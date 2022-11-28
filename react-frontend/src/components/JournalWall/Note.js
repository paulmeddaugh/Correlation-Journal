import { useEffect } from 'react';
import styles from '../../styles/JournalWall/Note.module.css';

const Note = ({ noteAndIndex, point, onClick, onMount, selected }) => {

    useEffect(() => {
        onMount(noteAndIndex.note, noteAndIndex.index, point);
    }, []);

    return (
        <div 
            className={noteAndIndex?.note.main ? styles.mainNote : styles.stickyNote} 
            style={{ left: point?.x, top: point?.y }}
            onClick={() => onClick?.(noteAndIndex.note, noteAndIndex.index, point)}
        >
            <div className={styles.noteTitle + (selected?.note.id === noteAndIndex.note.id ? ' ' + styles.selected : '')}>
                {noteAndIndex?.note.title}
            </div>
            <div className={styles.noteText}>{noteAndIndex?.note.text}</div>
        </div>
    )
}

export default Note;