import { supabase } from './supabase';

export const storageService = {
  // Upload de uma única imagem
  uploadImage: async (bucket: string, filePath: string, file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  },

  // Deletar uma imagem
  deleteImage: async (bucket: string, filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      throw error;
    }
  },

  // Obter URL pública de uma imagem
  getPublicUrl: (bucket: string, filePath: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Listar todas as imagens em um bucket
  listImages: async (bucket: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      throw error;
    }
  }
};