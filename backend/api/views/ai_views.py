"""
AI Assistant endpoint: proxies chat to Google Gemini or OpenAI so API keys stay server-side.
Prefers Gemini (GEMINI_API_KEY) when set; falls back to OpenAI (OPENAI_API_KEY).
"""
import json
import urllib.request
import urllib.error
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


SYSTEM_PROMPT = """You are a helpful AI assistant for Krishiment, a smart agriculture platform connecting farmers and agricultural workers in India. You help with:
- Farming tips, crops, weather, and government schemes
- Finding labour, posting jobs, and labour availability
- Equipment marketplace, market prices, and mandi information
- Route optimization and travel to farms, mandis, and warehouses
- General agriculture and platform usage questions
Keep answers concise, practical, and in a friendly tone. Use simple language. If you don't know something, say so."""


def call_gemini_chat(api_key: str, user_message: str, history: list) -> str:
    """Call Google Gemini generateContent API. Returns assistant reply or raises."""
    url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
    # Build contents: alternating user/model from history, then current user message
    contents = []
    for h in history:
        role = "user" if h.get("role") == "user" else "model"
        text = (h.get("content") or "").strip()
        if not text:
            continue
        contents.append({"role": role, "parts": [{"text": text}]})
    contents.append({"role": "user", "parts": [{"text": user_message}]})
    body = json.dumps({
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "maxOutputTokens": 500,
            "temperature": 0.7,
        },
    }).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            'Content-Type': 'application/json',
            'x-goog-api-key': api_key,
        },
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            candidates = data.get('candidates', [])
            if not candidates:
                return 'No response.'
            parts = candidates[0].get('content', {}).get('parts', [])
            if not parts:
                return 'No response.'
            return (parts[0].get('text') or '').strip() or 'No response.'
    except urllib.error.HTTPError as e:
        body_read = e.read().decode() if e.fp else ''
        try:
            err = json.loads(body_read)
            msg = err.get('error', {}).get('message', body_read)
        except Exception:
            msg = body_read or str(e)
        raise RuntimeError(f'Gemini API error: {msg}')
    except Exception as e:
        raise RuntimeError(f'Request failed: {e}')


def call_openai_chat(api_key: str, user_message: str, history: list) -> str:
    """Call OpenAI Chat Completions API. Returns assistant reply or raises."""
    url = 'https://api.openai.com/v1/chat/completions'
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history:
        messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
    messages.append({"role": "user", "content": user_message})
    body = json.dumps({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "max_tokens": 500,
        "temperature": 0.7,
    }).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
        },
        method='POST',
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
            choice = data.get('choices', [{}])[0]
            return choice.get('message', {}).get('content', '').strip() or 'No response.'
    except urllib.error.HTTPError as e:
        body_read = e.read().decode() if e.fp else ''
        try:
            err = json.loads(body_read)
            msg = err.get('error', {}).get('message', body_read)
        except Exception:
            msg = body_read or str(e)
        raise RuntimeError(f'OpenAI API error: {msg}')
    except Exception as e:
        raise RuntimeError(f'Request failed: {e}')


class AIChatView(APIView):
    """POST: { "message": "user text", "history": [...] } -> { "reply": "..." }
    Uses Gemini if GEMINI_API_KEY is set, else OpenAI if OPENAI_API_KEY is set."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        gemini_key = (getattr(settings, 'GEMINI_API_KEY', None) or '').strip()
        openai_key = (getattr(settings, 'OPENAI_API_KEY', None) or '').strip()
        if not gemini_key and not openai_key:
            return Response(
                {'error': 'AI assistant is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY on the server.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        message = request.data.get('message', '').strip()
        if not message:
            return Response(
                {'error': 'Message is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        history = request.data.get('history') or []
        if not isinstance(history, list):
            history = []
        try:
            if gemini_key:
                reply = call_gemini_chat(gemini_key, message, history)
            else:
                reply = call_openai_chat(openai_key, message, history)
            return Response({'reply': reply})
        except RuntimeError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
