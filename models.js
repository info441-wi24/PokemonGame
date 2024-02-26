import mongoose from 'mongoose';

const uri = 'mongodb+srv://briancard3070:KeGvOgE9v4A6DX3K@cluster0.tfea2ob.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const gameResultSchema = new mongoose.Schema({
  gameId: String,
  playerId: String,
  outcome: String,
  p1Move: String,
  p2Move: String,
  p1HpRemaining: Number,
  p2HpRemaining: Number,
  timestamp: { type: Date, default: Date.now }
});

const pokemonSchema = new mongoose.Schema({
  name: String,
  found: { type: Boolean, default: false }
});

const userPokedexSchema = new mongoose.Schema({
  playerId: String,
  pokemons: [pokemonSchema],
  online: { type: Boolean, default: false }
});


const GameResult = mongoose.model('GameResult', gameResultSchema);
const UserPokedex = mongoose.model('UserPokedex', userPokedexSchema);

const models = { GameResult, UserPokedex };

export default models;