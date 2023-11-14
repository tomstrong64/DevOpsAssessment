import express from 'express';

import UserRouter from './routes/user.route.js';
import PoiRouter from './routes/poi.route.js';
import HealthRouter from './routes/health.route.js';

import { initSwagger } from './swagger.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSwagger(app);

app.use('/user', UserRouter);

app.use('/pois', PoiRouter);

app.use('/healthcheck', HealthRouter);

export default app;
