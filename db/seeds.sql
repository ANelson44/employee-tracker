INSERT INTO departments (department_name)
VALUES 
('Upper Management'),
('Instrument and Control'),
('Human Resources'),
('Radiation Protection'),
('Engineering'),
('Information Technology'),
('Operations'),
('Construction'),
('Chemistry'),
('Maintenance');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Chief Nuclear Officer', 525000.00, 1),
('I&C Manager', 150000.00, 2),
('HR Director', 130000.00, 3),
('Radiation Protection Manager', 165000.00, 4),
('Director of Engineering', 175000.00, 5),
('IT Manager', 145000.00, 6),
('Operations Manager', 175000.00, 7),
('Construction Manager ', 165000.00, 8),
('Chemistry Manager', 150000.00, 9),
('Maintenance Manager', 155000.00, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Shane', 'Lies', 1, 1),
('Grahm', 'Stembridge', 2, 2),
('Ben', 'VonKoenig', 3, 3),
('Brian', 'Rogers', 4, 4),
('Eric', 'Shirley', 5, 5),
('Alex', 'Nelson', 6, 6),
('Nick', 'Breault', 7, 7),
('Tom', 'Crandall', 8, 8),
('Kyle', 'Gerard', 9, 9),
('Jimi', 'Williams', 10, 10);