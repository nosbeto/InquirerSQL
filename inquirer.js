const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

// IMPORTS
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
        loop: false,
        pageSize: 9,
        choices: [
          "Update Employee Managers",
          "View Employee managers",
          "View Employees by Department",
          "Delete Department",
          "Delete Roles",
          "Delete Employee",
          "View Total Utilized Budget of Department",
          "EXIT"
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
        case "Delete Roles":
          deleteRole();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "View Total Utilized Budget of Department":
          viewTotalBudgetDepart();
          break;
        default:
          bye();
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

//it fixes the async issue
const getAllEmployeesFunc = () => {
  return db.promise().query(getAllEmployees);
};

//gets all the departments in the department table
const getAllDepartment = `SELECT * FROM department;`;

//it fixes the async issue
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

const getAllDepartmentSHOW = () => {
  db.query(getAllDepartment, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`
    
    Department's Table
    `);
    console.table(res);
    baseq();
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
        const deleteDepartmentTemp = `DELETE FROM department WHERE id = ${data.departmentOptions}`;
        db.promise().query(deleteDepartmentTemp);

        console.log(`
        
        Department was removed!!
        `);
        getAllDepartmentSHOW();
      });
  });
};

//gets the title from the role table
const getAllRoles = `SELECT * FROM role`;

// ?
const getAllRolesFunc = () => {
  return db.promise().query(getAllRoles);
};

const getAllRolesSHOW = () => {
  db.query(getAllRoles, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`
    
    Role's Table
    `);
    console.table(res);
    baseq();
  });
};

// Function that relates to the deleteRole Case
const deleteRole = () => {
  getAllRolesFunc().then(([res]) => {
    const employeeChoice = res.map(({ id, title }) => ({
      name: `${title}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: `Which Role would you want to delete?`,
          name: "roleOptions",
          choices: employeeChoice,
        },
      ])
      .then((data) => {
        const deleteRoleTemp = `DELETE FROM role WHERE id = ${data.roleOptions}`;
        db.promise().query(deleteRoleTemp);
        console.log(employeeChoice);
        console.log(`
            
            Role was removed!!
            `);
        getAllRolesSHOW();
      });
  });
};

const getAllEmployeesSHOW = () => {
  db.query(getAllEmployees, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`
      
      Employee's Table
      `);
    console.table(res);
    baseq();
  });
};

// Function that relates to the deleteRole Case
const deleteEmployee = () => {
  getAllEmployeesFunc().then(([res]) => {
    const employeeChoice = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          message: `Which employee would you want to delete?`,
          name: "employeeOptions",
          choices: employeeChoice,
        },
      ])
      .then((data) => {
        const deleteEmployeeTemp = `DELETE FROM employee WHERE id = ${data.employeeOptions}`;
        db.promise().query(deleteEmployeeTemp);
        console.log(`
              
              employee was removed!!
              `);
        getAllEmployeesSHOW();
      });
  });
};

const budgetByDepartQ = `
  SELECT department.name AS "Department Name", SUM(salary) AS "Department's Budget" 
  FROM department 
  INNER JOIN role ON department.id = role.department_id 
  GROUP BY department.name ORDER BY SUM(salary) ASC;
  `;

const viewTotalBudgetDepart = () => {
  db.query(budgetByDepartQ, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(`
      
      Total Utilized Budget of Department
      `);
    console.table(res);
    baseq();
  });
};

const bye = () => {
    console.log('Thanks for using Inquirer SQL interface')
    process.exit()
}

baseq();
