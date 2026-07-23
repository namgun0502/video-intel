import React, { useState } from 'react';
import { X, Copy, Download, FileText, Check, Printer } from 'lucide-react';
import { VideoAnalysis } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: VideoAnalysis;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, analysis }) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'txt' | 'srt' | 'json'>('markdown');

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# 📹 ${analysis.title}\n\n`;
    md += `**채널/작성자**: ${analysis.channelOrAuthor || '미지정'}\n`;
    md += `**총 재생 시간**: ${analysis.duration}\n\n`;

    md += `## 📌 1. 전체 핵심 요약 (Executive Summary)\n`;
    analysis.executiveSummary.forEach((pt, i) => {
      md += `${i + 1}. ${pt}\n`;
    });

    md += `\n## 💡 2. 주요 핵심 인사이트 (Core Takeaways)\n`;
    analysis.coreTakeaways.forEach((pt) => {
      md += `- ${pt}\n`;
    });

    md += `\n## ⏱️ 3. 타임스탬프 목차 및 구간 요약\n`;
    analysis.chapters.forEach((ch) => {
      md += `### [${ch.timestamp}] ${ch.title}\n`;
      md += `${ch.summary}\n`;
      if (ch.keyPoints && ch.keyPoints.length > 0) {
        ch.keyPoints.forEach((kp) => (md += `  - ${kp}\n`));
      }
      md += `\n`;
    });

    if (analysis.glossary && analysis.glossary.length > 0) {
      md += `\n## 📚 4. 주요 개념 및 용어 사전\n`;
      analysis.glossary.forEach((g) => {
        md += `- **${g.term}**: ${g.definition}\n`;
      });
    }

    return md;
  };

  const generateTxt = () => {
    return generateMarkdown().replace(/#/g, '').replace(/\*\*/g, '');
  };

  const generateSrt = () => {
    let srt = '';
    analysis.chapters.forEach((ch, i) => {
      srt += `${i + 1}\n`;
      srt += `${ch.timestamp},000 --> ${ch.timestamp},999\n`;
      srt += `[${ch.title}] ${ch.summary}\n\n`;
    });
    return srt;
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case 'markdown':
        return generateMarkdown();
      case 'txt':
        return generateTxt();
      case 'srt':
        return generateSrt();
      case 'json':
        return JSON.stringify(analysis, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const extMap = { markdown: 'md', txt: 'txt', srt: 'srt', json: 'json' };
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video_summary_${analysis.id}.${extMap[exportFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">영상 내보내기 리포트</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format selector */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'markdown', label: 'Markdown (.md)' },
              { id: 'txt', label: '텍스트 (.txt)' },
              { id: 'srt', label: '자막/타임스탬프 (.srt)' },
              { id: 'json', label: '전체 데이터 (.json)' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setExportFormat(fmt.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  exportFormat === fmt.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '클립보드 복사'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>파일 저장</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-5 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all scrollbar-thin scrollbar-thumb-slate-800">
          {getExportContent()}
        </div>
      </div>
    </div>
  );
};
