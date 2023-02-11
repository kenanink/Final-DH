const productosRoutes = require('./src/routes/productosRoute')
const mainRoutes = require('./src/routes/mainRoute')
const usuarioRoutes = require('./src/routes/usuariosRoute')
const session = require('express-session');
const methodOverride = require('method-override');

const express = require('express');
const path = require('path');

const app = express();
const cookieParser = require('cookie-parser');

const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));


app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({secret: 'top secret',saveUninitialized:false, resave: false}));

app.use(methodOverride('_method'));

app.use(cookieParser());

app.use('/', mainRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/producto', productosRoutes);

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'./src/views'));

app.listen(process.env.PORT || 3002, function() {
    console.log("corriendo server 3002")
});