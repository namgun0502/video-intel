import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { VideoPlayer } from './components/VideoPlayer';
import { SummaryView } from './components/SummaryView';
import { TimelineView } from './components/TimelineView';
import { QnAView } from './components/QnAView';
import { KeywordSearch } from './components/KeywordSearch';
import { LearningHub } from './components/LearningHub';
import { ExportModal } from './components/ExportModal';
import { InputType, SupportedLanguage, VideoAnalysis } from './types';
import { SAMPLE_VIDEOS } from './data/samples';
import { Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(SAMPLE_VIDEOS[0]); // Default with sample for instant preview!
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Player synchronization state
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState<number>(0);

  // Language & Translation state
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ko');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Export Modal state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Search keyword override state
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  const handleJumpToTime = (seconds: number) => {
    setCurrentTimeSeconds(seconds);
    // Smooth scroll to top player if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async (data: {
    sourceType: InputType;
    url?: string;
    file?: File;
    textContent?: string;
    sampleData?: VideoAnalysis;
  }) => {
    if (data.sourceType === 'sample' && data.sampleData) {
      setAnalysis(data.sampleData);
      setCurrentTimeSeconds(0);
      setErrorMessage(null);
      setActiveTab('summary');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('sourceType', data.sourceType);
      if (data.url) formData.append('url', data.url);
      if (data.textContent) formData.append('textContent', data.textContent);
      if (data.file) formData.append('file', data.file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      let resData: any = {};

      try {
        resData = JSON.parse(responseText);
      } catch (parseErr) {
        if (responseText.startsWith('<') || responseText.includes('The page') || responseText.includes('Vercel')) {
          throw new Error('API 서버 연결 오류: Vercel 환경 변수 GEMINI_API_KEY가 등록되어 있는지 또는 vercel.json API 라우트 설정을 확인해주세요.');
        }
        throw new Error(`서버 응답 오류: ${responseText.slice(0, 100)}`);
      }

      if (response.ok && resData.success && resData.analysis) {
        setAnalysis(resData.analysis);
        setCurrentTimeSeconds(0);
        setActiveTab('summary');
      } else {
        const errMsg = resData.details ? `${resData.error} (${resData.details})` : (resData.error || '영상 분석 실패');
        throw new Error(errMsg);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || '영상을 분석하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (targetLangCode: SupportedLanguage) => {
    if (!analysis || targetLangCode === currentLanguage || isTranslating) return;

    setIsTranslating(true);
    setCurrentLanguage(targetLangCode);

    try {
      const langNames: Record<SupportedLanguage, string> = {
        ko: 'Korean (한국어)',
        en: 'English',
        ja: 'Japanese (日本語)',
        zh: 'Chinese (中文)',
        es: 'Spanish (Español)',
        de: 'German (Deutsch)',
        fr: 'French (Français)',
      };

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData: analysis,
          targetLangName: langNames[targetLangCode],
          targetLangCode,
        }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('Non-JSON translate response:', responseText);
        return;
      }

      if (data.success && data.translatedAnalysis) {
        setAnalysis((prev) => (prev ? { ...prev, ...data.translatedAnalysis, language: targetLangCode } : prev));
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeywordTagClick = (keyword: string) => {
    setSearchInitialQuery(keyword);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navigation Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenExport={() => setIsExportOpen(true)}
        hasAnalysis={!!analysis}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isTranslating={isTranslating}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/50 p-4 rounded-2xl flex items-center justify-between text-rose-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 underline hover:text-rose-200"
            >
              닫기
            </button>
          </div>
        )}

        {/* Input & Upload Section */}
        <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Main Workspace (When Analysis is loaded) */}
        {analysis && (
          <div className="space-y-8 animate-fadeIn">
            {/* Embedded Player Bar with Jump Sync */}
            <VideoPlayer
              videoUrl={analysis.videoUrl}
              title={analysis.title}
              currentTimeSeconds={currentTimeSeconds}
              thumbnailUrl={analysis.thumbnailUrl}
            />

            {/* Active View Tabs */}
            {activeTab === 'summary' && (
              <SummaryView analysis={analysis} onKeywordClick={handleKeywordTagClick} />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                chapters={analysis.chapters}
                onJumpToTime={handleJumpToTime}
                activeSeconds={currentTimeSeconds}
              />
            )}

            {activeTab === 'qna' && (
              <QnAView analysis={analysis} onJumpToTime={handleJumpToTime} />
            )}

            {activeTab === 'search' && (
              <KeywordSearch
                analysis={analysis}
                onJumpToTime={handleJumpToTime}
                initialQuery={searchInitialQuery}
              />
            )}

            {activeTab === 'learning' && (
              <LearningHub analysis={analysis} onJumpToTime={handleJumpToTime} />
            )}
          </div>
        )}
      </main>

      {/* Export Modal */}
      {analysis && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={analysis}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 AI Video Intelligence Workspace. Powered by Google Gemini 3.6 Flash.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>핵심 요약</span>
            <span>•</span>
            <span>타임스탬프 목차</span>
            <span>•</span>
            <span>AI Q&A</span>
            <span>•</span>
            <span>다국어 번역</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
