import styles from '../styles/NoteBoxNote.module.css';
import axios from 'axios';
import Graph from '../scripts/graph/graph';

const NoteBoxNote = ({ note,
    graphState: [graph, setGraph], selectedNoteState: [selectedNote, setSelectedNote] }) => {

    const select = () => {
        setSelectedNote(note);
    };

    const deleteNote = () => {
        if (!window.confirm("Are you sure you want to delete note \"" + note.title + "\"?")) {
            return;
        }

        // Delete from backend
        axios.delete('/api/notes/' + note.id + '/deleteNote').then((response) => {
            console.log(response);
        });

        // Delete on frontend
        graph.removeVertex(note);
        setGraph(graph.clone());
    };

    return (
        <a onClick={select} href={'#' + note.id}
            className={"list-group-item list-group-item-action flex-column align-items-start" 
                + ((selectedNote.id === note.id) ? " active" : '')}
            data-idnotebook={note.idNotebook}
        >
            <div className="d-flex w-30 justify-content-between">
                <h5 className="mb-1" id="title">{note.title}</h5>
                <small>
                    {new Date(note.dateCreated)
                        .toLocaleDateString('en-us', { month:"short", day:"numeric" })}
                </small>
            </div>
            <p className="mb-1">{note.text}</p>
            {note.id !== null ? 
                <div 
                    className={styles.removeNote 
                        + (selectedNote.id === note.id ? " " + styles.removeNoteEntry : '')} 
                    onClick={deleteNote} 
                /> : null
            }
        </a>
    )
}

export default NoteBoxNote;