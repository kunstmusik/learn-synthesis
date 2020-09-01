import React, { useState } from "react";
import { range, map, curry } from "ramda";
import "./index.css";

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

const orc = `
sr=48000
ksmps=128
0dbfs=1
ksmps=128
nchnls=2

instr 1
    ifreq = 200
    asig = oscili(chnget:k("harm1"), ifreq)
    asig += oscili(chnget:k("harm2"), ifreq * 2)
    asig += oscili(chnget:k("harm3"), ifreq * 3)
    asig += oscili(chnget:k("harm4"), ifreq * 4)
    asig += oscili(chnget:k("harm5"), ifreq * 5)
    asig += oscili(chnget:k("harm6"), ifreq * 6)
    asig += oscili(chnget:k("harm7"), ifreq * 7)
    asig += oscili(chnget:k("harm8"), ifreq * 8)
    asig += oscili(chnget:k("harm9"), ifreq * 9)
    asig += oscili(chnget:k("harm10"), ifreq * 10)
    asig += oscili(chnget:k("harm11"), ifreq * 11)
    asig += oscili(chnget:k("harm12"), ifreq * 12)
    asig += oscili(chnget:k("harm13"), ifreq * 13)
    asig += oscili(chnget:k("harm14"), ifreq * 14)
    asig += oscili(chnget:k("harm15"), ifreq * 15)
    asig += oscili(chnget:k("harm16"), ifreq * 16)

    asig *= 1/16 * expsegr:a(0.001, .05, 1, 4, .001)

    out(asig, asig)
endin
`;

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

    return (
        <div className="container">
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
