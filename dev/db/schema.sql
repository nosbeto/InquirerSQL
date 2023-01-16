DROP DATABASE IF EXISTS inquirerSQL;
CREATE DATABASE inquirerSQL;

USE inquirerSQL;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT, 
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
        REFERENCES department (id)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
        REFERENCES role (id)
        ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES employee (id)
        ON DELETE SET NULL
);