
import { useState, useRef, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Bed, Users, Wifi, Coffee } from "lucide-react";

interface RoomImage {
  url: string;
  alt: string;
}

interface RoomProps {
  name: string;
  description: string;
  price: string;
  images: RoomImage[];
  amenities: string[];
  featured?: boolean;
  promotion?: string;
}

const RoomCard = ({ 
  name, 
  description, 
  price, 
  images, 
  amenities, 
  featured = false,
  promotion
}: RoomProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isPaused) {
      const delay = featured ? 0 : 1000; // 1 segundo de atraso para cada card não-featured
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, 7000); // Aumentado para 7 segundos

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [images.length, isPaused, featured]);

  const handleManualNavigation = (index: number) => {
    setIsPaused(true);
    setCurrentImage(index);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10 seconds of inactivity
  };
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full ${featured ? 'ring-2 ring-gold' : ''}`}>
      {featured && (
        <div className="bg-gold text-white text-center py-2 font-semibold">
          Recomendado
        </div>
      )}
      
      {promotion && (
        <div className="bg-terracotta text-white text-center py-2 font-semibold">
          {promotion}
        </div>
      )}
      
      <div className="relative h-80 overflow-hidden group">
        <img 
          src={images[currentImage].url} 
          alt={images[currentImage].alt} 
          className="w-full h-full object-cover transition duration-500 transform group-hover:scale-110"
        />
        
        <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-navy mb-2 h-8 overflow-hidden">{name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2 h-12 overflow-hidden">{description}</p>
        
        <div className="flex flex-wrap gap-3 mb-4 h-16 overflow-hidden">
          {amenities.includes("King Size") && (
            <div className="flex items-center text-gray-700">
              <Bed className="w-4 h-4 mr-1" />
              <span className="text-sm">King Size</span>
            </div>
          )}
          {amenities.includes("Sala de Reunião") && (
            <div className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Sala de Reunião</span>
            </div>
          )}
          {amenities.includes("Wi-Fi") && (
            <div className="flex items-center text-gray-700">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm">Wi-Fi</span>
            </div>
          )}
          {amenities.includes("Pequeno Almoço") && (
            <div className="flex items-center text-gray-700">
              <Coffee className="w-4 h-4 mr-1" />
              <span className="text-sm">Pequeno Almoço</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-2xl font-bold text-navy">{price}</span>
            <span className="text-gray-500 text-sm"> / noite</span>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                Ver Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-[95vw] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-navy">{name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                <div>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src={images[currentImage].url} 
                      alt={images[currentImage].alt} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {images.map((image, idx) => (
                      <img 
                        key={idx}
                        src={image.url} 
                        alt={image.alt} 
                        className={`h-20 w-full object-cover rounded cursor-pointer ${currentImage === idx ? 'ring-2 ring-gold' : ''}`}
                        onClick={() => setCurrentImage(idx)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-4">{description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-navy mb-2">Comodidades</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-navy mb-2">Preço</h4>
                    <p className="text-3xl font-bold text-navy">{price} <span className="text-sm text-gray-500"> / noite</span></p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gold hover:bg-opacity-90 text-white"
                    onClick={() => {
                      // Fechar o diálogo usando o DialogClose
                      if (closeButtonRef.current) {
                        closeButtonRef.current.click();
                      }
                      // Pequeno atraso para garantir que o diálogo feche antes de abrir o formulário
                      setTimeout(() => {
                        setShowReservationForm(true);
                      }, 100);
                    }}
                  >
                    Reservar Agora
                  </Button>
                  
                  {/* Botão de fechamento invisível para referência */}
                  <DialogClose ref={closeButtonRef} className="hidden" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}
    </div>
  );
};

export default RoomCard;
