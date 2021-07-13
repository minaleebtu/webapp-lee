const InstrumentEL = {
    none: "None",
    guitar: "Guitar",
    bongo: "Bongo",
    tone_wood: "Tone Wood",
    lute: "Lute",
    voice: "Voice"
}

/**
 * The class Member
 * @class
 */
class Member {
    constructor({memberId, roles, name, instrument, mailAddress}) {
        this.memberId = memberId;
        this.name = name;
        this.mailAddress = mailAddress;
        if (roles) this.roles = roles;
        if (instrument) this.instrument = instrument;
    }

    set memberId(c) {
        const validationResult = Member.checkID(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._memberId = c;
        } else {
            throw validationResult;
        }
    }

    get memberId() {
        return this._memberId;
    }

    set name(c) {
        const validationResult = Member.validateName(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._name = c;
        } else {
            throw validationResult;
        }
    }

    get name() {
        return this._name;
    }

    set mailAddress(c) {
        const validationResult = Member.validateMail(c);
        if (validationResult instanceof NoConstraintViolation) {
            this._mailAddress = c;
        } else {
            throw validationResult;
        }

    }

    get mailAddress() {
        return this._mailAddress;
    }

    set roles(a) {
        this._roles = {};
        if (Array.isArray(a)) {
            for (const idRef of a) {
                this.addRole(idRef);
            }
        } else {
            for (const idRef of Object.keys(a)) {
                this.addRole(a[idRef]);
            }
        }
    }

    get roles() {
        return this._roles;
    }

    set instrument(a) {
        this._instrument = {};
        if (Array.isArray(a)) {
            for (const idRef of a) {
                this.addInstrument(idRef);
            }
        } else {
            for (const idRef of Object.keys(a)) {
                this.addInstrument(a[idRef]);
            }
        }
    }

    get instrument() {
        return this._instrument;
    }

    addRole(a) {
        const validationResult = Member.validateRole(a);
        if (a && validationResult instanceof NoConstraintViolation) {
            if (!this._roles.includes(a)) {
                this._roles.push(a);
            } else {
                console.error(`Role ${a} is already included!`);
            }

        } else {
            throw validationResult;
        }
    }

    addInstrument(a) {
        const validationResult = Member.checkInstrument(a);
        if (a && validationResult instanceof NoConstraintViolation) {
            if (!this._instrument.includes(a)) {
                this._instrument.push(a);
            } else {
                console.error(`Instrument ${a} is already added to this boi!`);
            }
        } else {
            throw validationResult;
        }
    }

    static checkInstrument(r) {
        if (r === undefined) {
            return new NoConstraintViolation(); //optional
        } else if (!isIntegerOrIntegerString(r) || parseInt(r) < 0 ||
            parseInt(r) > InstrumentEL.MAX) {
            console.log(`Invalid value for instrument: ${r}`);
            return new RangeConstraintViolation(
                `Invalid value for instrument: ${r}`);
        } else {
            return new NoConstraintViolation();
        }
    }

    // Validate member id from param and a
    static checkID = function (memberId) {
        if (!isIntegerOrIntegerString(memberId)) {
            console.log("ERROR: Member ID " + memberId + " is not a number!");
            return new RangeConstraintViolation(
                "ERROR: Member ID " + memberId + " is not a number!");
        }
        if (memberId < 0) {
            console.log("ERROR: Member ID is not positive!");
            return new RangeConstraintViolation(
                "ERROR: Member ID is not positive!");
        }
        if (isMemberIDEmpty(memberId)) {
            console.log("ERROR: A value for the Member ID must be provided!");
            return new MandatoryValueConstraintViolation(
                "ERROR: A value for the Member ID must be provided!");
        }

        return new NoConstraintViolation();
    }

    static checkIDasID = async function (memberId) {

        const validationResult = Member.checkID(memberId);
        if (!validationResult instanceof NoConstraintViolation) {
            return validationResult
        }

        console.log("isMemberIDUsed 0");
        var member = await db.collection("members").doc(memberId).get();
        console.log("isMemberIDUsed 1");
        if (member.exists) {
            console.log("isMemberIDUsed 2");
            return new UniquenessConstraintViolation("ERROR: Member ID already in use!");
        }
        console.log("isMemberIDUsed 3");
        return validationResult;
    }

    static validateRole = function (role) {
        if (!isNonEmptyString(role)) {
            console.log("ERROR: The role must be a non-empty string!");
            return new RangeConstraintViolation(
                "ERROR: The role must be a non-empty string!");
        }
        return new NoConstraintViolation();
    }

    static validateMail = function (mail) {
        if (!isNonEmptyString(mail)) {
            console.log("ERROR: The mail must be a non-empty string!");
            return new RangeConstraintViolation(
                "ERROR: The mail must be a non-empty string!");
        }
        return new NoConstraintViolation();
    }

    static validateName = function (name) {
        if (!isNonEmptyString(name)) {
            console.log("ERROR: The name must be a non-empty string!");
            return new RangeConstraintViolation(
                "ERROR: The name must be a non-empty string!");
        }
        return new NoConstraintViolation();
    }

}

Member.validateSlots = async function (slots) {
    //check memberid
    var validationResult = Member.checkID(slots.memberId);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check name
    validationResult = Member.validateName(slots.name);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //check mail
    validationResult = Member.validateMail(slots.mailAddress);
    if (validationResult instanceof NoConstraintViolation) {

    } else {
        throw validationResult;
    }

    //validate roles
    const tmp = [];
    const a = slots.role;
    console.log(a);
    if (Array.isArray(a)) {
        for (const idRef of a) {
            validationResult = Member.validateRole(idRef);
            if (a && validationResult instanceof NoConstraintViolation) {
                if (!tmp.includes(idRef)) {
                    tmp.push(idRef);
                } else {
                    console.error(`Role ${idRef} is already included!`);
                }
            } else {
                throw validationResult;
            }
        }
    } else {
        for (const idRef of Object.keys(a)) {
            validationResult = Member.validateRole(a[idRef]);
            if (a && validationResult instanceof NoConstraintViolation) {
                if (!this._roles.includes(a[idRef])) {
                    this._roles.push(a[idRef]);
                } else {
                    console.error(`Role ${a[idRef]} is already included!`);
                }

            } else {
                throw validationResult;
            }
        }
    }

    //validate instrument
    const instrument = [];
    const b = slots.instrument;
    if (Array.isArray(b)) {
        for (const idRef of b) {
            validationResult = Member.checkInstrument(idRef);
            if (idRef && validationResult instanceof NoConstraintViolation) {
                if (!instrument.includes(idRef)) {
                    instrument.push(idRef);
                } else {
                    console.error(`Instrument ${idRef} is already added to this boi!`);
                }
            } else {
                throw validationResult;
            }
        }
    } else {
        for (const idRef of Object.keys(b)) {
            validationResult = Member.checkInstrument(b[idRef]);
            if (b[idRef] && validationResult instanceof NoConstraintViolation) {
                if (!instrument.includes(b[idRef])) {
                    instrument.push(b[idRef]);
                } else {
                    console.error(`Instrument ${b[idRef]} is already added to this boi!`);
                }
            } else {
                throw validationResult;
            }
        }
    }
} 

/********************************************************
 *** Class-level ("static") storage management methods ***
 *********************************************************/
/**
 *  Create a new member record/object
 */

Member.add = async function (slots) {
    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(slots.memberId);
    try {
        console.log(slots);
        //convert roles string
        let str = slots.role;
        slots.role = str.split(",");
        //todo: velidate slots
        Member.validateSlots(slots);
        await memberDocRef.set(slots);
    } catch (e) {
        console.error(`Error when adding member record: ${e}`);
        return;
    }
    console.log(`Member record ${slots.memberId} created.`);
};
/**
 *  Update an existing member record/object
 *  properties are updated with implicit setters for making sure
 *  that the new values are validated
 */
Member.update = async function ({memberId, roles, name, instrument, mailAddress}) {
    const updSlots = {};
    const memberRec = await Member.retrieve(memberId);

    if (memberRec.roles !== roles) {
        updSlots.roles = roles;
    }

    if (memberRec.name !== name) {
        updSlots.name = name;
    }

    if (memberRec.instrument !== instrument) {
        updSlots.instrument = instrument;
    }

    if (memberRec.mailAddress !== mailAddress) {
        updSlots.mailAddress = mailAddress;
    }

    if (Object.keys(updSlots).length > 0) {
        try {
            await db.collection("members").doc(memberId).update(updSlots);
        } catch (e) {
            console.error(`Error when updating member record: ${e}`);
            return;
        }
        console.log(`Member record ${memberId} modified.`);
    }
};

/**
 *  Delete an existing member record/object
 */
Member.destroy = async function (memberId) {
    try {
        await db.collection("members").doc(memberId).delete();
    } catch (e) {
        console.error(`Error when deleting member record: ${e}`);
        return;
    }
    console.log(`Member record ${memberId} deleted.`);
};

/**
 *  Load all member table rows and convert them to objects
 *  Precondition: directors and people must be loaded first
 */
Member.retrieveAll = async function () {
    const membersCollRef = db.collection("members");
    var membersQuerySnapshot = null;
    try {
        membersQuerySnapshot = await membersCollRef.get();
    } catch (e) {
        console.error(`Error when retrieving member records: ${e}`);
        return null;
    }
    const memberDocs = membersQuerySnapshot.docs,
        memberRecords = memberDocs.map(d => d.data());
    console.log(`${memberRecords.length} member records retrieved.`);
    return memberRecords;
};

// Clear test data
Member.clearData = async function () {
    if (confirm("Do you really want to delete all member records?")) {
        // retrieve all book documents from Firestore
        const memberRecords = await Member.retrieveAll();
        // delete all documents
        await Promise.all(memberRecords.map(
            memberRec => db.collection("members").doc(memberRec.memberId).delete()));
        // ... and then report that they have been deleted
        console.log(`${Object.values(memberRecords).length} members deleted.`);
    }
};

Member.retrieve = async function (memberId) {
    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(memberId);
    var memberDocSnapshot = null;
    try {
        memberDocSnapshot = await memberDocRef.get();
    } catch (e) {
        console.error(`Error when retrieving member record: ${e}`);
        return null;
    }
    const memberRecord = memberDocSnapshot.data();
    return memberRecord;
};

Member.generateTestData = async function () {
    let memberRecords = [
        {
            memberId: "0",
            name: "John Doe",
            mailAddress: "bro@gmail.com",
            roles: ["Artist"],
            instrument: InstrumentEL.guitar
        },
        {
            memberId: "1",
            name: "Eminem",
            mailAddress: "whiteboy@gmail.com",
            roles: ["Artist"],
            instrument: InstrumentEL.voice
        },
        {
            memberId: "2",
            name: "Maria Musterfrau",
            mailAddress: "muster@gmail.com",
            roles: ["Manager"],
            instrument: InstrumentEL.none
        }
    ];
    // save all member records
    await Promise.all(memberRecords.map(
        memberRec => db.collection("members").doc(memberRec.memberId).set(memberRec)
    ));
    console.log(`${Object.keys(memberRecords).length} members saved.`);
};


/*
Copy Pasta Code inc
*/

/**
 * Verifies if a value represents an integer or integer string
 * @param {string} x
 * @return {boolean}
 */
function isIntegerOrIntegerString(x) {
    return typeof (x) === "number" && Number.isInteger(x) ||
        typeof (x) === "string" && x.search(/^-?[0-9]+$/) == 0;
}

function isMemberIDEmpty(memberId) {
    return memberId == null;
}

async function isMemberIDUsed(memberId) {

    const membersCollRef = db.collection("members"),
        memberDocRef = membersCollRef.doc(memberId);
    var memberDocSnapshot = null;
    try {
        memberDocSnapshot = await memberDocRef.get();
    } catch (e) {
        console.log("error");
        // console.error(`Error when retrieving member record: ${e}`);
        return false;
    }
    console.log("okay");
    const memberRecord = memberDocSnapshot.data();
    return true;


    /*
    console.log("isMemberIDUsed 0");
    var member = await db.collection("members").doc(memberId).get();
    console.log("isMemberIDUsed 1");
    if (member.exists) {
        console.log("isMemberIDUsed 2");
        return true;
    }
    console.log("isMemberIDUsed 3");
    return false;

     */
}

function isNonEmptyString(s) {
    return s != null;
}

// *************** D O M - Related ****************************************
/**
 * Create a Push Button
 * @param {string} txt [optional]
 * @return {object}
 */
function createPushButton(txt) {
    let pB = document.createElement("button");
    pB.type = "button";
    if (txt) pB.textContent = txt;
    return pB;
}

/**
 * Create a DOM option element
 *
 * @param {string} val
 * @param {string} txt
 * @param {string} classValues [optional]
 *
 * @return {object}
 */
function createOption(val, txt, classValues) {
    let el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
}

/**
 * Create a list element from an map of objects
 *
 * @param {object} eTbl  An entity table
 * @param {string} displayProp  The object property to be displayed in the list
 * @return {object}
 */
function createListFromMap(eTbl, displayProp) {
    const listEl = document.createElement("ul");
    fillListFromMap(listEl, eTbl, displayProp);
    return listEl;
}

/**
 * Fill a list element with items from an entity table
 *
 * @param {object} listEl  A list element
 * @param {object} eTbl  An entity table
 * @param {string} displayProp  The object property to be displayed in the list
 */
function fillListFromMap(listEl, eTbl, displayProp) {
    const keys = Object.keys(eTbl);
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    for (const key of keys) {
        const listItemEl = document.createElement("li");
        listItemEl.textContent = eTbl[key][displayProp];
        listEl.appendChild(listItemEl);
    }
}

function nextYear() {
    let date = new Date();
    return (date.getFullYear() + 1);
}

/**
 * Fill a select element with option elements created from an
 * map of objects
 *
 * @param {object} selectEl  A select(ion list) element
 * @param {object|array} selectionRange  A map of objects or an array
 * @param {string} keyProp [optional]  The standard identifier property
 * @param {object} optPar [optional]  A record of optional parameter slots
 *                 including optPar.displayProp and optPar.selection
 */
function fillSelectWithOptions(selectEl, selectionRange, keyProp, optPar) {
    let optionEl = null, displayProp = "";
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if (!selectEl.multiple) selectEl.add(createOption("", " --- "));
    // create option elements from object property values
    let options = Array.isArray(selectionRange) ? selectionRange : Object.keys(selectionRange);
    for (let i = 0; i < options.length; i++) {
        if (Array.isArray(selectionRange)) {
            optionEl = createOption(i, options[i]);
        } else {
            const key = options[i];
            const obj = selectionRange[key];
            if (!selectEl.multiple) obj.index = i + 1;  // store selection list index
            if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
            else displayProp = keyProp;
            optionEl = createOption(key, obj[displayProp]);
            // if invoked with a selection argument, flag the selected options
            if (selectEl.multiple && optPar && optPar.selection &&
                optPar.selection[keyProp]) {
                // flag the option element with this value as selected
                optionEl.selected = true;
            }
        }
        selectEl.add(optionEl);
    }
}

// basically fillSelectWithOptions but last param isn't optional -> no "no selection yet" entry
function fillSelectWithOptions2(selectEl, selectionRange, keyProp, optPar) {
    let optionEl = null, obj = null, displayProp = "";
    // delete old contents
    selectEl.innerHTML = "";

    // create "no selection yet" entry
    // if (!selectEl.multiple) selectEl.add(createOption("", " --- "));

    // create option elements from object property values
    let options = Object.keys(selectionRange);
    for (const i of options.keys()) {
        obj = selectionRange[options[i]];
        if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
        else displayProp = keyProp;
        optionEl = createOption(obj[keyProp], obj[displayProp]);
        // if invoked with a selection argument, flag the selected options
        if (selectEl.multiple && optPar && optPar.selection &&
            optPar.selection[keyProp]) {
            // flag the option element with this value as selected
            optionEl.selected = true;
        }
        selectEl.add(optionEl);
    }
}

// *************** Multiple Choice Widget ****************************************
/**
 * Create the contents of an Multiple Choice widget, which is a div containing
 * 1) a choice list (a list of chosen items), where each item has a delete button,
 * 2) a div containing a select element and an add button allowing to add a selected item
 *    to the association list
 *
 * @param {object} widgetContainerEl  The widget's container div
 * @param {object} selectionRange  An map of objects, which is used to
 *                 create the options of the select element
 * @param {object} selection  An map of objects, which is used to
 *                 fill the selection list
 * @param {string} keyProp  The standard identifier property of the range object type
 * @param displayProp
 * @param minCard
 *                 including "displayProp"
 */
function createMultipleChoiceWidget(widgetContainerEl, selection, selectionRange,
                                    keyProp, displayProp, minCard) {
    let assocListEl = document.createElement("ul"),  // shows associated objects
        selectEl = document.createElement("select"),
        el;
    if (!minCard) minCard = 0;  // default
    // delete old contents
    widgetContainerEl.innerHTML = "";
    // create association list items from property values of associated objects
    if (!displayProp) displayProp = keyProp;
    fillChoiceSet(assocListEl, selection, keyProp, displayProp);
    // event handler for removing an associated item from the association list
    assocListEl.addEventListener('click', function (e) {
        let listItemEl = null, listEl = null;
        if (e.target.tagName === "BUTTON") {  // delete/undo button
            listItemEl = e.target.parentNode;
            listEl = listItemEl.parentNode;
            if (listEl.children.length <= minCard) {
                alert("A member must have at least one person!");
                return;
            }
            if (listItemEl.classList.contains("removed")) {
                // undoing a previous removal
                listItemEl.classList.remove("removed");
                // change button text
                e.target.textContent = "✕";
            } else if (listItemEl.classList.contains("added")) {
                // removing an added item means moving it back to the selection range
                listItemEl.parentNode.removeChild(listItemEl);
                const optionEl = createOption(listItemEl.getAttribute("data-value"),
                    listItemEl.firstElementChild.textContent);
                selectEl.add(optionEl);
            } else {
                // removing an ordinary item
                listItemEl.classList.add("removed");
                // change button text
                e.target.textContent = "undo";
            }
        }
    });
    widgetContainerEl.appendChild(assocListEl);
    el = document.createElement("div");
    el.appendChild(selectEl);
    el.appendChild(createPushButton("add"));
    // event handler for adding an item from the selection list to the association list
    selectEl.parentNode.addEventListener('click', function (e) {
        let assocListEl = e.currentTarget.parentNode.firstElementChild,
            selectEl = e.currentTarget.firstElementChild;
        if (e.target.tagName === "BUTTON") {  // add button
            if (selectEl.value) {
                addItemToChoiceSet(assocListEl, selectEl.value,
                    selectEl.options[selectEl.selectedIndex].textContent, "added");
                selectEl.options[selectEl.selectedIndex].remove();
                selectEl.selectedIndex = 0;
            }
        }
    });
    widgetContainerEl.appendChild(el);
    // create select options from selectionRange minus selection
    fillMultipleChoiceWidgetWithOptions(selectEl, selectionRange, keyProp,
        {"displayProp": displayProp, "selection": selection});
}

/**
 * Fill the select element of an Multiple Choice Widget with option elements created
 * from the selectionRange minus an optional selection set specified in optPar
 *
 * @param selectEl
 * @param selectionRange
 * @param {string} keyProp  The standard identifier property
 * @param {object} optPar [optional]  An record of optional parameter slots
 *                 including optPar.displayProp and optPar.selection
 */
function fillMultipleChoiceWidgetWithOptions(selectEl, selectionRange, keyProp, optPar) {
    let options, obj = null, displayProp = "";
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    selectEl.add(createOption("", " --- "));
    // create option elements from object property values
    options = Object.keys(selectionRange);
    for (const i of options.keys()) {
        // if invoked with a selection argument, only add options for objects
        // that are not yet selected
        if (!optPar || !optPar.selection || !optPar.selection[options[i]]) {
            obj = selectionRange[options[i]];
            if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
            else displayProp = keyProp;
            selectEl.add(createOption(obj[keyProp], obj[displayProp]));
        }
    }
}

/**
 * Fill a Choice Set element with items
 *
 * @param {object} listEl  A list element
 * @param {object} selection  An entity table for filling the Choice Set
 * @param {string} keyProp  The standard ID property of the entity table
 * @param {string} displayProp  A text property of the entity table
 */
function fillChoiceSet(listEl, selection, keyProp, displayProp) {
    let options, obj = null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    options = Object.keys(selection);
    for (const j of options.keys()) {
        obj = selection[options[j]];
        addItemToChoiceSet(listEl, obj[keyProp], obj[displayProp]);
    }
}

/**
 * Add an item to a Choice Set element
 *
 * @param {object} listEl  A list element
 * @param {string} stdId  A standard identifier of an object
 * @param {string} humanReadableId  A human-readable ID of the object
 * @param classValue
 */
function addItemToChoiceSet(listEl, stdId, humanReadableId, classValue) {
    let listItemEl, el;
    listItemEl = document.createElement("li");
    listItemEl.setAttribute("data-value", stdId);
    el = document.createElement("span");
    el.textContent = humanReadableId;
    listItemEl.appendChild(el);
    el = createPushButton("✕");
    listItemEl.appendChild(el);
    if (classValue) listItemEl.classList.add(classValue);
    listEl.appendChild(listItemEl);
}

/**
 * Create a "clone" of an object that is an instance of a model class
 *
 * @param {object} obj
 */
function cloneObject(obj) {
    let p = "", val,
        clone = Object.create(Object.getPrototypeOf(obj));
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            val = obj[p];
            if (typeof val === "number" ||
                typeof val === "string" ||
                typeof val === "boolean" ||
                val instanceof Date ||
                // typed object reference
                typeof val === "object" && !!val.constructor ||
                Array.isArray(val) &&  // list of data values
                !val.some(function (el) {
                    return typeof el === "object";
                }) ||
                Array.isArray(val) &&  // list of typed object references
                val.every(function (el) {
                    return (typeof el === "object" && !!el.constructor);
                })
            ) {
                if (Array.isArray(val)) clone[p] = val.slice(0);
                else clone[p] = val;
            }
            // else clone[p] = cloneObject(val);
        }
    }
    return clone;
}

/**
 * * Create a choice control (radio button or checkbox) element
 *
 * @param {string} t  The type of choice control ("radio" or "checkbox")
 * @param {string} n  The name of the choice control input element
 * @param {string} v  The value of the choice control input element
 * @param {string} lbl  The label text of the choice control
 * @return {object}
 */
function createLabeledChoiceControl(t, n, v, lbl) {
    let ccEl = document.createElement("input"),
        lblEl = document.createElement("label");
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild(ccEl);
    lblEl.appendChild(document.createTextNode(lbl));
    return lblEl;
}

/**
 * Create a choice widget in a given fieldset element.
 * A choice element is either an HTML radio button or an HTML checkbox.
 * @method
 */
function createChoiceWidget(containerEl, fld, values,
                            choiceWidgetType, choiceItems, isMandatory) {
    const choiceControls = containerEl.querySelectorAll("label");
    // remove old content
    for (const j of choiceControls.keys()) {
        containerEl.removeChild(choiceControls[j]);
    }
    if (!containerEl.hasAttribute("data-bind")) {
        containerEl.setAttribute("data-bind", fld);
    }
    // for a mandatory radio button group initialize to first value
    if (choiceWidgetType === "radio" && isMandatory && values.length === 0) {
        values[0] = 1;
    }
    if (values.length >= 1) {
        if (choiceWidgetType === "radio") {
            containerEl.setAttribute("data-value", values[0]);
        } else {  // checkboxes
            containerEl.setAttribute("data-value", "[" + values.join() + "]");
        }
    }
    for (const j of choiceItems.keys()) {
        // button values = 1..n
        const el = createLabeledChoiceControl(choiceWidgetType, fld,
            j + 1, choiceItems[j]);
        // mark the radio button or checkbox as selected/checked
        if (values.includes(j + 1)) el.firstElementChild.checked = true;
        containerEl.appendChild(el);
        el.firstElementChild.addEventListener("click", function (e) {
            const btnEl = e.target;
            if (choiceWidgetType === "radio") {
                if (containerEl.getAttribute("data-value") !== btnEl.value) {
                    containerEl.setAttribute("data-value", btnEl.value);
                } else if (!isMandatory) {
                    // turn off radio button
                    btnEl.checked = false;
                    containerEl.setAttribute("data-value", "");
                }
            } else {  // checkbox
                let values = JSON.parse(containerEl.getAttribute("data-value")) || [];
                let i = values.indexOf(parseInt(btnEl.value));
                if (i > -1) {
                    values.splice(i, 1);  // delete from value list
                } else {  // add to value list
                    values.push(btnEl.value);
                }
                containerEl.setAttribute("data-value", "[" + values.join() + "]");
            }
        });
    }
    return containerEl;
}

/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * for property constraint violations
 * @person Gerd Wagner
 */

class ConstraintViolation {
    constructor(msg) {
        this.message = msg;
    }
}

class NoConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
        this.message = "";
    }
}

class MandatoryValueConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class RangeConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class StringLengthConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class IntervalConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class PatternConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class UniquenessConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}

class ReferentialIntegrityConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
