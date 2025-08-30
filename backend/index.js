import express from 'express'
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import db from './config/db.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/formRoutes.js';
import path from 'path';

const port = process.env.PORT || 5000;

const _dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "*",
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(bodyParser.json());

app.use('/api', router);

app.use(express.static(path.join(_dirname, '/frontend/dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
});



app.listen(port, () => {
    db().then(() => {
        console.log(`Server is running on port ${port}`);
    }).catch((err) => {
        console.error('Failed to connect to database:', err);
    });
});
