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
