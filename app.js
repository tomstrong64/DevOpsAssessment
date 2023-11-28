import express from 'express';

import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import HealthRouter from './routes/health.route.js';
import IndexRouter from './routes/index.route.js';

import { initSwagger } from './swagger.js';
import cookieParser from 'cookie-parser';

const app = express();

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSwagger(app);

app.use(IndexRouter);

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.use('/healthcheck', HealthRouter);

export default app;
