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

// function to add a department
function addDepartment() {
  inquirer
      .prompt({
          type: "input",
          name: "name",
          message: "Enter the name of the new department:",
      })
      .then((answer) => {
          console.log(answer.name);
          const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
          db.query(query, (err, res) => {
              if (err) throw err;
              console.log(`Added department ${answer.name} to the database!`);
              // restart the application
              initiate();
              console.log(answer.name);
          });
      });
}

// function to add a role
function addRole() {
  const query = "SELECT * FROM departments";
  db.query(query, (err, res) => {
      if (err) throw err;
      inquirer
          .prompt([
              {
                  type: "input",
                  name: "title",
                  message: "Enter the title of the new role:",
              },
              {
                  type: "input",
                  name: "salary",
                  message: "Enter the salary of the new role:",
              },
              {
                  type: "list",
                  name: "department",
                  message: "Select the department for the new role:",
                  choices: res.map(
                      (department) => department.department_name
                  ),
              },
          ])
          .then((answers) => {
              const department = res.find(
                  (department) => department.name === answers.department
              );
              const query = "INSERT INTO roles SET ?";
              db.query(
                  query,
                  {
                      title: answers.title,
                      salary: answers.salary,
                      department_id: department,
                  },
                  (err, res) => {
                      if (err) throw err;
                      console.log(
                          `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                      );
                      // restart the application
                      initiate();
                  }
              );
          });
  });
}

// Function to add an employee
function addEmployee() {
  // Retrieve list of roles from the database
  db.query("SELECT id, title FROM roles", (error, results) => {
      if (error) {
          console.error(error);
          return;
      }

      const roles = results.map(({ id, title }) => ({
          name: title,
          value: id,
      }));

      // Retrieve list of employees from the database to use as managers
      db.query(
          'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
          (error, results) => {
              if (error) {
                  console.error(error);
                  return;
              }

              const managers = results.map(({ id, name }) => ({
                  name,
                  value: id,
              }));

              // Prompt the user for employee information
              inquirer
                  .prompt([
                      {
                          type: "input",
                          name: "firstName",
                          message: "Enter the employee's first name:",
                      },
                      {
                          type: "input",
                          name: "lastName",
                          message: "Enter the employee's last name:",
                      },
                      {
                          type: "list",
                          name: "roleId",
                          message: "Select the employee role:",
                          choices: roles,
                      },
                      {
                          type: "list",
                          name: "managerId",
                          message: "Select the employee manager:",
                          choices: [
                              { name: "None", value: null },
                              ...managers,
                          ],
                      },
                  ])
                  .then((answers) => {
                      // Insert the employee into the database
                      const sql =
                          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                      const values = [
                          answers.firstName,
                          answers.lastName,
                          answers.roleId,
                          answers.managerId,
                      ];
                      db.query(sql, values, (error) => {
                          if (error) {
                              console.error(error);
                              return;
                          }

                          console.log("Employee added successfully");
                          initiate();
                      });
                  })
                  .catch((error) => {
                      console.error(error);
                  });
          }
      );
  });
}

  // Function to add a Manager
  function addManager() {
    const queryDepartments = "SELECT * FROM departments";
    const queryEmployees = "SELECT * FROM employee";
  
    db.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        db.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Select the department:",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to add a manager to:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Select the employee's manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name === answers.department
                    );
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.manager
                    );
                    const query =
                        "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                        db.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`
                            );
                            // restart the application
                            initiate();
                        }
                    );
                });
        });
    });
  }

// close the connection when the application exits
process.on("exit", () => {
  db.end();
});