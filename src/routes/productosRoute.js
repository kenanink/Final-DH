const express = require('express');
const router = express.Router();

const productosController = require('../controller/productosController');
const { body } = require('express-validator');

const multer = require('multer');
const path = require('path');

const configuracionImg = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null,path.join(__dirname, '../../public/img') );
    },
    filename: function(req, file, cb){
      let imgName =  "veisie" + Date.now() + file.originalname ;
      cb(null, imgName);
    }
  });

const uploadFile = multer({storage: configuracionImg});

let validaciones = [
body('titulo').notEmpty().withMessage('Llenar campo'),
body('precio').notEmpty().withMessage('Llenar campo'),
body('descripcion').notEmpty().withMessage('Llenar campo')
];

router.get('/catalogo', productosController.catalogo);

router.get('/carrito-compras', productosController.carrito);

router.get('/cargar', productosController.cargar);
router.post('/cargar', uploadFile.single('imgProduct'), validaciones, productosController.registrar);

router.get('/editar/:id', productosController.edit);
router.put('/editar/:id', uploadFile.single('img'), productosController.update);

router.delete('/eliminar/:id', productosController.destroy)


module.exports = router;