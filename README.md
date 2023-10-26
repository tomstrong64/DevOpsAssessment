# API Routes

## /pois

- GET 
    - If not authenticated send a 401 error
    - If normal user, send their POIs
    - If admin, send all POIs

    - If search param is present, return POIs matching the search query

- POST
    - If not authenticated send a 401 error
    - If user is authenticated, add POI to the database

- PUT
    - If not authenticated send a 401 error
    - If user is not the owner of the POI send a 403 error
    - If user is the owner, update the POI

- DELETE
    - If not authenticated send a 401 error
    - If admin, delete the POI
    - If user is not the owner of the POI send a 403 error
    - If user is the owner, delete the POI

## /users

- GET
    - If admin, get all users
    - Else send 401


## /users/me

- GET
    - If authenticated return users details
    - Else send a 401


## /users/logout

- PUT
    - If authenticated, delete user session
    - Else send 401


## /users/login

- POST
    - If credentials correct, login
    - Else 403

## /users/register

- POST
    - If authenticated, send 400
    - Create user and login
