import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Check, X, Search, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reservation } from "./types";

interface ReservationsTabProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

const ReservationsTab = ({ reservations, setReservations }: ReservationsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "cancel" | null>(null);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "pending" && reservation.status === "pending") ||
      (statusFilter === "confirmed" && reservation.status === "confirmed") ||
      (statusFilter === "cancelled" && reservation.status === "cancelled");
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsOpen(true);
  };

  const handleAction = (reservation: Reservation, action: "accept" | "cancel") => {
    setSelectedReservation(reservation);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedReservation || !actionType) return;

    const updatedReservations = reservations.map(res => {
      if (res.id === selectedReservation.id) {
        return {
          ...res,
          status: actionType === "accept" ? "confirmed" as const : "cancelled" as const,
          updatedAt: new Date()
        };
      }
      return res;
    });

    setReservations(updatedReservations);
    setIsConfirmDialogOpen(false);
    
    toast.success(
      actionType === "accept" 
        ? "Reserva confirmada com sucesso!" 
        : "Reserva cancelada com sucesso!"
    );
  };

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status as "pending" | "confirmed" | "cancelled" | "default"} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Reservas</CardTitle>
        <CardDescription>
          Visualize, confirme ou cancele as reservas do hotel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por nome, email ou telefone"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <div 
                  key={reservation.id} 
                  className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{reservation.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>
                        {format(new Date(reservation.checkIn), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(reservation.checkOut), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-3 w-3" />
                      <span>{reservation.adults} adultos, {reservation.children} crianças</span>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(reservation.status)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(reservation)}
                    >
                      Detalhes
                    </Button>
                    {reservation.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleAction(reservation, "accept")}
                        >
                          <Check className="mr-1 h-4 w-4" /> Confirmar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleAction(reservation, "cancel")}
                        >
                          <X className="mr-1 h-4 w-4" /> Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma reserva encontrada.
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              Nenhuma reserva para hoje.
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              Nenhuma reserva futura encontrada.
            </div>
          </TabsContent>
        </Tabs>

        {selectedReservation && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Detalhes da Reserva</DialogTitle>
                <DialogDescription>
                  Informações completas sobre a reserva.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Nome</h4>
                    <p>{selectedReservation.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p>{getStatusBadge(selectedReservation.status)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p>{selectedReservation.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                    <p>{selectedReservation.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check-in</h4>
                    <p>{format(new Date(selectedReservation.checkIn), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check-out</h4>
                    <p>{format(new Date(selectedReservation.checkOut), "dd/MM/yyyy", { locale: ptBR })}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tipo de Quarto</h4>
                    <p>{selectedReservation.roomType === "presidential" ? "Presidencial" : "Executivo"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Hóspedes</h4>
                    <p>{selectedReservation.adults} adultos, {selectedReservation.children} crianças</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Mensagem</h4>
                    <p className="text-sm">{selectedReservation.message || "Nenhuma mensagem"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Noites</h4>
                    <p>{selectedReservation.nights}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Valor Total</h4>
                    <p>{selectedReservation.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'MZN' })}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {selectedReservation && (
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {actionType === "accept" ? "Confirmar Reserva" : "Cancelar Reserva"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "accept" 
                    ? "Tem certeza que deseja confirmar esta reserva?" 
                    : "Tem certeza que deseja cancelar esta reserva?"}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfirmDialogOpen(false)}
                >
                  Voltar
                </Button>
                <Button 
                  variant={actionType === "accept" ? "default" : "destructive"}
                  onClick={confirmAction}
                >
                  {actionType === "accept" ? "Confirmar" : "Cancelar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationsTab;
