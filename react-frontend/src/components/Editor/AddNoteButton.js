import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Note from '../../scripts/notes/note';
import styles from '../../styles/Editor/AddNoteButton.module.css';

//const addButtonIcon = require('../resources/addButton.png');

const AddNoteButton = ({ onClick }) => {

    const location = useLocation();

    const clicked = (e) => {
        onClick?.(e, location.pathname);
    };

    return (
        <Link to='/editor' id={styles.add} onClick={clicked}></Link>
    );
}

export default AddNoteButton;