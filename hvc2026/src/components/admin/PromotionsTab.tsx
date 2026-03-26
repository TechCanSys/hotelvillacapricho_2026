
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PlusCircle, Trash } from "lucide-react";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useSupabaseContext } from "@/contexts/SupabaseContext";

interface Promotion {
  id: number;
  title: string;
  roomType: string;
  active: boolean;
}

interface PromotionsTabProps {
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
}

const PromotionsTab = ({ promotions, setPromotions }: PromotionsTabProps) => {
  const [newPromotionData, setNewPromotionData] = useState({
    title: "",
    roomType: "",
    active: true
  });
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabaseContext();

  const handleAddPromotion = async () => {
    if (!newPromotionData.title || !newPromotionData.roomType) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('promotions')
        .insert([{
          title: newPromotionData.title,
          room_type: newPromotionData.roomType,
          active: newPromotionData.active
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newPromotion = {
          id: data[0].id,
          title: data[0].title,
          roomType: data[0].room_type,
          active: data[0].active || true
        };
        
        setPromotions([...promotions, newPromotion]);
        setNewPromotionData({ title: "", roomType: "", active: true });
        toast.success("Promoção adicionada com sucesso!");
      }
    } catch (error) {
      console.error("Error adding promotion:", error);
      toast.error("Erro ao adicionar promoção.");
    } finally {
      setLoading(false);
    }
  };

  const togglePromotionStatus = async (id: number) => {
    try {
      setLoading(true);
      
      const promotion = promotions.find(p => p.id === id);
      if (!promotion) return;
      
      const { error } = await supabase
        .from('promotions')
        .update({
          active: !promotion.active,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*');
      
      if (error) throw error;
      
      // Atualizar estado local com dados do banco
      const updatedPromotion = error ? null : data?.[0];
      if (!updatedPromotion) throw new Error('Falha na atualização');
      
      // Update in local state
      setPromotions(
        promotions.map(promo => 
          promo.id === id 
          ? { ...promo, active: !promo.active } 
          : promo
        )
      );
      
      toast.success("Status da promoção atualizado!");
    } catch (error) {
      console.error("Error updating promotion status:", error);
      toast.error("Erro ao atualizar status da promoção.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromotion = async (id: number) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id)
        .select('*');
      
      if (error) throw error;
      
      // Verificar exclusão bem-sucedida
      if (!error && data?.[0]?.id !== id) throw new Error('Falha na exclusão');
      
      // Update local state
      setPromotions(promotions.filter(promo => promo.id !== id));
      toast.success("Promoção removida com sucesso!");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Erro ao remover promoção.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promoções</CardTitle>
        <CardDescription>
          Gerencie promoções especiais e ofertas para os quartos do hotel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título da Promoção</label>
              <Input 
                placeholder="15% de desconto para estadias longas" 
                value={newPromotionData.title}
                onChange={(e) => setNewPromotionData({...newPromotionData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Quarto</label>
              <Select 
                onValueChange={(value) => setNewPromotionData({...newPromotionData, roomType: value})}
                value={newPromotionData.roomType}
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
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="active-status"
              checked={newPromotionData.active} 
              onChange={(e) => setNewPromotionData({...newPromotionData, active: e.target.checked})}
            />
            <label htmlFor="active-status" className="text-sm font-medium">
              Ativar promoção imediatamente
            </label>
          </div>
          
          <Button onClick={handleAddPromotion} className="w-full bg-navy" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Promoção
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Promoções Atuais</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Quarto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.title}</TableCell>
                  <TableCell>{promo.roomType}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promo.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {promo.active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => togglePromotionStatus(promo.id)}
                        disabled={loading}
                      >
                        {promo.active ? "Desativar" : "Ativar"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRemovePromotion(promo.id)}
                        disabled={loading}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsTab;
