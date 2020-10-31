drop database if exists cms_organization;

create database cms_organization;

use cms_organization;

create table department (
id int auto_increment not null primary key,
dept_name varchar(30)
);

create table org_role (
id int auto_increment not null primary key,
title varchar(30),
salary decimal,
department_id int references department(id)
);

create table employee (
id int auto_increment not null primary key,
first_name varchar(30) not null,
last_name varchar(30) not null,
org_role_id int references org_role(id),
manager_id int references employee(id)
);

-- test values
insert into employee (first_name, last_name, org_role_id, manager_id) values ("Andrew", "Moses", 1, 1);

-- select * from employee 
-- left join org_role 
-- on employee.org_role_id = org_role.id 
-- left join department
-- on org_role.department_id = department.id;
