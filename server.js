const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "employeeTracker_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to the database.`);
  // start application
  initiate();
});

// function to start the application
function initiate() {
  inquirer
    .prompt ({
      type: "list",
      name: "action",
      message: "Select from the options below to view desired data.",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a role",
        "Add an employee",
        "Add a Manager",
        "Update an employee role",
        "View Employees by Manager",
        "View Employees by Department",
        "Delete Departments | Roles | Employees",
        "View the total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
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
          db.end();
          console.log("Goodbye!");
          break;
      };
    });
};

// function to view all departments
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // restart the application
      initiate();
  });
}

// function to view all roles
function viewAllRoles() {
  const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // restart the application
      initiate();
  });
}

// function to view all employees
function viewAllEmployees() {
  const query = `
  SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN roles r ON e.role_id = r.id
  LEFT JOIN departments d ON r.department_id = d.id
  LEFT JOIN employee m ON e.manager_id = m.id;
  `;
  db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      // restart the application
      initiate();
  });
}



// close the connection when the application exits
process.on("exit", () => {
  db.end();
});