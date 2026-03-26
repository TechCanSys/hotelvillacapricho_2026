
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Image, PlusCircle, X, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoomImage {
  id: number;
  room: string;
  url: string;
  alt: string;
}

interface ImagesTabProps {
  roomImages: RoomImage[];
  setRoomImages: React.Dispatch<React.SetStateAction<RoomImage[]>>;
}

const ImagesTab = ({ roomImages, setRoomImages }: ImagesTabProps) => {
  const [newImageData, setNewImageData] = useState({
    room: "",
    url: "",
    alt: ""
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = () => {
    if (!newImageData.room || (!newImageData.url && !previewUrl) || !newImageData.alt) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    const imageUrl = previewUrl || newImageData.url;

    const newImage = {
      id: roomImages.length + 1,
      room: newImageData.room,
      url: imageUrl,
      alt: newImageData.alt
    };

    setRoomImages([...roomImages, newImage]);
    setNewImageData({ room: "", url: "", alt: "" });
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Imagem adicionada com sucesso!");
  };

  const handleRemoveImage = (id: number) => {
    setRoomImages(roomImages.filter(image => image.id !== id));
    toast.success("Imagem removida com sucesso!");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }
    
    // Verificar se o arquivo é uma imagem
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    setSelectedFile(file);
    
    // Criar URL para preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens dos Quartos</CardTitle>
        <CardDescription>
          Adicione, edite ou remova imagens dos quartos do hotel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Quarto</label>
            <Select 
              onValueChange={(value) => setNewImageData({...newImageData, room: value})}
              value={newImageData.room}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de quarto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Presidencial">Presidencial</SelectItem>
                <SelectItem value="Executivo">Executivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descrição da Imagem</label>
            <Input 
              placeholder="Quarto Presidencial - Visão Geral" 
              value={newImageData.alt}
              onChange={(e) => setNewImageData({...newImageData, alt: e.target.value})}
            />
          </div>
          
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">URL da Imagem</TabsTrigger>
              <TabsTrigger value="upload">Upload de Imagem</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                <Input 
                  placeholder="https://exemplo.com/imagem.jpg" 
                  value={newImageData.url}
                  onChange={(e) => setNewImageData({...newImageData, url: e.target.value})}
                  disabled={!!previewUrl}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-40 object-contain mb-2" 
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="absolute top-0 right-0 bg-white" 
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Clique para selecionar uma imagem</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG ou JPEG (máx. 5MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!!newImageData.url}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Button onClick={handleAddImage} className="w-full bg-navy">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imagem
          </Button>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Imagens Atuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomImages.map((image) => (
              <div key={image.id} className="relative group bg-white border rounded-md overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <span className="text-xs font-medium bg-navy text-white px-2 py-1 rounded-full">
                    {image.room}
                  </span>
                  <p className="mt-2 text-sm truncate">{image.alt}</p>
                </div>
                <button 
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagesTab;
