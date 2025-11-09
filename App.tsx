
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageViewer } from './components/ImageViewer';
import { Spinner } from './components/Spinner';
import { removePeopleFromImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { DownloadIcon, MagicWandIcon, ArrowLeftIcon } from './components/Icons';

interface ImageFile {
  base64: string;
  name: string;
  mimeType: string;
}

export default function App() {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setProcessedImage(null);
    setIsLoading(true);
    try {
      const base64 = await fileToBase64(file);
      setOriginalImage({
        base64,
        name: file.name,
        mimeType: file.type,
      });
    } catch (err) {
      setError('Görüntü yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRemovePeople = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const resultBase64 = await removePeopleFromImage(originalImage.base64, originalImage.mimeType);
      setProcessedImage(resultBase64);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
      setError(`İşlem başarısız oldu: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${processedImage}`;
    const originalName = originalImage?.name.split('.').slice(0, -1).join('.') || 'processed';
    link.download = `${originalName}_removed.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Yapay Zeka Nesne Kaldırıcı
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Resimlerinizdeki insanları tek tıkla, sihirli bir şekilde kaldırın.
        </p>
      </header>

      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4 w-full text-center">
            {error}
          </div>
        )}

        {!originalImage && !isLoading && <ImageUploader onFileSelect={handleFileSelect} />}
        
        {isLoading && !processedImage && (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <Spinner />
                <p className="mt-4 text-lg text-slate-300 animate-pulse">
                {originalImage ? 'Yapay zeka analiz ediyor ve insanları kaldırıyor...' : 'Görüntü yükleniyor...'}
                </p>
            </div>
        )}


        {originalImage && (
          <div className="w-full flex flex-col items-center">
            <ImageViewer originalImage={`data:${originalImage.mimeType};base64,${originalImage.base64}`} processedImage={processedImage ? `data:image/png;base64,${processedImage}` : null} isLoading={isLoading} />
            
            <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
               <button onClick={handleReset} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ArrowLeftIcon />
                  Yeni Resim
                </button>
              <button
                onClick={handleRemovePeople}
                disabled={isLoading || !!processedImage}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MagicWandIcon />
                İnsanları Kaldır
              </button>
              {processedImage && (
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                >
                  <DownloadIcon />
                  İndir
                </button>
              )}
            </div>
          </div>
        )}
      </main>
       <footer className="w-full max-w-5xl text-center mt-6 text-slate-500">
        <p>Gemini API ile güçlendirilmiştir.</p>
      </footer>
    </div>
  );
}
