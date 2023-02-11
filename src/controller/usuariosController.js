const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');


const controller = {

    registro: (req,res) => {
        let usu=false
        let admi=false;
        if(req.session.profile){
               usu =true;
               if(req.session.profile.tipoUsuario == "admin"){
                admi=true
              }
        }
        res.render('./usuarios/registro',{email:false,usu:usu, admi:admi});
    },
    registrar:(req, res)=>{
        let usu=false
        let admi=false;
        if(req.session.profile){
            usu =true;
            if(req.session.profile.id_rol == 1){
                admi=true
            }
        }
        let errors = validationResult(req);
        if( errors.isEmpty() ) {

            let imgName = req.file.filename;
            let password = req.body.contrasena;
            let nuevaPasword = bcryptjs.hashSync(password, 10)
            const fecha = new Date();
            
            db.Usuario.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                clave: nuevaPasword,
                imagen: imgName,
                id_rol: 1,
            }).then(()=>{
                res.redirect('/usuario/login');
            })

        } else {
        console.log(errors.array())
            res.render('./usuarios/registro', {errors: errors.array(), error:false, email: false, usu:usu, admi:admi } ); 
        }
    },
    login:(req,res) => {

            let usu=false
            let admi=false;
            if(req.session.profile){
                usu=true;
                if(req.session.profile.Rol_id == 1){
                    admi=true
                }
            }
            res.render('./usuarios/login',{error:false,usu:usu,admi:admi});
    },
    perfil:(req,res) => {

        let usu=false
        let admi=false;
        if(req.session.profile){
            usu=true;
            if(req.session.profile.Rol_id == 1){
                admi=true
            }
        }

        let errors = validationResult(req);
        if( errors.isEmpty() ) {

            let email=req.body.email

            db.usuario.findAll().then((usuario)=>{
                let listaUsuarios=[];
                for(g of usuario){
                    listaUsuarios.push(g);
                }
                let usuarioInicio = listaUsuarios.find(usuario =>{
                    return usuario.email == email 
                    
                });
                req.session.profile = usuarioInicio;
                return res.redirect('/usuario/vista-perfil')
            });

        } else {
            res.render('./usuario/login', {errors: errors.array(), error:false, usu:usu, admi:admi } ); 
        }
    },
    vistaPerfil:(req,res)=>{
        let usu=false;
        let admi=false;

        if(req.session.profile){
            usu=true
            if(req.session.profile.Rol_id == 1){
                admi=true
                db.usuario.findAll({include:[{association: 'tematicas'}]}).then((usuario)=>{
                    let list = [];
                    let listaUSU = [];
                    for(g of usuario){
                        list.push(g);
                       
                        let obj = {
                            id: g.id,
                            nombre: g.nombre,
                            apellido: g.apellido,
                            rol: g.Rol_id,
                            email: g.email,
                            imagen: g.imagen,
                            tematica: g.tematicas.nombre
                        }
                        
                        listaUSU.push(obj);
                        
                    }
                    let listPro = listaUSU.filter(ele =>{
                        return ele.rol == 2
                    });
                    res.render('usuarios/vista-admin',{i:req.session.profile, usu:usu, admi:admi, list:listPro});
                })
            
            }else if(req.session.profile.Rol_id == 3){
                res.render('usuarios/perfil',{i:req.session.profile, usu:usu, admi:admi});
            }
        }else {
            delete req.session.profile;
            
            res.redirect('/')
        }
    },
    vistaDatos:(req,res) =>{
        let usu =false
        let admi = false;
        if(req.session.profile){
            usu =true;
            if(req.session.profile.Rol_id == 1){
                admi=true
            }
            res.render('usuarios/perfiles/mi-datos',{i:req.session.profile, usu:usu, admi:admi,});
        }else {
            delete req.session.profile;
            
            res.redirect('/')
        }
    },
    visataAyuda:(req,res)=>{
        let usu =false
        let admi = false;
        if(req.session.profile){
            usu =true;
            if(req.session.profile.Rol_id == 1){
                admi=true
            }
            res.render('usuarios/perfiles/ayuda',{i:req.session.profile, usu:usu, admi:admi});
        }else {
            delete req.session.profile;
            
            res.redirect('/')
        }
    },
    editar:(req,res) => {
    
    let usu=false
    let admi = false;
    if(req.session.profile){
           usu =true;
           if(req.session.profile.Rol_id = 1){
            admi=true
          }
    }
        res.render('usuarios/editar-usuario',{i:req.session.profile, usu:usu,admi:admi});
    },
    update: (req,res) => {
        let id = req.session.profile.id;
        db.Usuario_dbs.update(
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                telefono: req.body.telefono
            },
            {
                where:{id}
            }
        ).then(()=>{
            res.redirect('/usuario/vista-perfil');
        })

    },
    salir:(req,res)=>{
        let id = req.params.id
        if(id == "delete"){
            delete req.session.profile
            res.redirect('/')
        }
    }
}
module.exports = controller;