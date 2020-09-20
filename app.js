const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];
const engineerQuestions = [
    {
        type: "input",
        message: "What is the engineer's name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is the engineer's ID?",
        name: "id"
    },
    {
        type: "input",
        message: "What is the engineer's email?",
        name: "email"
    },
    {
        type: "input",
        message: "What is the engineer's github user?",
        name: "github"
    }    
];
const internQuestions = [
    {
        type: "input",
        message: "What is the intern's name?",
        name: "internName"
    },
    {
        type: "input",
        message: "What is the intern's ID?",
        name: "internId"
    },
    {
        type: "input",
        message: "What is the intern's email?",
        name: "internEmail"
    },
    {
        type: "input",
        message: "What school is the intern going to?",
        name: "internSchool"
    }
];
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
        name: "managerId"
    },
    {
        type: "input",
        message: "What is your manager's email?",
        name: "managerEmail"
    },
    {
        type: "input",
        message: "What is your manager's office number?",
        name: "managerOfficeId"
    }
];

function init() {
    function createManager(){
        inquirer.prompt(managerQuestions).then(function(response) {
            employees.push(new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeId));
            createTeam();
        });
    }
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

    function addEngineer() {
        inquirer.prompt(engineerQuestions).then(function(response) {
            employees.push(new Engineer(response.name, response.id, response.email, response.github));
            createTeam();
        })
    }

    function addIntern() {
        inquirer.prompt(internQuestions).then(function(response) {
            employees.push(new Intern(response.internName, response.internId, response.internEmail, response.internSchool));
            createTeam();
        })
    }
    
    function buildTeam() {
        fs.writeFileSync(outputPath, render(employees), "utf-8");
    }
    createManager();
}

init();
