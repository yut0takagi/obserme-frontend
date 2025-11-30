import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { handleError, getUserErrorMessage } from '../utils/errorHandler';

interface UseLiveSessionProps {
  onTranscriptionUpdate?: (input: string, output: string) => void;
}

export const useLiveSession = ({ onTranscriptionUpdate }: UseLiveSessionProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const sessionRef = useRef<Promise<any> | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const animationFrameRef = useRef<number | null>(null);

  // Decoding helper
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  // Encoding helper
  const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const createPcmBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    const binaryString = Array.from(new Uint8Array(int16.buffer))
      .map((b) => String.fromCharCode(b))
      .join("");
      
    return {
      data: btoa(binaryString),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const connect = useCallback(async () => {
    setIsError(false);
    setStatusMessage('接続中...');

    try {
      // #TODO: 環境変数からAPIキーを取得する方法を統一（env.tsを使用）
      // #TODO: APIキーの検証を追加
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // #TODO: モデル名をapi-config.jsonから取得
      // #TODO: 音声設定をユーザーがカスタマイズ可能に（声の種類、言語等）
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'あなたは親切で励ましてくれるキャリアと生産性向上のためのAIアシスタント「Obserme AI」です。回答は簡潔にしてください。日本語で話してください。',
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      };

      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            //TODO: 接続完了における出力の正規化
            setStatusMessage('接続完了');
            setIsConnected(true);

            if (!inputContextRef.current || !streamRef.current) return;

            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            
            // Use AnalyserNode with requestAnimationFrame instead of deprecated ScriptProcessorNode
            // TODO: Migrate to AudioWorklet for better performance and modern API
            const analyser = inputContextRef.current.createAnalyser();
            analyser.fftSize = 4096;
            analyser.smoothingTimeConstant = 0;
            analyserRef.current = analyser;
            
            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Float32Array(bufferLength);
            
            const processAudio = () => {
              if (!analyserRef.current) return;
              
              analyserRef.current.getFloatTimeDomainData(dataArray);
              const pcmBlob = createPcmBlob(dataArray);
              
              sessionPromise.then((session: any) => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(() => {
                // Session closed or error occurred, stop processing
                if (animationFrameRef.current !== null) {
                  cancelAnimationFrame(animationFrameRef.current);
                  animationFrameRef.current = null;
                }
              });
              
              if (analyserRef.current) {
                animationFrameRef.current = requestAnimationFrame(processAudio);
              }
            };
            
            animationFrameRef.current = requestAnimationFrame(processAudio);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputContextRef.current) {
              const ctx = outputContextRef.current;
              const uint8 = base64ToUint8Array(base64Audio);
              const audioBuffer = await decodeAudioData(uint8, ctx);
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              const now = ctx.currentTime;
              // Schedule next chunk
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Transcriptions
            if (onTranscriptionUpdate) {
               if (msg.serverContent?.inputTranscription?.text) {
                  onTranscriptionUpdate(msg.serverContent.inputTranscription.text, '');
               }
               if (msg.serverContent?.outputTranscription?.text) {
                  onTranscriptionUpdate('', msg.serverContent.outputTranscription.text);
               }
            }

            // Handle Interruptions
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsConnected(false);
            setStatusMessage('切断されました');
          },
          onerror: (err) => {
            // TODO: 自動再接続機能の実装
            const appError = handleError(err, 'useLiveSession.onerror');
            const userMessage = getUserErrorMessage(err);
            setIsError(true);
            setStatusMessage(userMessage);
            setIsConnected(false);
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (e) {
      const appError = handleError(e, 'useLiveSession.connect');
      const userMessage = getUserErrorMessage(e);
      setIsError(true);
      setStatusMessage(userMessage);
    }
  }, [onTranscriptionUpdate]);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
    }
    
    // Cleanup Audio
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
    analyserRef.current?.disconnect();
    sourceRef.current?.disconnect();
    inputContextRef.current?.close();
    outputContextRef.current?.close();
    
    setIsConnected(false);
    setStatusMessage('待機中');
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    isError,
    statusMessage
  };
};