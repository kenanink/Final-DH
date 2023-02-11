const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const db = require('../database/models');

const controlador = {
  
  catalogo: (req, res) => {
    let usu=false
    let admi=false
    if(req.session.profile){
      usu =true;
      if(req.session.profile.Rol_id == 1){
        admi=true
      }
    } 

  db.productos.findAll().then((products)=>{

      let listaproductos = [];
      let producto = [];
      
      for(g of products){
        listaproductos.push(g);
        let producto = g.producto.nombre;
        let obj = {
          id:g.id,
          nombre: g.nombre,
          descripcion: g.descripcion,
          precio: g.precio,
          imagen: g.imagen,
          Nivel_curso_id: g.nivel_curso.nombre,
        }
        producto.push(obj)
      }

      res.render('./productos/catalogo', {ps:producto, usu:usu, admi:admi});
    }); 

  },

  cargar: (req, res) => {
    let usu=false
    let admi=false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id == 1){
            admi=true
            res.render('./productos/cargar',{usu:usu , admi:admi});
          }
    }
  },

  registrar: (req, res) => {

    let usu=false
    let admi = false
    if(req.session.profile){
      usu =true;
      if(req.session.profile.Rol_id == 1){
        admi=true
      }
    }

    let errors = validationResult(req);
        if( errors.isEmpty() ) {

    
    // llamamos el dato de la img de file que queremos 
    let nombreImg = req.file.filename;
    const fecha = new Date();

    db.productos.create({
      nombre: req.body.titulo,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: nombreImg
    }).then(()=>{
        res.redirect('/producto/catalogo');
    })

  } else {
      res.render('./productos/cargar', {errors: errors.array(), usu:usu , admi:admi} ); 
  }
  },

  carrito: (req, res) => {
    let usu=false;
    let admi = false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id == 1){
            admi=true
          }
    }
    res.render('./carrito-compras',{usu:usu, admi:admi});
  },

  edit: (req, res) => {

    let idCurso = req.params.id;
    let usu=false
    let admi = false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id == 1){
            admi=true
          }
    }

    db.productos.findByPk(idCurso).then((producto)=>{
      res.render('./productos/editar', {ps: producto,usu:usu, admi:admi});
    });

    
  },

  update: (req, res) => {

    let id = req.params.id;
    let nombreImg = req.file.filename;

    db.productos.update({
      nombre: req.body.titulo,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      imagen: nombreImg
    },
    {
      where:{id}
    }
    ).then(()=>{
      res.redirect('/producto/catalogo')
    })
      
    
    
  },

  destroy: (req, res) => {

    let id = req.params.id;

    db.productos.findByPk(id).then((resul)=>{
      let name = resul.imagen;
      fs.unlinkSync(path.join(__dirname, '../../public/img', name));
      db.productos.destroy({
        where:{id}
      }).then(()=>{
        res.redirect('/producto/catalogo')
      });
    });
  }
  
};

module.exports = controlador;
