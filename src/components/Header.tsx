import React from 'react';
import { Video, Sparkles, Download, Globe, BookOpen, Search, HelpCircle, Layers } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenExport: () => void;
  hasAnalysis: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTranslating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenExport,
  hasAnalysis,
  activeTab,
  setActiveTab,
  isTranslating,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Video className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Video Intelligence Workspace
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 text-indigo-400" /> AI-Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                영상 요약 • 타임스탬프 주제 정리 • Q&A • 다국어 번역 • 키워드 검색
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-medium text-slate-200 border border-slate-700 transition cursor-pointer">
                <Globe className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
                <span>
                  {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.flag}{' '}
                  <span className="hidden md:inline">
                    {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.name.split(' ')[0]}
                  </span>
                </span>
              </div>
              
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-1 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  번역 언어 선택
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition ${
                      currentLanguage === lang.code
                        ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            {hasAnalysis && (
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-600/20 transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">리포트 내보내기</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar (Only when analysis exists) */}
        {hasAnalysis && (
          <div className="flex items-center gap-1 border-t border-slate-800/80 pt-1 pb-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'summary', label: '핵심 요약 & 정리', icon: BookOpen },
              { id: 'timeline', label: '타임스탬프 주제별 목차', icon: Layers },
              { id: 'qna', label: '영상 AI Q&A', icon: HelpCircle },
              { id: 'search', label: '키워드 검색', icon: Search },
              { id: 'learning', label: '학습 퀴즈 & 마인드맵', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
