
const bcryptjs = require('bcryptjs');
const db = require('../database/models')

function validacionLogin (req,res,next){
   

    let email = req.body.email;
    let password = req.body.password;

    db.Usuario_dbs.findAll().then((usuario)=>{
        let usuarios = [];
        for(g of usuario){
            usuarios.push(g);
        }

        let usuarioEncontrado = usuarios.find(elemento =>{
             return (elemento.email == email && bcryptjs.compareSync(password,elemento.clave) == true);
        });

        if(usuarioEncontrado == undefined){
        
            res.render('users/login',{error: true, usu:false, admi:false});
            
        }else {
            next();
        }
    });
}


module.exports= validacionLogin;
