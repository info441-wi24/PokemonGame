import mongoose from 'mongoose';

const uri = 'mongodb+srv://new_user_1:TBKgSxgty5cFKrAI@cluster0.dwrmvy4.mongodb.net/';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const newUserSchema = new mongoose.Schema({
  username: String,
  created_date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', newUserSchema);

const models = { User };

export default models;