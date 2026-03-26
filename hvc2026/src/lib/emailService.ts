// Este serviço simula o envio de email
// Em um ambiente de produção, você deve implementar uma solução real de envio de emails
// usando serviços como SendGrid, Mailgun, AWS SES, etc.

interface ReservationRequestData {
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  nights: number;
  totalPrice: number;
  message?: string;
}

export const emailService = {
  /**
   * Envia um email com os dados da reserva
   * @param data Dados do formulário de reserva
   * @returns Promise que resolve quando o email é enviado
   */
  sendReservationRequest: async (data: ReservationRequestData): Promise<boolean> => {
    // Simulando o envio de email
    console.log("Enviando email com os dados da reserva:", data);
    
    // Em um ambiente real, você usaria uma API ou serviço de email
    // Exemplo com EmailJS:
    // return emailjs.send(
    //   "service_id",
    //   "template_id",
    //   {
    //     to_email: "caxtonsanyanga2011@gmail.com",
    //     from_name: data.name,
    //     from_email: data.email,
    //     phone: data.phone,
    //     check_in: data.checkIn.toLocaleDateString(),
    //     check_out: data.checkOut.toLocaleDateString(),
    //     guests: data.guests,
    //     message: data.message || "Sem mensagem adicional",
    //   },
    //   "user_id"
    // );
    
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulando sucesso
    return true;
  }
};