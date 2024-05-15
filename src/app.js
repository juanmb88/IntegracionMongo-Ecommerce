import express from "express";
import path from "path"; 
import __dirname from "./utils.js"; 
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import connectDB from "./connection/MongoDB.js"
import { router as productRouter } from "./routes/products-router.js";
import { router as cartRouter } from "./routes/cart-router.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as sessionsRouter } from './routes/sessions-router.js';
import sessions from "express-session"
import socketChat from "./socket/socketChat.js";
import socketProducts from './socket/socketProducts.js';
import  dotenv from 'dotenv';
dotenv.config();
const port = 8080;

const app = express();

//middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//FIN middlewares 
//SESSION
app.use(sessions({
    secret:"CoderCoder123", resave:true, saveUninitialized: true
}))
//FIN SESSION
//CONECCION A MONGO DB
connectDB();
//CONECCION A MONGO DB
   
//handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));
//FIN handlebars

//contenido estatico
app.use(express.static(path.join(__dirname,'/public')));
//FIN contenido estatico

//RUTAS
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter);//ruta de las vistas con handlebars
app.use('/',(req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok")});
//FIN RUTAS

//Escucha del servidor
const serverHTTP= app.listen(port, ()=> console.log(`Server corriendo en http://localhost:${port}`));
serverHTTP.on('error', (err)=> console.log(err));

const socketServer = new Server(serverHTTP);

socketProducts(socketServer);
socketChat(socketServer);
//FIN Escucha del servidor
 