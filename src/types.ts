export interface Room {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  size: string;
  capacity: string;
  image: string;
  features: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  features: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
