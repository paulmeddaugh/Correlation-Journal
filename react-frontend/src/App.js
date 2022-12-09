import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import styles from './styles/App.module.css';
import Login from './components/LoginComponents/Login.js';
import CreateAccount from './components/LoginComponents/CreateAccount.js';
import ForgotPassword from './components/LoginComponents/ForgotPassword';
import Header from './components/Header';
import NoteBoxLayout from './components/NoteBox/NoteBoxLayout';
import Graph from './scripts/graph/graph';
import loadJournal from "./scripts/graph/loadJournal.js";
import Editor from './components/Editor/Editor';
import AddNoteButton from './components/Editor/AddNoteButton';
import Account from './components/Account';
import JournalWall from './components/JournalWall/JournalWall';
import Loading from './components/LoginComponents/Loading';

const App = () => {

    const [user, setUser] = useState(null);
    const [graph, setGraph] = useState(new Graph());
    const [notebooks, setNotebooks] = useState([]);
    const [selected, setSelected] = useState({}); // format: { note: ___, index: ___ }

    const [loading, setLoading] = useState(false);

    const [newNoteId, setNewNoteId] = useState(-1);
    const [addNoteClick, setAddNoteClick] = useState(null);

    const headerRef = useRef(null);

    useEffect(() => {
        if (user?.id) {
            loadJournal(user.id, (g, nbs) => {
                nbs.unshift({ name: 'All Notebooks' });
                setGraph(g);
                setNotebooks(nbs);
                setSelected({ note: g.getVertex(0), index: 0 });
                setLoading(false);
                console.log(g);
            });
        }
    }, [user]);

    if (loading) {
        return (
            <Loading 
                status={loading.status} 
                linkText={loading.linkText} 
                onLinkClick={() => setLoading(false)}
            />
        )
    }

    return (
        <div className={styles.fullSize}>
            {!user?.id ? (
                <BrowserRouter>
                    <Routes>
                        <Route path="*" element={
                            <Login 
                                onValidUser={setUser} 
                                onLoadingUser={() => setLoading({ status: 'Loading...' })} 
                                onLoginError={() => setLoading({ status: 'The backend is not running.', linkText: 'Retry' })} 
                            />}
                        />
                        <Route path="createAccount/*" element={<CreateAccount />} />
                        <Route path="forgotPassword/*" element={<ForgotPassword />} />
                    </Routes>
                </BrowserRouter> 
            ) : (
                <BrowserRouter>
                    <Header ref={headerRef} username={user.username} />
                    <Routes>
                        <Route path="/editor" element={
                            <NoteBoxLayout 
                                graphState={[graph, setGraph]} 
                                notebooksState={[notebooks, setNotebooks]}
                                selectedState={[selected, setSelected]}
                                headerRef={headerRef}
                            >
                                <Editor 
                                    userId={user.id}
                                    selectedState={[selected, setSelected]}
                                    graphState={[graph, setGraph]} 
                                    notebooksState={[notebooks, setNotebooks]}
                                    onMount={() => setNewNoteId(-1)}
                                />
                            </NoteBoxLayout>} 
                        />
                        <Route path="/" element={
                            <NoteBoxLayout 
                                graphState={[graph, setGraph]} 
                                notebooksState={[notebooks, setNotebooks]}
                                selectedState={[selected, setSelected]}
                                headerRef={headerRef}
                            >
                                <JournalWall
                                    graph={graph}
                                    notebooks={notebooks}
                                    selectedState={[selected, setSelected]}
                                />
                            </NoteBoxLayout>
                        } />
                        <Route path="account" element={
                            <Account 
                                user={user} 
                                graphValues={{ noteCount: graph.size(), notebookCount: notebooks.length }} 
                            />
                        } />
                    </Routes>
                    <AddNoteButton 
                        graphState={[graph, setGraph]} 
                        newNoteIdState={[newNoteId, setNewNoteId]} 
                        setSelected={setSelected}
                    />
                </BrowserRouter>
            )}
        </div>
        
    );
}

export default App;