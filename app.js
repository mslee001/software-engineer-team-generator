const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//array to save all the members of the team
const employees = [];

//question set for an engineer team member
const engineerQuestions = [
    {
        type: "input",
        message: "What is the engineer's name?",
        name: "name",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is the engineer's ID?",
        name: "id",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is the engineer's email?",
        name: "email",
        validate: function (email) {
            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            if (valid) {
                return true;
            } else {
                console.log(".  Please enter a valid email")
                return false;
            }
        }
    },
    {
        type: "input",
        message: "What is the engineer's github user?",
        name: "github",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    }    
];

//question set for an intern team member
const internQuestions = [
    {
        type: "input",
        message: "What is the intern's name?",
        name: "internName",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is the intern's ID?",
        name: "internId",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is the intern's email?",
        name: "internEmail",
        validate: function (email) {
            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            if (valid) {
                return true;
            } else {
                console.log(".  Please enter a valid email")
                return false;
            }
        }
    },
    {
        type: "input",
        message: "What school is the intern going to?",
        name: "internSchool",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    }
];

//question set for the manager
const managerQuestions = [
    {
        type: "input",
        message: "What is your manager's name?",
        name: "managerName",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is your manager's ID?",
        name: "managerId",
        validate: function(answer) {
            if (answer !== "") {
                return true;
            }
            return "Please enter at least one character";
        }
    },
    {
        type: "input",
        message: "What is your manager's email?",
        name: "managerEmail",
        validate: function (email) {
            valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
            if (valid) {
                return true;
            } else {
                console.log(".  Please enter a valid email")
                return false;
            }
        }
    },
    {
        type: "input",
        message: "What is your manager's office number?",
        name: "managerOfficeId",
        validate: function (value) {
            var pass = value.match(
              /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
            );
            if (pass) {
              return true;
            }
            return 'Please enter a valid phone number';
          }
    }
];

//initialization function
function init() {
    //function to present the manager questions and save the manager object to the employee array
    function createManager(){
        inquirer.prompt(managerQuestions).then(function(response) {
            employees.push(new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeId));
            createTeam();
        });
    }
    //function to ask if the user wishes to add more team members or if they are done
    function createTeam() {
        inquirer.prompt([
            {
                type: "list",
                message: "Which type of team member would you like to add next?",
                choices: ["Intern", "Engineer", "Done adding team members"],
                name:"nextMember"
            }
        ]).then(userChoice => {
            switch(userChoice.nextMember) {
            case "Engineer":
                addEngineer();
                break;
            case "Intern":
                addIntern();
                break;
            default:
                buildTeam();
            }
        })
    }

    //function to present the engineer questions and save the engineer object to the employees array
    function addEngineer() {
        inquirer.prompt(engineerQuestions).then(function(response) {
            employees.push(new Engineer(response.name, response.id, response.email, response.github));
            createTeam();
        })
    }

    //function to present the intern questions and save the intern object to the employees array
    function addIntern() {
        inquirer.prompt(internQuestions).then(function(response) {
            employees.push(new Intern(response.internName, response.internId, response.internEmail, response.internSchool));
            createTeam();
        })
    }
    
    //function to create the html file
    function buildTeam() {
        fs.writeFileSync(outputPath, render(employees), "utf-8");
    }
    //starts the app off with asking the manager questions first
    createManager();
}

//starts the app
init();
