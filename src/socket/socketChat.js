import MessageManager from "../dao/messageManagerMONGO.js"

const mensageManager= new MessageManager()

const socketChat=(socketServer)=>{

    socketServer.on('connection',async(socket)=>{
       // console.log("conectado usuario con id para el socketChat: " + socket.id)
   

        socket.on("mensaje", async (info) => {
            await mensageManager.createMessage(info);
            // Emitir el mensaje a todos los clientes conectados
             socketServer.emit("chat", await mensageManager.getMessages());
    
          })
          socket.on("clearchat", async () => {
            // Borrar todos los mensajes utilizando el MessagesManager
            await mensageManager.deleteMessage();
            
        });

        socket.on("nuevousuario",(usuario)=>{
            socket.broadcast.emit("broadcast",usuario);
    //broadcast: emito para todos menos para mi, ACORDATE!!
           })
    })    
}

export default socketChat;