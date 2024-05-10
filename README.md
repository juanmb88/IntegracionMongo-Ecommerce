

## dentro de una carpeta vacia       

git clone https://github.com/juanmb88/IntegracionMongo-Ecommerce.git     
## para iniciar    
npm init -y para crear package json  

paquetes node para funcionar instalados: npm i express express-handlebars mongoose    

carpeta src app.js     
instalamos nodemon    
importamos express y creamos app    
app.listen(3000) para el localhost    

en package reemplazamos script por "start": "nodemon src/app.js "  
en consola vamos con npm start como comando para darle inicio al programa con nodemon 


DEPENDENCIAS:    

    "express": "^4.19.2",  
    "express-handlebars": "^7.1.2",  
    "mongoose": "^8.3.2",  
    "mongoose-paginate-v2": "^1.8.0",  
    "multer": "^1.4.5-lts.1",  
    "socket.io": "^4.7.5",  
    "uuid": "^9.0.1"   
