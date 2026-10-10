import { env } from '@/lib/env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  system?: string;
  messages: ChatMessage[];
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerateResult {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  provider: string;
  model: string;
}

/**
 * Universal LLM Generation Gateway
 * All automation modules MUST call LLM exclusively through this function.
 */
export async function generate(options: GenerateOptions): Promise<GenerateResult> {
  const provider = env.LLM_PROVIDER || 'anthropic';
  const maxTokens = options.maxTokens || 1024;
  const temperature = options.temperature ?? 0.7;

  // 1. Anthropic Provider
  if (provider === 'anthropic') {
    const apiKey = env.ANTHROPIC_API_KEY;
    const model = env.LLM_MODEL || 'claude-3-5-sonnet-20241022';

    if (!apiKey) {
      // Mock / fallback for testing or before key configuration
      return {
        text: options.json
          ? JSON.stringify({ ok: true, note: 'Mock Anthropic JSON response' })
          : `[Mock Anthropic] Generated response based on ${options.messages.length} input messages.`,
        usage: { promptTokens: 50, completionTokens: 25, totalTokens: 75 },
        provider: 'anthropic-mock',
        model,
      };
    }

    // Direct fetch to Anthropic API
    const systemPrompt = options.system || '';
    const anthropicMessages = options.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || '';

    return {
      text,
      usage: {
        promptTokens: data.usage?.input_tokens,
        completionTokens: data.usage?.output_tokens,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
      provider: 'anthropic',
      model,
    };
  }

  // 2. OpenAI Provider
  if (provider === 'openai') {
    const apiKey = env.OPENAI_API_KEY;
    const model = env.LLM_MODEL || 'gpt-4o';

    if (!apiKey) {
      return {
        text: options.json
          ? JSON.stringify({ ok: true, note: 'Mock OpenAI JSON response' })
          : `[Mock OpenAI] Generated response based on ${options.messages.length} input messages.`,
        usage: { promptTokens: 40, completionTokens: 20, totalTokens: 60 },
        provider: 'openai-mock',
        model,
      };
    }

    const messages = [];
    if (options.system) {
      messages.push({ role: 'system', content: options.system });
    }
    messages.push(...options.messages);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        response_format: options.json ? { type: 'json_object' } : undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';

    return {
      text,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
      provider: 'openai',
      model,
    };
  }

  throw new Error(`Unsupported LLM provider: ${provider}`);
}
