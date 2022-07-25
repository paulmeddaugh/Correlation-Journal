import Graph from '../scripts/graph/graph.js';
import { loadJournal } from './graph/loadGraph.js';
import Note from './notes/note.js';
import { addNotebooksToInfoBox, addNotebookToInfoBox, addNoteToInfoBox } from './components/infoBox.js';
import Point from './notes/point.js';
import { removeNonSQLCharacters } from './utility/utility.js';

let idUser = sessionStorage.getItem('uid');

let notebooks = new Map()
let notes = new Map();

let infoBox;
let notebook, title, text, quotes; // inputs
let quotesInitialFocus = true;

let currentNoteIndex = 0;

window.addEventListener("load", () => {

    infoBox = document.getElementsByTagName('info-box-component')[0];
    notebook = document.getElementById('notebook');
    title = document.getElementById('title');
    text = document.getElementById('text');

    title.addEventListener("keydown", changeTab);

    let newNote = new Note(null, "(no title)", null, "-", "", null, true, new Date());
    notes.set(0, newNote);
    addNoteToInfoBox(infoBox, newNote, true);

    (quotes = document.getElementById('quotes')).addEventListener("focus", (e) => {
        if (quotesInitialFocus) {
            quotes.innerHTML = '""';
        }
    });

    loadJournal(idUser, (g, nbs) => {

        // Loads notes into infoBox, and additionally loads them into a Map
        // with their keys as the child index in the infobox.
        for (let i = 1, ns = g.getVertices(); i < ns.length + 1; i++) {
            notes.set(i, new Note(ns[i - 1]));
            addNoteToInfoBox(infoBox, ns[i - 1]);
        }

        for (let nb of nbs) {
            notebooks.set(nb.id, nb.name);
            addNotebookToInfoBox(infoBox, nb);
        }

        // Makes clicking a note in the infobox make note visible in the editor
        const notesInBox = infoBox.shadowRoot.getElementById('infobox').children[0].children;

        for (let i = 0; i < notesInBox.length - 2; i++) {
            notesInBox[i + 2].addEventListener("click", () => {

                // Updates values of the previous note on the front-end
                const prevNote = notes.get(currentNoteIndex);
                const existing = getNotebookIdFromName(notebook.value);
                const nbId = existing ? existing : (notebook.value != "") ? notebook.value : "(no title)";
                
                prevNote.setEditables(nbId, null, title.value, text.value, quotes.value);

                // Loads the selected note
                const loadingNote = notes.get(i);
                const exist = notebooks.get(loadingNote.idNotebook);
                const nbName = exist ? exist : loadingNote.idNotebook;
                setEditorInputs(
                    (nbName && nbName != '(no title)') ? nbName : "",
                    loadingNote.title,
                    loadingNote.text,
                    loadingNote.quotes
                );

                document.getElementById('addUpdate').value = (i == 0) ? 'Add Note' : 'Save Changes';
                currentNoteIndex = i;
            });
        }
    });
});

function setEditorInputs(notebookName, newTitle, newText, newQuotes) {
    notebook.value = notebookName;
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

function getNotebookIdFromName(name) {
    for (let [id, nbName] of notebooks) {
        if (new String(nbName).toLowerCase() == new String(name).toLowerCase()) {
            return id;
        }
    }

    return false;  
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
    let nbId = getNotebookIdFromName(notebook.value);
    if (!nb) {
        if (!confirm(`Are you sure you want to create the new notebook '${notebook.value}'?`)) {
            return false;
        }
    }

    let params = "?idUser=".concat(idUser)
        .concat((nb) ? "&idNotebook=" : "&newNotebookName=").concat((nb) ? nbId : notebook.value)
        .concat('&title=').concat(removeNonSQLCharacters(title.value))
        .concat('&text=').concat(removeNonSQLCharacters(text.value))
        .concat('&quotes=').concat(removeNonSQLCharacters(quotes.value));

    xhr.open("POST", "../php/addNote.php" + params, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    return true;
});