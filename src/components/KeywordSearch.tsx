import React, { useState } from 'react';
import { Search, Clock, Play, BookOpen, Layers, Sparkles, FileText } from 'lucide-react';
import { VideoAnalysis } from '../types';

interface KeywordSearchProps {
  analysis: VideoAnalysis;
  onJumpToTime: (seconds: number) => void;
  initialQuery?: string;
}

export const KeywordSearch: React.FC<KeywordSearchProps> = ({
  analysis,
  onJumpToTime,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'chapters' | 'glossary' | 'transcript'>('all');

  const queryLower = searchQuery.toLowerCase().trim();

  // Search results collections
  const chapterMatches = analysis.chapters.filter(
    (ch) =>
      ch.title.toLowerCase().includes(queryLower) ||
      ch.summary.toLowerCase().includes(queryLower) ||
      ch.keyPoints.some((kp) => kp.toLowerCase().includes(queryLower)) ||
      ch.keywords.some((kw) => kw.toLowerCase().includes(queryLower))
  );

  const glossaryMatches = (analysis.glossary || []).filter(
    (g) => g.term.toLowerCase().includes(queryLower) || g.definition.toLowerCase().includes(queryLower)
  );

  const transcriptMatches = (analysis.transcript || []).filter((t) =>
    t.text.toLowerCase().includes(queryLower)
  );

  const hasQuery = queryLower.length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Main Search Bar */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">영상 전체 키워드 검색 (Universal Search)</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          요약, 타임스탬프 목차, 용어 사전 및 전체 자막 스크립트에서 키워드를 검색하고 위치로 즉시 이동합니다.
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색할 키워드 또는 단어를 입력하세요 (예: 에이전트, 멀티모달, 큐비트, RSA...)"
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 text-sm placeholder-slate-500 outline-none transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {[
            { id: 'all', label: '전체 결과' },
            { id: 'chapters', label: `타임스탬프 목차 (${chapterMatches.length})` },
            { id: 'glossary', label: `용어 사전 (${glossaryMatches.length})` },
            { id: 'transcript', label: `자막 스크립트 (${transcriptMatches.length})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedFilter === f.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!hasQuery ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">검색어를 입력하시면 관련 구간 및 용어가 정리됩니다.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {analysis.allKeywords?.slice(0, 6).map((kw, i) => (
              <button
                key={i}
                onClick={() => setSearchQuery(kw)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:bg-indigo-600/30 hover:text-indigo-200"
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chapter Matches */}
          {(selectedFilter === 'all' || selectedFilter === 'chapters') && chapterMatches.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" /> 타임스탬프 목차 결과 ({chapterMatches.length})
              </h4>
              <div className="space-y-2.5">
                {chapterMatches.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-3 hover:border-indigo-500/40 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-100">{ch.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">{ch.summary}</p>
                    </div>
                    <button
                      onClick={() => onJumpToTime(ch.seconds)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg font-mono text-xs font-bold shrink-0 flex items-center gap-1 transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {ch.timestamp}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Glossary Matches */}
          {(selectedFilter === 'all' || selectedFilter === 'glossary') && glossaryMatches.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> 용어 사전 결과 ({glossaryMatches.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {glossaryMatches.map((g, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-xs font-bold text-purple-300 block mb-1">{g.term}</span>
                    <p className="text-xs text-slate-400">{g.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transcript Matches */}
          {(selectedFilter === 'all' || selectedFilter === 'transcript') && transcriptMatches.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> 자막 스크립트 구간 ({transcriptMatches.length})
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {transcriptMatches.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-slate-300">{t.text}</span>
                    <button
                      onClick={() => onJumpToTime(t.seconds)}
                      className="px-2.5 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded font-mono text-[11px] font-bold shrink-0 transition"
                    >
                      {t.timestamp}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chapterMatches.length === 0 && glossaryMatches.length === 0 && transcriptMatches.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              검색어 "{searchQuery}"와 일치하는 항목을 찾지 못했습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
