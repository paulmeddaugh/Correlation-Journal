import Graph from '../scripts/graph/graph.js';
import { loadJournal } from './graph/loadJournal.js';
import Note from './notes/note.js';
import { addNotesClickListenersToInfoBox, addNotebooksToInfoBox, addNotebookToInfoBox, addNoteToInfoBox, 
    selectNotebookListener } from './components/infoBox.js';
import Point from './notes/point.js';
import { stringToSQL } from './utility/utility.js';
import BinarySearchTree from './utility/bst.js';

let idUser = sessionStorage.getItem('uid');

let notebooks = new Map();
let graph;
let prevConnections;

let infoBox;
let notebook, title, text, quotes, isMain = true; // inputs
let connectionPlus, connectionPlusText, connectionSelect; // connection elements
let quotesInitialFocus = true;

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

    connectionPlus = document.getElementById('plusContainer');
    connectionPlusText = document.getElementById('plusText');
    connectionSelect = document.getElementById('addingConnection');

    let nbOptions = document.getElementById('notebookOptions');

    title.addEventListener("keydown", changeTitleTab);
    title.addEventListener("keyup", updateNewNoteInInfoBox);
    text.addEventListener("keyup", updateNewNoteInInfoBox);
    connectionPlusText.addEventListener("click", connectionPlusOpenClose);
    connectionSelect.addEventListener("change", addingConnectionChange);

    notebook.focus();

    (quotes = document.getElementById('quotes')).addEventListener("focus", (e) => {
        if (quotesInitialFocus) {
            //quotes.innerHTML = '""';
        }
    });

    loadJournal(idUser, (g, nbs) => {

        graph = g;
        console.log(prevConnections = graph.getNeighbors());

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

        // Appends new note to infoBox first
        const newNote = new Note(null, "(no title)", null, "-", "", null, true, new Date());
        addNoteToInfoBox(infoBox, newNote, true);

        // Loads notes
        for (let note of graph.getVertices()) {
            addNoteToInfoBox(infoBox, note);

            // Appends notes to the editor's connection selection
            let option = document.createElement('option');
            option.setAttribute('data-idNote', note.id);
            option.innerHTML = note.title;
            connectionSelect.appendChild(option);
        }
        graph.addVertex(newNote); // Adds new note to end of graph list

        // Makes notes visible in the editor when clicked
        addNotesClickListenersToInfoBox(infoBox, (i) => {

            // Updates edited values of the previous note on the front-end
            const prevNote = graph.getVertex(graphIndex(currentNoteIndex));
            let existingNb = getNotebookIdFromName(notebook.value);
            const nbId = existingNb ? existingNb : (notebook.value == "") ? "(no title)" : notebook.value;
            prevNote.setEditables(nbId, null, title.value, text.value, quotes.value, isMain);

            // Loads the selected note in editor
            const loadingIndex = graphIndex(i);
            const loadingNote = graph.getVertex(loadingIndex);
            existingNb = notebooks.get(loadingNote.idNotebook);
            const nbName = existingNb ? existingNb : loadingNote.idNotebook; // Stores new titles if no id
            setEditorInputs(
                (nbName && nbName != '(no title)') ? nbName : "",
                loadingNote.title,
                loadingNote.text,
                loadingNote.quotes,
                loadingNote.isMain
            );

            // Displays note connections
            document.getElementById('connections').innerHTML = '';
            for (let edge of graph.getVertexNeighbors(graph.getVertex(loadingIndex))) {
                let connectingNote = graph.getVertex(edge.id);
                createConnectionCanvas(connectingNote);
            }

            document.getElementById('addUpdate').value = (i == 0) ? 'Add Note' : 'Save Changes';
            currentNoteIndex = i;
        });
    });
});

function setEditorInputs(notebookName, newTitle, newText, newQuotes, main) {
    notebook.value = notebookName;
    title.value = newTitle;
    text.value = newText;
    quotes.value = newQuotes;
    document.getElementById((isMain = !!Number(main)) ? 'main' : 'sticky').checked = true;
    setEditorIsMain(isMain);
}

function createConnectionCanvas (note) {

    const title = note.title, isMain = !!Number(note.isMain), id = note.id;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio;

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

    // Icon for removing the connection
    let remove = document.createElement('div');
    remove.classList.add('removeConnection');
    remove.addEventListener("click", () => {
        graph.removeEdge(graph.getVertex(graphIndex(currentNoteIndex)), graph.getVertex(String(note.id)));
        document.body.removeChild(div);
    });

    // The div container to allow removing
    let div = document.createElement('div');
    div.classList.add('canvasContainer');
    div.appendChild(canvas);
    div.appendChild(remove);

    document.getElementById('connections').appendChild(div, document.getElementById('plus'));
}

for (let radio of document.getElementsByClassName('form-check-input')) {
    radio.addEventListener("click", (e) => {
        setEditorIsMain(e.currentTarget.id == 'main');
    });
}

function setEditorIsMain (main) {
    document.getElementById('editor').style.background = (isMain = main) ? 
        MAIN_NOTE_EDITOR_COLOR : STICKY_NOTE_COLOR;
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

function graphIndex(infoBoxIndex) {
    return (!infoBoxIndex) ? graph.getSize() - 1 : infoBoxIndex - 1;
}

function connectionPlusOpenClose (e) {
    if (connectionPlusText.innerHTML == '+') {
        connectionPlus.classList.add('expandConnectionPlus');
        connectionPlusText.innerHTML = '-';
        connectionPlusText.classList.add('minusText');
    } else { // innerHTML == '-'
        connectionPlus.classList.remove('expandConnectionPlus');
        connectionPlusText.innerHTML = '+';
        connectionPlusText.classList.remove('minusText');
    }
}

function addingConnectionChange (e) {
    // Adds a connection-displaying canvas when changed
    const currentNote = graph.getVertex((!currentNoteIndex) ? graph.getSize() - 1 : currentNoteIndex - 1);
    const connectingNote = graph.getVertices().find(note => note.title == connectionSelect.value);
    graph.addEdge(currentNote, connectingNote);
    createConnectionCanvas(connectingNote);
    connectionSelect.value = 'Connecting Note';
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

    // Determines connections to add and remove: O(n)
    const graphI = graphIndex(currentNoteIndex);
    const currNeighbors = graph.getVertexNeighbors(graphI); // in ascending order
    const prevNeighbors = prevConnections[graphI] ? new BinarySearchTree(prevConnections[graphI]).inorder() 
        : [];
    const currLen = currNeighbors.length, prevLen = prevNeighbors.length;
    const connToRemove = [], connToAdd = [];

    let currIndex = 0, prevIndex = 0;

    while (currIndex != currLen || prevIndex != prevLen) {
        if (currNeighbors[currIndex] && (prevIndex == prevLen || 
                prevNeighbors[prevIndex].id > currNeighbors[currIndex].id)) {
            connToAdd.push(currNeighbors[currIndex].id);
            currIndex++;
            console.log('added');
        } else if (prevNeighbors[prevIndex] && (currIndex == currLen || 
            currNeighbors[currIndex].id > prevNeighbors[prevIndex].id)) {
            connToRemove.push(prevConnections[prevIndex].id);
            prevIndex++;
            console.log('removed');
        } else if (prevNeighbors[prevIndex] == currNeighbors[currIndex]) {
            prevIndex++;
            currIndex++;
        }
    }

    let params = "?idUser=".concat(idUser)
        .concat((nbId) ? "&idNotebook=" : "&newNotebookName=").concat((nbId) ? nbId : notebook.value)
        .concat('&title=').concat(stringToSQL((title.value == '') ? '(no title)' : title.value))
        .concat('&text=').concat(stringToSQL((text.value == '') ? '-' : text.value))
        .concat('&quotes=').concat(stringToSQL(quotes.value))
        .concat('&isMain=').concat(isMain)
        .concat('&addConnections=').concat(JSON.stringify(connToAdd))
        .concat('&removeConnections=').concat(JSON.stringify(connToRemove));

    if (document.getElementById('addUpdate').value == 'Save Changes') {
        params = params.concat('&idNote=').concat(graph.getVertex(graphIndex(currentNoteIndex)).id);
    }

    console.log(params);

    // xhr.open("POST", "../php/addUpdateNote.php", true);
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xhr.send(params);

    return true;
});