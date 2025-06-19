import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  date: { type: Date, required: true },
});

export const Product = mongoose.model('Product', productSchema);
