import Graph from '../scripts/graph/graph.js';
import Note from './notes/note.js';
import { addNoteToInfoBox } from './components/infoBox.js';
import Point from './notes/point.js';
import { removeNonSQLCharacters } from './utility/utility.js';

let infoBox;

let notebook, title, text, quotes;
let quotesInitialFocus = true;
let newNoteInitialBlur;

window.addEventListener("load", () => {
    infoBox = document.getElementsByTagName('info-box-component')[0];
    notebook = document.getElementById('notebook');
    title = document.getElementById('title');
    text = document.getElementById('text');

    title.addEventListener("keydown", changeTab);

    let newNote = new Note(null, "Untitled", null, "-", "", null);
    addNoteToInfoBox(infoBox, newNote, true);

    // Loads notes from databas
    addNoteToInfoBox(infoBox, new Note(1, "Hello", null, "Workin", "Inspiring", 1), false);
    addNoteToInfoBox(infoBox, new Note(2, "There", null, "Workin", "Inspiring", 1), false);
    addNoteToInfoBox(infoBox, new Note(3, "Y", null, "Workin", "Inspiring", 1), false);

    (quotes = document.getElementById('quotes')).addEventListener("focus", (e) => {
        if (quotesInitialFocus) {
            quotes.innerHTML = '""';
        }
    });

    // Makes clicking a note in the infobox make note visible in the editor
    let notes = infoBox.getElementsByClassName('list-group-flush')[0];
    for (let i = 0; i < notes.children.length; i++) {
        notes.children[i].addEventListener("click", () => {
            if (i != 0) { // Not highlighting new note
                if (newNoteInitialBlur) {
                    newNote.setEditables(title.value, text.value, quotes.value);
                    newNoteInitialBlur = false;
                }
                setEditorInputs(
                    notes.children[i].children[0].children[0].innerHTML,
                    notes.children[i].children[1].innerHTML,
                    ""
                );
                document.getElementById('addUpdate').value = 'Save Changes';
            } else {
                newNoteInitialBlur = true;
                setEditorInputs(newNote.title, newNote.text, newNote.quotes);
                document.getElementById('addUpdate').value = 'Add Note';
            }
        });
    }
});

function setEditorInputs(newTitle, newText, newQuotes) {
    title.value = newTitle;
    text.value = newText;
    quotes.value = newQuotes;
}

function changeTab(e) {
    if (e.key != 'Enter') return;

    if (e.currentTarget.id == "title") {
        text.focus();
        e.preventDefault();
    }
    if (e.currentTarget.id == "text") {
        text.focus();
        e.preventDefault();
    }
}

function checkInputs() {
    let error = "";
    let focusObject = null;
    if (notebook.value == '') {
        error = "Notebook";
        focusObject = notebook;
    }
    if (title.value == '') {
        error = (error) ? ", title" : "Title";
        if (!focusObject) focusObject = title;
    }
    if (text.value == '') {
        error = (error) ? ", note content" : "Note content";
        if (!focusObject) focusObject = text;
    }
    if (quotes.value == '') {
        error = (error) ? ", quotes" : "Quotes";
        if (!focusObject) focusObject = text;
    }

    if (error) {
        alert(error + " blank.");
        focusObject.focus();
        return false;
    }

    return true;
}

/**
 * The function called when the 'Add Note' submit button is clicked.
 */
document.getElementsByTagName('form')[0].addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!checkInputs()) return false;

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let result = xhr.responseText;
            console.log(result);
            alert(result);
            window.location.href = "../pages/home.html";
        }
    }

    // Ask user if they're sure they want to add a new notebook if different

    let params = "?idUser=".concat(sessionStorage.getItem("uid"))
        .concat("&idNotebook=").concat(1)
        .concat('&title=').concat(removeNonSQLCharacters(title.value))
        .concat('&text=').concat(removeNonSQLCharacters(text.value))
        .concat('&quotes=').concat(removeNonSQLCharacters(quotes.value));

    xhr.open("POST", "../php/addNote.php" + params, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    return true;
});