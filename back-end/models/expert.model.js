// Especialista (expert): especialista científico de uma espécie ou família, que valida conteúdos e quizzes.
// Campos definidos na especificação da Tarefa 3.1 b) (docs/especificacao_entidades.md).
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CONFIG = require('../config/config');

const expertSchema = new Schema({
    name: { type: String, required: true, maxlength: 120 },
    title: { type: String, enum: ['', 'Dr.', 'Dra.', 'Prof.', 'Profa.'] },
    photo: String,                       // URL da fotografia
    specialty: { type: String, required: true },   // ex.: Felidae
    institution: { type: String, required: true },
    animals: [{                          // animais que acompanha (N:N)
        type: Schema.Types.ObjectId,
        ref: CONFIG.mongodb.collections.animal
    }],
    orcid: { type: String, match: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/ },
    bio: { type: String, maxlength: 500 },
    email: { type: String, required: true },
    website: String,
    canValidateQuizzes: { type: Boolean, default: false },
    active: { type: Boolean, default: true }
});

module.exports = global.mongoConnection.model(CONFIG.mongodb.collections.expert, expertSchema);
