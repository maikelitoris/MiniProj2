// Controlador de sponsors (Tarefa 3.2). Segue a mesma estrutura do animal.controller.js do livro.
const Sponsor = require('../models/sponsor.model');
const { validationResult } = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");

// Copia a mensagem antes de lhe juntar o corpo, para não alterar o objeto partilhado
const reply = (res, msg, body) => res.status(msg.http).send(body === undefined ? { ...msg } : { ...msg, body });

const invalid = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        res.status(406).send(errors);
        return true;
    }
    return false;
};

// GET /sponsors  (aceita filtros na query string, ex.: ?active=true ou ?animals=<id do animal>)
exports.get = (req, res) => {
    Sponsor.find(req.query).populate("animals", "name group").exec((error, list) => {
        if (error) return res.status(400).send({ type: "error", code: "BadQuery", message: error.message });
        if (list.length === 0) return reply(res, SponsorMessages.success.s5);
        return reply(res, SponsorMessages.success.s2, list);
    });
};

// GET /sponsors/public  (sem autenticação: só os ativos, para a página principal)
exports.getPublic = (req, res) => {
    Sponsor.find({ active: true }).populate("animals", "name").exec((error, list) => {
        if (error) throw error;
        return reply(res, SponsorMessages.success.s2, list);
    });
};

exports.getOne = (req, res) => {
    if (invalid(req, res)) return;
    Sponsor.findOne({ _id: req.params.id }).populate("animals", "name group").exec((error, item) => {
        if (error) throw error;
        if (!item) return reply(res, SponsorMessages.error.e0);
        return reply(res, SponsorMessages.success.s2, item);
    });
};

exports.create = (req, res) => {
    if (invalid(req, res)) return;
    new Sponsor(req.body).save((error, item) => {
        if (error) return res.status(406).send({ type: "error", code: "ValidationError", message: error.message });
        return res.header("location", "/sponsors/" + item._id).status(SponsorMessages.success.s0.http)
            .send({ ...SponsorMessages.success.s0, body: item });
    });
};

exports.update = (req, res) => {
    if (invalid(req, res)) return;
    const data = { ...req.body };
    delete data._id;
    Sponsor.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true, runValidators: true }, (error, item) => {
        if (error) return res.status(406).send({ type: "error", code: "ValidationError", message: error.message });
        if (!item) return reply(res, SponsorMessages.error.e0);
        return reply(res, SponsorMessages.success.s1, item);
    });
};

exports.delete = (req, res) => {
    if (invalid(req, res)) return;
    Sponsor.deleteOne({ _id: req.params.id }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return reply(res, SponsorMessages.error.e0);
        return reply(res, SponsorMessages.success.s3);
    });
};

const setActive = (value, okMessage) => (req, res) => {
    if (invalid(req, res)) return;
    Sponsor.updateOne({ _id: req.params.id }, { $set: { active: value } }, (error, result) => {
        if (error) throw error;
        if (result.n <= 0) return reply(res, SponsorMessages.error.e0);
        return reply(res, okMessage);
    });
};
exports.activate = setActive(true, SponsorMessages.success.s6);
exports.deactivate = setActive(false, SponsorMessages.success.s4);
