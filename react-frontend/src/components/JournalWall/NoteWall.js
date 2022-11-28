import { useEffect, useState } from "react";
import Note from "./Note";
import Point from "../../scripts/notes/point";
import Canvas from "./Canvas";

const CONNECTIONS_DISTANCE = 175;

const NOTE_CENTER_MAIN_X = 100 / 2;
const NOTE_CENTER_MAIN_Y = 125 / 2;
const NOTE_CENTER_STICKY_X = 100 / 2;
const NOTE_CENTER_STICKY_Y = 100 / 2;

const NoteWall = ({ noteAndIndex, centerPoint, connectingNotes, hasConnectionCanvas, drawArrayState: [drawArray, setDrawArray],
    onConnectionClick, onNoteClick, onNoteMount, selected }) => {

    const determineConnectingNotePoint = (i) => {
        let angle = (Math.PI * 2 / connectingNotes.length) * i + Math.PI / 2;
        return new Point(
            centerPoint.x - CONNECTIONS_DISTANCE * Math.cos(angle),
            centerPoint.y - CONNECTIONS_DISTANCE * Math.sin(angle)
        );
    };

    const draw = (ctx, frameCount) => {

        if (hasConnectionCanvas) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const noteMidX = (noteAndIndex.note.main) ? NOTE_CENTER_MAIN_X : NOTE_CENTER_STICKY_X;
        const noteMidY = (noteAndIndex.note.main) ? NOTE_CENTER_MAIN_Y : NOTE_CENTER_STICKY_Y;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < connectingNotes?.length; i++) {
            ctx.moveTo(centerPoint.x + noteMidX, centerPoint.y + noteMidY);
            const connectingPoint = determineConnectingNotePoint(i);
            const midX = (connectingNotes[i].note.main) ? NOTE_CENTER_MAIN_X : NOTE_CENTER_STICKY_X;
            const midY = (connectingNotes[i].note.main) ? NOTE_CENTER_MAIN_Y : NOTE_CENTER_STICKY_Y;
            ctx.lineTo(connectingPoint.x + midX, connectingPoint.y + midY);
        }
        ctx.stroke();
        ctx.closePath();
    };

    useEffect(() => {
        // onMount(draw)
        if (!hasConnectionCanvas && drawArray) {
            drawArray.push(draw);
            setDrawArray(drawArray);
        }
    }, []);

    return (
        <div style={{ left: centerPoint.x - CONNECTIONS_DISTANCE, top: centerPoint.y - CONNECTIONS_DISTANCE }}>
            <Note 
                noteAndIndex={noteAndIndex} 
                point={centerPoint} 
                onClick={onNoteClick}
                onMount={onNoteMount}
                selected={selected}
            />
            {connectingNotes?.map((noteAndIndex, i) => (
                <Note 
                    noteAndIndex={noteAndIndex}
                    point={determineConnectingNotePoint(i)}
                    onClick={onConnectionClick}
                    onMount={onNoteMount}
                    selected={selected}
                    key={i} 
                />
            ))}
            {hasConnectionCanvas ? (
                <Canvas draw={draw} />
            ) : null}
        </div>
    )
}

export default NoteWall;