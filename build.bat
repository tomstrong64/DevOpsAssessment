docker build -t geoguide.azurecr.io/server:latest .
docker stop server
docker rm server
docker start MongoDB
docker run --name server -p 3000:3000 --network geo_guide --env-file ./.env -d geoguide.azurecr.io/server:latest
