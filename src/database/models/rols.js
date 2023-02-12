function rolData(sequelize, Datatypes){

  let alias = 'Rols';
  
  let cols = {
    id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
    nombre: {type: Datatypes.STRING(45)}
  }
  
  let config = {camelCase: false, timestamps: false};

  const rols = sequelize.define(alias,cols,config);

  rols.associate = function(modelos){

    rols.hasMany(modelos.Usuario_dbs,{
      as: "usuarios",
      foreignKey: "Rol_id"
    });

  }

  return rols;
}

  module.exports = rolData;