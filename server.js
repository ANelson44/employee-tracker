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

function initiate() {
  inquirer
  .createPromptModule({
    type: 'list',
    name: 'action',
    message: 'Choose where to begin.',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a role',
      'Add an employee',
      'Add a Manager',
      'Update an employee role',
      'View Employees by Manager',
      'View Employees by Department',
      'Delete Departments | Roles | Employees',
      'View the total utilized budget of a department',
      'Exit',
    ],
  })
  .then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case "View all roles":
        viewAllRoles();
        break;
    case "View all employees":
        viewAllEmployees();
        break;
    case "Add a department":
        addDepartment();
        break;
    case "Add a role":
        addRole();
        break;
    case "Add an employee":
        addEmployee();
        break;
    case "Add a Manager":
        addManager();
        break;
    case "Update an employee role":
        updateEmployeeRole();
        break;
    case "View Employees by Manager":
        viewEmployeesByManager();
        break;
    case "View Employees by Department":
        viewEmployeesByDepartment();
        break;
    case "Delete Departments | Roles | Employees":
        deleteDepartmentsRolesEmployees();
        break;
    case "View the total utilized budget of a department":
        viewTotalUtilizedBudgetOfDepartment();
        break;
    case "Exit":
        connection.end();
        console.log("Goodbye!");
        break;
      }
});
}
  