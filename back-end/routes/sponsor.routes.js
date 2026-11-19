// Rotas dos patrocinadores (Tarefa 3.2). A validação segue a especificação da Tarefa 3.1 b).
const express = require('express');
let router = express.Router();
const SponsorController = require('../controllers/sponsor.controller');
const AuthController = require("../controllers/auth.controller");
const { body, param } = require('express-validator');

const rules = (optional) => {
    const f = (name) => optional ? body(name).optional({ checkFalsy: true }) : body(name);
    return [
        f('name').isString().trim().isLength({ min: 1, max: 120 }),
        f('type').isIn(['empresa', 'associacao', 'particular']),
        body('nif').optional({ checkFalsy: true }).matches(/^[0-9]{9}$/),
        body('logo').optional({ checkFalsy: true }).isURL(),
        f('email').isEmail(),
        body('website').optional({ checkFalsy: true }).isURL(),
        body('phone').optional({ checkFalsy: true }).isString(),
        f('level').isIn(['ouro', 'prata', 'bronze']),
        f('animals').isArray({ min: 1 }),
        body('animals.*').isMongoId(),
        f('startDate').isISO8601(),
        body('endDate').optional({ checkFalsy: true }).isISO8601(),
        body('message').optional({ checkFalsy: true }).isString().isLength({ max: 300 }),
        body('active').optional().isBoolean()
    ];
};

router.route('/')
    .get(AuthController.checkAuth, SponsorController.get)
    .post(AuthController.checkAuth, rules(false), SponsorController.create);

router.route('/public').get(SponsorController.getPublic);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.deactivate);
router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId(), ...rules(true)], SponsorController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], SponsorController.delete);

module.exports = router;
