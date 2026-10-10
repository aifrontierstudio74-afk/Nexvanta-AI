'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, RotateCcw, ExternalLink, Mail, User } from 'lucide-react';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone, normalizeIndianPhone } from '@/lib/format';
import { agents } from '@/data/agents';
import { saasAutomations } from '@/data/saas';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  quickReplies?: string[];
}

type ChatStep =
  | 'GREETING'
  | 'ASK_NAME'
  | 'ASK_INDUSTRY'
  | 'ASK_INTEREST'
  | 'ASK_PHONE'
  | 'ASK_EMAIL'
  | 'ASK_COMPANY'
  | 'CONFIRMATION'
  | 'DONE';

const STORAGE_CHAT_KEY = 'nx_chatbot_state';

const INDUSTRY_OPTIONS = [
  'Clinics & Healthcare',
  'Real Estate',
  'Coaching & Education',
  'Restaurants & Hotels',
  'E-commerce & D2C',
  'Agencies & Marketing',
  'Insurance & Finance',
  'Legal',
  'Recruitment',
  'Other',
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ChatStep>('GREETING');
  const [inputValue, setInputValue] = useState('');
  const [leadId, setLeadId] = useState<string | null>(null);

  // Collected details
  const [userData, setUserData] = useState<{
    lookingFor?: string;
    name?: string;
    industry?: string;
    interest?: string;
    phone?: string;
    email?: string;
    company?: string;
    isHumanRequested?: boolean;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or restore session state
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages && parsed.messages.length > 0) {
          setMessages(parsed.messages);
          setCurrentStep(parsed.currentStep || 'GREETING');
          setUserData(parsed.userData || {});
          setLeadId(parsed.leadId || null);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default starting message
    setMessages([
      {
        id: 'msg-1',
        sender: 'bot',
        text: "Hi 👋 I'm the Nexvanta.AI assistant. What are you looking for?",
        quickReplies: [
          'AI agents for my industry',
          'SaaS automations',
          'Digital product (₹99)',
          'Website design',
          'Talk to a human',
        ],
      },
    ]);
  }, []);

  // Save state on updates
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(
          STORAGE_CHAT_KEY,
          JSON.stringify({
            messages,
            currentStep,
            userData,
            leadId,
          })
        );
      } catch {
        // ignore
      }
    }
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep, userData, leadId]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleStartOver = () => {
    sessionStorage.removeItem(STORAGE_CHAT_KEY);
    setUserData({});
    setCurrentStep('GREETING');
    setErrorText(null);
    setLeadId(null);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: "Hi 👋 I'm the Nexvanta.AI assistant. What are you looking for?",
        quickReplies: [
          'AI agents for my industry',
          'SaaS automations',
          'Digital product (₹99)',
          'Website design',
          'Talk to a human',
        ],
      },
    ]);
  };

  const handleQuickReply = (reply: string) => {
    processUserInput(reply);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    processUserInput(text);
  };

  const processUserInput = async (text: string) => {
    setErrorText(null);
    const userMsgId = `usr-${Date.now()}`;
    addMessage({ id: userMsgId, sender: 'user', text });

    if (currentStep === 'GREETING') {
      if (text === 'Talk to a human') {
        const updated = { ...userData, lookingFor: text, isHumanRequested: true };
        setUserData(updated);
        setCurrentStep('ASK_NAME');
        addMessage({
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Understood! I will connect you directly with our senior automation lead. First, what is your name?',
        });
        return;
      }

      const updated = { ...userData, lookingFor: text };
      setUserData(updated);
      setCurrentStep('ASK_NAME');
      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Great to meet you! What is your name?',
      });
      return;
    }

    if (currentStep === 'ASK_NAME') {
      const updated = { ...userData, name: text };
      setUserData(updated);

      if (updated.isHumanRequested) {
        // Fast-track to phone for direct human contact
        setCurrentStep('ASK_PHONE');
        addMessage({
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Thanks ${text}. Please provide your 10-digit mobile number so our team can reach you on WhatsApp or call:`,
        });
        return;
      }

      setCurrentStep('ASK_INDUSTRY');
      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Nice to meet you, ${text}! What industry or sector is your business in?`,
        quickReplies: INDUSTRY_OPTIONS,
      });
      return;
    }

    if (currentStep === 'ASK_INDUSTRY') {
      const updated = { ...userData, industry: text };
      setUserData(updated);
      setCurrentStep('ASK_INTEREST');

      // Compute contextual interest options
      let interestReplies: string[] = [];
      if (updated.lookingFor === 'AI agents for my industry') {
        // Find 3 to 4 relevant agents matching chosen industry
        const relevant = agents.filter((a) =>
          a.specificIndustry.toLowerCase().includes(text.toLowerCase().split(' ')[0])
        );
        if (relevant.length > 0) {
          interestReplies = relevant.slice(0, 4).map((a) => a.name);
        } else {
          interestReplies = [
            'AI WhatsApp Receptionist',
            'AI Lead Qualification Agent',
            'AI Voice Receptionist',
            'AI Appointment Booking Agent',
          ];
        }
      } else if (updated.lookingFor === 'SaaS automations') {
        interestReplies = saasAutomations.map((s) => s.title);
      } else if (updated.lookingFor === 'Digital product (₹99)') {
        interestReplies = ['AI Starter SOP & Prompt Kit (₹99)', 'Custom SOP Consultation'];
      } else if (updated.lookingFor === 'Website design') {
        interestReplies = ['Website Design + Build (5-7 Days)', 'Landing Page Redesign'];
      } else {
        interestReplies = ['Custom AI Solution', 'Workflow Automation'];
      }

      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Got it. Which specific solution are you most interested in exploring?`,
        quickReplies: interestReplies,
      });
      return;
    }

    if (currentStep === 'ASK_INTEREST') {
      const updated = { ...userData, interest: text };
      setUserData(updated);
      setCurrentStep('ASK_PHONE');
      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Perfect! What is your 10-digit Indian mobile number? (We will send initial scope details via WhatsApp)',
      });
      return;
    }

    if (currentStep === 'ASK_PHONE') {
      if (!isValidIndianPhone(text)) {
        setErrorText('Please enter a valid 10-digit mobile number (e.g., 9713103152).');
        return;
      }

      const normalized = normalizeIndianPhone(text);
      const updated = { ...userData, phone: normalized };
      setUserData(updated);

      // Section 11 requirement: As soon as the phone is captured, create the lead!
      setIsSubmitting(true);
      try {
        let seg: 'Service' | 'SaaS' | 'Digital Product' | 'General' = 'General';
        if (updated.lookingFor?.includes('Service') || updated.lookingFor?.includes('AI agents')) seg = 'Service';
        else if (updated.lookingFor?.includes('SaaS')) seg = 'SaaS';
        else if (updated.lookingFor?.includes('Digital')) seg = 'Digital Product';

        const leadRes = await submitLead({
          leadId: leadId || undefined,
          name: updated.name,
          phone: normalized,
          industry: updated.industry,
          interestedIn: updated.interest || updated.lookingFor,
          segment: seg,
          source: updated.isHumanRequested ? 'Talk to Human' : 'Chatbot Flow',
          isHumanRequested: updated.isHumanRequested,
          message: `Captured via Chatbot. Looking for: ${updated.lookingFor || 'General'}`,
        });

        if (leadRes.ok && leadRes.leadId) {
          setLeadId(leadRes.leadId);
        }
      } catch (err) {
        console.error('Chatbot lead creation error:', err);
      } finally {
        setIsSubmitting(false);
      }

      if (updated.isHumanRequested) {
        // Jump straight to summary for human request
        setCurrentStep('DONE');
        addMessage({
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Thanks ${updated.name || ''}! We have notified our lead engineer. You can also message us directly on WhatsApp right now:`,
        });
        return;
      }

      setCurrentStep('ASK_EMAIL');
      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Got it! What is your work email? (Or type "Skip")',
        quickReplies: ['Skip'],
      });
      return;
    }

    if (currentStep === 'ASK_EMAIL') {
      const emailVal = text.toLowerCase() === 'skip' ? '' : text;
      const updated = { ...userData, email: emailVal };
      setUserData(updated);
      setCurrentStep('ASK_COMPANY');
      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'And what is the name of your company or clinic? (Or type "Skip")',
        quickReplies: ['Skip'],
      });
      return;
    }

    if (currentStep === 'ASK_COMPANY') {
      const companyVal = text.toLowerCase() === 'skip' ? '' : text;
      const updated = { ...userData, company: companyVal };
      setUserData(updated);
      setCurrentStep('DONE');

      // Final Lead Update
      setIsSubmitting(true);
      try {
        let seg: 'Service' | 'SaaS' | 'Digital Product' | 'General' = 'General';
        if (updated.lookingFor?.includes('Service') || updated.lookingFor?.includes('AI agents')) seg = 'Service';
        else if (updated.lookingFor?.includes('SaaS')) seg = 'SaaS';
        else if (updated.lookingFor?.includes('Digital')) seg = 'Digital Product';

        await submitLead({
          leadId: leadId || undefined,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          company: updated.company,
          industry: updated.industry,
          interestedIn: updated.interest || updated.lookingFor,
          segment: seg,
          source: 'Chatbot Completed',
          message: `Completed full chatbot flow. Industry: ${updated.industry || 'N/A'}, Target: ${updated.interest || 'N/A'}`,
        });
      } catch (err) {
        console.error('Final lead update error:', err);
      } finally {
        setIsSubmitting(false);
      }

      addMessage({
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Thanks ${updated.name}! The Nexvanta team will contact you shortly.`,
      });
    }
  };

  const getWhatsAppHandoffUrl = () => {
    const name = userData.name || 'there';
    const industry = userData.industry || 'my business';
    const interest = userData.interest || userData.lookingFor || 'AI automation';
    const text = encodeURIComponent(
      `Hi Nexvanta.AI, my name is ${name}. I run a business in ${industry} and I am interested in ${interest}. Let's discuss!`
    );
    return `https://wa.me/919713103152?text=${text}`;
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Nexvanta Assistant Chat"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-whatsapp text-black font-semibold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all group"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="hidden sm:inline font-heading tracking-wide">
              Chat with Assistant
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
            </span>
          </button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Nexvanta Assistant Chatbot"
          className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-surface border border-border-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-surface-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-text flex items-center gap-2">
                  Nexvanta Assistant
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                </h3>
                <p className="text-[11px] text-muted font-mono">
                  +91 97131 03152 · hello.nexvanta56@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleStartOver}
                title="Start Over"
                className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-bg/95 text-sm"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gold text-black font-medium rounded-br-none'
                      : 'bg-surface-2 border border-border text-text rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Quick reply chips */}
                {m.quickReplies && m.quickReplies.length > 0 && currentStep !== 'DONE' && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => handleQuickReply(qr)}
                        className="px-3 py-1.5 rounded-full bg-surface border border-gold/30 hover:border-gold hover:bg-gold/10 text-gold text-xs transition-colors text-left"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Final handoff action buttons */}
            {currentStep === 'DONE' && (
              <div className="pt-2 space-y-2">
                <a
                  href={getWhatsAppHandoffUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-whatsapp text-black font-semibold text-xs hover:opacity-90 transition-opacity"
                >
                  Continue on WhatsApp
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="mailto:hello.nexvanta56@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-border bg-surface text-text text-xs hover:border-gold/40 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  Email us
                </a>
              </div>
            )}

            {isSubmitting && (
              <div className="text-xs text-muted font-mono animate-pulse">
                Syncing with CRM...
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Error notice */}
          {errorText && (
            <div className="px-4 py-1.5 bg-red-500/10 border-t border-red-500/30 text-red-400 text-xs">
              {errorText}
            </div>
          )}

          {/* Permanent WhatsApp Chat Shortcut Footer */}
          <div className="px-4 py-1 bg-surface-2/60 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <span>Direct WhatsApp:</span>
            <a
              href="https://wa.me/919713103152"
              target="_blank"
              rel="noopener noreferrer"
              className="text-whatsapp hover:underline flex items-center gap-1 font-mono"
            >
              +91 97131 03152
            </a>
          </div>

          {/* Input Footer */}
          {currentStep !== 'DONE' && (
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-surface border-t border-border flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  currentStep === 'ASK_PHONE'
                    ? 'Enter 10-digit mobile number...'
                    : 'Type a message...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="p-2 rounded-xl bg-gold text-black hover:bg-gold-soft transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};
