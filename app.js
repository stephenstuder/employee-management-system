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

//add for each column

//view for each column

//update for employee role

//update associated manager

//delete departments, roles, and employees

//view totalized budget of the department - ie combined salaries of all employees in the department

const queryDatabase = async (connection, query) => {
  //convert so that this joins all 3 tables

  const [rows, fields] = await connection.query(query);

  console.table(rows);
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

  let action;
  do {
    action = await inquirer.prompt(chooseAction);
    switch (action.type) {
      case "View All Employees":
        await queryDatabase(connection, viewAllEmployeesQuery);
        break;
      case "View All Employees By Department":
        await queryDatabase(connection, viewAllEmployeesByDepartmentQuery);
        console.log("it works by department!");
        break;
      case "View All Employees By Manager":
        await queryDatabase(connection, viewAllEmployeesByManagerQuery);
        console.log("it works!");
        break;
      case "Add Employee":
        console.log("it works!");
        break;
      case "Remove Employee":
        console.log("it works!");
        break;
      case "Update Employee Role":
        console.log("it works!");
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

const viewAllEmployeesQuery = `SELECT first_name, last_name, title, salary, department_name FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id;`;
const viewAllEmployeesByManagerQuery = `SELECT manager_id, first_name, last_name, title, salary, department_name FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id ORDER BY manager_id DESC;`;
const viewAllEmployeesByDepartmentQuery = `SELECT department_name, first_name, last_name, title, salary FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id ORDER BY department_name;`;

const chooseAction = [
  {
    type: "list",
    name: "type",
    message: "Welcome to employee manager, select an action you'd like to take",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "Exit Program",
    ],
  },
];

main();
