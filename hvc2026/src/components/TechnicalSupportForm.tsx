import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Headset } from "lucide-react";

interface TechnicalSupportFormProps {
  className?: string;
}

const TechnicalSupportForm = ({ className }: TechnicalSupportFormProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulando o envio de email
      console.log("Enviando email de suporte técnico:", {
        message,
        to: ["helpdesk@techcansystems.com", "diler.sopa@techcansystems.com"],
      });

      // Simulando um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setMessage("");

      // Fechar o diálogo após 2 segundos
      setTimeout(() => {
        setIsOpen(false);
        // Resetar o estado de sucesso após fechar o diálogo
        setTimeout(() => setIsSuccess(false), 300);
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar mensagem de suporte:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-gold hover:bg-gold/90 text-white ${className}`}
        >
          <Headset className="mr-2" />
          Suporte Técnico
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suporte Técnico</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Mensagem enviada!</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Sua mensagem foi enviada com sucesso. Nossa equipe de suporte entrará em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Descreva aqui o problema
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva detalhadamente o problema que está enfrentando..."
                className="min-h-[120px]"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalSupportForm;