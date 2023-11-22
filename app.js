import express from 'express';

import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import HealthRouter from './routes/health.route.js';
import IndexRouter from './routes/index.route.js';

import { initSwagger } from './swagger.js';

const app = express();

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSwagger(app);

app.get('/', IndexRouter);
app.get('/addpoi', IndexRouter);
app.get('/allpois', IndexRouter);
app.get('/allusers', IndexRouter);
app.get('/updatepoi', IndexRouter);
app.get('/updateuser', IndexRouter);
app.get('/register', IndexRouter);
app.get('/login', IndexRouter);
app.get('/privacypolicy', IndexRouter);

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.use('/healthcheck', HealthRouter);

export default app;
