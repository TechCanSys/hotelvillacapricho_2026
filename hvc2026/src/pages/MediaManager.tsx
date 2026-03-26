import React, { useState, useEffect } from 'react';
import { useSupabaseContext } from '../contexts/SupabaseContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { toast } from '../components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Loader2, Upload, Globe, Trash2, Copy } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MediaManager = () => {
  const { supabase } = useSupabaseContext();
  const [images, setImages] = useState<Array<{ id: string, name: string, url: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const bucketName = 'media';

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoadingImages(true);
      const { data: bucketExists } = await supabase.storage.getBucket(bucketName);
      
      if (!bucketExists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880
        });
      }
      
      const { data, error } = await supabase.storage.from(bucketName).list();
      
      if (error) {
        throw error;
      }
      
      const imagesList = await Promise.all(
        data.map(async (item) => {
          const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(item.name);
          return {
            id: item.id,
            name: item.name,
            url: publicUrl
          };
        })
      );
      
      setImages(imagesList);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar imagens",
        description: "Ocorreu um erro ao carregar as imagens. Por favor, tente novamente."
      });
    } finally {
      setLoadingImages(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadLocalFile = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma imagem para upload."
      });
      return;
    }

    try {
      setLoading(true);
      
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Upload concluído",
        description: "Imagem carregada com sucesso!"
      });
      
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      await loadImages();
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload do arquivo. Por favor, tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFromUrl = async () => {
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "URL não fornecida",
        description: "Por favor, informe uma URL válida."
      });
      return;
    }

    if (!imageFileName) {
      toast({
        variant: "destructive",
        title: "Nome do arquivo não fornecido",
        description: "Por favor, defina um nome para o arquivo."
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Não foi possível buscar a imagem da URL fornecida");
      }
      
      const blob = await response.blob();
      const fileName = `${Date.now()}-${imageFileName}`;
      
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, blob);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Upload concluído",
        description: "Imagem carregada com sucesso!"
      });
      
      setImageUrl('');
      setImageFileName('');
      await loadImages();
    } catch (error) {
      console.error("Erro ao carregar imagem por URL:", error);
      toast({
        variant: "destructive",
        title: "Erro no carregamento",
        description: "Ocorreu um erro ao carregar a imagem da URL. Verifique se a URL é válida e acessível."
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([imageName]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Imagem excluída",
        description: "A imagem foi excluída com sucesso."
      });
      
      await loadImages();
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      toast({
        variant: "destructive",
        title: "Erro na exclusão",
        description: "Ocorreu um erro ao excluir a imagem. Por favor, tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "URL copiada",
      description: "A URL da imagem foi copiada para a área de transferência."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Gerenciador de Mídia</h1>
        
        <Tabs defaultValue="upload-local" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="upload-local">Upload Local</TabsTrigger>
            <TabsTrigger value="upload-url">Upload por URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload-local" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upload de Arquivo Local</h2>
              <div className="flex flex-col space-y-4">
                <Input 
                  id="file-upload"
                  type="file" 
                  onChange={handleFileSelect} 
                  accept="image/*"
                  disabled={loading}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600">
                    Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                <Button 
                  onClick={uploadLocalFile} 
                  disabled={!selectedFile || loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Fazer Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload-url" className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upload por URL</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Imagem
                  </label>
                  <Input 
                    id="image-url"
                    type="text" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="https://exemplo.com/imagem.jpg"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="image-filename" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Arquivo
                  </label>
                  <Input 
                    id="image-filename"
                    type="text" 
                    value={imageFileName} 
                    onChange={(e) => setImageFileName(e.target.value)} 
                    placeholder="nome-do-arquivo.jpg"
                    disabled={loading}
                  />
                </div>
                <Button 
                  onClick={uploadFromUrl} 
                  disabled={!imageUrl || !imageFileName || loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Carregar da URL
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Imagens Armazenadas</h2>
          
          {loadingImages ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando imagens...</span>
            </div>
          ) : images.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nenhuma imagem encontrada. Faça upload de imagens para visualizá-las aqui.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={image.url} 
                      alt={image.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex justify-between mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(image.url)}
                        className="flex-1 mr-1"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar URL
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="flex-none">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir imagem</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteImage(image.name)}>
                              {loading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Excluindo...
                                </>
                              ) : (
                                "Excluir"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MediaManager;
