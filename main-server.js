const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Gitgudfamlit21!",
  database: "cms_organization"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    runPrompt();
});

const prompts = [
    {
        type: "list",
        name: "initialPrompt",
        message: "What would you like to do?",
        choices: ["View", "Add", "Update", "Exit"]
    },
    {
        type: "list",
        name: "viewWhich",
        message: "What would you like to view?",
        choices: ["Departments", "Roles", "Managers"],
        when: answers => {
            return answers.initialPrompt === "View"
        }
        

    },
];

async function runPrompt() {
    await inquirer.prompt(prompts).then(answers => {
        if(answers.initialPrompt === "Exit") {
            connection.end();
        }
        console.log("Successful test.")
    }).catch(error => {
        console.log(error)
    });
};

