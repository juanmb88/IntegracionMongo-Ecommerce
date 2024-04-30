import express from "express";
import { engine } from "express-handlebars";
import path from "path"; 
import { Server } from "socket.io";
import { errorHandler } from "./middleware/middleW01.js";
import { connectDB } from "./connection/MongoDB.js"
import routerP from "./routes/products-router.js";
import { CartManager } from "./dao/cartManager.js";
import { cartsRouter } from "./routes/cart-router.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import __dirname from "./utils.js"; 
import socketChat from "./socket/socketChat.js";
import socketProducts from './socket/socketProducts.js'
import  dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT

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



app.use('/',(req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok")});
//FIN RUTAS

app.use(errorHandler)//error handler


//Escucha del servidor
const serverHTTP= app.listen(port, ()=> console.log(`Server corriendo en http://localhost:${port}`))
;
const socketServer = new Server(serverHTTP)
socketProducts(socketServer)
socketChat(socketServer)
//FIN Escucha del servidor
    
//CONECCION A MONGO DB
connectDB();
//CONECCION A MONGO DB
   