/*
Rutas de Usuario / Auth
host + /api/auth
*/

const express = require('express');
const { check } = require('express-validator');
const { fielsValidators } = require('../middlewares/validar-campos')
const { createNewUser, loginUser, TokenRatify } = require('../controllers/auth');
const { validarJWT } = require ('../middlewares/validar-jwt');


const router = express.Router();



router.post('/new',
    [
        check('name','El nombre es obligatorio').not().isEmpty().isLength({ min: 2 }),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fielsValidators
    ], 
    createNewUser);

router.post('/', 
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        fielsValidators
    ]
    ,loginUser );

router.get('/renew', validarJWT, 
    TokenRatify );

module.exports = router;
