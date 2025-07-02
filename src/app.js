require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dealerRoutes = require('./routes/dealerRoutes');
const vehiclesRoutes = require('./routes/vehicleRoutes')
const accesoryRoutes = require('./routes/accessoryRoutes')
const postRoutes = require('./routes/postRoutes')
const leadRoutes = require('./routes/leadRoutes')
const authRoutes = require('./routes/authRoutes')

app.use('/dealers', dealerRoutes);
app.use('/vehicles',vehiclesRoutes);
app.use('/accesory',accesoryRoutes);
app.use('/post',postRoutes);
app.use('/leads',leadRoutes);
app.use('/auth', authRoutes);



app.get('/', (req, res) => {
  res.send('API SimpliTEC con Prisma funcionando');
});

module.exports = app;
