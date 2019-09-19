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
      return findInfo(person);
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

function findInfo(person) {
  let infoArr = Object.keys(person);
  let infoDisplayArr = [];

  for (let i = 0; i < infoArr.length; i++) {
    if (infoArr[i] === "firstName") {
      infoDisplayArr.push("Name: " + person.firstName + " " + person.lastName);
      i++;
    } else {
      let siftProp = infoArr[i];
      if (person[siftProp] === null || person[siftProp].length === 0) {
        i++;
      } else {
        let infoDisplay = infoArr[i] + ": " + person[siftProp];
        infoDisplayArr.push(infoDisplay);
      }
    }
  }
  //AGE
  let age = generateAgeFromDOB(person.dob);
  person["age"] = age;
  infoDisplayArr.push(`age: ${person.age}`);

  return alert(infoDisplayArr.join(", "));
}

function findDescendants(person, people, nextChildren) {
  let childFound = false;
  let parentId = person.id;
  let foundChildren = [];
  people.forEach(function(el) {
    if (el.parents[0] === parentId || el.parents[1] === parentId) {
      foundChildren.push(el);
      childFound = true;
    }
  });

  if (childFound === false) {
    return false;
  } else {
    let ChildrenOfChildren = [];
    for (let i = 0; i < foundChildren.length; i++) {
      let nextChild = findDescendants(foundChildren[i], people);
      if (nextChild === false) {
      } else {
        ChildrenOfChildren.concat(nextChild);
      }
    }
    foundChildren.concat(ChildrenOfChildren);
  }
  return foundChildren;
}

function findImmediateFamily(person, people) {
  let siblings = [];

  let parents = people
    .filter(
      potentialParent => person.parents.indexOf(potentialParent.id) !== -1
    )
    .map(parent => Object.assign({}, parent, { relation: "parent" }));
  people.forEach(potentialSibling => {
    for (let sp = 0; sp < potentialSibling.parents.length; sp += 1) {
      for (let p = 0; p < parents.length; p += 1) {
        if (
          parents[p].id === potentialSibling.parents[sp] &&
          potentialSibling.id !== person.id
        ) {
          let sibling = Object.assign({}, potentialSibling, {
            relation: "sibling"
          });
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
  let firstName = capitalizeFirstLetter(
    promptFor("What is the person's first name?", chars)
  );
  let lastName = capitalizeFirstLetter(
    promptFor("What is the person's last name?", chars)
  );

  let foundPerson = people.filter(function(person) {
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
      .map(function(person) {
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

function generateAgeFromDOB(dob) {
  let today = new Date();
  let birthDate = new Date(dob);
  console.log(birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  let month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
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

function capitalizeFirstLetter(string) {
  let letters = string.split("");
  letters[0] = letters[0].toUpperCase();
  let newWord = letters.join("");
  return newWord;
}
