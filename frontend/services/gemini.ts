
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Image Editing ---
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const mimeMatch = base64Image.match(/^data:(.*);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const data = base64Image.replace(/^data:image\/\w+;base64,/, "");

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
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
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
