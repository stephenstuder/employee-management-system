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
        
        await readProducts(connection);
        connection.end();
    } catch (err) {
        console.log(err);
    }
};

const readProducts = async (connection) => {
    console.log("Selecting all rows ---------------")
    
    const [rows, fields] = await connection.query("SELECT * FROM employee");
    
    console.log(rows);
};

main();