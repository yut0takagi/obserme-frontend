import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { useLiveSession } from '../hooks/useLiveSession';
import { Mic, MicOff, Activity, AlertCircle } from 'lucide-react';

const LiveAssistant = () => {
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({user: '', ai: ''});
  
  const handleTranscription = (userInput: string, aiOutput: string) => {
    setTranscription(prev => ({
       user: userInput ? prev.user + userInput : prev.user,
       ai: aiOutput ? prev.ai + aiOutput : prev.ai
    }));
  };

  const { connect, disconnect, isConnected, isError, statusMessage } = useLiveSession({
    onTranscriptionUpdate: handleTranscription
  });

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
       <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ライブ音声アシスタント</h2>
        <p className="text-gray-500 dark:text-gray-400">AIキャリアコーチとリアルタイムで会話しましょう。</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col relative">
        {/* Status Bar */}
        <div className="h-14 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 bg-gray-50 dark:bg-gray-900/50">
           <div className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{statusMessage}</span>
           </div>
           {isConnected && <Badge color="green">ライブ 24kHz</Badge>}
        </div>

        {/* Visualizer / Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative">
          
          {!isConnected && !isError && (
             <div className="text-center max-w-md">
               <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Mic className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">準備はいいですか？</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-8">接続ボタンを押してマイクを有効にし、Gemini 2.5 Live と会話を始めましょう。</p>
               <Button size="lg" onClick={connect} className="w-full sm:w-auto shadow-lg shadow-indigo-200 dark:shadow-none">
                 接続して会話を開始
               </Button>
             </div>
          )}

          {isConnected && (
            <div className="w-full max-w-2xl space-y-8 flex flex-col items-center">
               {/* Abstract Visualizer */}
               <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500 opacity-10 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-indigo-500 opacity-20 rounded-full animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                    <Activity className="w-10 h-10 text-white" />
                  </div>
               </div>
               
               {/* Live Transcriptions */}
               <div className="w-full space-y-4 text-center">
                  <div className="min-h-[60px]">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">あなた</p>
                    <p className="text-xl text-gray-800 dark:text-gray-100 font-medium">{transcription.user || "聞き取り中..."}</p>
                  </div>
                  <div className="min-h-[60px]">
                    <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-1">Gemini</p>
                    <p className="text-xl text-indigo-700 dark:text-indigo-300 font-medium">{transcription.ai || "..."}</p>
                  </div>
               </div>

               <div className="absolute bottom-8">
                 <Button variant="danger" size="lg" onClick={disconnect} className="rounded-full px-8 shadow-lg">
                   <MicOff className="w-5 h-5 mr-2" /> セッション終了
                 </Button>
               </div>
            </div>
          )}

          {isError && (
            <div className="text-center">
               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">接続エラー</h3>
               <p className="text-red-600 dark:text-red-400 mb-6">{statusMessage}</p>
               <Button onClick={connect} variant="secondary">再試行</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;