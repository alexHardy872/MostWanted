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
      searchResults = searchByTraitsMenue(people, people);
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
      findInfo(person, people);
      mainMenu(person, people);
      break;
    case "family":
      // TODO: get person's family
      let family = findImmediateFamily(person, people);
      if (family === false) {
        alert("No immediate family (parents, siblings or spouse) found for " + person.firstName + " " + person.lastName + " \n Try searching for their 'descendants' to find children.");
        mainMenu(person, people);

      } else {

        displayPeople(family);
        mainMenu(person, people);
      }
      break;
    case "descendants":
      // TODO: get person's descendants
      let Descendants = findDescendants(person, people);
      if (Descendants.length === 0) {
        alert(person.firstName + " " + person.lastName + " has no known descendants ")
        mainMenu(person, people);
      } else {
        displayPeople(Descendants);
        mainMenu(person, people);
      }
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      alert(displayOption + " is not a valid option, please try again");
      return mainMenu(person, people); // ask again
  }
}

function findInfo(person, people) {
  let infoArr = Object.keys(person);
  let infoDisplayArr = [];

  for (let i = 0; i < infoArr.length; i++) {
    if (infoArr[i] === "firstName") {
      infoDisplayArr.push("Name: " + person.firstName + " " + person.lastName);
      i++;
    } else if (
      infoArr[i] === "currentSpouse" &&
      person.currentSpouse !== null
    ) {
      //SPOUSE

      let spouseName = getCurrentSpouseById(person, people);
      infoDisplayArr.push("Spouse: " + spouseName);
    } else if (infoArr[i] === "parents" && person.parents.length !== 0) {
      //PARENT NAMES

      let parents = getParentsById(person, people);
      let parentsNames = [];

      for (let p = 0; p < parents.length; p++) {
        parentsNames.push(parents[p].firstName + " " + parents[p].lastName);
      }
      infoDisplayArr.push("Parents: " + parentsNames.join(" & "));
    } else {
      let siftProp = infoArr[i];
      if (person[siftProp] === null || person[siftProp].length === 0) {
      } else {
        let infoDisplay = infoArr[i] + ": " + person[siftProp];
        infoDisplayArr.push(infoDisplay);
      }
    }
  }
  //AGE
  let age = generateAgeFromDOB(person.dob);
  person["age"] = age;
  infoDisplayArr.push(`age: ${person.age} `);

  return alert(infoDisplayArr.join("\n"));
}

function getCurrentSpouseById(person, people) {
  let spouseId = person.currentSpouse;

  let currentSpouse = people.filter(
    potentialSpouse => potentialSpouse.id === spouseId
  );

  return currentSpouse[0].firstName + " " + currentSpouse[0].lastName;
}

function getParentsById(person, people) {
  return people
    .filter(
      potentialParent => person.parents.indexOf(potentialParent.id) !== -1
    )
    .map(parent => Object.assign({}, parent, { relation: "parent" }));
}

function findDescendants(searchPerson, people) {
  return people
    .map(person => {
      if (
        person.parents[0] === searchPerson.id ||
        person.parents[1] === searchPerson.id
      ) {
        return [].concat(findDescendants(person, people), person);
      }
    })
    .filter(person => person !== undefined)
    .flat();
}

function findImmediateFamily(person, people) {
  let siblings = [];
  let addedAlready = false;

  let parents = people
    .filter(
      potentialParent => person.parents.indexOf(potentialParent.id) !== -1
    )
    .map(parent => Object.assign({}, parent, { relation: "parent" }));

  people.forEach(potentialSibling => {
    addedAlready = false;
    for (let sp = 0; sp < potentialSibling.parents.length; sp += 1) {
      for (let p = 0; p < parents.length; p += 1) {
        if (
          parents[p].id === potentialSibling.parents[sp] &&
          potentialSibling.id !== person.id &&
          addedAlready === false
        ) {
          let sibling = Object.assign({}, potentialSibling, {
            relation: "sibling"
          });
          siblings.push(sibling);
          addedAlready = true;
        }
      }
    }
  });

  let spouse = people
    .filter(potentialSpouse => potentialSpouse.id === person.currentSpouse)
    .map(spouse => Object.assign({}, spouse, { relation: "spouse" }));

  let familyTotal = [].concat(parents, siblings, spouse);

  if (familyTotal.length === 0) {

    return false;
  } else {
    return familyTotal;
  }
}

function searchByName(people) {
  let firstName = capitalizeFirstLetter(
    promptFor("What is the person's first name?", chars)
  );
  let lastName = capitalizeFirstLetter(
    promptFor("What is the person's last name?", chars)
  );

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

function searchByTraitsMenue(people, AllPeople) {
  let displayOption;
  if (people.length < 22) {
    displayOption = promptFor(
      `Please select another criteria to refine your search \nType id number, first name, last name,\ngender, dob, height, weight, eye color, or occupation.\n\nIf you know the name of the person you want to search type restart`,
      chars
    );
  } else {
    displayOption = promptFor(
      `Please select a criteria to search \nType id number, first name, last name,\ngender, dob, height, weight, eye color, or occupation.\n\nIf you know the name of the person you want to search type restart`,

      chars
    );
  }
  let searchKey;

  switch (displayOption) {
    case "id number":
    case "id":
      searchKey = parseInt(promptFor("Enter the ID number you want to search for", numsID));
      findTrait("id", searchKey, people, AllPeople);
      break;
    case "first name":
    case "firstName":
      searchKey = promptFor(
        "Enter the first name you want to search for",
        chars
      );
      searchKey = capitalizeFirstLetter(searchKey);
      findTrait("firstName", searchKey, people, AllPeople);
      break;
    case "last name":
    case "lastName":
      searchKey = promptFor(
        "Enter the last name you want to search for",
        chars
      );
      searchKey = capitalizeFirstLetter(searchKey);
      findTrait("lastName", searchKey, people, AllPeople);
      break;
    case "gender":
      searchKey = promptFor("Enter the gender you want to search for", chars);
      findTrait("gender", searchKey, people, AllPeople);
      break;
    case "dob":
    case "birthday":
    case "age": //switch with age maybe?
      searchKey = promptFor(
        "Enter the date of birth you want to search for",
        chars
      );
      findTrait("dob", searchKey, people, AllPeople);
      break;
    case "height":
      debugger;
      searchKey = parseInt(promptFor("Enter the height you want to search for", nums));
      findTrait("height", searchKey, people, AllPeople);
      break;
    case "weight":
      searchKey = parseInt(promptFor("Enter the weight you want to search for", nums));
      findTrait("weight", searchKey, people, AllPeople);
      break;
    case "eye color":
    case "eyeColor":
      searchKey = promptFor(
        "Enter the eye color you want to search for",
        chars
      );
      findTrait("eyeColor", searchKey, people, AllPeople);
      break;
    case "occupation":
      searchKey = promptFor(
        "Enter the occupation you want to search for",
        chars
      );
      findTrait("occupation", searchKey, people, AllPeople);
      break;

    case "restart":
      app(AllPeople);
      break;
    case "quit":
      return; // stop execution
    default:
      alert(
        `The trait you entered ${displayOption} does not match any criteria in our database`
      );
      return searchByTraitsMenue(people, AllPeople); // ask again
  }
}


function findTrait(key, value, people, AllPeople) {
  let newPeople = people.filter(person => person[key] === value);

  if (newPeople.length === 0) {
    alert(
      `No one in our data base has a ${key} value of ${value} Please search another criteria`
    );
    searchByTraitsMenue(people);
  }
  displayPeople(newPeople);
  searchByTraitsMenue(newPeople, AllPeople);
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

function generateAgeFromDOB(dob) {
  let today = new Date();
  let birthDate = new Date(dob);
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

// helper function to validate numbers
function numsID(input) {
  input = parseInt(input);
  let isNum = Number.isInteger(input);
  let numlength = input.toString().length;

  if (isNum === false || numlength !== 9) {
    return alert("not a valid number (valid IDs are 9 digits) ")
  } else {
    return true;
  }
}

function nums(input) {
  input = parseInt(input);
  let isNum = Number.isInteger(input);
  let numlength = input.toString().length;

  if (isNum === false || numlength > 3) {
    return alert("not a valid number for search")
  } else {
    return true;
  }
}



function capitalizeFirstLetter(string) {
  let letters = string.split("");
  letters[0] = letters[0].toUpperCase();
  let newWord = letters.join("");
  return newWord;
}
