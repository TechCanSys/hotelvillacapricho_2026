
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import ReservationsTab from './admin/ReservationsTab';
import PricesTab from './admin/PricesTab';
import ServicesTab from './admin/ServicesTab';
import PromotionsTab from './admin/PromotionsTab';
import ImagesTab from './admin/ImagesTab';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { Price, Promotion, Reservation, RoomImage } from './admin/types';
import { useSupabaseContext } from '../contexts/SupabaseContext';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  // Initialize state for all the required props
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabaseContext();

  useEffect(() => {
    // Load data from Supabase
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load reservations
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select('*');
        
        if (reservationsError) throw reservationsError;
        
        // Transform data to match our Reservation interface
        if (reservationsData) {
          const formattedReservations = reservationsData.map(res => ({
            id: res.id,
            name: res.name,
            email: res.email,
            phone: res.phone,
            roomType: res.room_type,
            checkIn: res.check_in,
            checkOut: res.check_out,
            adults: res.adults,
            children: res.children || 0,
            nights: res.nights,
            totalPrice: res.total_price,
            message: res.message,
            status: res.status as "pending" | "confirmed" | "cancelled",
            createdAt: res.created_at,
            updatedAt: res.updated_at
          }));
          setReservations(formattedReservations);
        }
        
        // Load prices
        const { data: pricesData, error: pricesError } = await supabase
          .from('prices')
          .select('*');
        
        if (pricesError) throw pricesError;
        
        // Transform data to match our Price interface
        if (pricesData) {
          const formattedPrices = pricesData.map(price => ({
            id: price.id,
            roomType: price.room_type,
            price: price.price.toString(),
            isPromotion: price.is_promotion || false,
            promotionPrice: price.promotion_price?.toString() || '',
            isEditing: false,
            active: price.active || true
          }));
          setPrices(formattedPrices);
        }
        
        // Load promotions
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('promotions')
          .select('*');
        
        if (promotionsError) throw promotionsError;
        
        // Transform data to match our Promotion interface
        if (promotionsData) {
          const formattedPromotions = promotionsData.map(promo => ({
            id: promo.id,
            title: promo.title,
            roomType: promo.room_type,
            active: promo.active || false
          }));
          setPromotions(formattedPromotions);
        }
        
        // Load room images
        const { data: imagesData, error: imagesError } = await supabase
          .from('room_images')
          .select('*');
        
        if (imagesError) throw imagesError;
        
        // Transform data to match our RoomImage interface
        if (imagesData) {
          const formattedImages = imagesData.map(img => ({
            id: img.id,
            room: img.room,
            url: img.url,
            alt: img.alt
          }));
          setRoomImages(formattedImages);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do banco de dados."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [supabase]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Link to="/admin/media">
          <Button variant="outline" className="flex items-center">
            <Database className="mr-2 h-4 w-4" /> 
            Gerenciador de Mídia
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Tabs defaultValue="reservations">
          <TabsList className="mb-4">
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="prices">Preços</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="promotions">Promoções</TabsTrigger>
            <TabsTrigger value="images">Imagens</TabsTrigger>
          </TabsList>
          <TabsContent value="reservations">
            <ReservationsTab reservations={reservations} setReservations={setReservations} />
          </TabsContent>
          <TabsContent value="prices">
            <PricesTab prices={prices} setPrices={setPrices} />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="promotions">
            <PromotionsTab promotions={promotions} setPromotions={setPromotions} />
          </TabsContent>
          <TabsContent value="images">
            <ImagesTab roomImages={roomImages} setRoomImages={setRoomImages} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminPanel;
