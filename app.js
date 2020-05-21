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

        await readProducts(connection);
        //await runInquirer();
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

const readProducts = async (connection) => {

    //convert so that this joins all 3 tables

    console.log("Selecting all rows ---------------")
    
    const [rows, fields] = await connection.query("SELECT * FROM department");
    
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



`)
    let action = await inquirer.prompt(chooseAction);
    switch (action.type) {
        case 'View All Employees':
            console.log('it works!');
            break;
        case 'View All Employees By Department':
            console.log('it works by department!');
            break;
        case 'View All Employees By Manager':
            console.log('it works!');
            break;
        case 'Add Employee':
            console.log('it works!');
            break;
        case 'Remove Employee':
            console.log('it works!');
            break;
        case 'Update Employee Role':
            console.log('it works!');
            break;
        case 'Update Employee Manager':
            console.log('it works!');
            break;
        case 'Exit Program':
            break;
        default:
            console.log('Something went wrong...');
    }
}

const chooseAction = [{
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
        "Exit Program"
    ]
}]



main();