import { Link } from 'react-router-dom';
import Note from '../../scripts/notes/note';
import styles from '../../styles/Editor/AddNoteButton.module.css';

//const addButtonIcon = require('../resources/addButton.png');

const AddNoteButton = ({ graphState: [graph, setGraph], newNoteIdState: [newNoteId, setNewNoteId],
    setSelected }) => {

    const onClick = () => {
        const newNote = new Note(newNoteId, '', '', '', null, true, new Date());
        graph.addVertex(newNote);
        setGraph(graph.clone());
        setNewNoteId((prev) => prev - 1);
        setSelected({ note: newNote, index: graph.size() - 1 });
    };

    return (
        <Link to="/editor"><button id={styles.add} onClick={onClick} /></Link>
    );
}

export default AddNoteButton;