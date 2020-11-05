const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Gitgudfamlit21!",
  database: "cms_organization"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + `\n`);
    runPrompts();
});


const prompts = [
    {
        // first object to proc
        type: "list",
        name: "initialPrompt",
        message: "What would you like to do?",
        choices: ["View", "Add", "Update", "Exit"]
    },
    {
        // this object only procs if the user chooses "view"
        type: "list",
        name: "viewWhich",
        message: "Which business area would you like to view?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "View"
        }
    },
    {
        // this object only procs if the user chooses "add"
        type: "list",
        name: "addToChoice",
        message: "Which business area would you like to add to?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Add"
        }
    }
];

function runPrompts() {
    inquirer.prompt(prompts).then(answers => {
        if(answers.initialPrompt === "Exit") {
            connection.end();
        }
        else if(answers.initialPrompt === "Update") {
            updateEmployee();
        }
        else if(answers.viewWhich === "Departments") {
            // show all department names
            viewData("departments");
        }
        else if(answers.viewWhich === "Roles") {
            // show role information
            viewData("org_roles")
        }
        else if(answers.viewWhich === "Employees") {
            // show employee information
            viewData("employees")
        }
        else if(answers.addToChoice === "Departments") {
            // need a function that will add to the "departments" table, maybe add new inquirer prompt
            addDepartments();
        }
        else if(answers.addToChoice === "Roles") {
            // need a function that will add to the "roles" table, maybe add new inquirer prompt
            addRoles()
        }
        else if(answers.addToChoice === "Employees") {
            // need a function that will add to the "employees" table
            addEmployees();
        }
    }).catch(error => {
        console.log(error)
    });
};

// catch all function for viewing tables made with help from @daneb91
function viewData(paramVar) {
    return connection.query(`SELECT * FROM ${paramVar}`, function(err, results) {
        if (err) throw err;
        console.table(results);
        runPrompts();
    })
}

// function to add a department to the database
function addDepartments() {
    inquirer
    .prompt(
        {
            type: "input",
            name: "deptInput",
            message: "Enter the name of the Department you would like to add"
        }
    ).then(answers => {
        connection.query("INSERT INTO departments (dept_name) VALUES (?)", answers.deptInput, function(err, results) {
            if (err) throw err;
            console.log(`Added ${answers.deptInput} to the current list of Departments!`)
            // console.log(results)
            runPrompts();
        })
    })
    
};

function addRoles() {

    connection.query("SELECT * FROM departments", function(err, results) {
        if (err) throw err;

        // use map method to pull results and create array within new var; must use name/value pair in objects in order to be displayed properly through inquirer 
        const departmentValues = results.map(element => ({
            name: element.dept_name,
            value: element.id
        }));
        // console.log(departmentValues)

        inquirer
        .prompt([
            {
                type: "input",
                name: "roleInput",
                message: "Enter the title of the Role you would like to add"
            },
            {
                type: "number",
                name: "salaryInput",
                message: "Enter the annual salary of the Role you are adding"
            },
            {
                type: "list",
                name: "departmentChoice",
                message: "Choose which Department the new Role belongs to",
                choices: departmentValues
            }
        ]).then(answers => {
            connection.query("INSERT INTO org_roles (title, salary, department_id) VALUES (?, ?, ?)", [answers.roleInput, answers.salaryInput, answers.departmentChoice], function(err, results) {
                if (err) throw err;
            })
            console.log(`Added ${answers.roleInput} to the list of current Roles, with a salary of $${answers.salaryInput} per year \n`);
            runPrompts();
        });
    })

    
}

function addEmployees() {

    connection.query("SELECT * FROM org_roles", function(err, results) {
        if (err) throw err;

        // use map method to pull results and create array within new var; must use name/value pair in objects in order to be displayed properly through inquirer 
        const roleValues = results.map(element => ({
            name: element.title,
            value: element.id
        }));

        connection.query("SELECT * FROM employees", function(err, employeeResults) {
            if (err) throw err;

            const employeesList = employeeResults.map(employeeElement => ({
                name: employeeElement.first_name + " " + employeeElement.last_name,
                value: employeeElement.id
            }))
        

            inquirer
            .prompt([
                {
                    type: "input",
                    name: "employeeFirstName",
                    message: "Enter the first name of the Employee you would like to add"
                },
                {
                    type: "input",
                    name: "employeeLastName",
                    message: "Enter the last name of the Employee you would like to add"
                },
                {
                    type: "list",
                    name: "employeeRole",
                    message: "Choose which Role to assign this Employee",
                    choices: roleValues
                },
                {
                    type: "list",
                    name: "chooseManager",
                    message: "Choose the Manager of this Employee",
                    choices: employeesList

                }
            ]).then(answers => {
                connection.query("INSERT INTO employees (first_name, last_name, org_role_id, manager_id) VALUES (?, ?, ?, ?)", [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.chooseManager], function(err, results) {
                    if (err) throw err;
                    // console.table(results)
                })
                console.log(`Added ${answers.employeeFirstName} ${answers.employeeLastName} to the current list of Employees \n`)
                runPrompts();
            });

        })

    })
};

// created with guidance from @alligatormonday (Joey Jepson)
function updateEmployee() {
    connection.query("SELECT * FROM employees", function(err, existingEmployeeResults) {
        if (err) throw err;
        const existingEmployees = existingEmployeeResults.map(element => ({
            name: element.first_name + " " + element.last_name,
            value: element.id
        }))

        connection.query("SELECT * FROM org_roles", function(err, roleResults) {
            if (err) throw err;

            const existingRoles = roleResults.map(element2 => ({
                name: element2.title,
                value: element2.id
            }))

            inquirer
            .prompt([
                {
                    type: "list",
                    name: "toBeUpdated",
                    message: "Which employee would you like to make updates to?",
                    choices: existingEmployees
                },
                {
                    type: "list",
                    name: "updateCurrentRole",
                    message: "Choose a new Role for the Employee",
                    choices: existingRoles
                }
            ]).then(answers => {
                connection.query("UPDATE employees SET org_role_id = ? WHERE id = ?", [answers.toBeUpdated, answers.updateCurrentRole], function(err, data) {
                    if (err) throw err;
                    // console.table(data);
                    runPrompts();
                })
            })

        })

    })
};

