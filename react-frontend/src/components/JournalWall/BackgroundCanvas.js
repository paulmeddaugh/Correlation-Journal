import Canvas from "./Canvas";

const BackgroundCanvas = ({ drawArray, resizeRef }) => {

    const draw = (ctx, frameCount) => {
        if (!Array.isArray(drawArray)) return;
        
        for (let drawFunc of drawArray) {
            if (typeof drawFunc === 'function') drawFunc(ctx, frameCount);
        }
    }

    return (
        <Canvas draw={draw} resizeRef={resizeRef} />
    )
}

export default BackgroundCanvas;