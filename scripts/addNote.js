import Graph from '../scripts/graph/graph.js';
import { loadJournal } from './graph/loadJournal.js';
import Note from './notes/note.js';
import { addNotesClickListenersToInfoBox, addNotebooksToInfoBox, addNotebookToInfoBox, addNoteToInfoBox, 
    selectNotebookListener } from './components/infoBox.js';
import Point from './notes/point.js';
import { stringToSQL } from './utility/utility.js';

let idUser = sessionStorage.getItem('uid');

let notebooks = new Map();
let notes = [];
let graph;

let infoBox;
let notebook, title, text, quotes, isMain = true; // inputs
let quotesInitialFocus = true;

const STICKY_NOTE_COLOR = 'rgb(255, 247, 209)';

let currentNoteIndex = 0;

window.addEventListener("load", () => {

    // Manually sets the height of the 'main' body to 100% - header
    let header = document.getElementsByTagName('header-component')[0];
    let main = document.getElementsByTagName('main')[0];
    main.style.height = parseInt(window.getComputedStyle(document.body).height) 
        - parseInt(window.getComputedStyle(header).height) + 'px';

    infoBox = document.getElementsByTagName('info-box-component')[0];
    notebook = document.getElementById('notebook');
    title = document.getElementById('title');
    text = document.getElementById('text');
    let nbOptions = document.getElementById('notebookOptions');

    title.addEventListener("keydown", changeTitleTab);
    title.addEventListener("keyup", updateNewNoteInInfoBox);
    text.addEventListener("keyup", updateNewNoteInInfoBox);

    let newNote = new Note(null, "(no title)", null, "-", "", null, true, new Date());
    notes.push(newNote);
    addNoteToInfoBox(infoBox, newNote, true);

    (quotes = document.getElementById('quotes')).addEventListener("focus", (e) => {
        if (quotesInitialFocus) {
            quotes.innerHTML = '""';
        }
    });

    loadJournal(idUser, (g, nbs) => {

        graph = g;

        // Loads notebooks
        for (let nb of nbs) {
            notebooks.set(nb.id, nb.name);
            addNotebookToInfoBox(infoBox, nb);

            // Appends notebooks to the editor notebook selections
            let option = document.createElement('option');
            option.setAttribute('data-idNotebook', nb.id);
            option.value = option.innerHTML = nb.name;
            notebookOptions.appendChild(option);
        }

        // Loads notes
        for (let note of g.getVertices()) {
            notes.push(new Note(note)); // Re-wraps the deep copy ('Object' now) to use Note functions
            addNoteToInfoBox(infoBox, note);
        }

        // Makes notes visible in the editor when clicked
        addNotesClickListenersToInfoBox(infoBox, (i) => {

            // Updates edited values of the previous note on the front-end
            const prevNote = notes[currentNoteIndex];
            let existingNb = getNotebookIdFromName(notebook.value);
            const nbId = existingNb ? existingNb : (notebook.value == "") ? "(no title)" : notebook.value;
            prevNote.setEditables(nbId, null, title.value, text.value, quotes.value);

            // Loads the selected note in editor
            const loadingNote = notes[i];
            existingNb = notebooks.get(loadingNote.idNotebook);
            const nbName = existingNb ? existingNb : loadingNote.idNotebook; // Stores new titles if no id
            setEditorInputs(
                (nbName && nbName != '(no title)') ? nbName : "",
                loadingNote.title,
                loadingNote.text,
                loadingNote.quotes
            );

            // Displays note connections
            document.getElementById('connections').innerHTML = '';

            for (let edge of graph.getVertexNeighbors(Number(notes[i].id))) {
                let canvas = document.createElement('canvas');
                console.log(!!Number(edge.v.isMain));
                drawConnectionCanvas(canvas, edge.v.title, true, Number(edge.v.isMain));
                document.getElementById('connections').appendChild(canvas, document.getElementById('plus'));
            }

            document.getElementById('addUpdate').value = (i == 0) ? 'Add Note' : 'Save Changes';
            currentNoteIndex = i;
        });

        document.getElementById('connectionsRow').appendChild(plus);
    });
});

function setEditorInputs(notebookName, newTitle, newText, newQuotes) {
    notebook.value = notebookName;
    title.value = newTitle;
    text.value = newText;
    quotes.value = newQuotes;
}

function drawConnectionCanvas (canvas, title, isMain) {
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio;

    console.log(isMain);

    const yGap = 8;
    const height = 20;
    const lineY = 0|((height + yGap) / 2); // bit-operator removes decimal

    const lineWidth = 8;
    const width = lineWidth + (new String(title).length * 4.5);

    // Scales the actual dimensions of the canvas to equal desired size in devicePixelRatio (less blurry)
    canvas.height = height * DPR;
    canvas.width = width * DPR;

    // but style dimensions to the desired size
    canvas.style.height = height + 'px';
    canvas.style.width = width + 'px';

    ctx.scale(DPR, DPR);
    ctx.translate(-0.5, -0.5);

    // Line to the note
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(lineWidth, lineY);
    ctx.closePath();
    ctx.stroke();

    // Background of note
    ctx.fillStyle = (isMain) ? 'lightgrey' : STICKY_NOTE_COLOR;
    ctx.lineWidth = 1;
    const p1 = new Point(lineWidth, yGap + 2), p2 = new Point(width - 8, height - 10);
    ctx.fillRect(p1.x, p1.y, p2.x, p2.y);

    // Border
    ctx.strokeStyle = 'black';
    ctx.strokeRect(p1.x, p1.y, p2.x, p2.y);

    // Title
    ctx.fillStyle = 'black';
    ctx.fillText(title, lineWidth, 10 + yGap);
}

for (let radio of document.getElementsByClassName('form-check-input')) {
    radio.addEventListener("click", (e) => {
        const isChecked = e.currentTarget.checked;
        isMain = (isChecked && e.currentTarget.id == 'main') ? true : false;
        document.getElementById('editor').style.background = (isChecked && e.currentTarget.id == 'main') ? 
            'white' : STICKY_NOTE_COLOR;
    });
}

function changeTitleTab(e) {
    if (e.key == 'Enter') {
        text.focus();
        e.preventDefault();
    }
}

function updateNewNoteInInfoBox(e) {
    if (currentNoteIndex == 0) {
        const id = e.currentTarget.id;
        // Updates the new note element in infobox when inputs change
        const el = (id == 'title') ?
            infoBox.shadowRoot.getElementById('infobox').children[2].children[1].children[0].children[0] :
            infoBox.shadowRoot.getElementById('infobox').children[2].children[1].children[1];
        el.innerHTML = (id == 'title' && e.currentTarget.value == '') ? '(no title)' : 
            (id == 'text' && e.currentTarget.value == '') ? '-' :
            e.currentTarget.value;
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
    if (notebook.value == '') {
        alert("Notebook must not be blank.");
        notebook.focus();
        return false;
    }

    return true;
}

/**
 * The function called when the submit button is clicked.
 */
document.getElementsByTagName('form')[0].addEventListener("submit", (e) => {

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
    if (!nbId) {
        if (!confirm(`Are you sure you want to create new notebook '${notebook.value}'?`)) {
            return false;
        }
    }

    let params = "?idUser=".concat(idUser)
        .concat((nbId) ? "&idNotebook=" : "&newNotebookName=").concat((nbId) ? nbId : notebook.value)
        .concat('&title=').concat(stringToSQL((title.value == '') ? '(no title)' : title.value))
        .concat('&text=').concat(stringToSQL((text.value == '') ? '-' : text.value))
        .concat('&quotes=').concat(stringToSQL(quotes.value))
        .concat('&isMain=').concat(isMain);

    if (document.getElementById('addUpdate').value == 'Save Changes') {
        params = params.concat('&idNote=').concat(notes[currentNoteIndex].id);
    }

    xhr.open("POST", "../php/addUpdateNote.php" + params, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

    return true;
});