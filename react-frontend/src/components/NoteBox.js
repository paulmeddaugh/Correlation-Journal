import { useRef, useState } from 'react';
import styles from '../styles/NoteBox.module.css';
import NoteBoxNote from './NoteBoxNote';
import CustomSelect from './CustomSelect';
import { binarySort } from '../scripts/utility/utility';

const pinSrc = require("../resources/unpinIcon.jpg");
const unpinSrc = require("../resources/unpinIcon2.png");

const NoteBox = ({ graphState: [graph, setGraph], notebooksState: [notebooks, setNotebooks], 
    selectedNoteState }) => {

    const [areSearchResults, setSearchResults] = useState(true);
    const [customSelectValues, setCustomSelectValue] = useState({
        innerHTML: 'All Notebooks',
        'data-id': null,
    });

    const infobox = useRef(null);
    const listGroupFlush = useRef(null);
    const searchInput = useRef(null);
    const noNotes = useRef(null);

    const pinIcon = useRef(null);

    const unpin = () => {
        infobox.current.style.width = '0px';
        pinIcon.current.style.display = 'block'; // makes visible

        setTimeout(() => { // Allows transition effect first
            infobox.current.style.position = 'absolute';
            infobox.current.style.right = '100%';
        }, 1000);
    };

    const pin = () => {
        infobox.current.style.width = '300px';
        infobox.current.style.position = 'unset';
        pinIcon.current.style.display = 'none'; // makes invisible
    };

    const searchInputChange = () => {
        let anyNotes = false;
        const notesInBox = listGroupFlush.current.children;
        for (let i = 1; i < notesInBox.length; i++) {

            const idSelectedNb = customSelectValues['data-id'];
            const idNotebook = notesInBox[i].getAttribute('data-idnotebook');
            const regex = new RegExp(searchInput.current.value, 'i');
            const isMatching = notesInBox[i].children[0].children[0].innerHTML.match(regex) || // in title
            notesInBox[i].children[1].innerHTML.match(regex); // or text

            if (isMatching && (!idSelectedNb || idSelectedNb === idNotebook)) {
                notesInBox[i].style.display = "block";
                anyNotes = true;
            } else {
                notesInBox[i].style.display = "none";
            }
        }

        setSearchResults(anyNotes);
    };

    const onSelectNotebook = (innerHTML, value, optionId) => {
        let anyNotes = false;
        for (let i = 1, notesInBox = listGroupFlush.current.children; i < notesInBox.length; i++) {
            if ((notesInBox[i].getAttribute('data-idnotebook') === optionId) || (!optionId)) {
                notesInBox[i].style.display = 'block';
                anyNotes = true;
            } else {
                notesInBox[i].style.display = 'none';
            }
        }

        noNotes.current.style.display = (!anyNotes) ? 'block' : 'none';
        setCustomSelectValue({ innerHTML: innerHTML, 'data-id': optionId });
    }

    // Handler for the onRemove prop of the customized select for notebooks
    const onRemoveNotebook = (notebook) => {

        // Deletes notebook: O(log n) time
        const id = notebook.id, [ , index] = binarySort(notebooks, id);
        notebooks.splice(index, 1);
        setNotebooks(notebooks);

        // Deletes notes in notebook: O(n) time
        for (let note of graph.getVertices()) {
            if (note.idNotebook === id) {
                graph.removeVertex(note);
            }
        }
        setGraph(graph.clone());
    };

    return (
        <div id={styles.leftBox}>
            <div id={styles.infobox} ref={infobox}>
                <div id={styles.searchBar} className={styles.configs}>
                    <label htmlFor="searchInput">Search:&nbsp;</label>
                    <input 
                        type="text" 
                        list='noteOptions'
                        id={styles.searchInput} 
                        placeholder="By title, body"
                        onChange={searchInputChange}
                        ref={searchInput}
                    />
                    <datalist id='noteOptions'>
                        {graph.getVertices()?.map((note, index) => (
                            <option value={note.tiselectPropstle} key={index}>
                                {note.title}
                            </option>
                        ))}
                    </datalist>
                    <div id={styles.unpin} onClick={unpin}>
                        <img src={unpinSrc} alt="unpin" />
                    </div>
                </div>
                <CustomSelect
                    items={notebooks}
                    onSelect={onSelectNotebook}
                    onRemoveClick={onRemoveNotebook}
                    defaultValues={customSelectValues}
                />
                <div id={styles.noteContainer} className="list-group list-group-flush" ref={listGroupFlush}>
                    <div 
                        id={styles.noNotes} 
                        className={areSearchResults ? styles.searchResults : styles.noSearchResults}
                        ref={noNotes}
                    >
                        No notes found. 
                    </div>

                    {graph.getVertices()?.reduce((prev, note, i, arr) => {
                        // Maps Note components from the graph, but places newly created notes at start: O(n)
                        const comp = (
                            <NoteBoxNote 
                                note={note} 
                                key={i}
                                graphState={[graph, setGraph]}
                                selectedNoteState={selectedNoteState}
                            />);
                        if (note.id < 0) {
                            arr.splice(i, 1);
                            arr.unshift(comp);
                        } else {
                            arr[i] = comp;
                        }
                        return arr;
                    }, [])}
                </div>
            </div>
            <div id={styles.pin} onClick={pin} ref={pinIcon}>
                <span> Notes </span>
                <img src={pinSrc} alt="pin" />
            </div>
        </div>
    );
}

export default NoteBox;