const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/db');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);


// Sync the models with the database
sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate tables
    .then(() => {
      console.log('Database synced successfully');
      // Start the server after syncing the database
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
