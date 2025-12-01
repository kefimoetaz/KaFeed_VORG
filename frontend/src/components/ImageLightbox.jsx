import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useState } from 'react';

const ImageLightbox = ({ image, alt, onClose, user }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `kafeed-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <Download size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Image */}
      <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
        <img
          src={image}
          alt={alt}
          className="w-full h-auto max-h-[85vh] object-contain transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        />
        {user && (
          <div className="mt-4 text-center text-white">
            <p className="text-sm opacity-75">Posted by {user}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
