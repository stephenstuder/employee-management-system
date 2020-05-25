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

  let action;
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
          break;
      case "Add Role":
          break;
      case "Add Employee":
        await addEmployee(connection);
        break;
      case "Remove Employee":
        let employeeList = await queryDatabase(connection, viewAllEmployees);
        console.log(employeeList);
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
const viewAllEmployeesByDepartmentQuery = `SELECT department_name, first_name, last_name, title FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id ORDER BY department_name;`;
const viewAllEmployees = `SELECT id, first_name, last_name FROM employee`;
const viewAllRoles = `SELECT * FROM employee_role`;
const viewAllDepartments = `SELECT * FROM department`;

const addDepartment = ``

const addEmployee = async (connection) => {
    await inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter first name of employee: "
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter first name of employee: "
        },
        {
            name: "jobRole",
            type: "rawlist",
            message: "Select a job role id: ",
            choices: ["1", "2", "3"] 
        },
    ])
    .then(async (answer) => {
        console.log(`INSERTING ${answer.firstName, answer.lastName, parseInt(answer.jobRole)} INTO DATABASE \n`);
        const query = await connection.query(`INSERT INTO employee SET ?`,
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.jobRole
        }, (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + "product inserted!\n")
        }
        )
    })
}

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

// const selectEmployee = [
//     {
//       type: "list",
//       name: "type",
//       message: "Employee's in Database",
//       choices: [
//         employeeList
//       ],
//     },
//   ];

main();
