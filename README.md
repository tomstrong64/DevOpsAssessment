# GeoGuide

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## How to run locally

System Requirements:

- [Docker](https://www.docker.com/products/docker-desktop/)

First of all, create a local MongoDB instance. This can be done in Docker with the following command:

`docker run --name MongoDB -p 27017:27017 -d mongo:latest`

Then rename the `.env.template` file to `.env`. The example values will allow the application if you have set up your database as shown above, however, the file upload will not work without a valid Azure connection string.

Once you have done this, the project includes build scripts for Windows (`build.bat`) and Linux (`build.sh`).

Running this file will build the Docker image, remove any existing containers, ensure the database is running, and then run the new image. The app will then be available at [http://localhost:3000](http://localhost:3000).

This works without needing to install NodeJS or the project
dependencies as the docker image uses the Node image and
installs the dependencies within it.

## How to test

System Requirements:

- [NodeJS v20](https://nodejs.org/en)

To install the dependencies needed to run the application and test it outside of Docker, run `npm install`.

Then you can run `npm test` to run the unit tests. You will see the results in the terminal.

## How to deploy

See the guide on how to deploy [here](https://github.com/TomStrong/DevOpsAssessment/tree/main/deploy/README.md).

## Feature Implementation

### 1. Secured with SSL

To secure our site will SSL, we upgrade the connection to HTTPS using nginx proxy. Our nginx instance is running on Docker as part of a stack deployment. Nginx has two ports open 80 (for HTTP) and 443 (for HTTPS), when a HTTP request comes in to the server, nginx will redirect the request to our app that uses HTTP.

![nginx config](/docs/nginx-config.png)

The /.well-known/acme-challenge/ endpoint is used by certbot. Firstly certbot creates a token and stores it in the mentioned directory. Then certbot makes a request for a SSL certificate from the Let's Encrypt Certificate Authority. The Certificate Authority then makes a request to the server for the token file specified by certbot to verify the identity of the server. If the challenge passes, the Certificate Authority will issue a certificate for the domain. A reference to the expected certificate route is added to the nginx config file.

For certificate renewal, we have a command in the [docker compose](#compose-image) to make certbot renew the certificate and for nginx to reload to get the new certificate.

### 2. ReST API Documentation (OpenAPI)

OpenAPI, formerly known as Swagger, is a specification for building APIs (Application Programming Interfaces). For this project, the comments with @openapi annotations are using the OpenAPI Specification to document the RESTful API for both Points of Interest (POI) and user management, which provide details about the available endpoints, expected request and response formats, authentication requirements, and potential error scenarios, making it easier for developers to understand and use the API. The URL for generated documentation is [https://coordinated-chaos.uksouth.cloudapp.azure.com/api-docs/](https://coordinated-chaos.uksouth.cloudapp.azure.com/api-docs/)

### 3. Database

For the database, we chose to use MongoDB as it is a NoSQL database it is very flexible making it easy to add new features when they require new fields in the data.

The database is hosted within docker, in our local testing environments we have the port open so that it can easily be accessed from a GUI like [Studio 3t](https://studio3t.com/). This helps with debugging.

On the live deployment, it does not have its ports open, it is accessed by the app through a private network within Docker. (See the [compose file](#compose-image) for more details)

To interact with the database in NodeJS we are using the [mongoose](https://www.npmjs.com/package/mongoose) npm package which is a wrapper for the official NodeJS MongoDB driver, making it easy to declare schemas and work with the data in the collections.

### 4. Internationalisation

We have implemented internationalisation using the [i18n](https://www.npmjs.com/package/i18n) npm package. The languages used are English as default, Portuguese, French, Spanish, German and Turkish.

"I18n.js" is used to configure i18n where is defined the default language, the languages supported and a cookie which is going to be used to store the value of the user language option. In the page there is a button which allows the user to change the language. When the user clicks on the button, it will change the value of the cookie, by linking to /lang/en ,for example, and reload the page. 
When the page is reloaded, it will be retrieved the value of the cookie, 
which is setted by the route and change the language accordingly, then redirects the user back to index page.

Inside "locales" folder is stored the json files with the key
strings and values of the translation that are used to translate
the ejs pages. Each ejs page has String keys that will retrieve
the values related to each key.
For example, in the index.ejs file, the following string key is used to retrieve the value for the "Home" attribute: "i18n.__("Home") ".
This key is defined in the en.json file, which contains the English translation for the "Home" string. If the user's preferred language is Portuguese, the  i18n.__ function will retrieve the value for the "Home" string from the pt.json file, which contains the Portuguese translation for the "title" string.

### 5. Documentation

THIS IS THE DOCUMENTATION

### 6. GDPR

### 7. Server hosting and Docker

#### Azure Server

#### Docker

![compose.yml](/docs/compose.png)

### 8. User authentication

For user authentication we are using [bcrypt](https://www.npmjs.com/package/bcrypt) to hash the passwords and [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate the tokens.

When a user registers, the password is hashed and stored in the database. When a user logs in, the password is compared to the hashed password stored in the database. If they match, a token is generated using the user's id and SECRET KEY as the payload with default expiration time of 1 day. and the token is sent as cookie to the user as response body. The token is then used to authenticate the user when they make requests to the API.

### 9. User privileges

We have a user model which has an admin field, this is used to differentiate between normal users and admins. When a user registers, the admin field is set to false by default. When a user logs in, the admin field is checked, if it is true, the user can access all the routes, and if it is false, the user can only access the routes that are not restricted to admins. Admin user can see all users and change the admin status of a normal user to admin and also delete a normal user. Admin user can also see all the POIs in the database. Admin user do all the things that a normal user can do. Normal user can only see their own profile and update it, and also see all the POIs. Normal user can delete their own account.

### 10. Mobile access

### 11. Responsiveness

### 12. Geolocation

The geolocation is implemented using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API). When a user accesses the web application, they are prompted to share their location with the app. If the user chooses to share their location, the Geolocation API retrieves data from the device's GPS hardware, providing accurate latitude and longitude coordinates. These coordinates are then used to display the user's current location on the map. The map is configured using [Leaflet](https://leafletjs.com/), a popular open-source JavaScript library for interactive maps.

If the user opts not to share their location, the map defaults to a predetermined location. In this case, the map remains static, and if the user interacts with it by moving the point on the map, the coordinates will not be updated since geolocation data is not available.

For users who grant permission to use their location, a "Revoke Geolocation" button is displayed. Clicking this button allows users to revoke the application's access to their location, effectively stopping the user's location marker from updating on the map. The Geolocation API provides a mechanism for users to control their privacy preferences, either by allowing or revoking access to their geographical information.

### 13. Client authentication

For client authentication we are using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate the tokens.

When a client login or register, a token is generated and is sent in the authentication header as bearer token. And the browser will store the token in the local storage. When a client logout, the token will be removed from the local storage. When a client wants to access the API, the token will be sent in the header of the request. Also for each page the authentication is checked, if the cookie is not valid, the client will be redirected to the login page.

## Requirements

### Server

- [x] the application will be secured with https using correct certificates
- [x] ReST api's will be documented using openAPI (swagger)
- [x] all dynamic data will be stored in a database
- [x] the application will support internationalisation i18n
- [ ] user documentation will be included on the hosted site
- [ ] the site will respect GPDR guidelines
- [x] the backend server will be hosted in the cloud and use container technology (docker)
- [x] user authentication will authenticate access to upload to the app
- [x] the app will support user and administrator roles and the signing up of new users

### Client

- [x] it shall be possible to use the application from a mobile device
- [ ] the web site will render on a mobile and desktop screen (responsive)
- [x] the mobile client will include code to upload geolocation provided by the device
- [x] The remote client must authenticate itself and use the ReST api to communicate with the hosted server.

## Contributors

- Tom Strong [TomStrong](https://github.com/TomStrong)
- Shiv Thakkar [5thaks07](https://github.com/5thaks07)
- Faizen Ahmed [FaizanAhmedSP707](https://github.com/FaizanAhmedSP707)
- Ali Dashti [ali1373107](https://github.com/ali1373107)
- Joao Potes [Joao-Potes](https://github.com/Joao-Potes)
