import styles from '../styles/NoteBoxNotebook.module.css';
import axios from 'axios';

const NoteBoxNotebook = ({ notebook, liftSelectProps, onRemoveClick }) => {

    const select = () => {
        liftSelectProps({ // Lifts props 
            optionInnerHTML: notebook.name, 
            'optionData-idnotebook': notebook.id, 
            nbOptionsVisible: false 
        });
    };

    const deleteNotebook = () => {
        if (!window.confirm("Are you sure you want to delete notebook '" + notebook.name + "' and all of its notes?")) {
            return;
        }
        
        // Delete on the backend
        axios.delete('/api/notebooks/' + notebook.id + '/deleteNotebook').then((response) => {
            alert(response);
            console.log(response);
        });

        // Delete on frontend
        onRemoveClick(notebook);
    };

    return (
        <div 
            className={styles.nbOption} 
            data-idnotebook={notebook.id} 
            onClick={select}
        >
            {notebook.name}
            {notebook.name !== 'All Notebooks' ? <div 
                    className={styles.removeNb} 
                    onClick={deleteNotebook}
            /> : null}
        </div>
    )
}

export default NoteBoxNotebook;