import React from 'react';
import { BookOpen, CheckCircle2, Target, Lightbulb, Sparkles, Tag, Users } from 'lucide-react';
import { VideoAnalysis } from '../types';

interface SummaryViewProps {
  analysis: VideoAnalysis;
  onKeywordClick?: (keyword: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ analysis, onKeywordClick }) => {
  return (
    <div className="space-y-6">
      {/* Video Overview Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {analysis.channelOrAuthor || '영상 콘텐츠 분석'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                총 길이: {analysis.duration}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                실제 Gemini 3.6 Flash AI 분석 완료
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {analysis.title}
            </h2>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary (전체 핵심 요약) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">전체 핵심 요약 (Executive Summary)</h3>
        </div>
        <ul className="space-y-3">
          {analysis.executiveSummary.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-200 leading-relaxed pt-0.5">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Core Takeaways & Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Takeaways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">주요 핵심 인사이트 (Core Takeaways)</h3>
            </div>
            <ul className="space-y-2.5">
              {analysis.coreTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Target Audience */}
          {analysis.targetAudience && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
              <Users className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  추천 대상 (Target Audience)
                </span>
                <span className="text-xs text-slate-200">{analysis.targetAudience}</span>
              </div>
            </div>
          )}
        </div>

        {/* Categorized Key Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">분야별 세부 요약</h3>
          </div>
          <div className="space-y-4">
            {analysis.keyInsights?.map((categoryGroup, idx) => (
              <div key={idx} className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                  • {categoryGroup.category}
                </h4>
                <ul className="space-y-1.5">
                  {categoryGroup.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-slate-500 shrink-0">-</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Glossary & Technical Terms (핵심 용어 사전) */}
      {analysis.glossary && analysis.glossary.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">영상 주요 개념 & 용어 사전 (Glossary)</h3>
            </div>
            <span className="text-xs text-slate-400">총 {analysis.glossary.length}개 주요 용어</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.glossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 hover:border-purple-500/30 transition group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-300 group-hover:text-purple-200">
                    {item.term}
                  </span>
                  {item.importance === 'high' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      핵심 개념
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. All Keyword Badges */}
      {analysis.allKeywords && analysis.allKeywords.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              자동 추출 핵심 키워드 태그
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.allKeywords.map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => onKeywordClick && onKeywordClick(keyword)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition cursor-pointer"
              >
                #{keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
