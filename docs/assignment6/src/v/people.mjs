/**
 * @fileOverview  View code of UI for managing Person data
 * @author Gerd Wagner (modified by Mina Lee)
 * @copyright Copyright 2013-2021 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/***************************************************************
 Import classes, datatypes and utility procedures
 ***************************************************************/
import Person from "../m/Person.mjs";
import {createChoiceWidget, fillSelectWithOptions} from "../../lib/util.mjs";
import {displaySegmentFields, undisplayAllSegmentFields} from "./app.mjs";
import Actor from "../m/Actor.mjs";
import Director from "../m/Director.mjs";

/***************************************************************
 Load data
 ***************************************************************/

Person.retrieveAll();
// Actor.retrieveAll();
// Director.retrieveAll();


/***************************************************************
 Set up general, use-case-independent UI elements
 ***************************************************************/
// set up back-to-menu buttons for all use cases
for (const btn of document.querySelectorAll("button.back-to-menu")) {
    btn.addEventListener('click', refreshManageDataUI);
}
// neutralize the submit event for all use cases
for (const frm of document.querySelectorAll("section > form")) {
    frm.addEventListener("submit", function (e) {
        e.preventDefault();
        frm.reset();
    });
}
// save data when leaving the page
window.addEventListener("beforeunload", function () {
    Person.saveAll();
    // save all subtypes for persisting changes of supertype attributes
    for (const Subtype of Person.subtypes) {
        Subtype.saveAll();
    }
});

/**********************************************
 * Use case Retrieve/List All people
 **********************************************/
document.getElementById("RetrieveAndListAll")
    .addEventListener("click", function () {
        const tableBodyEl = document.querySelector("section#Person-R > table > tbody");
        // reset view table (drop its previous contents)
        tableBodyEl.innerHTML = "";
        // populate view table
        for (const key of Object.keys(Person.instances)) {
            const person = Person.instances[key];
            const row = tableBodyEl.insertRow();
            const roles = [];

            // const rolesEL = createListFromMap( person.category, "name");

            // for (const c of person.category) {
            //     roles.push(person.category);
            // }
            row.insertCell().textContent = person.personId;
            row.insertCell().textContent = person.name;
            for (const Subtype of Person.subtypes) {
                if (person.personId in Subtype.instances) roles.push( Subtype.name);
            }
            row.insertCell().textContent = roles.toString();
            // if (roles && roles.includes(PersonTypeEL.labels[PersonTypeEL.ACTOR-1])) {
            //     row.insertCell().textContent = person.agent;
            //     // for (const c of person.category) {
            //     //         roles.push(person.category);
            //     //     }
            // }
            // if (person.category) {
            //     row.insertCell().textContent = PersonTypeEL.toString(person.category);
            // }
            // row.insertCell().textContent = roles.toString();
            // row.insertCell().textContent = PersonTypeEL.enumLitNames[person.category];
            // row.insertCell().textContent = PersonTypeEL.toString(person.category);
            // row.insertCell().appendChild( rolesEL);
        }
        document.getElementById("Person-M").style.display = "none";
        document.getElementById("Person-R").style.display = "block";
    });

/**********************************************
 * Use case Create Person
 **********************************************/
const createFormEl = document.querySelector("section#Person-C > form");
// const selectCategoryEl = createFormEl.querySelector("fieldset[data-bind='selectRoles']");
//----- set up event handler for menu item "Create" -----------
document.getElementById("Create").addEventListener("click", function () {
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-C").style.display = "block";
    // undisplayAllSegmentFields( createFormEl, PersonTypeEL.labels);
    createFormEl.reset();
});
// set up event handlers for responsive constraint validation
createFormEl.personId.addEventListener("input", function () {
    createFormEl.personId.setCustomValidity(
        Person.checkPersonIdAsId( createFormEl.personId.value).message);
});
createFormEl.name.addEventListener("input", function () {
    createFormEl.name.setCustomValidity(
        Person.checkName( createFormEl.name.value).message);
});
// createFormEl.agent.addEventListener("input", function () {
//     createFormEl.agent.setCustomValidity(
//         Actor.checkAgent( createFormEl.agent.value).message);
// });
// // set up a multiple selection list for selecting roles
// fillSelectWithOptions( selectCategoryEl, PersonTypeEL.labels);
// // set up the person category selection list
// fillSelectWithOptions( selectCategoryEl, PersonTypeEL.labels);

// set up the person category checkbox
// const categoryFieldsetEl = createFormEl.querySelector("fieldset[data-bind='selectRoles']");
// createChoiceWidget( selectCategoryEl, "selectRoles", [],
//     "checkbox", PersonTypeEL.labels);
// console.log("JSON.parse( selectCategoryEl.getAttribute(\"data-value\")): " + selectCategoryEl.getAttribute("data-value"));
// selectCategoryEl.addEventListener("change", function() {
//     const c = selectCategoryEl.getAttribute("data-value");
//     if (c && c.includes(PersonTypeEL.ACTOR)) {
//         console.log("ACTOR");
//         document.getElementById("agent").style.display = "block";
//     } else {
//         document.getElementById("agent").style.display = "none";
//     }
// });

// const checkBoxCategory = document.querySelectorAll("input[type=checkbox][name=selectRoles]");
// let enabledCheckbox = [];
// checkBoxCategory.forEach(function(ch) {
//     ch.addEventListener("change", function() {
//         enabledCheckbox = Array.from(checkBoxCategory).filter(i => i.checked).map(i => i.value);
//         // console.log("enabledCheckbox: " + enabledCheckbox + "/type: " +typeof  enabledCheckbox);
//         if (enabledCheckbox && enabledCheckbox.includes(PersonTypeEL.ACTOR.toString())) {
//             // console.log("ACTOR");
//             for (let e of document.getElementsByName("agentEl")) {
//                 e.style.display = "block";
//             }
//             // document.getElementByName("agentEl").style.display = "block";
//         } else {
//             for (let e of document.getElementsByName("agentEl")) {
//                 e.style.display = "none";
//             }
//             // document.getElementByName("agentEl").style.display = "none";
//         }
//     })
// });
// checkBoxCategory.addEventListener("change", function() {
//     const c = selectCategoryEl.getAttribute("data-value");
//     console.log("c: " + c + "/type: " + typeof c);
//     if (this.checked) {
//         console.log("CHECKED");
//         if (c && c.includes(PersonTypeEL.ACTOR)) {
//             console.log("ACTOR");
//             document.getElementById("agent").style.display = "block";
//         } else {
//             document.getElementById("agent").style.display = "none";
//         }
//     }
// });

// handle Save button click events
createFormEl["commit"].addEventListener("click", function () {
    // const selectedRolesOptions = createFormEl.selectRoles.selectedOptions;
    // const category = JSON.parse( selectCategoryEl.getAttribute("data-value"))
    const slots = {
        personId: createFormEl.personId.value,
        name: createFormEl.name.value,
        // category: []
    };
    // console.log("category: " + category);
    // if (category) {
    //     slots.category = category
    //     if (category.includes(PersonTypeEL.ACTOR)) {
    //         console.log("ACTOR AGENT");
    //         console.log("createFormEl.agent.value: " + createFormEl.agent.value);
    //
    //         if (createFormEl.agent.value) {
    //             console.log("agent VALUE");
    //             slots.agent = createFormEl.agent.value;
    //             console.log("slots.agent: " + slots.agent);
    //             createFormEl.agent.setCustomValidity(
    //                 Actor.checkAgent( createFormEl.agent.value).message);
    //         }
    //
    //     }
    // }

    // console.log("selectedRolesOptions: " + selectedRolesOptions);
    // // construct the list of selected genres
    // for (const c of selectedRolesOptions) {
    //     slots.category.push( parseInt( c.value)+1);
    // }

    // check all input fields and show error messages
    createFormEl.personId.setCustomValidity(
        Person.checkPersonIdAsId( slots.personId).message);
    createFormEl.name.setCustomValidity(
        Person.checkName( slots.name).message);

    // save the input data only if all form fields are valid
    if (createFormEl.checkValidity()) {
        Person.add( slots);
        //     console.log("slots.category: " + slots.category);
        //     if (slots.category) {
        //         for (const c of slots.category) {
        //             switch (c) {
        //                 case PersonTypeEL.DIRECTOR:
        //                     console.log("PersonTypeEL.DIRECTOR");
        //                     Director.add( slots);
        //                     break;
        //                 case PersonTypeEL.ACTOR:
        //                     console.log("PersonTypeEL.ACTOR");
        //                     Actor.add( slots);
        //                     break;
        //             }
        //         }
        //     }
    }
});

/**********************************************
 * Use case Update Person
 **********************************************/
const updateFormEl = document.querySelector("section#Person-U > form");
const updSelPersonEl = updateFormEl.selectPerson;
// const upSelCategoryEl = updateFormEl.querySelector("fieldset[data-bind='selectRoles']");;
//----- set up event handler for menu item "Update" ----------
document.getElementById("Update").addEventListener("click", function () {
    // reset selection list (drop its previous contents)
    updSelPersonEl.innerHTML = "";
    // populate the selection list
    fillSelectWithOptions( updSelPersonEl, Person.instances,
        "personId", {displayProp:"name"});

    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-U").style.display = "block";
    updateFormEl.reset();
});
//----- handle person selection events -------------------
updSelPersonEl.addEventListener("change", function () {
    const persId = updateFormEl.selectPerson.value;
    if (persId) {
        const pers = Person.instances[persId];
        // const categoryStr = [pers.constructor.name];
        // const category = [];

        updateFormEl.personId.value = pers.personId;
        updateFormEl.name.value = pers.name;
        // console.log("pers.category: "  +pers.category);
        // console.log("pers: " + pers + "/type: " + typeof pers);
        // console.log("pers.constructor: " + pers.constructor);
        // createChoiceWidget( upSelCategoryEl, "selectRoles", pers.category,
        //     "checkbox", PersonTypeEL.labels);
        // console.log("pers.constructor.name: " + categoryStr
        //  + "/type : " + typeof categoryStr);
        // console.log("PersonTypeEL.labels[PersonTypeEL.ACTOR-1]: " + PersonTypeEL.labels[PersonTypeEL.ACTOR-1]
        //  + "/type: " + typeof PersonTypeEL.labels[PersonTypeEL.ACTOR-1]);

        // if (categoryStr == PersonTypeEL.labels[PersonTypeEL.DIRECTOR-1]) {
        //     console.log("DIRECTOR");
        //     category.push(PersonTypeEL.DIRECTOR);
        //
        // } else if (categoryStr == PersonTypeEL.labels[PersonTypeEL.ACTOR-1]) {
        //     console.log("ACTOR");
        //     category.push(PersonTypeEL.ACTOR);
        //
        // }
        // console.log("category: " + category);

    } else {
        updateFormEl.reset();
    }
});
//----- handle Save button click events -------------------
updateFormEl["commit"].addEventListener("click", function () {
    const slots = {
        personId: updateFormEl.personId.value,
        name: updateFormEl.name.value
    }
    // check all property constraints
    /* SIMPLIFIED CODE: no before-save validation of name */
    // save the input data only if all of the form fields are valid
    if (updSelPersonEl.checkValidity()) {
        Person.update( slots);
        // update the author selection list's option element
        updSelPersonEl.options[updSelPersonEl.selectedIndex].text = slots.name;
    }
});

/**********************************************
 * Use case Delete Person
 **********************************************/
const deleteFormEl = document.querySelector("section#Person-D > form");
const delSelPersonEl = deleteFormEl.selectPerson;
//----- set up event handler for menu item "Delete" -----------
document.getElementById("Delete").addEventListener("click", function () {
    // reset selection list (drop its previous contents)
    delSelPersonEl.innerHTML = "";
    // populate the selection list
    fillSelectWithOptions( delSelPersonEl, Person.instances,
        "personId", {displayProp:"name"});
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-D").style.display = "block";
    deleteFormEl.reset();
});
//----- set up event handler for Delete button -------------------------
deleteFormEl["commit"].addEventListener("click", function () {
    const personIdRef = delSelPersonEl.value;
    if (!personIdRef) return;
    if (confirm("Do you really want to delete this person?")) {
        Person.destroy( personIdRef);
        delSelPersonEl.remove( delSelPersonEl.selectedIndex);
    }
});

/**********************************************
 * Refresh the Manage People Data UI
 **********************************************/
function refreshManageDataUI() {
// show the manage person UI and hide the other UIs
    document.getElementById("Person-M").style.display = "block";
    document.getElementById("Person-R").style.display = "none";
    document.getElementById("Person-C").style.display = "none";
    document.getElementById("Person-U").style.display = "none";
    document.getElementById("Person-D").style.display = "none";
}

/**
 * event handler for person category selection events
 * used both in create and update
 */
// function handleCategorySelectChangeEvent (e) {
//     const formEl = e.currentTarget.form,
//         // the array index of PersonTypeEL.labels
//         categoryIndexStr = formEl.selectRoles.value;
//     if (categoryIndexStr) {
//         displaySegmentFields( formEl, PersonTypeEL.labels,
//             parseInt( categoryIndexStr) + 1);
//     } else {
//         undisplayAllSegmentFields( formEl, PersonTypeEL.labels);
//     }
// }

// Set up Manage People UI
refreshManageDataUI();
