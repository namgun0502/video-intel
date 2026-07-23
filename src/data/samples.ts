import { VideoAnalysis } from '../types';

export const SAMPLE_VIDEOS: VideoAnalysis[] = [
  {
    id: 'sample-ai-future',
    sourceType: 'sample',
    title: '2026 AI 혁신과 미래 인공지능 트렌드 특강',
    channelOrAuthor: 'Tech Frontiers Institute',
    duration: '18:45',
    durationSeconds: 1125,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Demo video link
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    language: 'ko',
    executiveSummary: [
      '차세대 멀티모달 에이전트 AI 시스템의 전면적인 산업 적용 현황과 전망 발표.',
      '추론 능력 중심의 AI 모델 발전으로 인한 업무 자동화 및 연구개발 속도 혁신.',
      '개인 맞춤형 인공지능 학습 생태계와 AI 윤리/보안 표준 준수의 중요성 강조.'
    ],
    coreTakeaways: [
      '텍스트/음성/영상을 복합적으로 처리하는 실시간 반응형 에이전트의 대세화.',
      '기업 인프라 구축 시 온디바이스 AI와 파운데이션 모델 하이브리드 결합 필수.',
      '학습 분야에서는 지식 전달 위주에서 실시간 생성 기반 질의응답 시스템으로 전환.'
    ],
    targetAudience: 'AI 연구자, 소프트웨어 엔지니어, IT 기획자 및 미래 기술에 관심 있는 학습자',
    keyInsights: [
      {
        category: '기술적 패러다임',
        points: [
          '단순 문답 생성을 넘어 자율 과업 수행(Autonomous Execution) 에이전트로 전환',
          '실시간 로우-레이턴시 오디오 및 스트리밍 처리 기술 발전'
        ]
      },
      {
        category: '산업 적용 분야',
        points: [
          '의료 영상 분석 및 실시간 다국어 동시통역 시스템',
          '교육 및 개인 맞춤형 AI 튜터 시스템 활성화'
        ]
      }
    ],
    chapters: [
      {
        id: 'c1',
        timestamp: '00:00',
        seconds: 0,
        title: '오프닝 & 차세대 AI의 패러다임 변화',
        summary: '인공지능 발전의 역사적 흐름과 2026년 에이전트 시스템으로의 대전환 서론.',
        keyPoints: [
          'LLM 중심에서 멀티모달 자율 에이전트로의 스케일업',
          '추론(Reasoning) 성능 개선이 가져온 산업적 파급력'
        ],
        keywords: ['생성형 AI', '에이전트', '멀티모달', '추론 모델']
      },
      {
        id: 'c2',
        timestamp: '03:15',
        seconds: 195,
        title: '실시간 음성/영상 처리 기술과 멀티모달리티',
        summary: '지연시간 없는 실시간 오디오 및 상호작용 비전 기술의 작동 원리와 사례.',
        keyPoints: [
          'Latency 200ms 이하 실시간 음성 상호작용',
          '카메라/화면 인식을 통한 시각적 맥락 이해'
        ],
        keywords: ['Live API', 'Latency', '시각 지능', '음성 합성']
      },
      {
        id: 'c3',
        timestamp: '08:40',
        seconds: 520,
        title: '기업 및 학습 환경에서의 핵심 적용 사례',
        summary: 'AI 튜터, 코드 생성, 데이터 자동 분석 등 실제 적용 분야 집중 해설.',
        keyPoints: [
          '개인 맞춤형 피드백 제공 AI 학습 도구',
          '코드 분석 및 자동화 워크플로우'
        ],
        keywords: ['AI 튜터', '학습 효율', '코드 생성', '자동화']
      },
      {
        id: 'c4',
        timestamp: '14:10',
        seconds: 850,
        title: 'AI 윤리, 보안 및 향후 전망',
        summary: '환각 현상 제어, 데이터 프라이버시, 안전한 인공지능 활용 방안.',
        keyPoints: [
          'Grounding(근거 제시)을 통한 정확도 향상',
          '개인정보 보호 및 책임감 있는 AI 개발'
        ],
        keywords: ['AI 윤리', 'Grounding', '보안', '미래 전망']
      }
    ],
    glossary: [
      { term: 'Multimodal (멀티모달)', definition: '텍스트, 이미지, 음성, 영상 등 여러 형태의 데이터를 동시에 이해하고 처리하는 기술.', importance: 'high' },
      { term: 'Agentic AI (에이전트 AI)', definition: '스스로 목표를 설정하고 계획을 세워 복잡한 작업을 자율적으로 수행하는 인공지능.', importance: 'high' },
      { term: 'Grounding (그라운딩)', definition: 'AI 응답을 신뢰할 수 있는 외부 데이터 및 사실 출처에 연결하여 환각 현상을 줄이는 기법.', importance: 'medium' },
      { term: 'On-Device AI (온디바이스 AI)', definition: '클라우드 서버를 거치지 않고 개별 기기(스마트폰, PC) 내에서 직접 구동되는 AI.', importance: 'medium' }
    ],
    allKeywords: ['생성형 AI', '에이전트', '멀티모달', '추론 모델', 'Live API', 'Latency', '시각 지능', '음성 합성', 'AI 튜터', '학습 효율', '코드 생성', '자동화', 'AI 윤리', 'Grounding', '보안'],
    quiz: [
      {
        id: 'q1',
        question: '최근 AI 패러다임 변화의 핵심 특성으로 옳지 않은 것은 무엇인가요?',
        options: [
          '단순 텍스트 생성을 넘어 자율 에이전트로 진화',
          '실시간 음성 및 비전 데이터 복합 처리',
          '오직 클라우드 대형 서버에서만 구동 가능하며 온디바이스 구현 불가',
          'Grounding 기술을 통한 환각 현상 감소'
        ],
        correctIndex: 2,
        explanation: '강연에서 온디바이스 AI와 클라우드 모델의 하이브리드 결합이 중요한 트렌드로 언급되었습니다.',
        timestamp: '00:00'
      },
      {
        id: 'q2',
        question: 'AI 응답의 정확도를 높이고 환각 현상(Hallucination)을 제어하기 위해 사용하는 기술은?',
        options: ['Prompt Engineering', 'Grounding (그라운딩)', 'Quantization', 'Fine-tuning'],
        correctIndex: 1,
        explanation: 'Grounding 기술은 AI 모델이 신뢰할 수 있는 외부 데이터 출처를 근거로 답변하도록 조율합니다.',
        timestamp: '14:10'
      }
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: '발표자', text: '안녕하세요. 2026년 인공지능 트렌드 특강에 오신 여러분을 환영합니다.' },
      { timestamp: '00:45', seconds: 45, speaker: '발표자', text: '과거의 대형 언어 모델이 단순히 글을 써주는 도구였다면, 이제는 직접 과업을 계획하고 실행하는 에이전트로 변화하고 있습니다.' },
      { timestamp: '03:15', seconds: 195, speaker: '발표자', text: '특히 실시간 음성 및 영상 상호작용 지연시간이 200밀리초 이하로 감소하면서, 대화하듯 시각 정보를 분석하는 능력이 갖춰졌습니다.' },
      { timestamp: '08:40', seconds: 520, speaker: '발표자', text: '교육 현장에서는 학습자가 영상을 볼 때 주요 타임스탬프와 요약, 실시간 Q&A를 제공받아 학습 효율을 수배 이상 높이고 있습니다.' },
      { timestamp: '14:10', seconds: 850, speaker: '발표자', text: '마지막으로 안전한 AI 활용을 위해서는 정확한 근거 제시(Grounding)와 데이터 프라이버시 보장이 필수적입니다.' }
    ],
    suggestedQuestions: [
      '에이전트 AI와 일반 LLM의 차이점은 무엇인가요?',
      '학습 효율을 극대화하기 위해 AI 튜터는 어떤 방식으로 활용되나요?',
      'Grounding 기술이 환각 현상을 어떻게 해결하나요?',
      '실시간 멀티모달 상호작용의 주요 기술 요구사항은 무엇인가요?'
    ]
  },
  {
    id: 'sample-quantum-physics',
    sourceType: 'sample',
    title: '양자 컴퓨터와 미래 암호학 기초 입문',
    channelOrAuthor: 'Science Explorer Channel',
    duration: '14:10',
    durationSeconds: 850,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    language: 'ko',
    executiveSummary: [
      '큐비트(Qubit)의 중첩 및 얽힘 현상에 기반한 양자 연산 원리 해설.',
      '기존 RSA 암호 체계에 대한 양자 컴퓨팅의 위협과 양자 내성 암호(PQC)의 필요성.',
      '양자 이득(Quantum Supremacy) 달성 현황 및 상용화 로드맵 설명.'
    ],
    coreTakeaways: [
      '큐비트는 0과 1 상태를 동시에 가질 수 있어 병렬 연산 능력이 급격히 상승함.',
      '쇼어 알고리즘(Shor Algorithm)에 의한 소인수분해 효율성이 기존 보안 체계의 위협 요인.',
      '포스트 양자 암호(PQC) 표준 도입으로 격자 기반 암호 기술 고도화 진행 중.'
    ],
    targetAudience: '양자 물리학 기초 학습자, 사이버 보안 전문가 및 컴퓨터 공학 전공자',
    keyInsights: [
      {
        category: '양자 연산 원리',
        points: [
          'Superposition (중첩)과 Entanglement (얽힘) 개념',
          'Qubit 수 증가에 따른 연산 공간의 지수함수적 확장'
        ]
      },
      {
        category: '보안 및 미래 영향',
        points: [
          'Post-Quantum Cryptography (양자 내성 암호)의 세계 표준화',
          '신약 개발, 재료 공학, 금융 최적화 문제 해결'
        ]
      }
    ],
    chapters: [
      {
        id: 'qp1',
        timestamp: '00:00',
        seconds: 0,
        title: '비트 vs 큐비트: 양자 연산의 기본 개념',
        summary: '고전 컴퓨터의 0/1 비트와 양자 컴퓨터의 중첩 큐비트 상태 차이점.',
        keyPoints: [
          '중첩(Superposition)을 통한 동시 상태 표현',
          '블로흐 구(Bloch Sphere)를 이용한 큐비트 시각화'
        ],
        keywords: ['큐비트', '중첩', '블로흐 구', '양자 상태']
      },
      {
        id: 'qp2',
        timestamp: '04:20',
        seconds: 260,
        title: '양자 얽힘과 파동함수의 붕괴',
        summary: '두 개 이상의 큐비트가 상호 연관되는 얽힘 현상과 측정 시 상태 결정 원리.',
        keyPoints: [
          'Einstein의 아인슈타인-포돌스키-로젠 패러독스',
          '측정(Measurement)에 의한 파동함수 붕괴'
        ],
        keywords: ['양자 얽힘', '측정', '파동함수', '아인슈타인']
      },
      {
        id: 'qp3',
        timestamp: '09:15',
        seconds: 555,
        title: '쇼어 알고리즘과 보안 시스템의 변화',
        summary: '기존 RSA 소인수분해 암호 파괴와 새로운 양자 내성 암호(PQC) 발전.',
        keyPoints: [
          'Shor 알고리즘의 소인수분해 속도',
          'PQC (Post-Quantum Cryptography) 알고리즘'
        ],
        keywords: ['RSA 암호', '쇼어 알고리즘', 'PQC', '격자 암호']
      }
    ],
    glossary: [
      { term: 'Qubit (큐비트)', definition: '양자 정보의 기본 단위로, 0과 1의 상태를 중첩으로 동시에 가질 수 있음.', importance: 'high' },
      { term: 'Superposition (중첩)', definition: '양자계가 여러 상태를 확률적으로 동시에 보유하고 있는 상태.', importance: 'high' },
      { term: 'Entanglement (얽힘)', definition: '두 입자가 아무리 멀리 떨어져 있어도 하나의 상태 결정이 다른 입자에 즉각 영향을 미치는 현상.', importance: 'high' },
      { term: 'PQC (양자 내성 암호)', definition: '양자 컴퓨터로도 해독하기 어렵도록 수학적으로 설계된 차세대 암호 체계.', importance: 'medium' }
    ],
    allKeywords: ['큐비트', '중첩', '블로흐 구', '양자 상태', '양자 얽힘', '측정', '파동함수', '아인슈타인', 'RSA 암호', '쇼어 알고리즘', 'PQC', '격자 암호'],
    quiz: [
      {
        id: 'qq1',
        question: '양자 컴퓨터가 고전 컴퓨터보다 병렬 연산에서 압도적인 성능을 내는 핵심 성질은?',
        options: ['전압 크기 변화', '중첩(Superposition)과 얽힘(Entanglement)', '클럭 스피드 증가', '열전도율 향상'],
        correctIndex: 1,
        explanation: '큐비트는 중첩 상태를 이용해 2^N 개의 상태를 동시에 연산할 수 있습니다.',
        timestamp: '00:00'
      }
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: '강사', text: '고전 컴퓨터는 0 또는 1이라는 명확한 비트로 계산하지만, 양자 컴퓨터는 중첩 상태를 가진 큐비트를 사용합니다.' },
      { timestamp: '04:20', seconds: 260, speaker: '강사', text: '두 입자가 얽히게 되면, 지구 반대편에 있더라도 하나의 상태를 확인하는 순간 다른 하나의 상태가 결정됩니다.' },
      { timestamp: '09:15', seconds: 555, speaker: '강사', text: '이에 따라 현재 금융과 개인정보를 보호하는 RSA 암호가 위협을 받게 되며, 이를 대비해 양자 내성 암호(PQC)가 도입되고 있습니다.' }
    ],
    suggestedQuestions: [
      '양자 컴퓨터가 상용화되면 RSA 암호는 정말로 무용지물이 되나요?',
      '큐비트 중첩과 얽힘의 차이를 쉽게 설명해주세요.',
      '양자 내성 암호(PQC)는 기존 수학의 어떤 문제를 활용하나요?'
    ]
  }
];
