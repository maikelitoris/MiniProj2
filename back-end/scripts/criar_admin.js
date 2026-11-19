// Cria (ou volta a criar) na base local o utilizador "admin" com a palavra-passe "admin".
// Na base de testes partilhada do livro, esse utilizador já não existe no formato do Animalec.
// Uso (com o MongoDB local ligado):  node scripts/criar_admin.js
const mongoose = require('mongoose');
const CONFIG = require('../config/config');
global.mongoConnection = mongoose.createConnection(CONFIG.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
const User = require('../models/user.model');
(async () => {
  await User.deleteMany({ 'auth.username': 'admin' });
  const u = await new User({ name: 'Admin', type: 'admin', auth: { username: 'admin', password: 'admin' } }).save();
  console.log('Utilizador admin criado:', u._id.toString());
  await global.mongoConnection.close();
})().catch(e => { console.error('Erro:', e.message); process.exit(1); });
