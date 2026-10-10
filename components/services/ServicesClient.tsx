'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { agents, websiteDesignCard, getAllIndustries, AgentService } from '@/data/agents';
import { formatINR } from '@/lib/format';
import { QuoteModal } from '@/components/common/QuoteModal';
import {
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  Grid as GridIcon,
  MonitorSmartphone,
  Check,
  Bot,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const ServicesClient: React.FC = () => {
  const searchParams = useSearchParams();
  const initialIndustry = searchParams.get('industry') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(
    initialIndustry ? [initialIndustry] : []
  );
  const [sortOption, setSortOption] = useState<'default' | 'asc' | 'desc'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState('');

  const allIndustries = useMemo(() => getAllIndustries(), []);

  useEffect(() => {
    if (initialIndustry && !selectedIndustries.includes(initialIndustry)) {
      setSelectedIndustries([initialIndustry]);
    }
  }, [initialIndustry, selectedIndustries]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const handleOpenQuote = (agentName: string) => {
    setSelectedAgentName(agentName);
    setQuoteModalOpen(true);
  };

  const filteredAgents = useMemo(() => {
    let list = [...agents];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.specificIndustry.toLowerCase().includes(q)
      );
    }

    if (selectedIndustries.length > 0) {
      list = list.filter((a) => {
        const agentIndustries = a.specificIndustry
          .split(',')
          .map((i) => i.trim().toLowerCase());
        return selectedIndustries.some((sel) =>
          agentIndustries.includes(sel.toLowerCase())
        );
      });
    }

    if (sortOption === 'asc') {
      list.sort((a, b) => a.subscription - b.subscription);
    } else if (sortOption === 'desc') {
      list.sort((a, b) => b.subscription - a.subscription);
    }

    return list;
  }, [searchTerm, selectedIndustries, sortOption]);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
          SEGMENT 01 — SERVICE-BASED
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text">
          30 Industry-Specific AI Agents
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Done-for-you AI agents, built for your industry. Fully engineered, integrated, and maintained by our team.
        </p>
        <p className="text-xs font-mono text-gold/80 bg-surface-2 py-1.5 px-4 rounded-full inline-block border border-border">
          * Prices are indicative based on standard volume. A fixed custom quote is provided per business.
        </p>
      </div>

      {/* Featured Card: Website Design + Build */}
      <div className="rounded-2xl bg-surface border border-border-strong p-6 md:p-8 hover:border-gold hover:shadow-gold-glow transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <MonitorSmartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block">
                  FEATURED SERVICE
                </span>
                <h2 className="text-2xl font-bold font-heading text-text">
                  {websiteDesignCard.title}
                </h2>
              </div>
            </div>

            <p className="text-gold font-medium text-sm">
              &ldquo;{websiteDesignCard.tagline}&rdquo;
            </p>

            <p className="text-muted text-xs sm:text-sm leading-relaxed">
              {websiteDesignCard.description}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {websiteDesignCard.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-text/90">
                  <span className="w-4 h-4 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">
                  ONE-TIME SETUP
                </span>
                <span className="text-lg font-bold font-mono text-text">
                  {websiteDesignCard.pricing.setup}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">
                  MAINTENANCE
                </span>
                <span className="text-lg font-bold font-mono text-gold">
                  {websiteDesignCard.pricing.maintenance}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenQuote('Website Design + Build')}
              className="w-full py-3 px-5 rounded-xl bg-gold text-black font-heading font-semibold text-xs tracking-wider uppercase hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
            >
              Get a Fixed Quote ↗
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface p-4 rounded-2xl border border-border">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by agent name or industry (e.g. Clinic, Real estate, WhatsApp)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <SlidersHorizontal className="w-4 h-4" />
              <span>SORT:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'default' | 'asc' | 'desc')}
                className="bg-surface-2 border border-border rounded-lg px-2.5 py-1.5 text-text text-xs focus:border-gold focus:outline-none"
              >
                <option value="default">Default Order</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>

            {/* Desktop Table View Toggle */}
            <div className="hidden lg:flex items-center border border-border rounded-lg p-0.5 bg-surface-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'grid' ? 'bg-gold text-black' : 'text-muted hover:text-text'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table' ? 'bg-gold text-black' : 'text-muted hover:text-text'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Industry Filter Multi-Select Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-muted flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-gold" /> Filter:
          </span>
          {selectedIndustries.length > 0 && (
            <button
              onClick={() => setSelectedIndustries([])}
              className="text-xs font-mono text-gold hover:underline mr-2"
            >
              Clear filters ({selectedIndustries.length})
            </button>
          )}
          {allIndustries.map((ind) => {
            const isSelected = selectedIndustries.includes(ind);
            return (
              <button
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  isSelected
                    ? 'bg-gold text-black font-semibold'
                    : 'bg-surface border border-border text-muted hover:text-text hover:border-gold/50'
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agents Catalog Output */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-border">
          <Bot className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold font-heading text-text mb-1">
            No AI Agents Match Your Filters
          </h3>
          <p className="text-muted text-xs mb-4">
            Try adjusting your search query or clearing industry filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedIndustries([]);
            }}
            className="px-4 py-2 rounded-xl bg-gold text-black text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Desktop) */
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-border text-muted font-mono uppercase text-[10px]">
              <tr>
                <th className="p-4 w-12">No.</th>
                <th className="p-4">AI Agent</th>
                <th className="p-4">Specific Industry</th>
                <th className="p-4">Subscription</th>
                <th className="p-4">One-Time Setup</th>
                <th className="p-4">Monthly Maintenance</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="p-4 font-mono text-muted">
                    {String(agent.id).padStart(2, '0')}
                  </td>
                  <td className="p-4 font-bold text-text text-sm">
                    {agent.name}
                  </td>
                  <td className="p-4 text-muted">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {agent.specificIndustry.split(',').map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-surface-2 border border-border text-[11px]"
                        >
                          {ind.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-gold">
                    {formatINR(agent.subscription)}/mo
                  </td>
                  <td className="p-4 font-mono text-text">
                    {formatINR(agent.setup)}
                  </td>
                  <td className="p-4 font-mono text-muted">
                    {formatINR(agent.maintenance)}/mo
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenQuote(agent.name)}
                      className="px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 text-xs font-semibold font-heading transition-colors"
                    >
                      Quote ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW (3 columns desktop, 2 tablet, 1 mobile) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const industryTags = agent.specificIndustry.split(',').map((s) => s.trim());
            return (
              <div
                key={agent.id}
                className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between hover:border-border-strong hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-muted">
                      {String(agent.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold font-heading text-text mb-3">
                    {agent.name}
                  </h3>

                  {/* Industry Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {industryTags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[10px] text-muted font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="h-[1px] w-full bg-border my-4" />

                  {/* 3 Labeled Prices */}
                  <div className="space-y-1.5 font-mono text-xs mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted uppercase">SUBSCRIPTION</span>
                      <span className="font-bold text-gold">
                        {formatINR(agent.subscription)}/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted uppercase">ONE-TIME SETUP</span>
                      <span className="text-text font-medium">
                        {formatINR(agent.setup)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted uppercase">MONTHLY MAINTENANCE</span>
                      <span className="text-muted">
                        {formatINR(agent.maintenance)}/mo
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleOpenQuote(agent.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 hover:border-gold transition-all text-xs font-semibold font-heading flex items-center justify-center gap-1.5"
                  >
                    Get a fixed quote
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultInterestedIn={selectedAgentName}
        defaultSegment="Service"
      />
    </div>
  );
};
