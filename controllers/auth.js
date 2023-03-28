const { response } = require("express");
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const { gerarJWT }= require('../helpers/jwt');
// const { validationResult } = require("express-validator");

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;
    try {

        const existeEmail = await Usuario.findOne({email});
        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'O e-mail já está registrado!'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        //gerar JWT
        const token = await gerarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Fale com o Administrador'
        });
    }

}

const login = async(req, res = response) => {

    const{ email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'E-mail não encontrados'
            });
        }

        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Senha inválida'
            });
        }

        const token = await gerarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Fale com o administrador'
        });
    }





}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    const token = await gerarJWT( uid );

    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    login, 
    renewToken
}