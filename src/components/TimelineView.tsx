import React, { useState } from 'react';
import { Clock, Play, Search, Tag, ChevronRight, Layers } from 'lucide-react';
import { Chapter } from '../types';

interface TimelineViewProps {
  chapters: Chapter[];
  onJumpToTime: (seconds: number) => void;
  activeSeconds?: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  chapters,
  onJumpToTime,
  activeSeconds = 0,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredChapters = chapters.filter((ch) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.summary.toLowerCase().includes(q) ||
      ch.keyPoints.some((kp) => kp.toLowerCase().includes(q)) ||
      ch.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header & Chapter Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            타임스탬프별 주제 정리 및 목차
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            타임스탬프 버튼을 클릭하시면 영상의 해당 구간으로 연동 이동합니다. (총 {chapters.length}개 장)
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="주제 또는 키워드 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Chapters Timeline List */}
      <div className="relative pl-4 border-l-2 border-slate-800 space-y-6 my-2">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            검색어와 일치하는 타임스탬프 주제가 없습니다.
          </div>
        ) : (
          filteredChapters.map((chapter, idx) => {
            const isCurrent =
              activeSeconds >= chapter.seconds &&
              (idx === chapters.length - 1 || activeSeconds < chapters[idx + 1]?.seconds);

            return (
              <div
                key={chapter.id || idx}
                className={`relative group transition rounded-2xl p-4 border ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[25px] top-5 w-4 h-4 rounded-full border-2 transition ${
                    isCurrent
                      ? 'bg-indigo-500 border-indigo-300 ring-4 ring-indigo-500/20'
                      : 'bg-slate-900 border-slate-700 group-hover:border-indigo-400'
                  }`}
                />

                {/* Chapter Title & Time Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onJumpToTime(chapter.seconds)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg border border-indigo-500/30 font-mono text-xs font-bold transition active:scale-95 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{chapter.timestamp}</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition">
                      {chapter.title}
                    </h4>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
                  {chapter.summary}
                </p>

                {/* Key Points Bullet List */}
                {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 mb-3 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      구간 주요 내용:
                    </span>
                    {chapter.keyPoints.map((kp, kpIdx) => (
                      <div key={kpIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{kp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Keywords Tags */}
                {chapter.keywords && chapter.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {chapter.keywords.map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
