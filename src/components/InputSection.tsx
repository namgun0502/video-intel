import React, { useState, useRef } from 'react';
import { Link, Upload, FileText, PlayCircle, Sparkles, AlertCircle, FileAudio, FileType, CheckCircle2 } from 'lucide-react';
import { InputType, VideoAnalysis } from '../types';
import { SAMPLE_VIDEOS } from '../data/samples';

interface InputSectionProps {
  onAnalyze: (data: {
    sourceType: InputType;
    url?: string;
    file?: File;
    textContent?: string;
    sampleData?: VideoAnalysis;
  }) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [activeInputTab, setActiveInputTab] = useState<InputType>('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeInputTab === 'url') {
      if (!urlInput.trim()) return;
      onAnalyze({
        sourceType: 'url',
        url: urlInput.trim(),
        textContent: textInput.trim() || undefined,
      });
    } else if (activeInputTab === 'file') {
      if (!selectedFile) return;
      onAnalyze({ sourceType: 'file', file: selectedFile });
    } else if (activeInputTab === 'text') {
      if (!textInput.trim()) return;
      onAnalyze({ sourceType: 'text', textContent: textInput.trim() });
    }
  };

  const handleSelectSample = (sample: VideoAnalysis) => {
    onAnalyze({ sourceType: 'sample', sampleData: sample });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            영상 URL 또는 자막/오디오 파일 분석
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            유튜브/영상 링크, 자막(.srt, .vtt), 오디오/동영상 파일(.mp3, .wav, .mp4)을 입력하면 전체 핵심 요약과 타임스탬프 목차를 자동 생성합니다.
          </p>
        </div>

        {/* Input Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          {[
            { id: 'url', label: '영상 URL 링크', icon: Link },
            { id: 'file', label: '자막 / 오디오 파일 업로드', icon: Upload },
            { id: 'text', label: '자막/스크립트 직접 붙여넣기', icon: FileText },
            { id: 'sample', label: '샘플 영상 바로 체험', icon: PlayCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeInputTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveInputTab(tab.id as InputType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form area depending on active tab */}
        {activeInputTab === 'sample' ? (
          <div>
            <p className="text-xs text-slate-400 mb-3 font-medium">
              아래 미리 준비된 예시 영상을 클릭하시면 즉시 상세 분석 결과를 확인하실 수 있습니다:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_VIDEOS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="group cursor-pointer bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 transition duration-200 flex items-start gap-4"
                >
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={sample.thumbnailUrl}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
                    <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">
                      {sample.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-indigo-400 font-semibold mb-1">
                      {sample.channelOrAuthor}
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition line-clamp-2">
                      {sample.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {sample.executiveSummary[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeInputTab === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    유튜브(YouTube) 또는 온라인 동영상 URL 주소
                  </label>
                  <div className="relative flex items-center">
                    <Link className="absolute left-4 w-5 h-5 text-slate-500 pointer-events-none" />
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... 또는 동영상 주소 입력"
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 text-sm placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    YouTube oEmbed 메타데이터 및 Google Search Grounding 기술로 실제 영상 주제 및 타임스탬프 목차를 즉시 실시간 추출합니다.
                  </p>
                </div>

                {/* Optional Transcript Input for exact accuracy */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    (선택) 자막/대본 텍스트 함께 전달하기 (100% 정밀 분석용)
                  </label>
                  <textarea
                    rows={2}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="혹시 영상 자막이나 대본이 있다면 여기에 붙여넣으시면 더욱 정밀한 타임스탬프 분석이 이루어집니다."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg text-slate-200 text-xs placeholder-slate-500 outline-none resize-none font-mono"
                  />
                </div>
              </div>
            )}

            {activeInputTab === 'file' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".srt,.vtt,.txt,.json,.mp3,.wav,.m4a,.webm,.mp4,.ogg,.aac"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                    dragOver
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-slate-100">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB) - 파일 준비 완료
                      </div>
                      <span className="text-xs text-indigo-400 underline mt-1">다른 파일 선택</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 mb-1">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-semibold text-slate-200">
                        자막 파일(.srt, .vtt) 또는 오디오/영상 파일(.mp3, .wav, .mp4)을 드래그하여 올려주세요
                      </div>
                      <p className="text-xs text-slate-500">
                        지원 형식: SRT, VTT, TXT, MP3, WAV, M4A, WEBM, MP4 (최대 25MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeInputTab === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  자막 및 스크립트 전문 붙여넣기
                </label>
                <textarea
                  rows={5}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="[00:00] 영상의 자막이나 강연 스크립트를 여기에 직접 붙여넣으세요..."
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-slate-100 text-sm placeholder-slate-500 outline-none transition resize-none font-mono text-xs"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                (activeInputTab === 'url' && !urlInput.trim()) ||
                (activeInputTab === 'file' && !selectedFile) ||
                (activeInputTab === 'text' && !textInput.trim())
              }
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini AI가 영상을 분석하고 타임스탬프를 생성 중입니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI 영상 요약 및 학습 목차 생성 시작</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
