
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReservationForm from "./ReservationForm";

const Hero = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);

  return (
    <div className="relative h-screen">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/capa.jpg')" 
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
          Bem-vindo ao Hotel Villa Capricho
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Uma experiência de luxo e conforto para uma estadia inesquecível
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button 
            className="bg-gold hover:bg-opacity-90 text-white px-8 py-6 text-lg"
            onClick={() => setShowReservationForm(true)}
          >
            Reserve Agora
          </Button>
          <Button 
            variant="outline" 
            className="border-navy text-navy hover:bg-navy hover:text-white px-8 py-6 text-lg"
            onClick={() => {
              const roomsSection = document.getElementById("rooms");
              if (roomsSection) {
                roomsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Conheça Nossos Quartos
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white"
          fill="none" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}
    </div>
  );
};

export default Hero;
