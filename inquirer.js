const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const cTable = require("console.table");
const { listenerCount } = require("process");
const Sequelize = require("sequelize");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,
    // TODO: Add MySQL password here
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`
    Connected to the inquirerSQL database!
    `)
);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  }
);

const startBanner = `
+-+ +-+ +-+ +-+ +-+ +-+ +-+ +-+   +-+ +-+ +-+
|I| |N| |Q| |U| |I| |R| |E| |R|   |S| |Q| |L|
+-+ +-+ +-+ +-+ +-+ +-+ +-+ +-+   +-+ +-+ +-+
`;
console.log(startBanner);

const baseq = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: `What would you like to do?`,
        name: "userOptions",
        choices: [
          "Update Employee Managers",
          "View Employee managers",
          "View Employees by Department",
          "Delete Department",
          "Delete Roles",
          "Delete Employee",
          "View Total Utilized Budget of Department",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
      switch (answers.userOptions) {
        case "Update Employee Managers":
          updateEmployeeManager();
          break;
        case "View Employee managers":
          viewEmployeeManagers();
          break;
        case "View Employees by Department":
          viewEmployeesByDepartment();
          break;
        case "Delete Department":
          deleteDepartment();
          break;
      }
    });
};

const viewEmployeeManagers = () => {
  const viewEmpManQ = `
                        SELECT e.first_name, e.last_name, title, CONCAT(m.first_name, ', ', m.last_name) AS 'Manager' 
                        FROM employee AS e 
                        INNER JOIN employee AS m ON m.id = e.manager_id 
                        INNER JOIN role ON role.id = e.role_id;
                        `;
  db.query(viewEmpManQ, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`

Managers Table
`);
    console.table(res);
    baseq();
  });
};

const viewDepartmentName = `
SELECT first_name, last_name, name AS department_name
FROM employee 
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id;
`;

//gets all employees from the employee table
const getAllEmployees = ` SELECT * FROM EMPLOYEE; `;

//Why is this necessary? Avoid errors?
const getAllEmployeesFunc = () => {
  return db.promise().query(getAllEmployees);
};

//gets all the departments in the department table
const getAllDepartment = `SELECT * FROM department;`;

//Why is this necessary? Avoid errors?
const getAllDepartmentFunc = () => {
  return db.promise().query(getAllDepartment);
};

const viewEmployeesByDepartment = () => {
  db.query(viewDepartmentName, (err, res) => {
    if (err) {
      throw err;
    }
    console.log("\n");
    console.table(res);
    baseq();
  });
};

const updateEmployeeManager = () => {
  getAllEmployeesFunc().then(([res]) => {
    const employeeChoice = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: `Which employee you want to udpate?`,
          name: "employeeOptions",
          choices: employeeChoice,
        },
        {
          type: "list",
          message: `Which Manager you want the employee to have?`,
          name: "managerOptions",
          choices: employeeChoice,
        },
      ])
      .then((data) => {
        const updateManager = `UPDATE employee SET manager_id = ${data.managerOptions} WHERE id = ${data.employeeOptions}`;
        db.promise().query(updateManager);
        console.log(`
        
        Manager has been updated!            
        `);
        viewEmployeeManagers();
      });
  });
};

const deleteDepartment = () => {
  getAllDepartmentFunc().then(([res]) => {
    const employeeChoice = res.map(({ id, name }) => ({
      name: `${name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: `Which Department would you want to delete?`,
          name: "departmentOptions",
          choices: employeeChoice,
        },
      ])
      .then((data) => {
        const deleteDepartment = `SELECT id WHERE name = ${data.departmentOptions}`;
        db.promise().query(deleteDepartment);
        getAllDepartment();
      });
  });
};

baseq();
