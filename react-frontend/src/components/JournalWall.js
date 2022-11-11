import Header from "./Header";
import LeftSideBox from "./LeftSideBox";
import siteStyles from '../styles/App.module.css';
import { useEffect, useState } from "react";
import Note from "../scripts/notes/note.js";
import Notebook from "../scripts/notes/notebook.js";
import Graph from "../scripts/graph/graph.js";
import CustomConfirm from "./CustomConfirm";

const JournalWall = ({ graph, notebooks }) => {

    // A state for an object that holds 'title', 'message', and 'callback' properties,
    // displaying a model what invokes the callback with the confirm results when set
    const [confirmObj, setConfirmObj] = useState({});

    const customConfirm = (title, message, callback) => {
        setConfirmObj({ title: title, message: message, callback: callback });
    }

    return (
        <div className={siteStyles.body}>
            
            <div className={siteStyles.main}>
                <LeftSideBox graph={graph} notebooks={notebooks}></LeftSideBox>
                <div id={siteStyles.content}>
                    <canvas id="background"></canvas>
                </div>
            </div>

            <CustomConfirm 
                confirmObj={confirmObj} 
                setConfirmObj={setConfirmObj}
            />
        </div>
    )
}

export default JournalWall;