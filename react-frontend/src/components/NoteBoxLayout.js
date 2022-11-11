import { useEffect, useRef, useState } from "react";
import siteStyles from '../styles/App.module.css';
import NoteBox from "./NoteBox";
import CustomConfirm from "./CustomConfirm";

const NoteBoxLayout = ({ graphState, notebooksState, children, selectedNoteState, headerRef }) => {

    // A state for an object that holds 'title', 'message', and 'callback' properties,
    // displaying a model what invokes the callback with the confirm results when set
    const [confirmObj, setConfirmObj] = useState({});

    const bodyRef = useRef(null);

    const customConfirm = (title, message, callback) => {
        setConfirmObj({ title: title, message: message, callback: callback });
    }

    useEffect(() => {
        // Manually sets the height of 'main' to 100% - header
        if (headerRef.current !== null && bodyRef.current !== null) {
            bodyRef.current.style.height = parseInt(window.getComputedStyle(document.body).height) 
            - parseInt(window.getComputedStyle(headerRef.current).height) + 'px';
        }
        
    }, [headerRef, bodyRef]);

    return (
        <div className={siteStyles.body} ref={bodyRef}>
            
            <div className={siteStyles.main}>
                <NoteBox 
                    graphState={graphState} 
                    notebooksState={notebooksState} 
                    selectedNoteState={selectedNoteState} 
                />
                <div id={siteStyles.content}>
                    {children}
                    {/* <canvas id={siteStyles.background}></canvas> */}
                </div>
            </div>

            <CustomConfirm 
                confirmObj={confirmObj} 
                setConfirmObj={setConfirmObj}
            />
        </div>
    )
}

export default NoteBoxLayout;