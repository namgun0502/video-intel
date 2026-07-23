import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Brain, Network, Award, Clock } from 'lucide-react';
import { VideoAnalysis } from '../types';

interface LearningHubProps {
  analysis: VideoAnalysis;
  onJumpToTime: (seconds: number) => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({ analysis, onJumpToTime }) => {
  const [activeSubTab, setActiveSubTab] = useState<'quiz' | 'mindmap'>('quiz');
  
  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [quizId: string]: number }>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const quizzes = analysis.quiz || [];

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Subtab navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            학습 효율 극대화 센터 (Learning Efficiency Hub)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            영상 복습을 위한 자동 형성 평가 퀴즈 및 영상 구조 마인드맵
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            복습 퀴즈 ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('mindmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'mindmap'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            주제 마인드맵
          </button>
        </div>
      </div>

      {/* SUBTAB 1: QUIZ / FLASHCARDS */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-6">
          {quizzes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              이 영상에 대한 자동 생성 퀴즈가 없습니다.
            </div>
          ) : (
            <>
              {/* Quiz Score Summary Banner if submitted */}
              {submittedQuiz && (
                <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        퀴즈 채점 완료! {quizzes.length}문항 중 {calculateScore()}개 정답
                      </h4>
                      <p className="text-xs text-slate-400">
                        {calculateScore() === quizzes.length
                          ? '🎉 완벽합니다! 영상의 핵심 개념을 완벽하게 이해하셨습니다.'
                          : '아래 오답 해설 및 타임스탬프 바로가기를 참고하여 다시 확인해보세요.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 다시 풀기
                  </button>
                </div>
              )}

              {/* Quiz Item Cards */}
              <div className="space-y-5">
                {quizzes.map((q, idx) => {
                  const userChoice = selectedAnswers[q.id];
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id || idx}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                            Q{idx + 1}
                          </span>
                          <span>{q.question}</span>
                        </h4>

                        {q.timestamp && (
                          <button
                            onClick={() => {
                              const [m, s] = q.timestamp!.split(':').map(Number);
                              onJumpToTime(m * 60 + (s || 0));
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 rounded text-[11px] font-mono font-semibold flex items-center gap-1 transition"
                          >
                            <Clock className="w-3 h-3" /> {q.timestamp}
                          </button>
                        )}
                      </div>

                      {/* Multiple choice options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userChoice === optIdx;
                          let btnStyle =
                            'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                          if (submittedQuiz) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {submittedQuiz && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {submittedQuiz && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {submittedQuiz && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                            isCorrect
                              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                              : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <span className="font-bold block mb-0.5">
                            {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.'}
                          </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submittedQuiz && (
                <button
                  onClick={() => setSubmittedQuiz(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  퀴즈 정답 제출 및 채점하기
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* SUBTAB 2: TOPIC MINDMAP / DIAGRAM */}
      {activeSubTab === 'mindmap' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="text-center max-w-md mx-auto mb-8">
            <h4 className="text-sm font-bold text-white mb-1">영상의 정보 흐름 마인드맵</h4>
            <p className="text-xs text-slate-400">
              핵심 주제를 중심으로 한 장별 개념 흐름과 세부 내용 구조입니다.
            </p>
          </div>

          {/* Mindmap Central Node */}
          <div className="flex flex-col items-center gap-6 relative">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 border border-indigo-400/30 text-center max-w-sm">
              🎬 {analysis.title}
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-6 bg-indigo-500/40" />

            {/* Chapter Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {analysis.chapters.map((ch, idx) => (
                <div
                  key={ch.id || idx}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition shadow-md relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/20">
                      {ch.timestamp}
                    </span>
                    <button
                      onClick={() => onJumpToTime(ch.seconds)}
                      className="text-[11px] text-slate-400 hover:text-indigo-300 underline"
                    >
                      이동하기
                    </button>
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 mb-1">{ch.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{ch.summary}</p>
                  
                  {ch.keywords && (
                    <div className="flex flex-wrap gap-1">
                      {ch.keywords.map((kw, kI) => (
                        <span key={kI} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
