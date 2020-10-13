const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config({ path: "variables.env"});

// helpers
const helpers = require("./helpers");

// Crear conexión base de datos
const db = require("./config/db");


// import models
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

db.sync()
  .then(() => console.log("connect to database"))
  .catch((error) => console.log(error));

// Crear una app de express

const app = express();

// Donde cargar los archivos estaticos

app.use(express.static("public"));

// Habilitar pug

app.set("view engine", "pug");

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Añadir carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

// agregar flash messages
app.use(flash());


app.use(cookieParser());

// session permite navegar entre distintas paginas sin volvernos a autenticar

app.use(session({
  secret: "cualquiercosa",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la app
app.use((req,res,next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});







app.use("/", routes());
// Servidor y Puerto
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

app.listen(port,host, ()=>{
  console.log("Servidor funcionando");
});


