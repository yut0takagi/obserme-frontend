
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { getChatModel, taskTools, chatModelName } from '../services/gemini';
import { ChatMessage } from '../types';
import { Send, Bot, X, Smile, Paperclip, MoreHorizontal, Sparkles } from 'lucide-react';
import { Content, Part } from '@google/genai';
import { useDebounce, abortControllerManager } from '../utils/requestUtils';
import { handleError, getUserErrorMessage } from '../utils/errorHandler';

interface ChatSidebarProps {
  onClose: () => void;
}

export const ChatSidebar = ({ onClose }: ChatSidebarProps) => {
  const { addTask } = useTasks();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: 'こんにちは! タスクの追加や相談など、お気軽にどうぞ。',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: 'Obserme AI',
      avatar: 'AI'
    }
  ]);

  // TODO: 会話履歴の最大件数を制限（メモリリーク防止）
  // TODO: 会話履歴の圧縮機能（古いメッセージを要約）
  const [geminiHistory, setGeminiHistory] = useState<Content[]>([
    { role: 'model', parts: [{ text: 'こんにちは! Obserme AI です。' }] }
  ]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // クリーンアップ: コンポーネントのアンマウント時にリクエストをキャンセル
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成
    const controller = abortControllerManager.getController('chat');
    abortControllerRef.current = controller;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // 1. Add User Message
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: 'You',
      avatar: 'JS'
    };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      // AbortSignalをチェック
      if (controller.signal.aborted) {
        return;
      }

      const model = getChatModel();
      
      const currentHistory = [
        ...geminiHistory,
        { role: 'user', parts: [{ text: userText }] }
      ];

      // TODO: チャット機能のレート制限を追加
      // TODO: ストリーミングレスポンスの対応（リアルタイムでテキストを表示）
      // TODO: 会話履歴の永続化（ローカルストレージまたはバックエンドAPI）
      const result = await model.generateContent({
        model: chatModelName,
        contents: currentHistory,
        config: {
          tools: [{ functionDeclarations: taskTools }],
          systemInstruction: "あなたはフレンドリーなAIアシスタントです。ユーザーのタスク管理を手伝います。回答は簡潔に。",
        }
      });

      // リクエストがキャンセルされた場合
      if (controller.signal.aborted) {
        return;
      }

      const responseParts = result.candidates?.[0]?.content?.parts || [];
      let finalResponseText = "";
      
      const functionCalls = responseParts.filter(part => part.functionCall);
      const textParts = responseParts.filter(part => part.text);

      if (textParts.length > 0) {
        finalResponseText += textParts.map(p => p.text).join("");
      }

      if (functionCalls.length > 0) {
        const toolResponses: Part[] = [];

        for (const call of functionCalls) {
          const fc = call.functionCall;
          if (fc && fc.name === 'addTask') {
            const args = fc.args as any;
            addTask({
              title: args.title,
              category: args.category || '生活',
              dueDate: args.dueDate || new Date().toISOString().split('T')[0],
              priority: args.priority || '中',
              status: '未着手',
            });

            toolResponses.push({
              functionResponse: {
                name: fc.name,
                response: { result: "success", message: `Task '${args.title}' added.` },
                id: fc.id
              }
            });

            setMessages(prev => [...prev, {
              id: Date.now().toString() + '-sys',
              role: 'system',
              content: `✅ タスク「${args.title}」を追加しました`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              name: 'System'
            }]);
          }
        }

        if (toolResponses.length > 0) {
          // リクエストがキャンセルされた場合
          if (controller.signal.aborted) {
            return;
          }

          const functionResponseResult = await model.generateContent({
            model: chatModelName,
            contents: [
              ...currentHistory,
              result.candidates![0].content,
              { role: 'user', parts: toolResponses }
            ],
          });

          // リクエストがキャンセルされた場合
          if (controller.signal.aborted) {
            return;
          }
          
          const confirmationText = functionResponseResult.candidates?.[0]?.content?.parts?.[0]?.text;
          if (confirmationText) {
            finalResponseText = confirmationText;
          }
          
          setGeminiHistory([
             ...currentHistory,
             result.candidates![0].content,
             { role: 'user', parts: toolResponses },
             functionResponseResult.candidates![0].content
          ]);
        }
      } else {
        setGeminiHistory([
          ...currentHistory,
          result.candidates![0].content
        ]);
      }

      if (finalResponseText) {
        const newAiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: finalResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: 'Obserme AI',
          avatar: 'AI'
        };
        setMessages(prev => [...prev, newAiMsg]);
      }

    } catch (error: any) {
      // AbortErrorの場合はエラーメッセージを表示しない
      if (error?.name === 'AbortError') {
        setIsLoading(false);
        return;
      }

      // エラーを分類してユーザーフレンドリーなメッセージを取得
      const appError = handleError(error, 'ChatSidebar.handleSendMessage');
      const userMessage = getUserErrorMessage(error);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name: 'System'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, geminiHistory, addTask, messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl min-w-0">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-4 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-900/50 min-w-0">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 min-w-0 flex-1">
           <Sparkles className="w-4 h-4 flex-shrink-0" />
           <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate">AI アシスタント</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 ml-2"
          aria-label="チャットを閉じる"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-white dark:bg-gray-800 scroll-smooth min-w-0" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 sm:gap-3 min-w-0 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
              {msg.role === 'model' ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              ) : msg.role === 'user' ? (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs">
                  {msg.avatar}
                </div>
              ) : (
                 <div className="w-7 h-7 sm:w-8 sm:h-8"></div>
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col min-w-0 flex-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`px-3 py-2 rounded-lg text-xs sm:text-sm leading-relaxed break-words max-w-full ${
                 msg.role === 'user' 
                   ? 'bg-indigo-600 text-white rounded-br-none' 
                   : msg.role === 'system'
                     ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 border border-gray-100 dark:border-gray-700'
                     : 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 rounded-bl-none'
               }`}>
                 <span className="whitespace-pre-wrap break-words">{msg.content}</span>
               </div>
               <span className="text-[10px] text-gray-400 mt-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
             <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
             </div>
             <div className="flex items-center">
                <span className="text-xs text-gray-400">入力中...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 shrink-0 min-w-0">
        <form onSubmit={handleSendMessage} className="relative min-w-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="タスク追加や質問..."
            className="w-full min-w-0 pl-3 sm:pl-4 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors flex-shrink-0 ${
              input.trim() && !isLoading ? 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' : 'text-gray-400 cursor-not-allowed'
            }`}
            aria-label="送信"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
