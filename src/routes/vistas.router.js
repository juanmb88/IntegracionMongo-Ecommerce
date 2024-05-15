import { Router } from 'express';
import  ProductManagerMONGO from '../dao/productManagerMONGO.js';
import CartManager from '../dao/cartManagerMONGO.js';
import {auth} from "../middleware/auth.js"
export const router = Router();

const productManager = new ProductManagerMONGO();
const cartManager = new CartManager();

//////////////REAL TIME PRODUCTS/////////
 router.get('/realTimeproducts', async (req,res) => {
    res.status(200).render('realTimeProducts') 
}) ;

////////////////////////CHAT/////////
router.get('/chat', async (req,res) => {
    res.status(200).render('chat')
});

////////////////////////VISTA INICIO/////////////
router.get('/',auth, async (req, res) => {
    let carrito = await cartManager.getOneBy()
    if( !carrito ) {
        carrito = await cartManager.createCart()
    }; 
    try {
        let { pagina, query, sort } = req.query;
        // Si no se proporciona una página, usar la página 1
        if (!pagina) pagina = 1;
        
        // Obtener los productos paginados
        const { docs: listOfProducts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getAllPaginate(pagina);

        let filteredProducts = listOfProducts;// Aplicar el filtro si se proporciona

        if (query) {
            // Filtrar los productos donde título coincida con el valor de query
            filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
        }

        // Ordenar los productos si se especifica el tipo de ordenamiento
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        }

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('inicio', {
            listOfProducts: filteredProducts, // Usar los productos filtrados y ordenados
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            carrito
        });
    } catch (error) {
        console.error('Error al obtener los productos paginados:', error);
        res.status(500).send('Error interno del servidor');
    }
});

////////////////////////PAGINACION/////////////
router.get('/paginacion', async (req, res) => {
    try {
        let { page, query, sort } = req.query;

        // Obtener los productos paginados
        const { docs: listOfProducts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getAllPaginate(page);

        // Aplicar el filtro si se proporciona
        let filteredProducts = listOfProducts;
        if (query) {
            // Filtrar los productos donde título coincida con el valor de query
            filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
        }

        // Ordenar los productos si se especifica el tipo de ordenamiento
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        }

        // Enviar la respuesta JSON si no se solicita la vista HTML
        if (req.accepts('json')) {
            return res.status(200).json({
                status: "success",
                payload: filteredProducts,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: "En construcción",
                nextLink: "En construcción"
            });
        }

        // Renderizar la vista HTML si no se solicita la respuesta JSON
        res.status(200).render('inicio', {
            listOfProducts: filteredProducts, // Usar los productos filtrados y ordenados
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        });
    
    } catch (error) {
        console.error('Error al obtener los productos paginados:', error);
        res.status(500).send('Error interno del servidor');
    }
});

//VISTA DE SOLO EL CARRITO
 router.get("/carrito/:cid", async (req, res) => {
    let id = req.params.cid
    let products
    try {
        let carrito = await cartManager.getCartById(id)
        console.log(carrito)
        products = carrito.products
        res.setHeader("Content-Type", "text/html")
        res.status(200).render("carrito",{products})
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).res.json({ Error: "Error 500 - Error inesperado en el servidor" })        
    }
    
});


//VISTA PRODUCTOS
router.get('/productos', async(req,res) => {
    let carrito = await cartManager.getOneBy()
    if( !carrito ) {
        carrito = await cartManager.createCart()
    }; 


    let productos;
    try {
        productos=await productManager.getAll()        
    } catch (error) {
        console.log(error);
        res.setHeader( 'Content-Type','application/json' );
        return res.status(500).json(
            {
                error:`Unexpected server error - Try later, or contact your administrator`,
                detalle:`${error.message}`
            }
        )
    };
    res.setHeader('Content-Type','text/html')
    res.status(200).render("productos", {
        productos,
        carrito
    })
});


//VISTA DE REGISTRO
router.get('/register', (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.status(200).render("register")
});
    
//VISTA DE LOGIN PARA EL USUARIO
router.get('/login',(req,res)=>{

    let {error}=req.query

    res.status(200).render('login', {error})
})

//VISTA PERFIL DEL USUARIO
router.get('/profile',auth, (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.status(200).render("profile",{
        usuario: req.session.usuario
    })
});
    