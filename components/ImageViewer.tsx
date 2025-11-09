
import React from 'react';
import { Spinner } from './Spinner';

interface ImageViewerProps {
  originalImage: string;
  processedImage: string | null;
  isLoading: boolean;
}

const ImageCard: React.FC<{ title: string; imageSrc?: string | null; isLoading?: boolean; isProcessed?: boolean }> = ({ title, imageSrc, isLoading = false, isProcessed = false }) => (
  <div className="flex-1 flex flex-col items-center min-w-[280px] w-full">
    <h3 className="text-lg font-semibold text-slate-300 mb-3">{title}</h3>
    <div className="w-full aspect-square rounded-lg bg-slate-900/50 border border-slate-700 flex items-center justify-center overflow-hidden">
      {isLoading && isProcessed ? (
        <div className="flex flex-col items-center text-center p-4">
            <Spinner />
            <p className="mt-2 text-sm text-slate-400">Sonuç oluşturuluyor...</p>
        </div>
      ) : imageSrc ? (
        <img src={imageSrc} alt={title} className="w-full h-full object-contain" />
      ) : (
        <div className="text-slate-500 p-4 text-center">İşlenmiş görüntü burada görünecek</div>
      )}
    </div>
  </div>
);


export const ImageViewer: React.FC<ImageViewerProps> = ({ originalImage, processedImage, isLoading }) => {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      <ImageCard title="Orijinal" imageSrc={originalImage} />
      <ImageCard title="İşlenmiş Sonuç" imageSrc={processedImage} isLoading={isLoading} isProcessed={true}/>
    </div>
  );
};
