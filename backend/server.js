import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

import invoiceRoutes from './routes/invoiceRoute';
import invoiceLineRoutes from './routes/invoiceLineRoute';
import itemRoutes from './routes/itemRoute';
import clientRoutes from './routes/clientRoute';
import vendorRoutes from './routes/vendorRoute';

const app = express();
const port = process.env.PORT || 4000;  


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API is working!');
});

app.use('/routes/invoices', invoiceRoutes);
app.use('/routes/invoicelines', invoiceLineRoutes);
app.use('/routes/items', itemRoutes);
app.use('/routes/clients', clientRoutes);
app.use('/routes/vendors', vendorRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
