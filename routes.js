// Server (NodeJS) //npm install express // npm install body-parser// npm install mysql
const express = require('express'); //Node framework creates server routes//getAPI
const bodyParser = require('body-parser'); //Help getting data from request's body
const mysql = require('mysql'); //SQL-module crate connectin to database

const connection = mysql.createPool({
  host: 'protepto.com', // Your connection adress (localhost)
  user: 'micro', //Your database's username.
  password: 'M1cr0n', // Your database's password.
  database: 'mot_rn_webradio', // Your database's name.
});

// Starting our app.
const app = express();

// Creating a GET route that returns data from the 'stations' table.
app.get('/stations', function(req, res) {
  // Connecting to the database.
  connection.getConnection(function(err, connection) {
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query('SELECT * FROM stations', function(
      error,
      results,
      fields,
    ) {
      // If some error occurs, we throw an error.
      if (error) {
        throw error;
      }

      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results);
    });
  });
});

// Starting our server.
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/stations so you can see the data.');
});

// command node routes.js
