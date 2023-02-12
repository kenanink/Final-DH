const db = require('../database/models');


function validacionRegitro(req, res, next){

    db.Usuario_dbs.findAll().then((usuario)=>{
        let email = req.body.email;
        let listaUsuario = [];
        for(f of usuario){
            listaUsuario.push(f.email);
        }

        let registro = listaUsuario.find(usuarios =>{
            return usuarios == email;
        });
        if(registro != undefined){   
            res.render('users/registro',{email: true,usu:false,admi:false});
        }else{
           next();
        }
    })
}

module.exports = validacionRegitro;