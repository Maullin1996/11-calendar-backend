const { response } = require('express');
const Event = require('../models/Evento')

const getEventos = async( req, res = response ) => {
    
    const event = await Event.find().populate('user','name');

    try{
        res.status(200).json({
            ok: true,
            event
        });

    } catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'No se pudo acceder a la base de datos'
        });
    }


}

const crearEvento = async( req, res = response ) => {

    const event = new Event( req.body );
    //console.log( req.body );

    try{

        event.user = req.uid
        const eventSave = await event.save()

        res.json({
            ok: true,
            event:eventSave
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const actualizarEvento = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const event = await Event.findById( eventId );

        if ( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            })
        }

        if( event.user.toString() !== uid ){
            return  res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }
        const newEvent = {
            ...req.body,
            user: uid
        }
        const updateEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );
        res.json({
            ok:true,
            event: updateEvent
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const eliminarEvento = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese ID'
            });
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'You do not have the authorisation to edit this file'
            });
        }

        await Event.findByIdAndDelete( eventId )

        res.json({
            ok: true
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

    res.status(200).json({
        ok: true,
        msg: 'eliminar eventos',
    })
}

module.exports = {
    getEventos,
    crearEvento, 
    actualizarEvento,
    eliminarEvento,
    }