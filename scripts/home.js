import Graph from '../scripts/graph/graph.js';
import Note from './notes/note.js';
import { addNotesToInfoBox, addNotebooksToInfoBox, loadInfoBox } from './components/infoBox.js';
import Point from './notes/point.js';
import { displayMainNoteOnWall, displayStickyNoteOnWall, addConnection, scaleToDPR } from '../scripts/graph/graphView.js'
import { loadJournal } from './graph/loadJournal.js';

let infoBox;
let graph, notebooks;
let idUser = sessionStorage.getItem('uid');

const MAIN_NOTE_GAP_BEGIN = 150;
const MAIN_NOTE_GAP = 200;
const MAIN_NOTE_HEIGHT = 200;
const STICKY_NOTE_RADIUS = 100;
const STICKY_NOTE_MIN_GAP = 100;

window.addEventListener("load", () => {

    // Manually sets the height of 'main' to 100% - header
    let header = document.getElementsByTagName('header-component')[0];
    let main = document.getElementsByTagName('main')[0];
    main.style.height = parseInt(window.getComputedStyle(document.body).height) 
        - parseInt(window.getComputedStyle(header).height) + 'px';

    infoBox = document.getElementsByTagName('info-box-component')[0];
    let n = new Note(1, "Hello", null, "Nice to meet ya.");

    loadJournal(idUser, (g, nbs) => {

        let notes = (graph = g).getVertices();
        loadInfoBox(infoBox, notes, (notebooks = nbs));

        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            let gap = MAIN_NOTE_GAP_BEGIN + (i * MAIN_NOTE_GAP);
            displayMainNoteOnWall(note, new Point(gap, MAIN_NOTE_HEIGHT));
        }

        // Add notes to journal wall
        
        // displayMainNoteOnWall(n, new Point(150, 200));
        // displayStickyNoteOnWall(n, new Point(250, 50));

        // addConnection(new Point(400, 200), new Point(300, 100));
    
        scaleToDPR();
    });
});

window.addEventListener("resize", () => {
    let canvas = document.getElementById('background');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    scaleToDPR();
});