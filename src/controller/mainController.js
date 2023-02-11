const controller = {
    index: (req, res) => {
        let usu=false;
        let admi = false;
        if(req.session.profile){
               usu =true;
               if(req.session.profile.Rol_id == 1){
                admi=true
              }
        }
        res.render('index',{usu:usu, admi: admi});     
    },
    catalogo: (req,res)=>{
        let usu=false;
                let admi = false;
                if(req.session.profile){
                       usu =true;
                       if(req.session.profile.Rol_id == 1){
                        admi=true
                      }
                }
        res.render('./productos/catalogo')
    }
}
module.exports = controller;