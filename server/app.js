import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import UserRouter from './routes/user.route';
import PoiRouter from './routes/poi.route';

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

app.use('*', async (req, res, next) => {
    global.user = false;
    if (req.session.userID && !global.user) {
        const user = await User.findById(req.session.userID);
        global.user = user;
    }
    next();
});
const authMiddleware = async (req, res, next) => {
    const user = await User.findById(req.session.userID);
    if (!user) {
        return res.redirect('/');
    }
    next();
};

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
