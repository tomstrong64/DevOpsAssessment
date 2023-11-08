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
        },
        apis: ['./routes/*.js'],
    };

    const specs = swaggerJsDoc(options);

    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
};
