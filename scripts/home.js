import Graph from '../scripts/graph/graph.js';
import Note from './notes/note.js';
import { addNotesToInfoBox, addNotebooksToInfoBox } from './components/infoBox.js';
import Point from './notes/point.js';
import { displayMainNoteOnWall, displayStickyNoteOnWall, addConnection } from '../scripts/graph/graphView.js'
import { loadJournal } from './graph/loadGraph.js';

let infoBox;
let graph, notebooks;
let idUser = sessionStorage.getItem('uid');

window.addEventListener("load", () => {

    // Manually sets the height of 'main' to 100% - header
    let header = document.getElementsByTagName('header-component')[0];
    let main = document.getElementsByTagName('main')[0];
    main.style.height = parseInt(window.getComputedStyle(document.body).height) 
        - parseInt(window.getComputedStyle(header).height) + 'px';

    infoBox = document.getElementsByTagName('info-box-component')[0];
    let n = new Note(1, "Hello", null, "Nice to meet ya.");

    loadJournal(idUser, (g, nbs) => {

        addNotesToInfoBox(infoBox, (graph = g).getVertices());
        addNotebooksToInfoBox(infoBox, (notebooks = nbs));

        // Add notes to journal wall
        displayMainNoteOnWall(n, new Point(400, 200));
        displayMainNoteOnWall(n, new Point(150, 200));
        displayStickyNoteOnWall(n, new Point(250, 50));

        addConnection(new Point(400, 200), new Point(300, 100));
    });
});