const db = require('../database/models');


function validacionRegitro(req, res, next){

    db.usuario.findAll().then((usuari)=>{
        let email = req.body.email;
        let listaUsuario = [];
        for(f of usuari){
            listaUsuario.push(f.email);
        }

        let registro = listaUsuario.find(usuarios =>{
            return usuarios == email;
        });
        if(registro != undefined){   
            res.render('/',{email:true,usu:false,admi:false});
        }else{
           next();
        }
    })
}

module.exports = validacionRegitro;