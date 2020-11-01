drop database if exists cms_organization;

create database cms_organization;

use cms_organization;

create table departments (
id int auto_increment not null primary key,
dept_name varchar(30)
);

create table org_roles (
id int auto_increment not null primary key,
title varchar(30),
salary decimal,
department_id int references departments(id)
);

create table employees (
id int auto_increment not null primary key,
first_name varchar(30) not null,
last_name varchar(30) not null,
org_role_id int references org_roles(id),
manager_id int references employees(id)
);

-- select * from employee 
-- left join org_role 
-- on employee.org_role_id = org_role.id 
-- left join department
-- on org_role.department_id = department.id;
