import { useEffect, useRef, useState } from "react";
import { binarySearch } from '../../scripts/utility/utility';
import styles from '../../styles/JournalWall/JournalWall.module.css';
import NoteWall from "./NoteWall";
import BackgroundCanvas from "./BackgroundCanvas";
import Graph from "../../scripts/graph/graph.js";
import Point from '../../scripts/notes/point';

const MAIN_NOTE_SIZE = { width: 100, height: 100 };
const STICKY_NOTE_SIZE = { width: 100, height: 100 };

const NOTE_WALL_GAP = 475;
const NOTE_WALL_X_START = 200;//'30%';
const NOTE_WALL_Y_START = 200;//'40%';

const JournalWall = ({ graph, notebooks, selectedState: [selected, setSelected] }) => {

    const [notes, setNotes] = useState([]);
    const [independentNotes, setIndependentNotes] = useState([]);
    const [scrollToMap, setScrollToMap] = useState(new Map());
    const [wallzindex, setWallzindex] = useState(4);

    const [drawArray, setDrawArray] = useState([]);

    const journalWallRef = useRef(null);

    useEffect(() => {
        // determine notes to put as center of spider web: 'main' type and 'sticky' with no connections 
        setNotes(graph.getVertices());
        const arr = graph.getVertices();
        for (let i = arr.length - 1; i >= 0; i--) { // filters while modifing from notes array
            if (arr[i].main === true || graph.getVertexNeighbors(i).length === 0) {
                scrollToMap.set(arr[i].id, getCenterPoint(i));
                arr[i] = { note: arr[i], index: i };
            } else {
                arr.splice(i, 1);
            }
        }
        setIndependentNotes(arr.concat());
        
    }, [graph]);

    useEffect(() => {
        const point = scrollToMap.get(selected.note?.id);
        const width = journalWallRef.current.getBoundingClientRect().width;
        const halfNoteWidth = 50; // Anticipates both note types are same width
        if (point) {
            journalWallRef.current.scrollTo({ left: point.x - (width / 2) + halfNoteWidth, behavior: 'smooth' });
        }
    }, [selected, journalWallRef]);

    const draw = (ctx, frameCount) => {

        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        // ctx.fillStyle = '#000000'
        // ctx.beginPath()
        // ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
        // ctx.fill()

        // Drawing grey line on independent note line
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = 'grey';
        ctx.setLineDash([15, 5]);
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Moves to first note position
        const { width, height } = (independentNotes[0]?.note.main) ? MAIN_NOTE_SIZE : STICKY_NOTE_SIZE;
        ctx.moveTo(NOTE_WALL_X_START + (width / 2), NOTE_WALL_Y_START + (height * .75));

        for (let i = 1; i < independentNotes.length; i++) { // iterates to every independent note
            const { width, height } = (independentNotes[i].note.main) ? MAIN_NOTE_SIZE : STICKY_NOTE_SIZE;
            ctx.lineTo(NOTE_WALL_X_START + (NOTE_WALL_GAP * i) + (width / 2), NOTE_WALL_Y_START + (height *.75));
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
        
        // Drawing date on independent note line
        ctx.fillStyle = 'grey';
        ctx.font = '9pt Arial';
        for (let i = 0; i < independentNotes.length; i++) {
            const date = new Date(independentNotes[i].note.dateCreated)
                .toLocaleDateString('en-us', { month:"short", day:"numeric" });
            const { width, height } = (independentNotes[i].note.main) ? MAIN_NOTE_SIZE : STICKY_NOTE_SIZE;
            ctx.fillText(date, NOTE_WALL_X_START + (NOTE_WALL_GAP * i) + width + 5, NOTE_WALL_Y_START + (height * .667));
        }
    }

    useEffect(() => {
        drawArray.push(draw);
        setDrawArray(drawArray);
    }, [independentNotes]);

    const onNoteMount = (note, index, point) => {
        if (!scrollToMap.has(note.id)) scrollToMap.set(note.id, point);
        setScrollToMap(new Map(scrollToMap));
    } 

    const onCenterNoteClick = (note, index, point) => {
        setSelected({ note: note, index: index });
    }

    const onConnectionClick = (note, index, point) => {
        const width = journalWallRef.current.getBoundingClientRect().width;
        const halfNoteWidth = (note.main) ? MAIN_NOTE_SIZE.width / 2 : STICKY_NOTE_SIZE.width / 2;
        journalWallRef.current.scrollTo({ left: point.x - (width / 2) + halfNoteWidth, behavior: 'smooth' });
    };

    const getCenterPoint = (i) => {
        return new Point(NOTE_WALL_X_START + (i * NOTE_WALL_GAP), NOTE_WALL_Y_START);
    }

    const getConnectingNotes = (graphIndex) => {
        const ids = graph.getVertexNeighbors(graphIndex);
        return (notes) ? ids?.map(({ v }, i) => {
            const results = binarySearch(notes, v.id);
            return { note: results[0], index: results[1] };
        }) : null;
    }

    return (
        <div className={styles.main} ref={journalWallRef}>
            {independentNotes?.map((noteAndIndex, i) => (
                <NoteWall 
                    noteAndIndex={noteAndIndex}
                    centerPoint={getCenterPoint(i)}
                    connectingNotes={getConnectingNotes(noteAndIndex.index)}
                    onNoteMount={onNoteMount}
                    onNoteClick={onCenterNoteClick}
                    onConnectionClick={onConnectionClick}
                    drawArrayState={[drawArray, setDrawArray]}
                    selected={selected}
                    key={i}
                />
            ))}
            <BackgroundCanvas drawArray={drawArray} resizeRef={journalWallRef}></BackgroundCanvas>
        </div>
    )
}

export default JournalWall;