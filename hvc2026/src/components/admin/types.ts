
export interface RoomImage {
  id: number;
  room: string;
  url: string;
  alt: string;
}

export interface Price {
  id: number;
  roomType: string;
  price: string;
  isPromotion: boolean;
  promotionPrice: string;
  isEditing: boolean;
  active: boolean;
}

export interface Promotion {
  id: number;
  title: string;
  roomType: string;
  active: boolean;
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string | Date;
  checkOut: string | Date;
  adults: number;
  children: number;
  nights: number;
  totalPrice: number;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string | Date;
  updatedAt?: string | Date;
}
