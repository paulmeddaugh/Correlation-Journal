import { useEffect, useRef, useState } from 'react';
import styles from '../styles/EditNote.module.css';
import Note from '../scripts/notes/note.js';
import Graph from '../scripts/graph/graph';
import axios from 'axios';
import Notebook from '../scripts/notes/notebook';
import { useUnmount, binarySort } from '../scripts/utility/utility';

const notebookIcon = require("../resources/notebook.jfif");

const EditNote = ({ note, user, setSelectedNote,
	graphState: [graph, setGraph], notebooksState: [notebooks, setNotebooks]}) => {

	const [noteInEditor, setNoteInEditor] = useState(new Note());

	const [notebookName, setNotebookName] = useState('');
	const [connections, setConnections] = useState([]);

	const dataListRef = useRef(null);

	useEffect(() => {
		if (note) {
			setNoteInEditor(new Note(
				note?.id ? note.id : null,
				note?.title ? note.title : '',
				note?.text ? note.text : '',
				note?.quotes ? note.quotes : '',
				note?.idNotebook ? note.idNotebook : -1,
				note?.main ? note.main : true,
				note?.dateCreated ? note.dateCreated : null,
			));
			setNotebookName(getNotebookName(note?.idNotebook) ?? '');
			setConnections(null);
		}
	}, [note, dataListRef]);

	useUnmount(() => { // Doesn't get stale state values not in dependency array
		if (note?.id && noteInEditor?.id && graph.indexOf(noteInEditor) !== -1) update();
	}, [note]);

	const update = (e) => {
		if (!e && !window.confirm("Would you like to save note '" + noteInEditor.title + "'?")) {
			return false;
		}

		if (notebookName === '') {
			window.alert("A notebook must be selected.");
			return false;
		}

		// Determines if notebook exists
		let notebookId = dataListRef.current?.options.namedItem(notebookName)?.getAttribute('data-id');

		// Creates a new notebook if not-existent
		if (!notebookId && notebookName !== 'All Notebooks') {
			if (!window.confirm("Create notebook '" + notebookName + "'?")) {
				return false;
			} else { // Creates the new Notebook
				const notebookForBackend = {
					name: notebookName, 
					idUser: user.id, 
					dateCreated: new Date(),
				}
				axios.post('/api/notebooks/newNotebook', notebookForBackend).then((response) => {
					console.log(response);
					notebookId = response.data.id;

					notebooks.push(new Notebook(response.data.id, notebookName));
					setNotebooks(notebooks);

					updateAddNote();
				});
			}
		} else {
			updateAddNote();
		}

		function updateAddNote () {

			let updatingNote = { ...noteInEditor, idNotebook: Number(notebookId) };

			// Adding new note
			if (note?.id < 0) {

				// Add to backend first to get new note 'id'
				updatingNote.idUser = user.id;
				console.log('noteforbackend:', updatingNote);
				axios.post('/api/notes/newNote', updatingNote).then((response) => {

					console.log(response);
					// Format note for frontend
					updatingNote.id = response.data.id;
					delete updatingNote.idUser;
					console.log('noteForFrontend', updatingNote);

					// Add to frontend
					graph.updateVertex(updatingNote, graph.indexOf(noteInEditor));
					setGraph(graph.clone());

					// Only updates if button clicked (not other note selection)
					if (e) setNoteInEditor(updatingNote);
				});

			// Updating a note
			} else {
				// On frontend
				if (e) setNoteInEditor(updatingNote); // Only updates if button clicked (not other note selection)
				graph.updateVertex(updatingNote);
				setGraph(graph.clone());

				// On backend
				updatingNote.idUser = user.id;
				axios.put('/api/notes/' + updatingNote.id + '/updateNote', updatingNote).then((response) => {
					console.log(response);
				});
			}
		}
	};

	// Binary searches for the name of a notebook from its id: O(log n)
	const getNotebookName = (id) => {

		console.log('1 id:', id);
		if (typeof id !== 'number' || id === 0) return null;
		console.log('2 passed');

		return binarySort(notebooks, id)[0].name;
	}

	function mainToggle (e) {
		setNoteInEditor({...noteInEditor, main: (e.target.id === 'mainRadio') ? true : false});
	}

    return (
        <form>
			<div className={styles.flexRow}>
				<img src={notebookIcon} alt="" />
				<input 
					type="text" 
					list="notebookOptions" 
					id={styles.notebook} 
					className={styles.editorTextInputs} 
					placeholder="Notebook"
					value={notebookName}
					onChange={(e) => setNotebookName(e.target.value)}
				/>
					<datalist id="notebookOptions" ref={dataListRef}>
						{notebooks?.map((nb, index) => (
                            nb.name !== 'All Notebooks' ? 
								<option value={nb.name} name={nb.name} data-id={nb.id} key={index}>
									{nb.name}
								</option>
							: null
                        ))}
					</datalist>
			</div>

			<div id={styles.editor} className={noteInEditor?.main ? styles.editorMainColor : styles.editorStickyColor}>
				<input 
					type="text" 
					id={styles.title} 
					className={styles.editorTextInputs} 
					placeholder="Title" 
					value={noteInEditor.title}
					onChange={(e) => setNoteInEditor({...noteInEditor, title: e.target.value})}
				/>
				<textarea 
					id={styles.text} 
					className={styles.editorTextInputs} 
					placeholder="..." 
					value={noteInEditor.text}
					onChange={(e) => setNoteInEditor({...noteInEditor, text: e.target.value})}
				/>
				<textarea 
					id={styles.quotes} 
					className={styles.editorTextInputs} 
					placeholder="Quotes" 
					value={noteInEditor.quotes}
					onChange={(e) => setNoteInEditor({...noteInEditor, quotes: e.target.value})}
				/>
				<div className={styles.radioRow}>
					<input 
						type="radio"
						className="btn-check" 
						name="options-outlined" 
						id="stickyRadio" 
						autoComplete="off" 
						checked={!noteInEditor.main} 
						onChange={mainToggle} 
					/>
					<label className="btn" id={styles.stickyButton} htmlFor="stickyRadio">Sticky Note</label>

					<input 
						type="radio" 
						className="btn-check" 
						name="options-outlined" 
						id="mainRadio" 
						autoComplete="off" 
						checked={noteInEditor.main} 
						onChange={mainToggle} 
					/>
					<label className="btn" id={styles.mainButton} htmlFor="mainRadio">Main Note</label>
				</div>
			</div>

			<div id={styles.connectionsRow}>
				<label htmlFor="connections"> Connections:&nbsp; </label>
				<div id={styles.connections} />
				<div id={styles.plusContainer} className={styles.plusContainer}>
					<div id={styles.plusText} className={styles.plusText}>+</div>
					<select id={styles.addingConnection} type="text" list="noteOptions" title="Connecting Note" />
				</div>
			</div>

          <input type="button" id="addUpdate" value={note?.id < 0 ? "Add Note" : "Update Note"} onClick={update}/>
        </form>
    )
};
export default EditNote;