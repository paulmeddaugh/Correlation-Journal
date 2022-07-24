import Note from '../notes/note.js';
import Notebook from '../notes/notebook.js';
import Graph from './graph.js';
import { removeNonSQLCharacters } from '../utility/utility.js';

/**
 * Loads a user's notes into a graph from the database.
 * 
 * @param {number} idUser The user whose notes to return.
 * @param {function} callback The function to call when the AJAX request returns.
 * @param {number} idNotebook An optional parameter to narrow the notes returned to a notebook.
 */
export function loadJournal (idUser, callback, idNotebook) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

            let graph = new Graph(), notebooks = [];

            let result = xhr.responseText;
            console.log(result);
            result = removeNonSQLCharacters(result);
            
            let jsonData = JSON.parse(result);
            let notes = jsonData.notes;
            let nbs = jsonData.notebooks;
            
            // Loads user note data into the graph
            if (notes.length > 0) {
                for (let noteData of notes) {
                    let note = new Note(noteData.idNote, noteData.title, noteData.idEmotion, noteData.text,
                        noteData.quotes, noteData.idNotebook, noteData.isMain, noteData.dateCreated);
                    graph.addVertex(note);

                    if (noteData.idMain != null) { // Supporting note
                        graph.addEdge(graph.getVertex(noteData.idMain), note);
                    }
                }
            }

            // Loads notebook data into an array
            if (nbs.length > 0) {
                for (let nbData of nbs) {
                    let notebook = new Notebook(nbData.idNotebook, nbData.name);
                    notebooks.push(notebook);
                }
            }

            callback(graph, notebooks);
        }
    }

    let params = "?idUser=" + idUser;
    if (idNotebook) params += "&idNotebook=" + idNotebook;

    xhr.open("GET", "../php/loadGraph.php" + params, true);
    xhr.send();
}