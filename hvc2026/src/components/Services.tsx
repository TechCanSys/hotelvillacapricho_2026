
import { useState, useEffect } from "react";
import { Bed, Users, Shirt, ShoppingBag, Utensils, Waves } from "lucide-react";
import ServiceDialog from "./ServiceDialog";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DADOS MOCKADOS PARA TESTE
    const mockData = [
      {
        icon: <Users className="w-10 h-10" />,
        title: "Sala de Reunião",
        description: "Espaços profissionais para reuniões e eventos corporativos.",
        images: [
          {
            url: "https://vazqzipehewahhcqtdfw.supabase.co/storage/v1/object/public/media/1743789336561-rr.jpg",
            alt: "Quarto Presidencial - Sala de Estar"
          },
        
        /*images: [
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Reuniao/Exec.jpg`, alt: "Sala de Reunião Principal" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Reuniao/Exec1.jpg`, alt: "Área de Apresentação" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Reuniao/Exec2.jpg`, alt: "Espaço de Networking" }
        */],
        detailedInfo: "Nossas salas de reunião são equipadas com tecnologia de ponta..."
      },
      {
        icon: <Utensils className="w-10 h-10" />,
        title: "Restaurante & Bar",
        description: "Gastronomia de alta qualidade e bebidas premium.",
        
        images: [
          {
            url: "https://vazqzipehewahhcqtdfw.supabase.co/storage/v1/object/public/media/1743789323328-r.jpg",
            alt: "Quarto Presidencial - Sala de Estar"
          },

          images: [
          {
            url: "https://vazqzipehewahhcqtdfw.supabase.co/storage/v1/object/public/media/1743789323328-r.jpg",
          },


        
        /*images: [
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Restaurante/Pre.jpg`, alt: "Restaurante Principal" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Restaurante/Pre1.jpg`, alt: "Bar Lounge" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Restaurante/Pre2.jpg`, alt: "Área VIP" }
        */],
        detailedInfo: "Nosso restaurante oferece uma experiência gastronômica única..."
      },
      {
        icon: <Shirt className="w-10 h-10" />,
        title: "Lavandaria",
        description: "Serviço completo de lavandaria para sua conveniência.",
        
        images: [
          {
            url: "https://vazqzipehewahhcqtdfw.supabase.co/storage/v1/object/public/media/1743789357201-l.jpg",
            alt: "Serviço completo de lavandaria para sua conveniência."
          },
        /*
        images: [
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Lavandaria/Pre3.jpg`, alt: "Lavanderia Principal" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Lavandaria/Exec.jpg`, alt: "Área de Processamento" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Lavandaria/Exec1.jpg`, alt: "Serviço de Passadoria" }
        */],
        detailedInfo: "Oferecemos serviço completo de lavanderia com tecnologia avançada..."
      },
      {
        icon: <Waves className="w-10 h-10" />,
        title: "Piscina",
        description: "Piscina de luxo para relaxar e refrescar-se.",
        images: [
          {
            url: "https://vazqzipehewahhcqtdfw.supabase.co/storage/v1/object/public/media/1743789314688-p.jpg",
            alt: "Piscina de luxo para relaxar e refrescar-se."
          },
        
        
        /*images: [
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Piscina/Pre2.jpg`, alt: "Piscina Principal" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Piscina/Pre3.jpg`, alt: "Área de Descanso" },
          { url: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/Servicos/Piscina/Pre1.jpg`, alt: "Bar da Piscina" }
        */],
        detailedInfo: "Nossa piscina oferece um ambiente relaxante com espreguiçadeiras..."
      }
    ];

    setServices(mockData);
    setLoading(false);
  }, []);

  if (loading) return <div>Carregando serviços...</div>;

  return (
    <section id="services" className="section-padding bg-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">Nossos Serviços</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Desfrute de uma variedade de serviços executivos projetados para tornar sua estadia especial e confortável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center relative overflow-hidden group"
            >
              <div className="relative h-48 mb-6 overflow-hidden rounded-lg">
                <img
                  src={service.images[0].url}
                  alt={service.images[0].alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="text-gold mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-bold text-navy mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ServiceDialog
                title={service.title}
                description={service.description}
                images={service.images}
                detailedInfo={service.detailedInfo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
