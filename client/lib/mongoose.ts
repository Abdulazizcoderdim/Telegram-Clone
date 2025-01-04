import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    return console.error('MONGO_URI is not defined');
  }

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { autoCreate: true });
    isConnected = true;
  } catch (error) {
    console.log("Couldn't connect to MongoDB", error);
  }
};
