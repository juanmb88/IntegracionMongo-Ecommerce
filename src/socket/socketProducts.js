import ProductManager from "../dao/productManagerMONGO.js";
const pm = new ProductManager();

export const socketProducts = (socketServer) => {
    socketServer.on("connection", async(socket)=>{
        console.log("un cliente se conecto con ID:",socket.id);
        const listOfProducts = await pm.getProducts();
        
        socketServer.emit('sendProducts',listOfProducts);

        socket.on("addProduct", async(obj)=>{
            await pm.addProduct(obj);
            const listOfProducts = await pm.getProducts();
            socketServer.emit('sendProducts',listOfProducts);
            });

            socket.on("deleteProduct", async(_id)=>{

            console.log("Se recibió un evento para eliminar el producto con ID:", _id);
            await pm.deleteProduct(_id);
            const listOfProducts = await pm.getProducts();
            socketServer.emit('sendProducts',listOfProducts);
            });
/* 
            socket.on("updateProduct", async(data)=>{
                const {_id, updateProduct} = data
                console.log("Se recibió un evento para actualizar el producto con ID:", _id);
                await pm.updateProduct(_id, updateProduct);
                const listOfProducts = await pm.getProducts();
                socketServer.emit('sendProducts',listOfProducts);
                }); */

           /*      socket.on("updateProduct", async (data) => {
                    const { id, updatedProduct } = data;
                    console.log("Se recibió un evento para actualizar el producto con ID:", id);
                    await ProductModel.updateOne({ id }, updatedProduct); // Suponiendo que tu modelo se llama ProductModel
                    const listOfProducts = await ProductModel.find(); // Suponiendo que deseas obtener todos los productos actualizados después de la actualización
                    socketServer.emit('sendProducts', listOfProducts);
                }); */
        
    });
};

