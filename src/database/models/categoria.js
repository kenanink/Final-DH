function categoriaData(sequelize, Datatypes){

    let alias = 'Categoria';
    
    let cols = {
      id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
      descripcion: {type: Datatypes.TEXT},
    }
    
    let config = {camelCase: false, timestamps: false};
  
    const categoria = sequelize.define(alias,cols,config);
    
    return categoria;
  }
  
    module.exports = categoriaData;
    