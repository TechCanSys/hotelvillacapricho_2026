
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Image, PlusCircle, X, Check, Upload, Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

interface ServiceImage {
  url: string;
  alt: string;
  file?: File;
}

interface ServiceData {
  id: number;
  title: string;
  description: string;
  detailedInfo: string;
  images: ServiceImage[];
  isEditing?: boolean;
}

const ServicesTab = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabaseContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        throw error;
      }

      // Transform data to match our ServiceData interface
      const formattedServices = data?.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        detailedInfo: service.detailed_info || "",
        images: service.images ? (service.images as ServiceImage[]) : [],
        isEditing: false
      })) || [];

      setServices(formattedServices);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Erro ao carregar serviços.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, isEditing: true } : service
    ));
  };

  const handleSave = async (id: number) => {
    const serviceToUpdate = services.find(service => service.id === id);
    if (!serviceToUpdate) return;

    try {
      setLoading(true);
      
      // For any images with file property, upload to storage first
      const updatedImages = await Promise.all(serviceToUpdate.images.map(async (image) => {
        if (image.file) {
          // Upload file to Supabase Storage
          const fileName = `${Date.now()}-${image.file.name}`;
          const { error: uploadError, data } = await supabase.storage
            .from('media')
            .upload(fileName, image.file);
          
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);
          
          // Return updated image object with URL from storage
          return {
            url: publicUrl,
            alt: image.alt
          };
        }
        
        // Return existing image if no file upload needed
        return {
          url: image.url,
          alt: image.alt
        };
      }));
      
      // Update service with new data including processed images
      const { error } = await supabase
        .from('services')
        .update({
          title: serviceToUpdate.title,
          description: serviceToUpdate.description,
          detailed_info: serviceToUpdate.detailedInfo,
          images: updatedImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setServices(services.map(service =>
        service.id === id ? { 
          ...service, 
          isEditing: false,
          images: updatedImages
        } : service
      ));
      
      toast.success("Serviço atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Erro ao atualizar serviço.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (serviceId: number) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        return {
          ...service,
          images: [...service.images, { url: "", alt: "" }]
        };
      }
      return service;
    }));
  };

  const handleImageChange = (serviceId: number, index: number, field: "url" | "alt", value: string) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        const newImages = [...service.images];
        newImages[index] = { ...newImages[index], [field]: value };
        return { ...service, images: newImages };
      }
      return service;
    }));
  };

  const handleFileChange = (serviceId: number, index: number, file: File) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        const newImages = [...service.images];
        newImages[index] = { ...newImages[index], file };
        return { ...service, images: newImages };
      }
      return service;
    }));
  };

  const handleRemoveImage = (serviceId: number, index: number) => {
    setServices(services.map(service => {
      if (service.id === serviceId) {
        const newImages = service.images.filter((_, i) => i !== index);
        return { ...service, images: newImages };
      }
      return service;
    }));
  };

  const handleAddService = async () => {
    const newService = {
      title: "Novo Serviço",
      description: "Descrição do serviço",
      detailedInfo: "Informações detalhadas do serviço",
      images: []
    };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .insert([{
          title: newService.title,
          description: newService.description,
          detailed_info: newService.detailedInfo,
          images: []
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Add the new service to the state with the ID from the database
        const createdService = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          detailedInfo: data[0].detailed_info || "",
          images: [],
          isEditing: true
        };
        
        setServices([...services, createdService]);
        toast.success("Serviço adicionado com sucesso!");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Erro ao adicionar serviço.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServices(services.filter(service => service.id !== id));
      toast.success("Serviço removido com sucesso!");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Erro ao remover serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Gerenciar Serviços</h2>
        <Button
          onClick={handleAddService}
          className="bg-navy hover:bg-opacity-90"
          disabled={loading}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Serviço
        </Button>
      </div>

      {loading && services.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.id} className="p-4">
              <CardContent>
                {service.isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={service.title}
                      onChange={(e) => setServices(services.map(s =>
                        s.id === service.id ? { ...s, title: e.target.value } : s
                      ))}
                    />
                    <Input
                      value={service.description}
                      onChange={(e) => setServices(services.map(s =>
                        s.id === service.id ? { ...s, description: e.target.value } : s
                      ))}
                    />
                    <Textarea
                      value={service.detailedInfo}
                      onChange={(e) => setServices(services.map(s =>
                        s.id === service.id ? { ...s, detailedInfo: e.target.value } : s
                      ))}
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Imagens</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddImage(service.id)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Imagem
                        </Button>
                      </div>
                      <div className="flex flex-col space-y-4">
                        {service.images.map((image, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2 items-start">
                              <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="URL da imagem"
                                    value={image.url}
                                    onChange={(e) => handleImageChange(service.id, index, "url", e.target.value)}
                                    disabled={!!image.file}
                                  />
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      
                                      if (!file.type.startsWith('image/')) {
                                        toast.error("Por favor, selecione apenas arquivos de imagem");
                                        return;
                                      }
                                      
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        handleImageChange(service.id, index, "url", reader.result as string);
                                        handleFileChange(service.id, index, file);
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                    id={`file-upload-${service.id}-${index}`}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById(`file-upload-${service.id}-${index}`)?.click()}
                                    disabled={!!image.url && !image.file}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload
                                  </Button>
                                </div>
                                <Input
                                  placeholder="Descrição da imagem"
                                  value={image.alt}
                                  onChange={(e) => handleImageChange(service.id, index, "alt", e.target.value)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveImage(service.id, index)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            {image.url && (
                              <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.alt}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-navy">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(service.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {service.images.map((image, index) => (
                        <div key={index} className="relative aspect-video">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {service.isEditing && (
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={() => handleSave(service.id)}
                      className="bg-gold hover:bg-opacity-90 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </div>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" /> Salvar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
