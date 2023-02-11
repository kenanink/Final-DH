const usuariosController = require('../controller/usuariosController')
const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path')
const { body } = require('express-validator');

const configuracionImg = multer.diskStorage({

    destination:function(req, file, cb){
        cb(null, path.join(__dirname, '../../public/img/perfil'));
    },
    filename:function(req,file,cb){
        let imgName =  "moidih" + Date.now() + file.originalname;
        cb(null, imgName);
    }
})

const uploadfile = multer({storage:configuracionImg});
const validacionRegitro = require('../middleware/validacionRegistro');
const validacionLogin = require('../middleware/validacionLogin');

let validacionReg = [
    body('nombre').notEmpty().withMessage('Campo vacio'),
    body('apellido').notEmpty().withMessage('Campo vacio'),
    body('telefono').notEmpty().withMessage('Campo vacio'),
    body('email').isEmail(),
    body('contrasena').isLength({ min: 4, max:10 }).withMessage('Debe contener entre 4 y 10 caracteres')

];

let validacionLog = [
    body('email').isEmail(),
    body('password').isLength({ min: 4, max:10 }).withMessage('Debe contener entre 4 y 10 caracteres')
];

router.get('/registro',usuariosController.registro);
router.post('/regitro', uploadfile.single('img'), validacionRegitro, validacionReg, usuariosController.registrar);

router.get('/login', usuariosController.login);
router.post('/perfil', validacionLogin, validacionLog, usuariosController.perfil);
router.get('/vista-perfil',usuariosController.vistaPerfil );
router.get('/datosUsuario', usuariosController.vistaDatos);
router.get('/ayuda', usuariosController.visataAyuda);

router.get('/editar-usuario', usuariosController.editar);
router.post('/editar-usuarios',/* uploadfile.single('img'),  validacionUsu, */ usuariosController.update);

module.exports = router;