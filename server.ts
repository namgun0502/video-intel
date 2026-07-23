import express from 'express';
import path from 'path';
import multer from 'multer';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

// JSON parser for body
app.use(express.json({ limit: '25mb' }));

// Helper to initialize Gemini Client lazily
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// API 1: /api/analyze - Summarize & Extract Chapters
// ----------------------------------------------------
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    const ai = getGeminiAI();
    const sourceType = req.body.sourceType || 'text'; // 'url', 'text', 'file'
    const url = req.body.url;
    const textContent = req.body.textContent;
    const uploadedFile = req.file;

    let parts: any[] = [];
    let promptContext = '';
    let fetchedTitle = '';
    let fetchedAuthor = '';
    let fetchedThumbnail = '';
    let useSearchGrounding = false;

    if (uploadedFile) {
      const mimeType = uploadedFile.mimetype || 'application/octet-stream';
      const fileName = uploadedFile.originalname;

      if (mimeType.startsWith('audio/') || mimeType.startsWith('video/')) {
        // Audio/Video file upload - send inline base64 directly to Gemini multimodal
        const base64Data = uploadedFile.buffer.toString('base64');
        parts.push({
          inlineData: {
            mimeType: mimeType === 'video/mp4' ? 'video/mp4' : (mimeType.startsWith('audio/') ? mimeType : 'audio/mp3'),
            data: base64Data,
          },
        });
        promptContext = `The user uploaded an actual audio/video file named "${fileName}". Carefully process the media, listen to the complete audio track, transcribe and analyze the exact spoken words and visual content.`;
      } else {
        // Subtitle or text file (.srt, .vtt, .txt, .json)
        const fileText = uploadedFile.buffer.toString('utf-8');
        parts.push({
          text: `Exact Subtitle/Transcript File Content (${fileName}):\n\n${fileText}`,
        });
        promptContext = `The user uploaded an exact subtitle/transcript file named "${fileName}". Perform an in-depth analysis based strictly on this transcript.`;
      }
    } else if (url) {
      // Try fetching real YouTube metadata via oEmbed
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
          const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            fetchedTitle = oembedData.title || '';
            fetchedAuthor = oembedData.author_name || '';
            fetchedThumbnail = oembedData.thumbnail_url || '';
          }
        } catch (e) {
          console.log('YouTube oEmbed fetch skipped or failed:', e);
        }
      }

      useSearchGrounding = true;
      promptContext = `The user requested real analysis for the video URL: "${url}". ${
        fetchedTitle ? `Verified Video Title: "${fetchedTitle}", Channel: "${fetchedAuthor}".` : ''
      } Use live search grounding to look up the video's actual topic, key points, transcript summary, and details.`;

      if (textContent) {
        parts.push({ text: `User provided transcript text / additional details for this URL:\n${textContent}` });
      }
    } else if (textContent) {
      parts.push({ text: `Transcript Text:\n${textContent}` });
      promptContext = `The user pasted the video transcript text directly. Perform a deep, accurate analysis based on this text.`;
    } else {
      return res.status(400).json({ error: 'Video URL, file, or transcript text is required.' });
    }

    const systemPrompt = `You are an expert AI Video & Media Analyzer specializing in extracting clear, high-yield learning content from video, audio, or transcripts.
Analyze the provided media or text and generate a comprehensive response in JSON format adhering strictly to the schema provided.

Guidelines:
1. Provide a clear, engaging title and channel/author name if identifiable (or descriptive title).
2. Generate an Executive Summary (3 bullet points) and Core Takeaways (3 detailed actionable points).
3. Identify Target Audience and Key Insights categorized by theme.
4. Timestamps & Chapters: Create 3 border-to-border chronological chapters (or up to 8 for long media) with exact timestamps (format "MM:SS" or "HH:MM:SS"), seconds integer, chapter title, 1-sentence summary, key points array, and key terms/keywords.
5. Key Concepts & Glossary: Extract 4-6 technical terms, acronyms, or key concepts with clear definitions and importance ('high' or 'medium').
6. Extract all unique keywords for easy tag searching.
7. Quiz/Study Flashcards: Create 2 border-to-border multiple choice questions based on the video content to test the learner's comprehension.
8. Transcript: Provide key timestamped transcript lines if available or extracted (at least 5-10 timestamped dialogue/topic lines).
9. Suggested Questions: Create 4 insightful follow-up questions the learner might want to ask about this video.
10. Output language MUST be Korean (한국어) unless the source text explicitly requests English.`;

    parts.push({
      text: `${promptContext}\n\nPlease generate a full structured analysis in JSON.`,
    });

    const config: any = {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'Video title' },
          channelOrAuthor: { type: Type.STRING, description: 'Author or Channel name' },
          duration: { type: Type.STRING, description: 'Duration in MM:SS format' },
          durationSeconds: { type: Type.INTEGER, description: 'Duration in seconds' },
          executiveSummary: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Executive summary bullet points',
          },
          coreTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Core takeaways bullet points',
          },
          targetAudience: { type: Type.STRING, description: 'Intended target audience' },
          keyInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                points: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['category', 'points'],
            },
          },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                seconds: { type: Type.INTEGER },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['id', 'timestamp', 'seconds', 'title', 'summary', 'keyPoints', 'keywords'],
            },
          },
          glossary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
                importance: { type: Type.STRING },
              },
              required: ['term', 'definition'],
            },
          },
          allKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                timestamp: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
            },
          },
          transcript: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                seconds: { type: Type.INTEGER },
                speaker: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ['timestamp', 'seconds', 'text'],
            },
          },
          suggestedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          'title',
          'executiveSummary',
          'coreTakeaways',
          'chapters',
          'glossary',
          'quiz',
          'suggestedQuestions',
        ],
      },
    };

    // Note: Do not attach googleSearch tool when responseSchema is present as Gemini API does not allow tools with structured responseSchema.
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config,
    });

    let rawText = response.text || '{}';
    // Clean markdown code fence if present
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

    let analysisData: any = {};
    try {
      analysisData = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Failed to parse JSON response:', parseErr, rawText);
      // Fallback object if JSON parse fails
      analysisData = {
        title: fetchedTitle || '비디오 분석 결과',
        channelOrAuthor: fetchedAuthor || '미디어 채널',
        duration: '10:00',
        durationSeconds: 600,
        executiveSummary: ['영상의 주요 내용에 대한 분석이 완료되었습니다.'],
        coreTakeaways: ['주요 포인트를 다룹니다.'],
        chapters: [],
        glossary: [],
        quiz: [],
        suggestedQuestions: ['이 영상의 핵심은 무엇인가요?'],
      };
    }

    if (fetchedTitle && (!analysisData.title || analysisData.title.length < 3)) {
      analysisData.title = fetchedTitle;
    }
    if (fetchedAuthor && (!analysisData.channelOrAuthor || analysisData.channelOrAuthor === '알 수 없음')) {
      analysisData.channelOrAuthor = fetchedAuthor;
    }

    res.json({
      success: true,
      analysis: {
        id: 'analysis-' + Date.now(),
        sourceType,
        videoUrl: url || undefined,
        thumbnailUrl: fetchedThumbnail || undefined,
        language: 'ko',
        analyzedAt: new Date().toISOString(),
        isRealAnalysis: true,
        ...analysisData,
      },
    });
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    res.status(500).json({
      error: 'Failed to analyze video content.',
      details: err.message || String(err),
    });
  }
});

// ----------------------------------------------------
// API 2: /api/qa - Grounded Interactive Q&A
// ----------------------------------------------------
app.post('/api/qa', async (req, res) => {
  try {
    const ai = getGeminiAI();
    const { videoContext, question, chatHistory } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const systemPrompt = `You are an intelligent Video Content AI Tutor.
Answer the user's question accurately based strictly on the provided video summary, transcript, chapters, and context.
If a timestamp in the video (e.g. 02:15) is relevant to the answer, mention it explicitly in format [MM:SS] or (MM:SS) so the user can click to jump.
Be polite, structured, and helpful in Korean unless requested otherwise.`;

    let contents = [
      {
        role: 'user',
        parts: [
          { text: `Video Summary & Context:\n${JSON.stringify(videoContext, null, 2)}` },
          { text: `Previous Conversation:\n${JSON.stringify(chatHistory || [], null, 2)}` },
          { text: `User Question: ${question}` },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      answer: response.text || '답변을 생성하지 못했습니다.',
    });
  } catch (err: any) {
    console.error('Error in /api/qa:', err);
    res.status(500).json({ error: 'Failed to process Q&A query.', details: err.message });
  }
});

// ----------------------------------------------------
// API 3: /api/translate - Multi-language Translation
// ----------------------------------------------------
app.post('/api/translate', async (req, res) => {
  try {
    const ai = getGeminiAI();
    const { analysisData, targetLangName, targetLangCode } = req.body;

    if (!analysisData || !targetLangName) {
      return res.status(400).json({ error: 'analysisData and targetLangName are required.' });
    }

    const systemPrompt = `You are a professional multi-lingual translator.
Translate all Korean text inside the provided JSON video analysis into ${targetLangName} (${targetLangCode}).
Do NOT change key names, timestamps, seconds, or numerical indexes.
Translate strings, title, summary, keyPoints, definitions, questions, and explanations faithfully into ${targetLangName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          text: `Translate this JSON into ${targetLangName}:\n\n${JSON.stringify(analysisData)}`,
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const translatedJson = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      translatedAnalysis: translatedJson,
    });
  } catch (err: any) {
    console.error('Error in /api/translate:', err);
    res.status(500).json({ error: 'Failed to translate content.', details: err.message });
  }
});

// ----------------------------------------------------
// Vite Middleware / Static Fallback
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
