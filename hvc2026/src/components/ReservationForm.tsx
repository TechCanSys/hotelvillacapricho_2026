import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { emailService } from "@/lib/emailService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  roomType: z.string({ required_error: "Tipo de quarto é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(9, { message: "Telefone inválido" }),
  checkIn: z.date({ required_error: "Data de check-in é obrigatória" }),
  checkOut: z.date({ required_error: "Data de check-out é obrigatória" }),
  adults: z.coerce.number().min(1, { message: "Mínimo de 1 adulto" }).max(6, { message: "Máximo de 6 adultos" }),
  children: z.coerce.number().min(0, { message: "Valor inválido" }).max(4, { message: "Máximo de 4 crianças" }),
  message: z.string().optional(),
}).refine(data => data.checkOut > data.checkIn, {
  message: "Data de check-out deve ser posterior à data de check-in",
  path: ["checkOut"],
});

type FormValues = z.infer<typeof formSchema>;

interface ReservationFormProps {
  onClose: () => void;
}

const ReservationForm = ({ onClose }: ReservationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nightsCount, setNightsCount] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roomType: "",
      adults: 1,
      children: 0,
      message: "",
    },
  });
  
  // Calcular número de noites e preço total quando as datas mudarem
  useEffect(() => {
    const checkIn = form.watch("checkIn");
    const checkOut = form.watch("checkOut");
    const roomType = form.watch("roomType");
    
    if (checkIn && checkOut && checkOut > checkIn) {
      const nights = differenceInDays(checkOut, checkIn);
      setNightsCount(nights);
      
      // Preço base por tipo de quarto
      let basePrice = 0;
      if (roomType === "suite") {
        basePrice = 5000; // 5000 MZN para Suite Executiva
      } else if (roomType === "presidential") {
        basePrice = 8000; // 8000 MZN para Suite Presidencial
      }
      
      if (basePrice > 0) {
        setTotalPrice(basePrice * nights);
      }
    } else {
      setNightsCount(null);
      setTotalPrice(null);
    }
  }, [form.watch("checkIn"), form.watch("checkOut"), form.watch("roomType")]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Enviar dados para o serviço de email
      const success = await emailService.sendReservationRequest({
        name: data.name,
        email: data.email,
        phone: data.phone,
        roomType: data.roomType,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        adults: data.adults,
        children: data.children,
        nights: nightsCount || 0,
        totalPrice: totalPrice || 0,
        message: data.message
      });
      
      if (success) {
        toast({
          title: "Solicitação enviada com sucesso!",
          description: "Entraremos em contato em breve para confirmar sua reserva.",
        });
        
        onClose();
      } else {
        throw new Error("Falha ao enviar email");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar solicitação",
        description: "Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto mr-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-navy">Solicitar Reserva</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Quarto</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Selecione um tipo de quarto</option>
                        <option value="suite">Suite Executiva</option>
                        <option value="presidential">Suite Presidencial</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="+258 84 000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const checkIn = form.getValues("checkIn");
                              return (
                                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                (checkIn && date <= checkIn)
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {nightsCount !== null && (
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                  <p className="text-gray-700 font-medium">Número de Noites: <span className="text-navy">{nightsCount}</span></p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="adults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adultos</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crianças</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informe requisitos especiais ou dúvidas..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gold hover:bg-opacity-90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
                
                {totalPrice !== null && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-400 text-sm">Valor Total Estimado: <span className="font-medium">{totalPrice.toLocaleString('pt-BR')} MZN</span></p>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;