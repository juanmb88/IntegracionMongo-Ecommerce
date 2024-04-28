import express from "express";
//import { ProductManagerMONGO } from '../dao/productManagerMONGO.js';
import {socketProducts} from './socket/socketProducts.js'
import routerP from "./routes/products-router.js";
import { CartManager } from "./dao/cartManager.js";
import { cartsRouter } from "./routes/cart-router.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import { errorHandler, middleware01, middleware02, middleware03 } from "./middleware/middleW01.js";
import { engine } from "express-handlebars";
import {coneccionDB} from "./connection/MongoDB.js"
import path from "path"; 
import __dirname from "./utils.js"; 
import { Server } from "socket.io";
const puerto = 8080;
const app = express();

export const  cartManager = new CartManager;

//middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));
//FIN handlebars

//contenido estatico
app.use(express.static(path.join(__dirname,'/public')));
//FIN contenido estatico

//RUTAS
app.use('/api/products', routerP);
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter)//ruta de las vistas con handlebars



app.use('/',/* middleware03, */(req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok")});
//FIN RUTAS

app.use(errorHandler)//error handler


//Escucha del servidor
const serverHTTP=  app.listen(puerto, () => console.log('Servidor andando en puerto ',  puerto));
const socketServer = new Server(serverHTTP)
socketProducts(socketServer)
//FIN Escucha del servidor

    
//CONECCION A MONGO DB
 coneccionDB();
//CONECCION A MONGO DB
   