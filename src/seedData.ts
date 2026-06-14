import { Property, Testimonial, Category } from './types';

export const SEED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Luxury 4 BHK Swastik Villa",
    type: "Villa",
    saleOrRent: "Buy",
    price: 24500000, // 2.45 Crores INR
    area: 3200,
    bedrooms: 4,
    bathrooms: 5,
    parking: true,
    address: "Block-C, Sushant Golf City",
    locality: "Sushant Golf City",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "Experience the epitome of luxury in this ultra-premium 4 BHK villa at Sushant Golf City, Lucknow. Surrounded by lush greenery and an international standard golf course, this property boasts world-class architecture, custom Italian marble flooring, false ceilings with LED installations, automated home systems, high-end modular kitchen with chimney, a personal landscaped garden, and a private terrace bar area.",
    amenities: ["Swimming Pool", "Gym", "Power Backup", "24x7 Security", "Private Garden", "Club House", "Modular Kitchen", "Golf Course Access"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14246.36894086438!2d80.992224!3d26.7891152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be26fa9ab03a7%3A0xe7448bf88277be9e!2sSushant%20Golf%20City%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    dateAdded: "2026-06-10"
  },
  {
    id: "prop-2",
    title: "Swastik Residency Highrise Apartment",
    type: "Apartment",
    saleOrRent: "Buy",
    price: 8500000, // 85 Lakhs INR
    area: 1650,
    bedrooms: 3,
    bathrooms: 3,
    parking: true,
    address: "Sector 4, Gomti Nagar Extension",
    locality: "Gomti Nagar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "An elegant, ready-to-move-in 3 BHK apartment in Gomti Nagar Extension, Lucknow. This apartment on the 11th floor offers stunning views of the Gomti riverfront and Lucknow skyline. Includes elegant woodwork, high quality sliding windows, dedicated covered basement parking, continuous 24/7 water supply, power backup, and modern clubhouse with swimming pool, gym, and kids play area.",
    amenities: ["Power Backup", "24x7 Security", "Swimming Pool", "Gym", "Elevator", "Intercom", "Kids Play Area", "Covered Parking"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.163353594!2d80.9996023!3d26.8545831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2e3c0000001%3A0x6b6c0e0bcfdf2dff!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
    ],
    featured: true,
    dateAdded: "2026-06-12"
  },
  {
    id: "prop-3",
    title: "Premium Residential Plot in Vrindavan Yojna",
    type: "Plot/Land",
    saleOrRent: "Buy",
    price: 5500000, // 55 Lakhs INR
    area: 1500,
    parking: false,
    address: "Sector 7C, Vrindavan Yojna, Amar Shaheed Path",
    locality: "Vrindavan Yojna",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "LDA-approved west-facing residential plot of 1500 Sq Ft in highly sought-after Vrindavan Yojna, Lucknow. Located just 500 meters from Amar Shaheed Path with wide 30ft metalled roads, underground drainage, park-facing view, and continuous electricity layout. Perfect option for building your dream home or as an high-appreciating investment.",
    amenities: ["Park Facing", "Corner property", "Gated Community", "Water Supply", "Street Lights"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14251.272528741368!2d80.9571343!3d26.764516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be1bb34415449%3A0xe21287e0766cd5d6!2sVrindavan%20Yojna%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000002!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    dateAdded: "2026-06-08"
  },
  {
    id: "prop-4",
    title: "Premium Commercial Shop in Hazratganj",
    type: "Shop",
    saleOrRent: "Buy",
    price: 18000000, // 1.80 Crores INR
    area: 520,
    parking: true,
    address: "Halwasiya House, Hazratganj",
    locality: "Hazratganj",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "Rare opportunity to own an exclusive high-visibility retail shop space of 520 Sq Ft in Hazratganj, the premium central market of Lucknow. Generating heavy daily footfalls, this shop is ideal for apparel brands, high-end boutiques, jewelry showrooms, or coffee cafes. Standard height with option for mezzanine construction.",
    amenities: ["Central Location", "Power Backup", "24x7 Security", "Visitor Parking", "Fire Safety System"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14239.51614798781!2d80.9388344!3d26.8465487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd0a8fffffff%3A0x868c2d2cf05d691e!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000003!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    dateAdded: "2026-06-05"
  },
  {
    id: "prop-5",
    title: "Double-Story Independent House in Aliganj",
    type: "Independent House",
    saleOrRent: "Buy",
    price: 13500000, // 1.35 Crores INR
    area: 2100,
    bedrooms: 4,
    bathrooms: 4,
    parking: true,
    address: "Sector B, Near Kapoorthala, Aliganj",
    locality: "Aliganj",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "Spacious 4 BHK double-story independent house in Aliganj, Lucknow. Constructed on a solid foundation with top-grade raw materials. Ground floor has 2 large bedrooms, massive living room, modular kitchen, and marble bathrooms. First floor contains 2 additional bedrooms, study room, and a massive balcony perfect for winter sunbathing. Close to schools, major shopping markets, and Metro station.",
    amenities: ["Independent Balcony", "Water Storage Tank", "Covered Car Parking", "Study Room", "Modular Kitchen"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.409895123004!2d80.938634!3d26.8833452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3999f82d1c1a2f6b%3A0x2daffd33a7ad1f1e!2sAliganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000004!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    dateAdded: "2026-06-02"
  },
  {
    id: "prop-6",
    title: "Premium Semi-Furnished 3 BHK Corporate Flat",
    type: "Apartment",
    saleOrRent: "Rent",
    price: 25000, // 25,000 INR per month
    area: 1550,
    bedrooms: 3,
    bathrooms: 3,
    parking: true,
    address: "Omaxe Residency, City Club Road",
    locality: "Amar Shaheed Path",
    city: "Lucknow",
    state: "Uttar Pradesh",
    description: "Premium semi-furnished 3 BHK flat available for rent/lease in Omaxe Residency, Lucknow. Elegant wooden cupboards, modular layout kitchen with chimney, AC provisions, complete safety grills in balconies, geysers in washrooms, and top floor advantage with beautiful breeziness. Perfect choice for corporate families or defense personnel.",
    amenities: ["Power Backup", "Gym", "Club House", "Covered Parking", "Piped Gas System", "Children Play Area"],
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14249.2312005432!2d80.975489!3d26.790902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be17af2b22bb3%3A0x6bba52601ab9d6bf!2sAmar%20Shaheed%20Path%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000005!5m2!1sen!2sin",
    status: "Available",
    featuredImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    dateAdded: "2026-06-11"
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Rishi Kant Dwivedi",
    role: "Retired Bank Manager",
    feedback: "Swastik Group helped us locate our dream home in Sushant Golf City. Their transparency, professional paperwork handling, and local expertise is truly commendable. Best property consultants in Lucknow!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "test-2",
    name: "Priyanka Chaudhary",
    role: "IT Professional",
    feedback: "It was extremely easy to coordinate and finalize my flat in Gomti Nagar. Since I reside outside Lucknow, Swastik Group handled all LDA validations, video tours, and agreement tasks flawlessly.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "test-3",
    name: "Alok Srivastava",
    role: "Business Owner",
    feedback: "Bought my second retail building project through Swastik Group in Hazratganj. Exceptional business sense, unmatched negotiation skills, and fully transparent pricing models.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-res", name: "Residential", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-comm", name: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-plot", name: "Plot/Land", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-villa", name: "Villa", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-apt", name: "Apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-house", name: "Independent House", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-office", name: "Office Space", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" },
  { id: "cat-shop", name: "Shop", image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80" }
];
