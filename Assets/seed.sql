drop database if exists cms_organization;

create database cms_organization;

use cms_organization;

create table department (
id int primary key,
dept_name varchar(30)
);

create table org_role (
id int primary key,
title varchar(30),
salary decimal,
department_id int
);

create table employee (
id int primary key,
first_name varchar(30),
last_name varchar(30),
org_role_id int,
manager_id int
);

insert into department values (1, "Engineering");

insert into org_role values (1, "Software Engineer", 75000.00, 1);

insert into employee values (1, "Andrew", "Moses", 1, 1);

