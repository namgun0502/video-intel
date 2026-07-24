import React, { useState } from 'react';
import { Send, HelpCircle, Bot, User, Sparkles, Clock, MessageSquareQuote } from 'lucide-react';
import { QAMessage, VideoAnalysis } from '../types';

interface QnAViewProps {
  analysis: VideoAnalysis;
  onJumpToTime: (seconds: number) => void;
}

export const QnAView: React.FC<QnAViewProps> = ({ analysis, onJumpToTime }) => {
  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `안녕하세요! 영상 "${analysis.title}" 내용에 대해 궁금한 점을 무엇이든 질문해 보세요. 영상 내 구체적인 타임스탬프 근거와 함께 답변해 드립니다.`,
      createdAt: new Date(),
    },
  ]);
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuestion = async (qText?: string) => {
    const query = qText || questionInput.trim();
    if (!query || isLoading) return;

    const userMsg: QAMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setQuestionInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoContext: analysis,
          question: query,
          chatHistory: messages.map((m) => ({ role: m.sender, text: m.text })),
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('API 응답 형식 오류');
      }

      if (response.ok && data.success && data.answer) {
        const aiMsg: QAMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: data.answer,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.error || '답변 생성에 실패했습니다.');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'ai',
          text: '⚠️ 죄송합니다. 답변을 처리하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse timestamp strings like [MM:SS] or (MM:SS) in AI text into clickable links
  const renderFormattedText = (text: string) => {
    // Regex for [MM:SS] or (MM:SS) or MM:SS
    const timeRegex = /\[?(\d{1,2}):(\d{2})\]?/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = timeRegex.exec(text)) !== null) {
      const start = match.index;
      const fullMatch = match[0];
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const totalSeconds = mins * 60 + secs;

      if (start > lastIdx) {
        parts.push(text.substring(lastIdx, start));
      }

      parts.push(
        <button
          key={`time-${start}`}
          onClick={() => onJumpToTime(totalSeconds)}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-mono text-xs font-bold transition cursor-pointer"
        >
          <Clock className="w-3 h-3" />
          <span>{match[1]}:{match[2]}</span>
        </button>
      );

      lastIdx = start + fullMatch.length;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return parts;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[620px]">
      {/* Q&A Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">영상 기반 AI 질의응답 (Q&A)</h3>
        </div>
        <span className="text-xs text-slate-400">Gemini 3.6 Flash 모델 연동</span>
      </div>

      {/* Suggested Questions Chips */}
      {analysis.suggestedQuestions && analysis.suggestedQuestions.length > 0 && (
        <div className="mb-4 shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400" /> 추천 질문:
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedQuestions.map((sQ, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuestion(sQ)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition text-left cursor-pointer disabled:opacity-50"
              >
                💡 {sQ}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Chat List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isAi
                    ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-700'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                {isAi ? renderFormattedText(msg.text) : msg.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              영상 내용을 바탕으로 답변을 구성하고 있습니다...
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion();
        }}
        className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="영성에 대해 궁금한 점을 질문해보세요 (예: 특정 개념의 설명, 핵심 주장 등)"
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={!questionInput.trim() || isLoading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
