import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';

import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import HealthRouter from './routes/health.route.js';

const app = express();

const { MONGODB_URI } = process.env;

if(process.env.NODE_ENV === 'test') {
    mongoose.connect('mongodb://admin:admin@localhost:27017/admin',{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
} else {
    mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
}

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.use('/healthcheck', HealthRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

export default app;
