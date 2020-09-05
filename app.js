const path = require('path')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const exejs = require('ejs')
const md5 = require('md5')
const nodemailer = require('nodemailer');

const moment = require("moment");

//Importar variables de entorno locales
require('dotenv').config({path: 'variables.env'});

const app = express();

// importando rutas
const indexRoutes = require('./routes/index');

//settings
//app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".ejs");

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });


//connecting to db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, 
	{
		useNewUrlParser: true, 
		useUnifiedTopology: true
	})

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


//routers
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('/', indexRoutes);

app.use(express.static(path.join(__dirname, 'public')));

//starting the server
app.listen(process.env.PORT || 3000, host, () => 
{
	console.log("Server on port");
});