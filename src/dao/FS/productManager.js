import fs  from "fs";
import {v4 as uuidv4} from "uuid";

export class ProductManager {

        constructor() {
            this.PATH = "./src/data/products.json";
            this.products = [];
        }; 

//--------------------FUNCION AGREGAR PRODUCTO---------------------//
    addProduct = async ({title, description, price, thumbnail, code, stock, status, category}) => { 
        const id = uuidv4()

        let newProduct =  { id , title, description, price, thumbnail, code, stock, status, category}

        this.products = await this.getProducts(); //Traigo los productos existentes para agregar el nuevo al final de la lista        
        this.products.push(newProduct)

        await fs.promises.writeFile(this.PATH, JSON.stringify(this.products))
        return newProduct;
        
    }

//-------------------FUNCION OBTENER PRODUCTOS---------------------//
    getProducts = async  ()=> {
        const response = await fs.promises.readFile(this.PATH, 'utf-8');
        const responseParse =  JSON.parse(response);  
        return  responseParse ;
    };

//-----------------FUNCION OBTENER PRODUCTO POR ID----------------//
    getProductById = async(id) =>  {
        const response =await this.getProducts();
        const product = response.find(product => product.id === id)

        if (product){
            return product
        }else{
            console.log("Producto no encontrado")
        }
    }
//-----------------FUNCION ACTUALIZAR PRODUCTO POR ID----------------//

    updateProduct = async (id, {...data}) => {
         const products = await this.getProducts();
         const index =products.findIndex( product => product.id === id);

         if(index !== -1){
            products[index] = {id, ...data}
            await fs.promises.writeFile(this.PATH ,JSON.stringify(products))
            return console.log("Se ha actualizado el producto")
         } else {
            console.log('El Producto no existe')
         }
    }
     //-----------------FUNCION  ELIMINAR PRODUCTO ----------------//

/*     deleteProduct = async ({title}) => {
        const products = await this.getProducts();
        const index = products.findIndex(product => (product.title === title));
    
        if(index !== -1){
            products.splice(index, 1);
            await fs.promises.writeFile(this.PATH, JSON.stringify(products));
            console.log('Producto eliminado correctamente.');
        } else {
            console.log('El producto no existe.');
        }
    } */
 //-----------------FUNCION  ELIMINAR PRODUCTO POR ID----------------//
    deleteProductById = async(id) => {
        const products = await this.getProducts();
        const index =products.findIndex(product => product.id === id);

        if(index !== -1){
            products.splice(index, 1)
            await fs.promises.writeFile(this.PATH ,JSON.stringify(products))
         } else {
            console.log('El Producto no existe')
         }
    }


}