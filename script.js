const express = require("express");
const fs = require("fs");
const path = require("path");
const mysql = require('mysql2');
const inquirer = require("inquirer");
const sequelize = require('./config/connection');
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     // MySQL username,
//     user: 'root',
//     // TODO: Add MySQL password here
//     password: 'password1234',
//     database: 'inquirerSQL'
//   },
//   console.log(`Connected to the inquirerSQL database.`)
// );

// turn on connection to db and server
const db = sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

// init express
const app = express();
const PORT = process.env.PORT || 3000;

//middleware for parsing json and urlencoded data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//init express
app.listen(PORT, () => console.log(`The server is listening to port ${PORT}`));