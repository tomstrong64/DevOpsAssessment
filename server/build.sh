docker build -t geoguide-server:latest .
docker stop server
docker rm server
docker start MongoDB
docker run --name server -p 3000:3000 -d geoguide-server:latest
