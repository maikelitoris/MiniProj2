// Rotas dos especialistas (Tarefa 3.2). A validação segue a especificação da Tarefa 3.1 b).
const express = require('express');
let router = express.Router();
const ExpertController = require('../controllers/expert.controller');
const AuthController = require("../controllers/auth.controller");
const { body, param } = require('express-validator');

const rules = (optional) => {
    const f = (name) => optional ? body(name).optional({ checkFalsy: true }) : body(name);
    return [
        f('name').isString().trim().isLength({ min: 1, max: 120 }),
        body('title').optional({ checkFalsy: true }).isIn(['Dr.', 'Dra.', 'Prof.', 'Profa.']),
        body('photo').optional({ checkFalsy: true }).isURL(),
        f('specialty').isString().trim().isLength({ min: 1 }),
        f('institution').isString().trim().isLength({ min: 1 }),
        f('animals').isArray({ min: 1 }),
        body('animals.*').isMongoId(),
        body('orcid').optional({ checkFalsy: true }).matches(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/),
        body('bio').optional({ checkFalsy: true }).isString().isLength({ max: 500 }),
        f('email').isEmail(),
        body('website').optional({ checkFalsy: true }).isURL(),
        body('canValidateQuizzes').optional().isBoolean(),
        body('active').optional().isBoolean()
    ];
};

router.route('/')
    .get(AuthController.checkAuth, ExpertController.get)
    .post(AuthController.checkAuth, rules(false), ExpertController.create);

router.route('/public').get(ExpertController.getPublic);

router.route("/deactivate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.deactivate);
router.route("/activate/:id")
    .put(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.activate);

router.route('/:id')
    .get(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.getOne)
    .put(AuthController.checkAuth, [param("id").isMongoId(), ...rules(true)], ExpertController.update)
    .delete(AuthController.checkAuth, [param("id").isMongoId()], ExpertController.delete);

module.exports = router;
