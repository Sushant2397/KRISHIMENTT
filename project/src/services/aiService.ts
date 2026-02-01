import API from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const aiService = {
  chat: (message: string, history: ChatMessage[] = []) =>
    API.post<{ reply: string }>('/ai/chat/', {
      message,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
};

export default aiService;
