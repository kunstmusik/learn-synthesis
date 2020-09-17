import React, { useState, useEffect } from "react";
import { range, map, curry } from "ramda";
import "./index.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import orc from "!!raw-loader!./additive.orc";

const dbToAmp = (db) => {
    return db <= -60 ? 0 : Math.exp((db * Math.log(10)) / 20);
};

const Slider = (csound, sliderNum) => {
    const [db, setdb] = useState(-60);

    const amp = dbToAmp(db);
    const sliderChan = `harm${sliderNum}`;

    csound.setControlChannel(sliderChan, amp);
    return (
        <div key={sliderChan} className="sliderBox">
                
            <div className="sliderLabel">{`Harmonic ${sliderNum}`}</div>
            <input
                type="range"
                min="-60"
                max="0"
                value={db}
                onInput={(evt) => {
                    const val = evt.target.value;
                    setdb(val);
                }}
                onDoubleClick={(evt) => {
                    setdb(-60);
                }}
            />
            <div className="sliderValue">{db}</div>
        </div>
    );
};

const Sliders = ({ csound }) => {
    const csSlider = curry(Slider)(csound);
    const sliders = map(csSlider, range(1, 17));
    return <div>{sliders}</div>;
};

const Buttons = ({ csound }) => {
    return (
        <div className="buttonBox">
            <button onClick={() => csound.readScore("i1.1 0 -1")}>On</button>
            <button onClick={() => csound.readScore("i-1.1 0 1")}>Off</button>
            <button onClick={() => csound.readScore("i1 0 .2")}>Trigger</button>
        </div>
    );
};

const Additive = ({ csound }) => {
    const [started, setStarted] = useState(false);

    const startCsound = () => {
        csound.compileOrc(orc);
        csound.start();
        csound.audioContext.resume();
        setStarted(true);
    };

    useEffect(() => {
        return () => {
            csound.reset();
        }
    }, [csound]);

    return (
        <div className="container">
            <h2>Additive Synthesis</h2>
            {started ? (
                <>
                    <Buttons csound={csound} />
                    <Sliders csound={csound} />
                    <div>
                        <ul>
                            <li>Double-click slider to reset to -60 db</li>
                        </ul>
                    </div>
                </>
            ) : (
                <button onClick={startCsound}>Start Project</button>
            )}
        </div>
    );
};

export default Additive;
