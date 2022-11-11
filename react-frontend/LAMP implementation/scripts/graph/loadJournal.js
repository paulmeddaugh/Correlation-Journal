import Note from '../notes/note.js';
import Notebook from '../notes/notebook.js';
import Graph from './graph.js';
import { stringToSQL, stringFromSQL } from '../utility/utility.js';

/**
 * Loads a user's notes into a graph from the database.
 * 
 * @param {number} idUser The user whose notes to return.
 * @param {function} callback The function to call when the AJAX request returns.
 * @param {number} idNotebook An optional parameter to narrow the notes returned to a notebook.
 */
export function loadJournal (idUser, callback, idNotebook, asDisplayableNotes) {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

            let graph = new Graph(), notebooks = [];

            let result = xhr.responseText;
            console.log(result);
            result = stringToSQL(result);
            
            const jsonData = JSON.parse(result);
            const notes = jsonData.notes;
            const nbs = jsonData.notebooks;
            const connections = jsonData.connections;
            
            // Loads user note data into the graph
            if (notes.length > 0) {
                for (let noteData of notes) {
                    let note = new Note(noteData.idNote, stringFromSQL(noteData.title), noteData.idEmotion, 
                        stringFromSQL(noteData.text), stringFromSQL(noteData.quotes), noteData.idNotebook, 
                        !!Number(noteData.isMain), noteData.dateCreated);

                    graph.addVertex(note);
                }
            }

            // Loads note connections into graph
            if (connections.length > 0) {
                for (let connection of connections) {
                    graph.addEdge(graph.getVertex(String(connection.idNote1)), 
                        graph.getVertex(String(connection.idNote2)));
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

    xhr.open("GET", "../php/loadJournal.php" + params, true);
    xhr.send();
}