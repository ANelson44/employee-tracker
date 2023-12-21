const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Bailey2023#',
      database: 'employeeTracker_db'
    },
    console.log(`Connected to the database.`)
  );