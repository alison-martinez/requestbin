# Request Bin Backend

### Install Request Bin
download the code by cloning the repository
```
git clone https://github.com/alison-martinez/requestbin
```

also download the **frontend** by cloning the repository
```
git clone https://github.com/ChelseaSaunders/requestbin_frontend
```

### create and initialize database
Initializing the PSQL database
```
createdb endpoints
psql -d endpoints < schema.sql
```

### set up environment file with database information
to ensure that this connects correctly add the file `.env` to the `requestbin` folder
this file will have the following content:
```
PORT = 4000
MONGODB_URI= "##URI from setting up Mongo database"

PG_DATABASE: endpoints
```

### Starting Request Bin Backend
enter into the respository, download dependancies, and run the applciation
```
cd requestbin
npm install
npm start
```