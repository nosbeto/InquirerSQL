USE inquirerSQL;

INSERT INTO department (name)
VALUES  ('Sales'),
        ('Engineering'),
        ('CloudOps'),
        ('Delivery'),
        ('Pre-Sales');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Manager',150000,1),
        ('Delivery Manager',300000,4),
        ('Senior Engineer',200000,2),
        ('Engineer',120000,2),
        ('CloudOps Specialist',85000,3),
        ('Implementation Consultant',135000,4),
        ('S-Implementation Consultant',165000,4),
        ('Pre-Sales Consultant',125000,5),
        ('C-Suite',300000,1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Everyone's",'Boss',9,1),
        ('John','Smith',1,1),
        ('Andres','Freitas',3,1),
        ('Beto','De Armas',2,3);


