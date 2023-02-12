const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const db = require('../database/models');

const controlador = {
  
  catalogo: (req, res) => {
    let usu=false
    let admi = false
    if(req.session.profile){
      usu =true;
      if(req.session.profile.Rol_id == 1){
        admi=true
      }
    } 

  db.Product_dbs.findAll().then((productos)=>{

      let listaProd = [];
      let prod = [];
      
      for(g of productos){
        listaProd.push(g);
        let obj = {
          id:g.id,
          nombre: g.nombre,
          descripcion: g.descripcion,
          precio: g.precio,
          imagen: g.imagen,
        }
        prod.push(obj)
      }

      res.render('./products/catalogo', {ps:prod, usu:usu, admi:admi});
    }); 

  },

  cargar: (req, res) => {
    let usu=false
    let admi=false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id == 1){
            admi=true
            res.render('./products/cargar',{usu:usu , admi:admi});
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
    

    db.Product_dbs.create({
      nombre: req.body.titulo,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: nombreImg

    }).then(()=>{
        res.redirect('/producto/cursos');
    })

  } else {
      res.render('./products/cargar', {errors: errors.array(), usu:usu , admi:admi} ); 
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

    let idprod = req.params.id;
    let usu=false
    let admi = false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id == 1){
            admi=true
          }
    }

    db.Product_dbs.findByPk(idprod).then((prod)=>{
      res.render('./products/editar', {ps: prod,usu:usu, admi:admi});
    });

    
  },

  update: (req, res) => {

    let id = req.params.id;
    let nombreImg = req.file.filename;

    db.Product_dbs.update({
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

    db.Product_dbs.findByPk(id).then((resul)=>{
      let name = resul.imagen;
      fs.unlinkSync(path.join(__dirname, '../../public/img/licores', name));
      db.Product_dbs.destroy({
        where:{id}
      }).then(()=>{
        res.redirect('/producto/catalogo')
      });
    });
  }
};

module.exports = controlador;
