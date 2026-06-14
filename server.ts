import express from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { SEED_PROPERTIES, SEED_TESTIMONIALS, SEED_CATEGORIES } from './src/seedData';
import { Property, Inquiry, Testimonial, Category } from './src/types';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'swastik-group-secret-key-lucknow-2026';

// Support larger payload sizes for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database directory setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Create folders if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Lowdb-style memory-to-file store
interface Database {
  properties: Property[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  categories: Category[];
  admin: {
    email: string;
    passwordHash: string;
  };
}

let db: Database = {
  properties: [],
  inquiries: [],
  testimonials: [],
  categories: [],
  admin: {
    email: 'groupswastik8@gmail.com',
    passwordHash: '' // Seeded on startup
  }
};

// Load database
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
    } else {
      // Seed Database
      db.properties = SEED_PROPERTIES;
      db.testimonials = SEED_TESTIMONIALS;
      db.categories = SEED_CATEGORIES;
      
      // Default admin password: 'swastik_lucknow_admin' or simple 'swastik123'
      const salt = bcryptjs.genSaltSync(10);
      db.admin.passwordHash = bcryptjs.hashSync('swastik123', salt);
      
      saveDatabase();
      console.log('Database seeded with initial Lucknow properties and Admin user (groupswastik8@gmail.com / swastik123)');
    }
  } catch (error) {
    console.error('Failed to load database. Initializing default.', error);
  }
}

// Save database
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

loadDatabase();

// Middleware to authenticate JWT and restrict paths to Admin
const authenticateAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    if (decoded.role !== 'admin' || decoded.email !== 'groupswastik8@gmail.com') {
      return res.status(403).json({ error: 'Access forbidden. Insufficient permissions.' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// ==================== REST API ENDPOINTS ====================

// --- Authentication ---
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email !== db.admin.email) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = bcryptjs.compareSync(password, db.admin.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { email: db.admin.email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { email: db.admin.email, role: 'admin' }
  });
});

// Verify token validity
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    if (decoded.email === db.admin.email) {
      return res.json({ valid: true, user: { email: decoded.email, role: decoded.role } });
    }
    res.status(401).json({ valid: false });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

// --- Properties ---

// Get all properties with filtering, searching, sorting
app.get('/api/properties', (req, res) => {
  let filtered = [...db.properties];
  const { saleOrRent, type, minPrice, maxPrice, minArea, maxArea, bedrooms, locality, search, featuredOnly } = req.query;

  if (saleOrRent) {
    filtered = filtered.filter(p => p.saleOrRent.toLowerCase() === (saleOrRent as string).toLowerCase());
  }

  if (type) {
    filtered = filtered.filter(p => p.type.toLowerCase() === (type as string).toLowerCase());
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  if (minArea) {
    filtered = filtered.filter(p => p.area >= Number(minArea));
  }

  if (maxArea) {
    filtered = filtered.filter(p => p.area <= Number(maxArea));
  }

  if (bedrooms) {
    filtered = filtered.filter(p => p.bedrooms === Number(bedrooms));
  }

  if (locality) {
    filtered = filtered.filter(p => p.locality.toLowerCase().includes((locality as string).toLowerCase()));
  }

  if (featuredOnly === 'true') {
    filtered = filtered.filter(p => p.featured);
  }

  if (search) {
    const query = (search as string).toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.locality.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    );
  }

  // Sort by date added, descending
  filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  res.json(filtered);
});

// Get single property
app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  const property = db.properties.find(p => p.id === id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json(property);
});

// Create Property (Admin Only)
app.post('/api/properties', authenticateAdmin, (req, res) => {
  const propertyData = req.body;
  
  if (!propertyData.title || !propertyData.type || !propertyData.saleOrRent || !propertyData.price || !propertyData.address || !propertyData.locality) {
    return res.status(400).json({ error: 'Missing required property fields' });
  }

  const newProperty: Property = {
    id: `prop-${Date.now()}`,
    title: propertyData.title,
    type: propertyData.type,
    saleOrRent: propertyData.saleOrRent,
    price: Number(propertyData.price),
    area: Number(propertyData.area || 0),
    bedrooms: propertyData.bedrooms ? Number(propertyData.bedrooms) : undefined,
    bathrooms: propertyData.bathrooms ? Number(propertyData.bathrooms) : undefined,
    parking: !!propertyData.parking,
    address: propertyData.address,
    locality: propertyData.locality,
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    description: propertyData.description || '',
    amenities: Array.isArray(propertyData.amenities) ? propertyData.amenities : [],
    googleMapUrl: propertyData.googleMapUrl || '',
    status: propertyData.status || 'Available',
    featuredImage: propertyData.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    images: Array.isArray(propertyData.images) && propertyData.images.length > 0 ? propertyData.images : [propertyData.featuredImage],
    featured: !!propertyData.featured,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  db.properties.unshift(newProperty);
  saveDatabase();
  res.status(201).json(newProperty);
});

// Update Property (Admin Only)
app.put('/api/properties/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.properties.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  const current = db.properties[index];
  const updatedData = req.body;

  db.properties[index] = {
    ...current,
    ...updatedData,
    price: updatedData.price !== undefined ? Number(updatedData.price) : current.price,
    area: updatedData.area !== undefined ? Number(updatedData.area) : current.area,
    bedrooms: updatedData.bedrooms !== undefined ? (updatedData.bedrooms ? Number(updatedData.bedrooms) : undefined) : current.bedrooms,
    bathrooms: updatedData.bathrooms !== undefined ? (updatedData.bathrooms ? Number(updatedData.bathrooms) : undefined) : current.bathrooms,
    parking: updatedData.parking !== undefined ? !!updatedData.parking : current.parking,
    featured: updatedData.featured !== undefined ? !!updatedData.featured : current.featured,
  };

  saveDatabase();
  res.json(db.properties[index]);
});

// Delete Property (Admin Only)
app.delete('/api/properties/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.properties.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Property not found' });
  }

  db.properties.splice(index, 1);
  saveDatabase();
  res.json({ message: 'Property deleted successfully' });
});

// --- Inquiries ---

// Get all Inquiries (Admin Only)
app.get('/api/inquiries', authenticateAdmin, (req, res) => {
  res.json(db.inquiries);
});

// Update Inquiry Status (Admin Only)
app.put('/api/inquiries/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inquiry = db.inquiries.find(i => i.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  inquiry.status = status || inquiry.status;
  saveDatabase();
  res.json(inquiry);
});

// Delete Inquiry (Admin Only)
app.delete('/api/inquiries/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const index = db.inquiries.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  db.inquiries.splice(index, 1);
  saveDatabase();
  res.json({ message: 'Inquiry deleted successfully' });
});

// Submit Inquiry (Public)
app.post('/api/inquiries', async (req, res) => {
  const { customerName, phone, email, message, propertyId, propertyName } = req.body;

  if (!customerName || !phone || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all inquiry fields' });
  }

  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    customerName,
    phone,
    email,
    message,
    propertyId,
    propertyName,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase();

  // Lazy initialize email transfer to support without credentials
  const emailUser = process.env.SMTP_USER;
  const emailPass = process.env.SMTP_PASS;
  
  // Format HTML/Plain text message for notification
  const emailBody = `
    <h3>New Inquiry Received - Swastik Group Lucknow</h3>
    <p>A customer has submitted a new inquiry. Details below:</p>
    <table border="1" cellpadding="8" style="border-collapse: collapse;">
      <tr><td><strong>Customer Name:</strong></td><td>${customerName}</td></tr>
      <tr><td><strong>Mobile Number:</strong></td><td>${phone}</td></tr>
      <tr><td><strong>Email ID:</strong></td><td>${email}</td></tr>
      <tr><td><strong>Property:</strong></td><td>${propertyName || 'General Inquiry (Contact Page)'}</td></tr>
      <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
      <tr><td><strong>Inquiry Date:</strong></td><td>${newInquiry.date}</td></tr>
    </table>
  `;

  console.log('======== NEW INQUIRY SAVED TO DB ========');
  console.log(`Customer: ${customerName}`);
  console.log(`Phone: ${phone}`);
  console.log(`Email: ${email}`);
  console.log(`Property Context: ${propertyName || 'General Website Inquiry'}`);
  console.log(`Message: ${message}`);
  console.log('=========================================');

  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });

      await transporter.sendMail({
        from: `"Swastik Group Alerts" <${emailUser}>`,
        to: 'groupswastik8@gmail.com',
        subject: `[Inquiry Alert] ${customerName} - Swastik Group Lucknow`,
        html: emailBody
      });
      console.log('Notification email successfully dispatched to groupswastik8@gmail.com');
    } catch (err) {
      console.error('Nodemailer configuration error. Notification logged to console instead.', err);
    }
  } else {
    console.log('Notice: SMTP credentials (SMTP_USER/SMTP_PASS) not defined in process.env. Email notification logged to terminal logs.');
  }

  res.status(201).json({
    message: 'We appreciate your interest! Swastik Group team will contact you shortly.',
    inquiry: newInquiry
  });
});

// --- Testimonials ---
app.get('/api/testimonials', (req, res) => {
  res.json(db.testimonials);
});

// --- Categories ---
app.get('/api/categories', (req, res) => {
  // Compute real counts based on database properties
  const categoriesWithCounts = db.categories.map(cat => ({
    ...cat,
    count: db.properties.filter(p => p.type.toLowerCase() === cat.name.toLowerCase() || 
      (cat.name === 'Residential' && ['Villa', 'Apartment', 'Independent House'].includes(p.type)) ||
      (cat.name === 'Commercial' && ['Office Space', 'Shop'].includes(p.type))
    ).length
  }));
  res.json(categoriesWithCounts);
});

// --- File/Image Upload (Admin Only) ---
// Since we don't assume real custom Cloudinary keys at start, and wish to keep upload 100% operational,
// we save base64 content to /public/uploads/ which yields local static URLs
app.post('/api/uploads', authenticateAdmin, (req, res) => {
  const { base64Data, fileName } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 format' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');
    const safeName = `upload-${Date.now()}-${fileName || 'property.jpg'}`;
    const destination = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(destination, imageBuffer);
    
    // Serve uploaded photo link
    const fileUrl = `/uploads/${safeName}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('File write err:', error);
    res.status(500).json({ error: 'Failed to write upload to server disk.' });
  }
});

// --- Dashboard Analytics ---
app.get('/api/analytics', authenticateAdmin, (req, res) => {
  const total = db.properties.length;
  const buy = db.properties.filter(p => p.saleOrRent === 'Buy').length;
  const rent = db.properties.filter(p => p.saleOrRent === 'Rent').length;
  const totalInquiries = db.inquiries.length;
  const featured = db.properties.filter(p => p.featured).length;

  // Monthly breakdown of inquiries
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyInquiries: Record<string, number> = {};
  
  // Fill present year
  months.forEach(m => { monthlyInquiries[m] = 0; });
  
  // Basic date parsing logic for monthly stats
  db.inquiries.forEach(inq => {
    const dateStr = inq.date;
    if (dateStr) {
      const monthPart = new Date(dateStr).getMonth();
      if (monthPart >= 0 && monthPart < 12) {
        monthlyInquiries[months[monthPart]] += 1;
      }
    }
  });

  const inquiriesChartData = months.map(m => ({
    name: m,
    inquiries: monthlyInquiries[m]
  }));

  // Property types breakdown stats
  const typeStats = db.properties.reduce((acc: Record<string, number>, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.keys(typeStats).map(key => ({
    name: key,
    value: typeStats[key]
  }));

  res.json({
    total,
    buy,
    rent,
    totalInquiries,
    featured,
    inquiriesChartData,
    typeChartData
  });
});


// Serve uploaded images safely
app.use('/uploads', express.static(UPLOADS_DIR));

// Vite development / production handler integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Swastik Group full-stack engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
