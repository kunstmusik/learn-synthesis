import React, { useEffect, useRef } from "react";
import { scaleLinear } from "d3-scale";

// resize code used from https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

const connectVisualizer = (csound, canvasRef) => {
    if (!canvasRef || !canvasRef.current) {
        return null;
    } else {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");

        if (ctx == null) {
            return null;
        }

        //console.log("Connect Visualizer!");

        const node = csound.getNode();
        const context = node.context;
        const scopeNode = context.createAnalyser();
        scopeNode.fftSize = 2048;
        node.connect(scopeNode);

        const mags = function() {
            resize(canvas);
            const width = canvas.width;
            const height = canvas.height;
            let freqData = new Uint8Array(scopeNode.frequencyBinCount);

            const scaleY = scaleLinear()
                            .domain([0, 256])
                            .range([height, 0]);

            scopeNode.getByteFrequencyData(freqData);

            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "rgba(0, 20, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0,255,0,1)";
            ctx.beginPath();

            for (var x = 0; x < width; x++) {
                let indx = Math.floor(
                    (x / width) * scopeNode.frequencyBinCount
                );
                ctx.lineTo(x, scaleY(freqData[indx]));
            }

            ctx.stroke();
            requestAnimationFrame(mags);
        };
        mags();

        return scopeNode;
    }
};

const disconnectVisualizer = (csound, scopeNode) => {
    const node = csound.getNode();
    node.disconnect(scopeNode);

    //console.log("Disconnect Visualizer!");
};

export const SpectralAnalyzer = ({csound}) => {
    const canvasRef = useRef();

    useEffect(() => {
        let scopeNode = null;
        if (csound && canvasRef.current) {
            scopeNode = connectVisualizer(csound, canvasRef);
        }

        return () => {
            if (csound && scopeNode) {
                disconnectVisualizer(csound, scopeNode);
            }
        };
    }, [canvasRef, csound]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
        ></canvas>
    );
};

export default SpectralAnalyzer;
