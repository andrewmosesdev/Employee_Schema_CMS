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
    console.log("Connected as id " + connection.threadId);
    runPrompt();
});

const prompts = [
    // first object to proc
    {
        type: "list",
        name: "initialPrompt",
        message: "What would you like to do?",
        choices: ["View", "Add", "Update", "Exit"]
    },
    {
        // this object only procs if the user chooses "view"
        type: "list",
        name: "viewWhich",
        message: "What would you like to view?",
        choices: ["Departments", "Roles", "Managers", "Exit"],
        when: answers => {
            return answers.initialPrompt === "View"
        }
    },
    {
        // this object only procs if the user chooses "add"
        type: "list",
        name: "addToChoice",
        message: "Which business area would you like to add to?",
        choices: ["Departments", "Roles", "Managers", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Add"
        }
    },
    {
        // this object only procs if the user chooses "update"
        type: "list",
        name: "updateChoice",
        message: "Which business area would you like to make updates to?",
        choices: ["Departments", "Roles", "Managers", "Exit"],
        when: answers => {
            return answers.initialPrompt === "Update"
        }
    }
];

async function runPrompt() {
    await inquirer.prompt(prompts).then(answers => {
        if(answers.initialPrompt === "Exit") {
            connection.end();
        }
        else if(answers.viewWhich === "Departments") {
            // show department information
            console.table("Department information appears here")
        }
        else if(answers.viewWhich === "Roles") {
            // show role information
            console.table("Role information appears here")
        }
        else if(answers.viewWhich === "Managers") {
            // show manager information
            console.table("Manager information appears here")
        }
        else if(answers.addToChoice === "Departments") {
            // need a function that will add to the "departments" table, maybe add new inquirer prompt
        }
        else if(answers.addToChoice === "Roles") {
            // need a function that will add to the "roles" table, maybe add new inquirer prompt
        }
        else if(answers.addToChoice === "Managers") {
            // need a function that will add to the "managers" table, maybe add new inquirer prompt here
        }

        console.log("Successful test.")
    }).catch(error => {
        console.log(error)
    });
};

