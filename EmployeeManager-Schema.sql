DROP DATABASE IF EXISTS employee_managerDB;
CREATE database employee_managerDB;

USE employee_managerDB;

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT,

  PRIMARY KEY (id)
);

CREATE TABLE employee_role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL NULL,
  department_id INT NOT NULL,
  year INT NULL,

  PRIMARY KEY (id)
);

CREATE TABLE department (
  department_name VARCHAR(30) NULL,
  
  PRIMARY KEY (id)
);

SELECT * FROM employee;
SELECT * from employee_role;
SELECT * from department;