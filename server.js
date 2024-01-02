const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      port:3306,
      password: '',
      database: 'employeeTracker_db'
    });

    db.connect((err) =>{
      if (err) throw err;
      console.log(`Connected to the database.`);
      // start application
      initiate();
    });

    