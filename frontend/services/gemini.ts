
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { requestDeduplicator } from '../utils/requestUtils';

const apiKey = process.env.API_KEY || '';
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Some features may not work.');
}

const ai = new GoogleGenAI({ apiKey });

// レート制限: 画像編集は1分間に5回まで
let imageEditRequests: number[] = [];
const MAX_IMAGE_EDIT_PER_MINUTE = 5;

async function checkRateLimit(): Promise<void> {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  // 古いリクエストを削除
  imageEditRequests = imageEditRequests.filter(timestamp => timestamp > oneMinuteAgo);
  
  if (imageEditRequests.length >= MAX_IMAGE_EDIT_PER_MINUTE) {
    const oldestRequest = imageEditRequests[0];
    const waitTime = 60 * 1000 - (now - oldestRequest);
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return checkRateLimit();
    }
  }
  
  imageEditRequests.push(now);
}

// --- Image Editing ---
export const editImage = async (
  base64Image: string, 
  prompt: string,
  signal?: AbortSignal
): Promise<string> => {
  // 重複リクエストの防止（同じ画像とプロンプトの組み合わせ）
  const requestKey = `image-edit-${base64Image.substring(0, 50)}-${prompt}`;
  
  return requestDeduplicator.deduplicate(requestKey, async () => {
    try {
      // レート制限のチェック
      await checkRateLimit();
      
      // AbortSignalのチェック
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }

      const mimeMatch = base64Image.match(/^data:(.*);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      // リトライロジック付きでリクエスト
      let lastError: Error | null = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          if (signal?.aborted) {
            throw new Error('Request aborted');
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                {
                  inlineData: {
                    data: data,
                    mimeType: mimeType,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          });

          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
          throw new Error("No image generated.");
        } catch (error: any) {
          lastError = error;
          
          // AbortErrorの場合はリトライしない
          if (error?.name === 'AbortError' || signal?.aborted) {
            throw error;
          }
          
          // 最後の試行でない場合のみ待機
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      throw lastError || new Error("Image generation failed after retries.");
    } catch (error: any) {
      console.error("Gemini Image Edit Error:", error);
      
      // より詳細なエラーメッセージ
      if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        throw new Error('APIのレート制限に達しました。しばらく待ってから再試行してください。');
      }
      
      throw error;
    }
  });
};

// --- Chat Agent Tools ---

const addTaskTool: FunctionDeclaration = {
  name: "addTask",
  description: "Add a new task to the user's todo list. Use this when the user asks to create, add, or schedule a task.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The title or content of the task.",
      },
      category: {
        type: Type.STRING,
        description: "Category of the task. Must be one of: '就活', '学習', '生活'. Infer based on context if not specified.",
        enum: ['就活', '学習', '生活']
      },
      dueDate: {
        type: Type.STRING,
        description: "Due date of the task in YYYY-MM-DD format. If user says 'tomorrow', calculate the date.",
      },
      priority: {
        type: Type.STRING,
        description: "Priority of the task. Must be one of: '高', '中', '低'.",
        enum: ['高', '中', '低']
      }
    },
    required: ["title"],
  },
};

export const chatModelName = 'gemini-2.5-flash';

export const getChatModel = () => {
  return ai.models;
};

export const taskTools = [addTaskTool];
