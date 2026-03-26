import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ServiceImage {
  url: string;
  alt: string;
}

interface ServiceDialogProps {
  title: string;
  description: string;
  images: ServiceImage[];
  detailedInfo: string;
}

const ServiceDialog = ({ title, description, images, detailedInfo }: ServiceDialogProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const delay = 1000;
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 7000);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [images.length, isPaused]);

  const handleManualNavigation = (index: number) => {
    setIsPaused(true);
    setCurrentImage(index);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white mt-4">
          Ver Mais
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] p-4 sm:p-6 overflow-y-auto max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-navy">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
          <div>
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img
                src={images[currentImage].url}
                alt={images[currentImage].alt}
                className="w-full h-80 object-cover transition-transform duration-500"
              />
              <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between px-4">
                <button
                  onClick={() => handleManualNavigation(currentImage === 0 ? images.length - 1 : currentImage - 1)}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={() => handleManualNavigation(currentImage === images.length - 1 ? 0 : currentImage + 1)}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={image.alt}
                  className={`h-20 w-full object-cover rounded cursor-pointer transition-all ${currentImage === idx ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => handleManualNavigation(idx)}
                />
              ))}                  
            </div>
          </div>

          <div>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="mb-6">
              <h4 className="font-bold text-navy mb-2">Informações Detalhadas</h4>
              <p className="text-gray-600">{detailedInfo}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;