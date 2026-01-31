import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { aiService, type ChatMessage } from '../../services/aiService';
import { Button } from './ui/button';
import { cn } from '../../lib/utils';

function getFriendlyErrorMessage(apiError: string): string {
  const lower = apiError.toLowerCase();
  if (lower.includes('quota') || lower.includes('exceeded') || lower.includes('billing') || lower.includes('usage limit')) {
    return 'The AI service is temporarily unavailable (usage limit reached). Please add billing or credits at platform.openai.com, or try again later.';
  }
  if (lower.includes('invalid') && lower.includes('api key')) {
    return 'The AI service is not configured correctly. Please check the API key in server settings.';
  }
  return apiError;
}

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clear chat history when a different user logs in (or on logout)
  const userId = user?.id ?? null;
  useEffect(() => {
    setMessages([]);
    setError(null);
    setInput('');
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !user) return;
    setInput('');
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await aiService.chat(text, messages);
      const reply = res.data?.reply ?? 'No response.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      const rawMsg =
        err && typeof err === 'object' && 'response' in err && (err as { response?: { data?: { error?: string } } }).response?.data?.error
          ? (err as { response: { data: { error: string } } }).response.data.error
          : 'Failed to get reply.';
      const friendlyMsg = getFriendlyErrorMessage(rawMsg);
      setError(friendlyMsg);
      setMessages((m) => [...m, { role: 'assistant', content: friendlyMsg }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all',
          'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
        )}
        aria-label="Open AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-3rem)] flex-col rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 bg-emerald-600 px-4 py-3 text-white rounded-t-xl">
            <span className="font-semibold">Krishiment AI Assistant</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            ref={scrollRef}
            className="flex max-h-[320px] min-h-[200px] flex-col overflow-y-auto p-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Ask about farming, jobs, labour, schemes, or the platform.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'mb-2 max-w-[90%] rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'ml-auto bg-emerald-600 text-white'
                    : 'mr-auto bg-gray-100 text-gray-900'
                )}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 border-t border-gray-200 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
