# Deployment Guide

## How to deploy on your own server

Firstly to create your docker image, run the `build.sh` or `build.bat` file on your local system. Then run `docker push {image name}` to push the image to docker hub or your respective registry.

Install docker on your server, following the instructions [here](https://docs.docker.com/engine/install/) for your respective OS. Ensure docker compose is installed in this process.

Copy the contents of the deploy folder onto your server and fill out the `app.env` and `mongo.env` template files.

`MONGODB_URI` should be your database connection string.

`JWT_SECRET` should be a secret encryption string for your JWT tokens.

`AZURE_STORAGE_CONNECTION_STRING` should be the connections string for your Azure Blob instance.

`MONGO_INITDB_ROOT_PASSWORD` should be the password for your database.

`MONGO_INITDB_ROOT_USERNAME` should be the username for your database.

If you have built your own docker image with a name different to what is in the files, make sure to update this in the `compose.yml`.

Using the script `init-letsencrypt.sh` from this GitHub repo [https://github.com/wmnnd/nginx-certbot](https://github.com/wmnnd/nginx-certbot) you can get the first SSL certificate from Let's Encrypt. You will have to replace the domain and your email in the script with yours, also you may need to change instances of "docker-compose" with "docker compose". This is because docker compose has been changed to be more consistent with the rest of the docker cli commands.

After you have gotten the first SSL certificate, you can run `docker compose up -d` to deploy the application. Any time you make an update to the docker image, run `./update.sh`.

Your deployment should now be accessible via your domain.

## Auto Deploy from GitHub

The deployment happens automatically when code is merged into the main branch.

The GitHub CI/CD deployment pipeline runs as follows:

- The code is checked out
- It logs into our private Azure container registry
- It builds the docker image
- It pushes the docker image to the container registry
- It SSH's onto the deployment server as the "deploy" user
- It runs the update script
