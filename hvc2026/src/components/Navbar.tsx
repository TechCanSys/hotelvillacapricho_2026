
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservationForm from "./ReservationForm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className={`text-2xl font-bold ${isScrolled ? "text-navy" : "text-white"}`}>
              Hotel Villa Capricho
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`font-medium hover:text-gold transition-colors ${
                isScrolled ? "text-navy" : "text-white"
              }`}
            >
              Início
            </button>
            <button
              onClick={() => {
                const roomsSection = document.getElementById('rooms');
                if (roomsSection) {
                  roomsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`font-medium hover:text-gold transition-colors ${
                isScrolled ? "text-navy" : "text-white"
              }`}
            >
              Quartos
            </button>
            <button
              onClick={() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`font-medium hover:text-gold transition-colors ${
                isScrolled ? "text-navy" : "text-white"
              }`}
            >
              Serviços
            </button>
            <Link
              to="#restaurant"
              className={`font-medium hover:text-gold transition-colors ${
                isScrolled ? "text-navy" : "text-white"
              }`}
            >
              
            </Link>
            <Button 
              className="bg-gold hover:bg-opacity-90 text-white"
              onClick={() => setShowReservationForm(true)}
            >
              Reserve Agora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl focus:outline-none"
          >
            {isOpen ? (
              <X className={isScrolled ? "text-navy" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-navy" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white w-full py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <button
                className="font-medium text-navy hover:text-gold transition-colors text-left"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsOpen(false);
                }}
              >
                Início
              </button>
              <button
                className="font-medium text-navy hover:text-gold transition-colors text-left"
                onClick={() => {
                  const roomsSection = document.getElementById('rooms');
                  if (roomsSection) {
                    roomsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsOpen(false);
                }}
              >
                Quartos
              </button>
              <button
                className="font-medium text-navy hover:text-gold transition-colors text-left"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsOpen(false);
                }}
              >
                Serviços
              </button>
              <Link
                to="#restaurant"
                className="font-medium text-navy hover:text-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Restaurante & Bar
              </Link>
              <Button 
                className="bg-gold hover:bg-opacity-90 text-white w-full"
                onClick={() => {
                  setShowReservationForm(true);
                  setIsOpen(false);
                }}
              >
                Reserve Agora
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm onClose={() => setShowReservationForm(false)} />
      )}
    </>
  );
};

export default Navbar;
