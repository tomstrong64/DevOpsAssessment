import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import IndexRouter from './routes/index.route.js';
import { fileURLToPath } from 'url';
import path from 'path';
const app = express();

const __filename = fileURLToPath(import.meta.url); // Get the filename of the current module
const __dirname = path.dirname(__filename); // Get the directory name

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log(
        'MongoDB connection established successfully',
        chalk.green('✓')
    );
});

mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log(
        'MongoDB connection error. Please make sure MongoDB is running.',
        chalk.red('✗')
    );
    process.exit();
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.get('/', IndexRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
