const { response } = require('express');
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generarJWT } = require('../helpers/jwt')

const createNewUser = async( req, res = response ) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        //console.log(user)
        if (user) {
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existente con ese correo'
            });
        }
        user = new User( req.body );

        //encryptar contraseña
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        //Generar JWT
        const token = await generarJWT( user.id, user.name );
    
        res.status(201).json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }


}

const loginUser = async( req, res = response ) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email });
        //console.log(user)
        if (!user) {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario y contraseña no son correctos'
            });
        }

        //confirmar los password
        const validPassword = bcrypt.compareSync( password, user.password );

        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg: 'check your email or password'
            });
        }

        //Generar nuestro JWT.
        const token = await generarJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })



    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
} 

const TokenRatify = async( req, res = response ) => {

    const { uid, name } = req 

    //Generar un nuevo JWT y retornarlo en la petición

    const token = await generarJWT( uid, name );

    res.json({
        ok:true,
        token

    })
}

module.exports = {
    createNewUser,
    loginUser,
    TokenRatify,
}