import express from 'express'
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import db from './config/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/formRoutes.js';


const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: "*",
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(bodyParser.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    db().then(() => {
        console.log(`Server is running on port ${port}`);
    }).catch((err) => {
        console.error('Failed to connect to database:', err);
    });
});