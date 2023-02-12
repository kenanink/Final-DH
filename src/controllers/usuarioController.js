const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');


const controller = {

    registro: (req,res) => {
        let usu=false
        let admi =false;
        if(req.session.profile){
               usu =true;
               if(req.session.profile.tipoUsuario == "admin"){
                admi=true
              }
        }
        res.render('./users/registro',{email: false,usu:usu, admi:admi});
    },


    registrar:(req, res)=>{


        let usu=false
        let admi =false;
        if(req.session.profile){
            usu =true;
            if(req.session.profile.Rol_id == 1){
                admi=true
            }
        }

        let errors = validationResult(req);
    
        if( errors.isEmpty() ) {

            let imgName = req.file.filename;
            let password = req.body.contrasena;
            let nuevaPasword = bcryptjs.hashSync(password, 10)
            const fecha = new Date();
            
            db.Usuario_dbs.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                clave: nuevaPasword,
                telefono: req.body.telefono,
                imagen: imgName,
                Rol_id: 3,
                Administrador_id: 1
            }).then(()=>{
                res.redirect('/usuario/login');
            })

        } else {
        console.log(errors.array())
            res.render('./users/registro', {errors: errors.array(), error:false, email: false, usu:usu, admi:admi } ); 
        }
    },

    login:(req,res) => {

            let usu=false
            let admi = false;
            if(req.session.profile){
                usu =true;
                if(req.session.profile.Rol_id == 1){
                    admi=true
                }
            }
            res.render('./users/login',{ error:false,usu:usu,admi:admi});
    },

    perfil:(req,res) => {

        let usu=false
        let admi =false;
        if(req.session.profile){
            usu =true;
            if(req.session.profile.Rol_id == 1){
                admi=true
            }
        }

        let errors = validationResult(req);
        if( errors.isEmpty() ) {

            let email=req.body.email

            db.Usuario_dbs.findAll().then((usuario)=>{
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
            res.render('./users/login', {errors: errors.array(), error:false, usu:usu, admi:admi } ); 
        }
    },

    vistaPerfil:(req,res)=>{
        let usu =false
        let admi = false;
   

        if(req.session.profile){
            usu = true
            if(req.session.profile.Rol_id == 1){
                admi=true
                db.Usuario_dbs.findAll().then((usuario)=>{
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
                        }
                        
                        listaUSU.push(obj);
                        
                    }
                    let listPro = listaUSU.filter(ele =>{
                        return ele.rol == 2
                    });
                    

                    res.render('users/vista-admin',{i:req.session.profile, usu:usu, admi:admi, list:listPro});
                })
            
            }else if(req.session.profile.Rol_id == 3){
                res.render('users/perfil',{i:req.session.profile, usu:usu, admi:admi});
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
            res.render('users/perfiles/mi-datos',{i:req.session.profile, usu:usu, admi:admi,});
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
        res.render('users/editar-usuario',{i:req.session.profile, usu:usu,admi:admi});
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
    },

    eliminar:(req,res)=>{
        let id = req.params.id;
        db.Usuario_dbs.findByPk(id).then((resultado)=>{
            let name = resultado.imagen;
            console.log(name);
            fs.unlinkSync(path.join(__dirname, '../../public/img/perfil', name));
            db.Usuario_dbs.destroy({
                where:{id}
            }).then((re)=>{
                res.redirect('/usuario/vista-perfil');
    
            });
        })
    }

}


module.exports = controller;