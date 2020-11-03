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
        choices: ["View", "Add", "Update", "Delete", "Exit"]
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
    },
    {
        // this object only procs if the user chooses "update"
        type: "list",
        name: "updateChoice",
        message: "Which business area would you like to make updates to?",
        choices: ["Roles", "Managers", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Update"
        }
    },
    {
        type: "list",
        name: "deleteChoice",
        message: "Which business area would you like to make deletions in?",
        choices: ["Departments", "Roles", "Employees", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Delete"
        }
    }
];

function runPrompts() {
    inquirer.prompt(prompts).then(answers => {
        if(answers.initialPrompt === "Exit") {
            connection.end();
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
function viewData(table) {
    return connection.query(`SELECT * FROM ${table}`, function(err, results) {
        if (err) throw err;
        console.table(results);
        runPrompts();
    })
}

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
        }
    ]).then(answers => {
        connection.query("INSERT INTO org_roles (title, salary) VALUES (?, ?)", [answers.roleInput, answers.salaryInput], function(err, results) {
            if (err) throw err;
        })
        console.log(`Added ${answers.roleInput} to the list of current Roles, with a salary of $${answers.salaryInput} per year \n`);
        runPrompts();
    });
}

function addEmployees() {
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
    ]).then(answers => {
        connection.query("INSERT INTO employees (first_name, last_name) VALUES (?, ?)", [answers.employeeFirstName, answers.employeeLastName], function(err, results) {
            if (err) throw err;
            // console.table(results)
        })
        console.log(`Added ${answers.employeeFirstName} ${answers.employeeLastName} to the current list of Employees \n`)
        runPrompts();
    });
}