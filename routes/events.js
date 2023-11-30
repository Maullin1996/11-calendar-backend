// //Todas tiene que pasar por la validación del JWT
/*
    Event Routes
    /api/events
*/

const express = require('express');
const {check} = require('express-validator');

const { isDate } = require('../helpers/isDate')
const { getEventos, 
        crearEvento,
        actualizarEvento,
        eliminarEvento,
        id } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { fielsValidators } = require('../middlewares/validar-campos');

const router = express.Router();

/*Cuando todos los componentes necesitan la misma validad
se puede utilizar router.use para evitar escribirlo en todos
los elementos*/
router.use( validarJWT );

// Obtener eventos
router.get('/', getEventos);

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoría').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoría').custom( isDate ),
        fielsValidators
    ],
    crearEvento );

//Actualizar evento evento
router.put('/:id', actualizarEvento );

//Eliminar evento
router.delete('/:id', eliminarEvento );

module.exports = router;

