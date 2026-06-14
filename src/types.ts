export interface Property {
  id: string;
  title: string;
  type: 'Residential' | 'Commercial' | 'Plot/Land' | 'Villa' | 'Apartment' | 'Independent House' | 'Office Space' | 'Shop';
  saleOrRent: 'Buy' | 'Rent';
  price: number;
  area: number; // in Sq Ft
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  address: string;
  locality: string;
  city: string; // Default 'Lucknow'
  state: string; // Default 'Uttar Pradesh'
  description: string;
  amenities: string[];
  googleMapUrl?: string;
  status: 'Available' | 'Sold' | 'Rented';
  images: string[];
  featuredImage: string;
  featured: boolean;
  dateAdded: string;
}

export interface Inquiry {
  id: string;
  propertyId?: string;
  propertyName?: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: 'Pending' | 'Contacted' | 'Closed';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating: number;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count?: number;
}
