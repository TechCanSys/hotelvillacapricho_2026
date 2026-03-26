import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelos seus valores reais da Supabase
// Você pode encontrar essas informações no painel de controle da Supabase
// em Configurações do Projeto > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de autenticação
export const auth = {
  // Registrar um novo usuário
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  // Fazer login
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  // Fazer logout
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  // Obter usuário atual
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  
  // Obter sessão atual
  getSession: async () => {
    return await supabase.auth.getSession();
  },
};

// Funções para manipulação de dados
export const dataService = {
  // Exemplo de função para buscar quartos
  getRooms: async () => {
    return await supabase
      .from('rooms')
      .select('*');
  },
  
  // Exemplo de função para buscar um quarto específico
  getRoomById: async (id: number) => {
    return await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
  },
  
  // Exemplo de função para criar uma reserva
  createBooking: async (bookingData: any) => {
    return await supabase
      .from('bookings')
      .insert(bookingData);
  },
  
  // Exemplo de função para buscar reservas de um usuário
  getUserBookings: async (userId: string) => {
    return await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId);
  },

  // Funções para manipulação de imagens dos quartos
  getRoomImages: async (roomId: number) => {
    return await supabase
      .from('room_images')
      .select('*')
      .eq('room_id', roomId);
  },

  uploadRoomImage: async (imageData: { room_id: number, url: string }) => {
    return await supabase
      .from('room_images')
      .insert(imageData);
  },

  deleteRoomImage: async (imageId: number) => {
    return await supabase
      .from('room_images')
      .delete()
      .eq('id', imageId);
  },
};