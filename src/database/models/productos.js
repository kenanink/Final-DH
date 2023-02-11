function productosData(sequelize, Datatypes){

    let alias = 'productos';
    
    let cols = {
      id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
      nombre: {type: Datatypes.STRING(50)},
      descripcion: {type: Datatypes.TEXT(500)},
      precio: { type: Datatypes.FLOAT},
      imagen:{type: Datatypes.STRING(100)},
      id_categoria: {type: Datatypes.TEXT(500)}
    }
    
    let config = {camelCase: false, timestamps: false};

    const productos = sequelize.define(alias,cols,config);
    

    return productos;
  }

module.exports = productosData;
    