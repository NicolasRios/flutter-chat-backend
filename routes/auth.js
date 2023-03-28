/*
    path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'O nome é obrigatório').not().isEmpty(),
    check('email', 'O e-mail é obrigatório').isEmail(),
    check('password', 'A senha é obrigatória').not().isEmpty(),
    validarCampos
],crearUsuario);

router.post('/', [
    check('email', 'O e-mail é obrigatório').isEmail(),
    check('password', 'A senha é obrigatória').not().isEmpty(),
], login);

router.get('/renew', validarJWT, renewToken);


module.exports = router;