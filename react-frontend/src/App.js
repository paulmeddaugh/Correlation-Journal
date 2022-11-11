import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import styles from './styles/App.module.css';
import Login from './components/Login.js';
import CreateAccount from './components/CreateAccount.js';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import NoteBoxLayout from './components/NoteBoxLayout';
import Graph from './scripts/graph/graph';
import loadJournal from "./scripts/graph/loadJournal.js";
import EditNote from './components/EditNote';
import AddNoteButton from './components/AddNoteButton';

const App = () => {

    const [user, setUser] = useState(null);
    const [graph, setGraph] = useState(new Graph());
    const [notebooks, setNotebooks] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

    const [newNoteId, setNewNoteId] = useState(-1);

    const headerRef = useRef(null);

    useEffect(() => {
        if (user?.id) loadJournal(user.id, (g, nbs) => {
            nbs.unshift({ name: 'All Notebooks' });
            setGraph(g);
            setNotebooks(nbs);
            setSelectedNote(g.getVertex(0));
            console.log(g);
        });
    }, [user]);

    return (
        <div className={styles.fullSize}>
            {!user?.id ? (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login onValidUser={setUser} />} />
                        <Route path="createAccount/*" element={<CreateAccount />} />
                        <Route path="forgotPassword/*" element={<ForgotPassword />} />
                    </Routes>
                </BrowserRouter> 
            ) : (
                <BrowserRouter>
                    <Header ref={headerRef} username={user.username} />
                    <Routes>
                        <Route path="/" element={
                            <NoteBoxLayout 
                                graphState={[graph, setGraph]} 
                                notebooksState={[notebooks, setNotebooks]}
                                selectedNoteState={[selectedNote, setSelectedNote]}
                                headerRef={headerRef}
                            >
                                <EditNote 
                                    user={user}
                                    note={selectedNote}
                                    setSelectedNote={setSelectedNote}
                                    graphState={[graph, setGraph]} 
                                    notebooksState={[notebooks, setNotebooks]}
                                />
                            </NoteBoxLayout>
                        } />
                    </Routes>
                    <AddNoteButton 
                        graphState={[graph, setGraph]} 
                        newNoteIdState={[newNoteId, setNewNoteId]} 
                        setSelectedNote={setSelectedNote}
                    />
                </BrowserRouter>
            )}
        </div>
        
    );
}

export default App;