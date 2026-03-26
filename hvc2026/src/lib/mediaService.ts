
import { supabase } from './supabase';

const BUCKET_NAME = 'media';

// Verifica se o bucket existe e cria se não existir
export const ensureBucketExists = async () => {
  try {
    const { data: bucket } = await supabase.storage.getBucket(BUCKET_NAME);
    
    if (!bucket) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao verificar/criar bucket:", error);
    return false;
  }
};

// Lista todas as imagens no bucket
export const listImages = async () => {
  try {
    await ensureBucketExists();
    
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    
    if (error) {
      throw error;
    }
    
    return Promise.all(
      data.map(async (item) => {
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(item.name);
        return {
          id: item.id,
          name: item.name,
          url: publicUrl,
          createdAt: item.created_at
        };
      })
    );
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
    throw error;
  }
};

// Upload de arquivo local
export const uploadLocalFile = async (file: File) => {
  try {
    await ensureBucketExists();
    
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file);
    
    if (error) {
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    return {
      fileName,
      url: publicUrl
    };
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    throw error;
  }
};

// Upload de arquivo a partir de URL
export const uploadFileFromUrl = async (url: string, fileName: string) => {
  try {
    await ensureBucketExists();
    
    // Faz o fetch da imagem da URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Não foi possível buscar a imagem da URL fornecida");
    }
    
    const blob = await response.blob();
    const completeFileName = `${Date.now()}-${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(completeFileName, blob);
    
    if (error) {
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(completeFileName);
    
    return {
      fileName: completeFileName,
      url: publicUrl
    };
  } catch (error) {
    console.error("Erro ao fazer upload por URL:", error);
    throw error;
  }
};

// Exclui uma imagem pelo nome
export const deleteImage = async (imageName: string) => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imageName]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    throw error;
  }
};

// Obtém a URL pública de uma imagem pelo nome
export const getImageUrl = (imageName: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(imageName);
  
  return publicUrl;
};
