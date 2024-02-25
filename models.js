import mongoose from 'mongoose';

const uri = "mongodb+srv://briancard3070:KeGvOgE9v4A6DX3K@cluster0.tfea2ob.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const newUserSchema = new mongoose.Schema({
  username: String,
  created_date: { type: Date, default: Date.now }
});

const battleSchema = new mongoose.Schema({
  userId: String,
  pokemonChosen: String,
  opponentPokemon: String,
  movesUsed: String,
  outcome: String,
  battleDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', newUserSchema);
const Battle = mongoose.model('Battle', battleSchema);

const models = { User, Battle };

console.log("mongoose models created")

export default models
