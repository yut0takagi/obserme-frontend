import React, { useState, useRef } from 'react';
import { Card, Button, Input } from '../components/UI';
import { editImage } from '../services/gemini';
import { Upload, Wand2, Loader2, Image as ImageIcon } from 'lucide-react';

const ImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null); // Reset generated image when new one is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setLoading(true);
    try {
      const result = await editImage(selectedImage, prompt);
      setGeneratedImage(result);
    } catch (error) {
      alert('画像の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI 画像編集</h2>
        <p className="text-gray-500 dark:text-gray-400">Gemini 2.5 Flash を使用して、言葉で画像を編集しましょう。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-4">
          <Card className="min-h-[400px] flex flex-col justify-center items-center border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden group">
            {selectedImage ? (
              <img src={selectedImage} alt="Original" className="w-full h-full object-contain absolute inset-0" />
            ) : (
              <div className="text-center pointer-events-none">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">画像をアップロード</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG (5MBまで)</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
            {selectedImage && (
              <div className="absolute bottom-4 right-4 z-10">
                <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                   画像を変更
                </Button>
              </div>
            )}
          </Card>
          
          <div className="space-y-3">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">編集指示</label>
             <div className="flex gap-2">
               <div className="flex-1">
                 <Input 
                    placeholder="例: 'レトロなフィルターを追加して', '雪を降らせて'" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                 />
               </div>
               <Button 
                 onClick={handleGenerate} 
                 disabled={!selectedImage || !prompt || loading}
                 className="min-w-[120px]"
               >
                 {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                 生成
               </Button>
             </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-4">
          <Card className="min-h-[400px] flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 relative overflow-hidden">
            {loading ? (
              <div className="text-center animate-pulse">
                <Wand2 className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-bounce" />
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Gemini が魔法をかけています...</p>
              </div>
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated" className="w-full h-full object-contain absolute inset-0" />
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm">編集された画像がここに表示されます</p>
              </div>
            )}
          </Card>
          
          {generatedImage && (
            <div className="flex justify-end">
              <a href={generatedImage} download="edited-image.png">
                <Button variant="secondary">画像をダウンロード</Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;