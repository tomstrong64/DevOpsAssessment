import {} from 'dotenv/config';
import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import path from 'path'; // Import the 'path' module

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

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.get('/home', function (req, res) {
    res.render('home');
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// Showing register form
app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    });

    return res.status(200).json(user);
});

//Showing login form
app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', async function (req, res) {
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
                res.render('secret');
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
