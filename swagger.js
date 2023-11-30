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
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

export const initSwagger = (app) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'GeoGuide',
                version: '1.0.0',
                description: 'GeoGuide API',
            },

            servers: [
                {
                    url: 'https://coordinated-chaos.uksouth.cloudapp.azure.com',
                },
                {
                    url: 'http://localhost:3000',
                },
            ],

            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            
        },
        apis: ['./routes/*.js'],
    };

    const specs = swaggerJsDoc(options);

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
};
