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

The user documentation is available at `/user-docs` it can be accessed from any page by a link in the footer. The documentation covers all of the features of the site and how you can use them.

### 6. GDPR

At GeoGuide, we prioritize user privacy and strictly adhere to the regulations set forth by the General Data Protection Regulation (GDPR). Our commitment to data handling and privacy practices aligns with the stringent requirements of the GDPR, ensuring a transparent, secure, and lawful processing of personal data.

Our measures for GDPR compliance include:

Robust Security Measures: We employ SSL encryption within our systems to safeguard data transmission.

Responsible Data Practices: GeoGuide adheres meticulously to GDPR guidelines, maintaining strict control over data management and storage. Users are empowered with control over their information, and explicit consent is obtained for all data processing activities through the use of cookies.

Transparent Documentation: Our ReST API documentation is compliant with OpenAPI specifications, offering comprehensive insights into data endpoints, authentication requirements, and potential error scenarios. 

Privacy Policy Page: We utilize a dedicated privacy policy page to inform users comprehensively about the data we collect, how we use it, and the purposes behind its collection. This page serves as a vital resource for users, ensuring they are well-informed about their data rights and our commitment to privacy.

Our privacy policy page is designed to be easily accessible, providing clear and understandable information about data practices. We ensure that users have the necessary awareness and understanding of their data's usage and their rights in line with GDPR regulations.

### 7. Server hosting and Docker

On Azure we are using multiple services:

- Virtual Machine
- Container Registry
- Blob Storage

On the VM, we installed Docker standalone with the Docker Compose plugin. We have docker set to run on startup using systemctl with the command `sudo systemctl enable --now docker`. In our docker compose file we have our containers to restart unless stopped, this means they will start when docker starts as well. Because of this all we have to do to put our site live is turn the server on.
The VM has 3 ports open, 80 for HTTP to nginx, 443 for HTTPS to nginx, and 9443 for access to Portainer, our web GUI for managing our Docker instance.

Our container registry requires authentication with username and password to push or pull images from it. This means our docker image for our site is accessible from anywhere as long as we have our credentials.

The blob storage is used to store the images uploaded to our site, it requires authentication to upload or download files from it.

In our deployment on Docker, we have 5 containers running:

- app: uses our docker image built from our NodeJS source code
- mongodb: uses the mongo image to run a database
- nginx: uses the nginx image to run an instance of nginx for reverse proxying requests to the app container
- certbot: uses the certbot image to request SSL certificates
- portainer: uses the portainer image to run a GUI to manage the docker instance

We have a network in Docker to allow the containers to communicate with each other but restrict which containers are accessible via there ports when going to our domain or public IP.

### 8. User authentication

For user authentication we are using [bcrypt](https://www.npmjs.com/package/bcrypt) to hash the passwords and [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to generate the tokens.

When a user registers, the password is hashed and stored in the database. When a user logs in, the password is compared to the hashed password stored in the database. If they match, a token is generated using the user's id and SECRET KEY as the payload with default expiration time of 1 day. and the token is sent as cookie to the user as response body. The token is then used to authenticate the user when they make requests to the API.

### 9. User privileges

We have a user model which has an admin field, this is used to differentiate between normal users and admins. When a user registers, the admin field is set to false by default. When a user logs in, the admin field is checked, if it is true, the user can access all the routes, and if it is false, the user can only access the routes that are not restricted to admins. Admin user can see all users and change the admin status of a normal user to admin and also delete a normal user. Admin user can also see all the POIs in the database. Admin user do all the things that a normal user can do. Normal user can only see their own profile and update it, and also see all the POIs. Normal user can delete their own account.

### 10. Mobile access

To access it from a mobile device, it doesn't require any specific permissions or dependencies. This application works on any mobile device as long as the device has access to a browser and the internet. Additionally, the browser needs to have JavaScript enabled, and the user may enable geolocation so the application can access their current location.

### 11. Responsiveness

Our web application uses a mobile-friendly design approach to the responsive design of the application's UI elements by using a combination of [Bootstrap](https://getbootstrap.com/) and [Cascading Style Sheets](https://www.w3.org/Style/CSS/Overview.en.html) to ensure a seamless user experience across different devices with varying screen sizes. Bootstrap's CSS framework is used to make the navigation bar intelligently collapse into a toggle-based menu on a smaller screens which maintains the usability of our app and does not sacrifice design integrity of the app. Additionally, our app uses Bootstrap's flexible containers & responsive utility classes in order to arrange site content that dynamically adjusts to the device's viewport (width of the viewable screen area).

The navigation bar is assigned the Bootstrap utility class 'navbar-expand-lg' which controls the visibility of the items within the navigation bar based on screen size. This class is used to adapt the appearance and behaviour of the navigation bar depending on either the device or screen size. All of the options in the navbar except for the link to the 'home' page of the website, are contained within a div that has the classes 'collapse navbar-collapse' which work in conjunction to initially hide the toggle button for displaying the rest of the navbar and collapse the navigation bar's content into a 'hamburger' style button that a user can click on to display the nav bar. A button accompanying the collapsible nav bar is given the class 'navbar-toggler', which styles the button according to Bootstrap's default button style for a navigation bar toggler (which appears as a 'hamburger'-styled button), a 'data-toggle' attribute set to 'collapse' which indicates that the button should trigger the collapse behaviour, a 'data-target' attribute that specifies the ID of the element that will be collapsed or expanded, which in this case points to the ID given to the div containing the data items that should be collapsed or expanded. All of this means that with a reduced screen size, clicking the toggler button triggers the expansion or collapse of the navigation bar content.

A search bar on the index page is contained within three parent divs that have different classes assigned to them, which are 'container mt-5', 'row justify-content-center' and 'col-md-6 navbar-custom'. 'container mt-5' is two classes that first define a fixed-width container that centers the content contained within it, while 'mt-5' applies a top margin to the div that is five times Bootstrap's spacing scale, which prevents the div from being shown too close to the navigation bar. The class 'row' defines a a row in Bootstrap's grid system which consists of a 12-column layout and helps to organise and structure the content within the columns, while 'justify-content-center' is Bootstrap's flexbox utility class that, when applied to a 'row' element, centers the columns horizontally within the row. Next, class 'col-md-6' is part of Bootstrap's grid system and specifies that the column should take upto half of the available width on medium and larger screens, while 'navbar-custom' allows for setting specific styles such as colours to that div. The form element containing the search bar has the class 'form-inline ml-auto'; 'form-inline' makes the input box and button appear on the same line, and 'ml-auto' aligns the form elements to the right side of the parent by applying a Bootstrap- defined margin to the left of the parent div. Coming to the input field, the classes 'form-control custom-input-size' applies a consistent style to all form elements so that they adapt well to different screen sizes and devices, while 'custom-input-size' is defined by us to have a width of 250px to prevent the input field becoming too big to be displayed on a mobile device. A width of 10px to the right using 'margin-right' is also defined for the input field to position the 'Search' button a bit further away. The button has the classes 'btn btn-light my-2 my-sm-0' which first creates a Bootstrap-standard styled button, with 'btn-light' setting the background colour of the button to a light shade, 'my-2' adding a margin of 2 units above and below the button on the vertical axis, and 'my-sm-0' that sets no margin to the top and bottom of the button for small-sized screens 'sm'. All of these class enable the visibility of the form even on small screens without impacting user experience.

Similarly, the div containing the map on the index page is housed inside three divs that each perform some styling operations; the outermost div has the class 'container-fluid' which creates a full-width container that spans the entire viewport and ensures that the container will resize itself when the viewport size decreases, the inner div has the class 'row justify-content-center', and the innermost div has the classes 'col-md-8 mr-4'; 'col-md-8' specifies that the div should take up 8 out of 12 columns on medium-sized 'md' and larger screens, and 'mr-4' sets a margin of 4 units to the right of the 8 columns so as to create space between the current column and the next column. Next, the div containing the map has it's own CSS-based styling, with a 'height' of 500px, 'width' of 100% {to take the whole width of the div housing the map}, 'margin-top' of 30px, 'margin-bottom' of 30px, a 'margin-left' of 10px, and a 'border-radius' of 8px to give the map rounded borders. All of these styles combined make the map resize on smaller devices and leave space for the user to scroll up and down the page by using the space to the right of the map.

When a user clicks on the map, a form having the appearance of a card appears on the webpage, which has five container divs housing the actual form that have Bootstrap styling applied to them; the first div has class 'container-fluid', the second div has class 'row justify-content-center', the third div has class 'col-md-4' which takes up 4 out of 12 columns, the fourth div has class 'card' (this contains the 'cardBody' div that actually contains the form) which is a flexible, extensible container that is designed to display various types of content in an appealing and organised way. With 'cardBody', this class is a building block of a card that allows the form to have some padding outside of it. All of this combines to create a form that usually displays right next to the map, but moves to be placed below the map with a small screen size.

When a user attempts to view their POIs, all of the results are shown in a table with class 'table' that is housed in a div having the id 'poi_table', which is then housed inside a parent div having the custom class called 'custom-table-scrolling'; this div is further housed inside another div with class 'container-fluid'. 'custom-table-scrolling' has an attribute called 'overflow-x' that is set to 'auto', which makes the entire table scrollable horizontally inplace when the table's content becomes too large to display on a small screen. Bootstrap applies its' own styling features to this table, which makes table headers appear larger and in bold font, with appropriate widths given to each column of the table's headers in order to fit the retrieved data. These styling features enable both mobile and PC users to view the entire table by only scrolling it horizontally instead of the whole page, which would have shown empty white space above the table.

Finally, the footer that is included on each page has it's own CSS styling to make it responsive on small screen sizes, with the footer being contained inside a parent div that has the class 'container-fluid', following which another div with class 'footer' contains the footer, this class uses a 'display' of 'grid' which makes the contents of the footer display via a grid of rows and columns. These values are decided by the property 'grid-template-columns' which has a 'repeat' block containing 'auto-fit' and a 'minmax' block, which tells the grid to create as many tracks as are needed to fit in the available space, with each column taking up a minimum size of 200 pixels and a maximum size of one fraction of the available space for each track. This ensures that a balance is achieved between flexibility and structure in the grid layout and prevent the footer's content spilling out through the parent div housing the footer.

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
- [x] user documentation will be included on the hosted site
- [x] the site will respect GPDR guidelines
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
