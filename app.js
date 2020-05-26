const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

const main = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password",
      database: "employee_managerDB",
    });
    console.log(`Connected to database with id ${connection.threadId}`);
    //All the inquirier code goes here

    await runInquirer(connection);
    connection.end();
  } catch (err) {
    console.log(err);
  }
};

const queryDatabase = async (connection, query) => {
  //convert so that this joins all 3 tables

  const [rows, fields] = await connection.query(query);

  return rows;
};

//inquirer function that allows functionality to be visualized
const runInquirer = async (connection) => {
  console.log(`
    .########.##.....##.########..##........#######..##....##.########.########....##.....##....###....##....##....###.....######...########.########.
    .##.......###...###.##.....##.##.......##.....##..##..##..##.......##..........###...###...##.##...###...##...##.##...##....##..##.......##.....##
    .##.......####.####.##.....##.##.......##.....##...####...##.......##..........####.####..##...##..####..##..##...##..##........##.......##.....##
    .######...##.###.##.########..##.......##.....##....##....######...######......##.###.##.##.....##.##.##.##.##.....##.##...####.######...########.
    .##.......##.....##.##........##.......##.....##....##....##.......##..........##.....##.#########.##..####.#########.##....##..##.......##...##..
    .##.......##.....##.##........##.......##.....##....##....##.......##..........##.....##.##.....##.##...###.##.....##.##....##..##.......##....##.
    .########.##.....##.##........########..#######.....##....########.########....##.....##.##.....##.##....##.##.....##..######...########.##.....##
    
    
    
    `);

  let action, employeeList, employeeArray, roleList, roleArray;
  do {
    action = await inquirer.prompt(chooseAction);
    switch (action.type) {
      case "View All Employees":
        console.table(await queryDatabase(connection, viewAllEmployeesQuery));
        break;
      case "View All Employees By Department":
        console.table(await queryDatabase(connection, viewAllEmployeesByDepartmentQuery));
        console.log("it works by department!");
        break;
      case "View All Employees By Manager":
        console.table(await queryDatabase(connection, viewAllEmployeesByManagerQuery));
        console.log("it works!");
        break;
      case "View Departments":
        console.table(await queryDatabase(connection, viewAllDepartments));
        break;
      case "View Roles":
        console.table(await queryDatabase(connection, viewAllRoles));
        break;
      case "Add Department":
        await addDepartment(connection);
        break;
      case "Add Role":
        await addRole(connection);
        break;
      case "Add Employee":
        await addEmployee(connection);
        break;
      case "Remove Employee":
        employeeList = await queryDatabase(connection, employeeListQuery);
        employeeArray = buildArrayEmployee(employeeList);
        await removeEmployee(connection, employeeArray);
        break;
      case "Update Employee Role":
        employeeList = await queryDatabase(connection, employeeListQuery);
        employeeArray = buildArrayEmployee(employeeList);
        roleList = await queryDatabase(connection, roleListQuery);
        console.log(roleList)
        roleArray = buildArrayRole(roleList);
        console.log(employeeArray, roleArray);
        break;
      case "Update Employee Manager":
        console.log("it works!");
        break;
      case "Exit Program":
        break;
      default:
        console.log("Something went wrong...");
    }
    console.log(action.type);
  } while (action.type !== "Exit Program");
};

const buildArrayEmployee = (sqlReturn) => {
  let array = [];
  for (let i = 0; i < sqlReturn.length; i++) {
    array.push(sqlReturn[i].Employee);
  }
  return array;
};
const buildArrayRole = (sqlReturn) => {
  let array = [];
  for (let i = 0; i < sqlReturn.length; i++) {
    array.push(sqlReturn[i].Title);
  }
  return array;
};
//Queries for viewing information
const employeeListQuery = `SELECT CONCAT(first_name, ' ', last_name) as Employee FROM employee;`;
const roleListQuery = `SELECT title FROM employee_role;`;
const viewAllEmployeesQuery = `SELECT first_name, last_name, title, salary, department_name FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id;`;
const viewAllEmployeesByManagerQuery = `SELECT manager_id, first_name, last_name, title, salary, department_name FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id ORDER BY manager_id DESC;`;
const viewAllEmployeesByDepartmentQuery = `SELECT department_name, first_name, last_name, title FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id ORDER BY department_name;`;
const viewAllEmployees = `SELECT id, first_name, last_name FROM employee`;
const viewAllRoles = `SELECT * FROM employee_role`;
const viewAllDepartments = `SELECT * FROM department`;

const addDepartment = async (connection) => {
  await inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter the name of new department: ",
      },
    ])
    .then(async (answer) => {
      console.log(`INSERTING ${answer.departmentName} INTO DATABASE`);
      const query = await connection.query(
        `INSERT INTO department SET ?`,
        {
          department_name: answer.departmentName,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} inserted!`);
        }
      );
    });
};
const removeEmployee = async (connection, employeeList) => {
  await inquirer
    .prompt([
      {
        name: "removedEmployee",
        type: "rawlist",
        message: "Which employee do you wish to remove?",
        choices: employeeList
      },
    ])
    .then(async (answer) => {
      console.log(`REMOVING ${answer.removedEmployee} FROM DATABASE`);
      const query = await connection.query(
        `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${answer.removedEmployee}'`,
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} deleted!`);
        }
      );
    });
};

const addRole = async (connection) => {
  await inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Enter name of the role: ",
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the salary of the role (numbers only): ",
      },
      {
        name: "departmentId",
        type: "rawlist",
        message: "Select a department id: ",
        choices: ["1", "2", "3", "4"],
      },
      {
        name: "yearHired",
        type: "input",
        message: "Enter the year hired (numbers only):",
      },
    ])
    .then(async (answer) => {
      console.log(`INSERTING ${(answer.title, answer.salary, answer.departmentId, answer.yearHired)} INTO DATABASE \n`);
      const query = await connection.query(
        `INSERT INTO employee_role SET ?`,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
          year_hired: answer.yearHired,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} inserted!\n`);
        }
      );
    });
};
const addEmployee = async (connection) => {
  await inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter first name of employee: ",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter first name of employee: ",
      },
      {
        name: "jobRole",
        type: "rawlist",
        message: "Select a job role id: ",
        choices: ["1", "2", "3"],
      },
    ])
    .then(async (answer) => {
      console.log(`INSERTING ${(answer.firstName, answer.lastName, parseInt(answer.jobRole))} INTO DATABASE \n`);
      const query = await connection.query(
        `INSERT INTO employee SET ?`,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.jobRole,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} inserted!\n`);
        }
      );
    });
};

const chooseAction = [
  {
    type: "list",
    name: "type",
    message: "Welcome to employee manager, select an action you'd like to take",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "View Departments",
      "View Roles",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "Exit Program",
    ],
  },
];

main();
