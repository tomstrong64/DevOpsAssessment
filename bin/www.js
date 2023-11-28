/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {} from 'dotenv/config';

import { createServer } from 'http';
import mongoose from 'mongoose';
import chalk from 'chalk';
import app from '../app.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

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

// Start the server
const server = createServer(app);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    // stop HTTP server
    server.close(() => {
        console.log('Process terminated');
    });

    // close DB connection
    mongoose.connection.close();
});
