import Note from '../scripts/notes/note';
import styles from '../styles/AddNoteButton.module.css';

//const addButtonIcon = require('../resources/addButton.png');

const AddNoteButton = ({ graphState: [graph, setGraph], newNoteIdState: [newNoteId, setNewNoteId],
    setSelectedNote }) => {

    const onClick = () => {
        const newNote = new Note(newNoteId, 'Untitled', '-', '', null, true, new Date())
        graph.addVertex(newNote);
        setGraph(graph.clone());
        setNewNoteId((prev) => prev - 1);
        setSelectedNote(newNote);
    };

    return (
        <button id={styles.add} onClick={onClick} />
    );
}

export default AddNoteButton;