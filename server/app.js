require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api', require('./routes/index'));


app.use(errorMiddleware);

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 6000;
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log('Connected to MongoDB ✔✔✔');
      app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
