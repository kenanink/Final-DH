function usuarioData(sequelize, Datatypes){

    let alias = 'Usuario';
    
    let cols = {
      id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
      nombre: {type: Datatypes.STRING(45)},
      apellido: {type: Datatypes.STRING(500)},
      email: {type: Datatypes.STRING(45)},
      clave: {type: Datatypes.STRING(255)},
      imagen:{type: Datatypes.STRING(100)},
      id_rol: {type: Datatypes.STRING(50)}
    }
    
    let config = {camelCase: false, timestamps: false};

    const users = sequelize.define(alias,cols,config);

    users.associate = function(modelos){

      users.belongsTo(modelos.Rols,{
        as: 'rol',
        foreignKey: "Rol_id"
      });

      return users;
      }
    }
  
  
      
  

module.exports = usuarioData;