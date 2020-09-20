const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

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
        message: "What is your manager's office ID?",
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
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// function userPrompts(questions) {
//     do {
//     return inquirer.prompt(questions).then(function(response) {
        
//         if (questions === managerQuestions ) {
//             employees.push(new Manager(response.managerName, response.managerId, response.managerEmail, response.managerOfficeId));

//         } else if (questions === engineerQuestions) {
//             employees.push(new Engineer(response.name, response.id, response.email, response.github));

//         } else if (questions === internQuestions) {
//             employees.push(new Intern(response.internName, response.internId, response.internEmail, response.internSchool));
//         }
//         nextQuestions(response);
//     })   
// } while (response.nextMember === "" || response.nextMember === "engineer" || response.nextMember === "intern") 
// }

// function nextQuestions(response){
//     if (response.nextMember === "engineer") {
//         userPrompts(engineerQuestions);
//     } else if (response.nextMember === "intern") {
//         userPrompts(internQuestions);
//     } else 
//     console.log(employees);
// }


// async function init() {
//     try {
//         await userPrompts(managerQuestions);
//         await writeFileAsync(outputPath, render(employees));
//     } catch(err) {
//         console.log(err);
//     }
// }

init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!


// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
