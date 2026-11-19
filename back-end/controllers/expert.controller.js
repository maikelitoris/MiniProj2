// Controlador de experts (Tarefa 3.2). Segue a mesma estrutura do animal.controller.js do livro.
const Expert = require('../models/expert.model');
const { validationResult } = require('express-validator');
const ExpertMessages = require("../messages/expert.messages");

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

// GET /experts  (aceita filtros na query string, ex.: ?active=true ou ?animals=<id do animal>)
exports.get = (req, res) => {
    Expert.find(req.query).populate("animals", "name group").exec((error, list) => {
        if (error) return res.status(400).send({ type: "error", code: "BadQuery", message: error.message });
        if (list.length === 0) return reply(res, ExpertMessages.success.s5);
        return reply(res, ExpertMessages.success.s2, list);
    });
};

// GET /experts/public  (sem autenticação: só os ativos, para a página principal)
exports.getPublic = (req, res) => {
    Expert.find({ active: true }).populate("animals", "name").exec((error, list) => {
        if (error) throw error;
        return reply(res, ExpertMessages.success.s2, list);
    });
};

exports.getOne = (req, res) => {
    if (invalid(req, res)) return;
    Expert.findOne({ _id: req.params.id }).populate("animals", "name group").exec((error, item) => {
        if (error) throw error;
        if (!item) return reply(res, ExpertMessages.error.e0);
        return reply(res, ExpertMessages.success.s2, item);
    });
};

exports.create = (req, res) => {
    if (invalid(req, res)) return;
    new Expert(req.body).save((error, item) => {
        if (error) return res.status(406).send({ type: "error", code: "ValidationError", message: error.message });
        return res.header("location", "/experts/" + item._id).status(ExpertMessages.success.s0.http)
            .send({ ...ExpertMessages.success.s0, body: item });
    });
};

exports.update = (req, res) => {
    if (invalid(req, res)) return;
    const data = { ...req.body };
    delete data._id;
    Expert.findOneAndUpdate({ _id: req.params.id }, { $set: data }, { new: true, runValidators: true }, (error, item) => {
        if (error) return res.status(406).send({ type: "error", code: "ValidationError", message: error.message });
        if (!item) return reply(res, ExpertMessages.error.e0);
        return reply(res, ExpertMessages.success.s1, item);
    });
};

exports.delete = (req, res) => {
    if (invalid(req, res)) return;
    Expert.deleteOne({ _id: req.params.id }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return reply(res, ExpertMessages.error.e0);
        return reply(res, ExpertMessages.success.s3);
    });
};

const setActive = (value, okMessage) => (req, res) => {
    if (invalid(req, res)) return;
    Expert.updateOne({ _id: req.params.id }, { $set: { active: value } }, (error, result) => {
        if (error) throw error;
        if (result.n <= 0) return reply(res, ExpertMessages.error.e0);
        return reply(res, okMessage);
    });
};
exports.activate = setActive(true, ExpertMessages.success.s6);
exports.deactivate = setActive(false, ExpertMessages.success.s4);
