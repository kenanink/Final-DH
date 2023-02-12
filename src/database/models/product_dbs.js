function productData(sequelize, Datatypes){

    let alias = 'Product_dbs';
    
    let cols = {
      id: {type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
      nombre: {type: Datatypes.STRING(50)},
      descripcion: {type: Datatypes.TEXT(500)},
      imagen: {type: Datatypes.STRING(255)},
      precio: { type: Datatypes.FLOAT},
    }
    
    let config = {camelCase: false, timestamps: false};

    const courses = sequelize.define(alias,cols,config);

    return courses;
  }

module.exports = productData;
    