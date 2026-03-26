
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, PlusCircle, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Price } from "./types";

// Função para formatar valores monetários em MZN
const formatCurrency = (value: string): string => {
  if (!value) return "";
  
  // Remove qualquer caractere não numérico, exceto vírgula e ponto
  let numericValue = value.replace(/[^0-9,.]/g, "");
  
  // Substitui vírgula por ponto para processamento
  numericValue = numericValue.replace(/,/g, ".");
  
  // Converte para número e formata com 2 casas decimais
  const number = parseFloat(numericValue);
  
  if (isNaN(number)) return "";
  
  // Formata o número com 2 casas decimais e substitui ponto por vírgula
  const formattedValue = number.toFixed(2).replace(".", ",");
  
  // Adiciona separador de milhares
  const parts = formattedValue.split(",");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  // Retorna o valor formatado com o símbolo da moeda
  return `${parts.join(",")}MZN`;
};

interface PricesTabProps {
  prices: Price[];
  setPrices: React.Dispatch<React.SetStateAction<Price[]>>;
}

const PricesTab = ({ prices, setPrices }: PricesTabProps) => {
  const [newRoomType, setNewRoomType] = useState("");
  const [newPrice, setNewPrice] = useState("");
  
  const handleAddRoom = async () => {
    if (!newRoomType.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um tipo de quarto válido.",
        variant: "destructive"
      });
      return;
    }

    if (prices.some(price => price.roomType.toLowerCase() === newRoomType.toLowerCase())) {
      toast({
        title: "Erro",
        description: "Este tipo de quarto já existe.",
        variant: "destructive"
      });
      return;
    }

    try {
      const numericPrice = parseFloat(newPrice.replace(/[^0-9,.]/g, '').replace(',', '.'));
      
      const { data, error } = await supabase
        .from('prices')
        .insert([{
          room_type: newRoomType,
          price: numericPrice,
          is_promotion: false,
          promotion_price: null,
          active: true
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newPriceEntry = {
          id: data[0].id,
          roomType: data[0].room_type,
          price: formatCurrency(newPrice),
          isPromotion: data[0].is_promotion,
          promotionPrice: "",
          isEditing: false,
          active: data[0].active
        };

        setPrices([...prices, newPriceEntry]);
        setNewRoomType("");
        setNewPrice("");
        
        toast({
          title: "Sucesso",
          description: "Tipo de quarto adicionado com sucesso!",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar preço:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar no banco de dados",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePrice = async (id: number) => {
    try {
      const priceToUpdate = prices.find(p => p.id === id);
      if (!priceToUpdate) return;

      const numericPrice = parseFloat(priceToUpdate.price.replace(/[^0-9,.]/g, '').replace(',', '.'));

      const { error } = await supabase
        .from('prices')
        .update({
          price: numericPrice,
          room_type: priceToUpdate.roomType,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setPrices(
        prices.map(price => 
          price.id === id 
          ? { ...price, isEditing: !price.isEditing } 
          : price
        )
      );

      toast({
        title: "Sucesso",
        description: "Informações atualizadas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar no banco de dados",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      const { error } = await supabase
        .from('prices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrices(prices.filter(price => price.id !== id));
      toast({
        title: "Sucesso",
        description: "Tipo de quarto removido com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao deletar preço:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover do banco de dados",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = (id: number) => {
    setPrices(
      prices.map(price => 
        price.id === id 
        ? { ...price, active: !price.active } 
        : price
      )
    );
    
    const newStatus = !prices.find(p => p.id === id)?.active;
    toast({
      title: "Sucesso",
      description: `Tipo de quarto ${newStatus ? "ativado" : "desativado"} com sucesso!`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços dos Quartos</CardTitle>
        <CardDescription>
          Adicione, atualize ou remova tipos de quartos e seus preços.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 border rounded-md bg-slate-50">
          <h3 className="text-lg font-medium mb-4">Adicionar Novo Tipo de Quarto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Quarto</label>
              <Input 
                placeholder="Ex: Suíte Master" 
                value={newRoomType}
                onChange={(e) => setNewRoomType(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preço Regular</label>
              <Input 
                placeholder="Ex: 8.500,00MT" 
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddRoom} className="w-full bg-navy">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Quarto
              </Button>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Tipos de Quartos Existentes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Quarto</TableHead>
              <TableHead>Preço Regular</TableHead>
              <TableHead>Promoção Ativa</TableHead>
              <TableHead>Preço Promocional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhum tipo de quarto cadastrado. Adicione um novo acima.
                </TableCell>
              </TableRow>
            ) : (
              prices.map((price) => (
                <TableRow key={price.id} className={!price.active ? "opacity-60" : ""}>
                  <TableCell className="font-medium">
                    {price.isEditing ? (
                      <Input 
                        value={price.roomType} 
                        onChange={(e) => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, roomType: e.target.value} : p
                          ))
                        }
                      />
                    ) : (
                      price.roomType
                    )}
                  </TableCell>
                  <TableCell>
                    {price.isEditing ? (
                      <Input 
                        value={price.price} 
                        onChange={(e) => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, price: e.target.value} : p
                          ))
                        }
                        onBlur={(e) => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, price: formatCurrency(e.target.value)} : p
                          ))
                        }
                        className="w-full"
                      />
                    ) : (
                      price.price || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={price.isPromotion} 
                        onChange={() => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, isPromotion: !p.isPromotion} : p
                          ))
                        }
                        disabled={!price.isEditing}
                        className="mr-2"
                      />
                      <span>{price.isPromotion ? "Sim" : "Não"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {price.isEditing ? (
                      <Input 
                        value={price.promotionPrice} 
                        onChange={(e) => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, promotionPrice: e.target.value} : p
                          ))
                        }
                        onBlur={(e) => 
                          setPrices(prices.map(p => 
                            p.id === price.id ? {...p, promotionPrice: formatCurrency(e.target.value)} : p
                          ))
                        }
                        disabled={!price.isPromotion}
                        className="w-full"
                      />
                    ) : (
                      price.promotionPrice || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant={price.active ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => handleToggleActive(price.id)}
                      className={`${price.active ? "text-green-600" : "text-gray-500"}`}
                    >
                      {price.active ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1" />
                          Inativo
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdatePrice(price.id)}
                      >
                        {price.isEditing ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Salvar
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteRoom(price.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PricesTab;
