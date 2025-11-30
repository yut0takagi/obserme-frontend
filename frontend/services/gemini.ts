
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { requestDeduplicator } from '../utils/requestUtils';
import { apiConfig, env } from '../config/env';
import { handleError, getUserErrorMessage } from '../utils/errorHandler';

const apiKey = env.geminiApiKey;
if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Some features may not work.');
}

const ai = new GoogleGenAI({ apiKey });

// TODO: レート制限の設定をapi-config.jsonから読み込むように変更
// TODO: チャット機能のレート制限も追加
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

          // モデル名を設定から取得
          const modelName = apiConfig.getModel('gemini', 'image');
          
          const response = await ai.models.generateContent({
            model: modelName,
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
      // エラーを分類してユーザーフレンドリーなメッセージに変換
      const appError = handleError(error, 'gemini.editImage');
      
      // AbortErrorの場合はそのままthrow
      if (appError.type === 'ABORT') {
        throw error;
      }
      
      // ユーザーフレンドリーなエラーメッセージをthrow
      throw new Error(appError.userMessage);
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

// チャットモデル名を設定から取得
export const chatModelName = apiConfig.getModel('gemini', 'chat');

export const getChatModel = () => {
  return ai.models;
};

export const taskTools = [addTaskTool];

// TODO: 追加のツール機能を実装
// - タスクの更新・削除
// - カレンダーイベントの追加
// - メモの作成
// - アプリケーション情報の取得
