USE employee_managerDB;

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES ("Jeff", "Turner", 1, 5);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES ("Lisa", "Erricson", 1, 5);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Johnson", 3, 6);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES ("Riley", "Schmidt", 1, 6);

INSERT into employee (first_name, last_name, role_id)
VALUES ("Medlinda", "Rope", 2);

INSERT into employee (first_name, last_name, role_id, manager_id)
VALUES ("James", "Carson", 3, 6);

INSERT into employee (first_name, last_name, role_id)
VALUES ("Tim", "Duncan", 2);


INSERT into employee_role (title, salary, department_id, year_hired)
VALUES ("Software Engineer", 80000, 1, 2020);

INSERT into employee_role (title, salary, department_id, year_hired)
VALUES ("Manager", 85000, 2, 2020);

INSERT into employee_role ( title, salary, department_id, year_hired)
VALUES ("Sales", 60000, 3, 2020);


INSERT into department (department_name)
VALUES ("Engineering");

INSERT into department (department_name)
VALUES ("Management");

INSERT into department (department_name)
VALUES ("Sales");

SELECT first_name, last_name, title, salary, department_name FROM employee, employee_role, department WHERE employee.role_id = employee_role.role_id AND employee_role.department_id = department.department_id;
