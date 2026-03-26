
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gold">Hotel Villa Capricho</h3>
            <p className="mb-6 text-gray-300">
              Oferecendo luxo e conforto excepcionais para uma experiência memorável. Nosso compromisso é proporcionar o máximo em hospitalidade.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gold transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-gold transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-gold transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gold mt-1" />
                <span>Mahulane, Distrito de Moamba<br />Provincia - Maputo</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gold" />
                <span>+258 84 031 7375 | 85 760 4763</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gold" />
                <span>caxtonsanyanga2011@gmail.com <br /> info@villacapricho.pt</span>
                
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-gold transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="#rooms" className="text-gray-300 hover:text-gold transition-colors">
                  Quartos
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-300 hover:text-gold transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="#restaurant" className="text-gray-300 hover:text-gold transition-colors">
                  Restaurante & Bar
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-gold transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">Newsletter</h3>
            <p className="mb-4 text-gray-300">
              Subscreva nossa newsletter para receber as últimas ofertas e novidades.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Seu email"
                className="px-4 py-2 bg-white bg-opacity-10 border border-gray-600 rounded focus:outline-none focus:border-gold text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold hover:bg-opacity-90 text-white rounded font-medium"
              >
                Subscrever
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Hotel Villa Capricho. Todos os direitos reservados. <br /> Tech-Can Systems, Lda</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
