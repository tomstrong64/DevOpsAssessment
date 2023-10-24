import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';

const app = express();

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

app.get('/', (req, res, next) => {
    res.render("index");
});

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
