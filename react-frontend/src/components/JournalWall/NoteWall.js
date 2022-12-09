import { useEffect, useRef, useState } from "react";
import styles from '../../styles/JournalWall/NoteWall.module.css';
import BigNote from './BigNote';
import Note from "./Note";
import Line from "./Line";
import Canvas from "./Canvas";
import { binarySearch } from "../../scripts/utility/utility";

const CONNECTIONS_DISTANCE = 175;

const NOTE_CENTER_MAIN_X = 100 / 2;
const NOTE_CENTER_MAIN_Y = 125 / 2;
const NOTE_CENTER_STICKY_X = 100 / 2;
const NOTE_CENTER_STICKY_Y = 100 / 2;
const BIG_NOTE_HOVER_X = 175;
const BIG_NOTE_HOVER_Y = 219;

const NoteWall = ({ noteAndIndex, centerPoint, connectingNotes, hasConnectionCanvas, onMount,
    onConnectionClick, onNoteClick, onNoteMount, selected, connectionWall }) => {

    const [bigNoteAnimation, setBigNoteAnimation] = useState(0);
    const noteWallRef = useRef(null);
    const bigNoteRef = useRef(null);
    const noteRefs = useRef([]);

    const draw = (ctx, frameCount) => {

        if (hasConnectionCanvas) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const noteMidX = (noteAndIndex.note.main) ? NOTE_CENTER_MAIN_X : NOTE_CENTER_STICKY_X;
        const noteMidY = (noteAndIndex.note.main) ? NOTE_CENTER_MAIN_Y : NOTE_CENTER_STICKY_Y;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < connectingNotes?.length; i++) {
            ctx.moveTo(centerPoint.x + noteMidX, centerPoint.y + noteMidY);
            const connectingPoint = connectingNoteInlineStyle(i);
            const midX = (connectingNotes[i].note.main) ? NOTE_CENTER_MAIN_X : NOTE_CENTER_STICKY_X;
            const midY = (connectingNotes[i].note.main) ? NOTE_CENTER_MAIN_Y : NOTE_CENTER_STICKY_Y;
            ctx.lineTo(connectingPoint.x + midX, connectingPoint.y + midY);
        }
        ctx.stroke();
        ctx.closePath();
    };

    useEffect(() => {
        onMount(hasConnectionCanvas, draw);
    }, []);

    const boundaryInline = () => ({
        width: BIG_NOTE_HOVER_X + CONNECTIONS_DISTANCE,
        height: BIG_NOTE_HOVER_Y + CONNECTIONS_DISTANCE,
        left: centerPoint.x,
        top: centerPoint.y
    });

    const bigNoteInlineStyle = () => {
        return (!bigNoteAnimation) ? {} : {
            width: BIG_NOTE_HOVER_X,
            height: BIG_NOTE_HOVER_Y,
            border: '1px solid',
            backgroundColor: 'rgba(240, 238, 239, .95)',
        };
    }

    const connectingNoteInlineStyle = (i) => {

        if (!bigNoteAnimation) {
            return {
                rotate: (Math.floor(Math.random() * 2) ? '' : '-') + '1deg',
            };
        }

        if (bigNoteAnimation === 1 && noteRefs.current.length) { // Returns the last position of the note when attached to BigNote
            if (noteRefs.current[i].style?.top === '') {
                if (noteRefs.current[i].id) {
                    const { left: noteLeft, top: noteTop } = noteRefs.current[i].getBoundingClientRect();
                    const { left: parentLeft, top: parentTop } = noteWallRef.current.getBoundingClientRect();
                    noteRefs.current[i] = {
                        left: noteLeft - parentLeft + NOTE_CENTER_MAIN_X, 
                        top: noteTop - NOTE_CENTER_MAIN_Y,
                    };
                }

                setTimeout(() => {
                    if (bigNoteAnimation === 1) setBigNoteAnimation(2);
                    noteRefs.current = [];
                }, 5);
            }

            return noteRefs.current[i];
        } else {
            const angle = getLineAngle(i);
            const noteWallCenter = getNoteWallCenter();
            
            return {
                left: noteWallCenter.left + CONNECTIONS_DISTANCE * Math.cos(angle),
                top: noteWallCenter.top + CONNECTIONS_DISTANCE * Math.sin(angle)
            };
        }
    };

    const getLineAngle = (i) => (Math.PI * 2 / connectingNotes.length) * i - Math.PI / 2;

    const getNoteWallCenter = () => {
        const { width: parentWidth, height: parentHeight } = noteWallRef.current.getBoundingClientRect();
        return {
            left: parentWidth / 2,
            top: parentHeight / 2,
        }
    }

    if (bigNoteAnimation) {
        return (
            <div 
            className={`${styles.noteWallBoundary} ${(connectionWall) ? styles.connectionNoteWall : ''}`} 
                style={boundaryInline()} 
                ref={noteWallRef}
                onMouseLeave={() => setBigNoteAnimation(0)}
            >
                <BigNote 
                    noteAndIndex={noteAndIndex} 
                    inlineStyle={bigNoteInlineStyle()} 
                    onClick={onNoteClick}
                    onMount={onNoteMount}
                    onMouseEnter={() => setBigNoteAnimation(1)}
                    isSelected={selected?.note.id === noteAndIndex.note.id}
                    noConnections={connectingNotes.length === 0}
                    ref={bigNoteRef}
                />
                {connectingNotes.map((noteAndIndex, i) => (
                    <>
                        <Note 
                            noteAndIndex={noteAndIndex}
                            inlineStyle={connectingNoteInlineStyle(i)}
                            onClick={onConnectionClick}
                            onMount={onNoteMount}
                            isSelected={selected?.note.id === noteAndIndex.note.id}
                            isConnection={false}
                            key={i} 
                        />
                        <Line 
                            angle={getLineAngle(i)} 
                            length={CONNECTIONS_DISTANCE}
                            rotateOrigin={getNoteWallCenter()}
                        />
                    </>
                ))}
            </div>
        )
    }

    return (
        <div 
            className={`${styles.noteWallBoundary} ${(connectionWall) ? styles.connectionNoteWall : ''}`} 
            style={boundaryInline()} 
            ref={noteWallRef}
            onMouseLeave={() => setBigNoteAnimation(0)}
        >
            <BigNote 
                noteAndIndex={noteAndIndex} 
                inlineStyle={bigNoteInlineStyle()} 
                onClick={onNoteClick}
                onMount={onNoteMount}
                onMouseEnter={() => setBigNoteAnimation(1)}
                isSelected={selected?.note.id === noteAndIndex.note.id}
                noConnections={connectingNotes.length === 0}
                ref={bigNoteRef}
            >
                {connectingNotes.length >= 1 ? (
                    <div className={styles.bigNoteTop} id='bigNoteTop'>
                        {connectingNotes.slice(0, Math.ceil(connectingNotes.length / 2)).map((noteAndIndex, i) => (
                            <Note 
                                noteAndIndex={noteAndIndex}
                                inlineStyle={connectingNoteInlineStyle(i)}
                                onClick={onConnectionClick}
                                onMount={onNoteMount}
                                isSelected={selected?.note.id === noteAndIndex.note.id}
                                isConnection={true}
                                ref={(el) => {
                                    if (el && !binarySearch(noteRefs.current, el.id)[0]) 
                                    noteRefs.current.push(el)
                                }}
                                key={i} 
                            />
                        ))}
                        <div className={styles.connectionLabel}>
                            ---------------- Connections
                        </div>
                    </div>
                ) : null}
                {connectingNotes.length === 0 ? (
                    null
                ) : connectingNotes.length === 1 ? (
                    null
                ) : connectingNotes.length >= 2 ? (
                    <div className={styles.bigNoteBottom} id='bigNoteBottom'>
                        {connectingNotes.slice(Math.ceil(connectingNotes.length / 2)).map((noteAndIndex, i) => (
                            <Note 
                                noteAndIndex={noteAndIndex}
                                inlineStyle={connectingNoteInlineStyle(i + connectingNotes.length / 2)}
                                onClick={onConnectionClick}
                                onMount={onNoteMount}
                                isSelected={selected?.note.id === noteAndIndex.note.id}
                                isConnection={true}
                                ref={(el) => {if (el && !binarySearch(noteRefs, el.id)[0]) noteRefs.current.push(el)}}
                                key={i} 
                            />
                        ))}
                        <div className={`${styles.connectionLabel} ${styles.connectionLabelBottom}`}>
                            ---------------- Connections
                        </div>
                    </div>
                ) : null}
            </BigNote>
            
            {hasConnectionCanvas ? (
                <Canvas draw={draw} />
            ) : null}
        </div>
    )
}

export default NoteWall;