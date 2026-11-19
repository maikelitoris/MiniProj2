// Patrocinador (sponsor): empresa, associação ou particular que apoia um ou mais animais.
// Campos definidos na especificação da Tarefa 3.1 b) (docs/especificacao_entidades.md).
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const sponsorSchema = new Schema({
    name: { type: String, required: true, maxlength: 120 },
    type: { type: String, required: true, enum: ['empresa', 'associacao', 'particular'] },
    nif: { type: String, match: /^[0-9]{9}$/ },
    logo: String,                       // URL do logótipo (como os links dos animais)
    email: { type: String, required: true },
    website: String,
    phone: String,
    level: { type: String, required: true, enum: ['ouro', 'prata', 'bronze'] },
    animals: [{                          // relação N:N com os animais
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.animal
    }],
    startDate: { type: Date, required: true },
    endDate: Date,
    message: { type: String, maxlength: 300 },   // mensagem para o público
    active: { type: Boolean, default: true }     // só os ativos aparecem na página principal
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.sponsor, sponsorSchema);
