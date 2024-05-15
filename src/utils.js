import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from "crypto"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
export default __dirname;



import multer from 'multer';
//funcion para admitir imganes  y archivos de texto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)

        // file.
        //pequena validacion
        let tipo=file.mimetype.split("/")[0]
        if(tipo!=="image"){
            return cb(new Error("Solo se admiten imagenes...!"))
        } 

        cb(null, Date.now() +"-"+file.originalname )

    }
})

export const upload = multer({ storage: storage });

const SECRET="CoderCoder123"
export const generaHash=password=>crypto.createHmac("sha256", SECRET).update(password).digest("hex")