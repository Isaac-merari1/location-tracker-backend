const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use('/api/locations', locationRoutes);

sequelize.sync() // Use { force: true } to drop and recreate tables
    .then(() => {
      console.log('Database synced successfully');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
