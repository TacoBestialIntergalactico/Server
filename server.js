import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import multer from 'multer'
import path from 'path'

const app = express()
app.use(express.json());
app.use(cors());


// Agrega esta línea para servir las imágenes estáticas desde la carpeta 'images'
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {        
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    password: "",
    database: 'gearupdb'
})

app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file.filename;
    const productId = req.body.productId; // Obtiene el ID del producto
    const sql = "UPDATE products SET image = ? WHERE id = ?"; // Actualiza el producto correcto
    db.query(sql, [image, productId], (err, result) => {
        if (err) return res.json({ Message: "Error" });
        return res.json({ Status: "Success"});
    })
})

app.get('/', (req, res) =>{
    const sql = 'select * from products'
    db.query(sql, (err, result) => {
        if(err) return res.json("Error");
        return res.json(result);
    })
})

app.listen(3000, () => {
    console.log("Running");
})