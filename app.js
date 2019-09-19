"use strict";
/*
Build all of your functions for displaying and gathering information below (GUI). okmokmokmo
*/

// this line is unnecessary
/* CHANGE HERE**/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(
    "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
    yesNo
  ).toLowerCase();
  let searchResults;
  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      // TODO: search by traits
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt(
    "Found " +
    person.firstName +
    " " +
    person.lastName +
    " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'"
  );

  switch (displayOption) {
    case "info":
      // TODO: get person's info
      return findInfo(person, people);
      break;
    case "family":
      // TODO: get person's family
      let family = findImmediateFamily(person, people);
      console.log(family);
      break;
    case "descendants":
      // TODO: get person's descendants
      return findDescendants(person, people, null);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}


function findInfo(person, people) {
  console.log(person);
  let infoArr = Object.keys(person);
  let infoDisplayArr = [];

  for (let i = 0; i < infoArr.length; i++) {
    let siftProp = infoArr[i];
    let infoDisplay = infoArr[i] + ": " + person[siftProp];
    infoDisplayArr.push(infoDisplay);
  }
  console.log(infoDisplayArr);
  //NEEDS TO FINISH? OR BE FORMATTED TO DIFFERNT PROMPT
}

function findDescendants(person, people) {
  //recursive
  //debugger;
  //filter through all parents for id of person
  let parentId = person.id;

  let foundChildren = [];

  people.forEach(function(el) {
    if (el.parents[0] === parentId || el.parents[1] === parentId) {
      foundChildren.push(el);
    }
  });

  if (foundChildren.length === 0) {
  } else {
    for (let i = 0; i < foundChildren.length; i++) {
      let nextChild = findDescendants(foundChildren[i], people);
      foundChildren.concat(nextChild);
    }
  }
  debugger;
  return foundChildren;

function findImmediateFamily(person, people) {
  let siblings = []

  let parents = people
    .filter(potentialParent => person.parents.indexOf(potentialParent.id) !== -1)
    .map(parent => Object.assign({}, parent, { relation: "parent" }));
  people
    .forEach(potentialSibling => {
      for (let sp = 0; sp < potentialSibling.parents.length; sp += 1) {
        for (let p = 0; p < parents.length; p += 1) {
          if (parents[p].id === potentialSibling.parents[sp] && potentialSibling.id !== person.id) {
            let sibling = Object.assign({}, potentialSibling, { relation: "sibling" });
              siblings.push(sibling);
          }
        }
      }
    });

  let spouse = people
    .filter(potentialSpouse => potentialSpouse.id === person.currentSpouse)
    .map(spouse => Object.assign({}, spouse, { relation: "spouse" }));

  return [].concat(parents, siblings, spouse);

}

function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    } else {
      return false;
    }
  });
  // TODO: find the person using the name they entered
  return foundPerson[0];
}

// alerts a list of people
function displayPeople(people) {
  alert(
    people
      .map(function (person) {
        return person.firstName + " " + person.lastName;
      })
      .join("\n")
  );
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid) {
  let response;
  do {
    response = prompt(question).trim();
  } while (!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input) {
  return true; // default validation only
}
