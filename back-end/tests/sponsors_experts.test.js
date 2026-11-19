// Testes das rotas novas (Tarefa 3.2) sem base de dados: os acessos ao MongoDB são substituídos por funções falsas.
// Correr com: npm test
const test = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const JWT = require('jsonwebtoken');

global.mongoConnection = mongoose.createConnection();   // ligação sem servidor, só para registar os modelos
const app = express();
require('../init/middleware')(app);
require('../init/router')(app);

const User = require('../models/user.model');
const Sponsor = require('../models/sponsor.model');
const Expert = require('../models/expert.model');

// Utilizador falso para o checkAuth: token assinado com a chave privada dele
const fakeUser = { name: "Admin", auth: { public_key: "pk1", private_key: "segredo" } };
const token = JWT.sign({ pk: "pk1" }, "segredo", { expiresIn: 60, issuer: "FCA" });
User.findOne = (q, cb) => cb(null, q["auth.public_key"] === "pk1" ? fakeUser : null);

// find(...).populate(...).exec(cb)
const chain = (result) => ({ populate: () => ({ exec: (cb) => cb(null, result) }) });
const animalId = "5dd2f1f6a0b1c2d3e4f5a6b7";

const sponsorOk = {
    name: "Zoo Amigo, Lda.", type: "empresa", nif: "123456789", email: "geral@zooamigo.pt",
    website: "https://zooamigo.pt", level: "ouro", animals: [animalId], startDate: "2026-11-01", active: true
};
const expertOk = {
    name: "Ana Lince", title: "Dra.", specialty: "Felidae", institution: "Universidade Aberta",
    animals: [animalId], orcid: "0000-0002-1825-0097", email: "ana@exemplo.pt", canValidateQuizzes: true
};

test('sem token: 401', async () => {
    const r = await request(app).get('/sponsors');
    assert.strictEqual(r.status, 401);
});

test('listar patrocinadores com token', async () => {
    Sponsor.find = () => chain([{ name: "Zoo Amigo" }]);
    const r = await request(app).get('/sponsors').set('Authorization', token);
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.code, "SponsorFound");
    assert.strictEqual(r.body.body.length, 1);
});

test('patrocinadores públicos não pedem token e só pedem os ativos', async () => {
    let filtro = null;
    Sponsor.find = (q) => { filtro = q; return chain([]); };
    const r = await request(app).get('/sponsors/public');
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(filtro, { active: true });
});

test('criar patrocinador válido: 201 e Location', async () => {
    Sponsor.prototype.save = function (cb) { this._id = new mongoose.Types.ObjectId(); cb(null, this); };
    const r = await request(app).post('/sponsors').set('Authorization', token).send(sponsorOk);
    assert.strictEqual(r.status, 201, JSON.stringify(r.body));
    assert.match(r.headers.location, /^\/sponsors\//);
});

test('patrocinador com NIF errado, email inválido e sem animais: 406', async () => {
    const r = await request(app).post('/sponsors').set('Authorization', token)
        .send({ ...sponsorOk, nif: "12AB", email: "nao-e-email", animals: [] });
    assert.strictEqual(r.status, 406);
    const campos = r.body.map(e => e.param);
    assert.ok(campos.includes('nif') && campos.includes('email') && campos.includes('animals'), campos.join(','));
});

test('nível do patrocinador fora da lista: 406', async () => {
    const r = await request(app).post('/sponsors').set('Authorization', token).send({ ...sponsorOk, level: "platina" });
    assert.strictEqual(r.status, 406);
});

test('criar especialista válido: 201', async () => {
    Expert.prototype.save = function (cb) { this._id = new mongoose.Types.ObjectId(); cb(null, this); };
    const r = await request(app).post('/experts').set('Authorization', token).send(expertOk);
    assert.strictEqual(r.status, 201, JSON.stringify(r.body));
});

test('especialista com ORCID mal formado: 406', async () => {
    const r = await request(app).post('/experts').set('Authorization', token).send({ ...expertOk, orcid: "1234" });
    assert.strictEqual(r.status, 406);
});

test('editar especialista inexistente: 404', async () => {
    Expert.findOneAndUpdate = (q, u, o, cb) => cb(null, null);
    const r = await request(app).put(`/experts/${animalId}`).set('Authorization', token).send({ specialty: "Canidae" });
    assert.strictEqual(r.status, 404);
});

test('id inválido no URL: 406', async () => {
    const r = await request(app).delete('/experts/abc').set('Authorization', token);
    assert.strictEqual(r.status, 406);
});

test('desativar patrocinador', async () => {
    Sponsor.updateOne = (q, u, cb) => cb(null, { n: 1 });
    const r = await request(app).put(`/sponsors/deactivate/${animalId}`).set('Authorization', token);
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.body.code, "Deactivated");
});
