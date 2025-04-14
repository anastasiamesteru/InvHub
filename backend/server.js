import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

import invoiceRoutes from './routes/invoiceRoute.js';
import itemRoutes from './routes/itemRoute.js';
import clientRoutes from './routes/clientRoute.js';
import vendorRoutes from './routes/vendorRoute.js';
import reportRoute from './routes/reportRoute,js';
import authRoute from './routes/authRoute.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.send('API is working!');
});

// API Routes
app.use('/routes/invoices', invoiceRoutes);
app.use('/routes/items', itemRoutes);
app.use('/routes/clients', clientRoutes);
app.use('/routes/vendors', vendorRoutes);
app.use('/routes/reports', reportRoute);
app.use('/auth', authRoute);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
