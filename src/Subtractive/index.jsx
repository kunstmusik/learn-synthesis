import React, { useState, useEffect } from "react";
import "./index.css";

const dbToAmp = (db) => {
    return db <= -60 ? 0 : Math.exp((db * Math.log(10)) / 20);
};

const SourcePanel = ({ csound }) => {
    return (
        <div className="subPanel1">
            <h3>Source</h3>
            <label for="waveform">Choose a waveform:</label>
            <select
                id="waveform"
                name="waveform"
                onChange={(evt) => {
                    csound.setControlChannel("waveform", evt.target.value);
                }}
            >
                <option value="0">Sawtooth</option>
                <option value="10">Square</option>
                <option value="12">Triangle</option>
            </select>
        </div>
    );
};

const FilterPanel = ({ csound }) => {
    const [freq, setFreq] = useState(1000);

    csound.setControlChannel("filterCutoff", freq);
    return (
        <div className="subPanel2">
            <h3>Filter</h3>

            <label for="filterType">Filter Type:</label>
            <select
                id="filterType"
                name="filterType"
                onChange={(evt) => {
                    csound.setControlChannel("filterType", evt.target.value);
                }}
            >
                <option value="0">None</option>
                <option value="1">Low Pass: 2 pole (-12dB oct)</option>
                <option value="2">Low Pass: 4 pole (-24dB oct)</option>
            </select>

            <input
                type="range"
                min="20"
                max="10000"
                value={freq}
                onInput={(evt) => {
                    const val = evt.target.value;
                    setFreq(val);
                }}
                onDoubleClick={(evt) => {
                    setFreq(1000);
                }}
            />
            <div style={{margin: "auto"}}>{freq} Hz</div>
        </div>
    );
};

const PlayButtons = ({ csound }) => {
    return (
        <div className="buttonBox" style={{ marginTop: "30px" }}>
            <button
                onClick={() =>
                    csound.evaluateCode("schedule(1, 0, 2, cpsmidinn(48))")
                }
            >
                C3
            </button>
            <button
                onClick={() =>
                    csound.evaluateCode("schedule(1, 0, 2, cpsmidinn(60))")
                }
            >
                C4
            </button>
            <button
                onClick={() =>
                    csound.evaluateCode("schedule(1, 0, 2, cpsmidinn(72))")
                }
            >
                C5
            </button>
            <button
                onClick={() => {
                    csound.setControlChannel("run", 1);
                    csound.readScore("i2 0 1");
                }}
            >
                Start Note Gen 
            </button>
            <button
                onClick={() =>
                    csound.setControlChannel("run", 0)
                }
            >
                Stop Note Gen 
            </button>
        </div>
    );
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
nchnls=2

instr 1
    ifreq = p4 

    print ifreq

    ;; SOURCE
    asig = vco2(1, ifreq, chnget:i("waveform"))


    ;; FILTER 
    kfiltType = chnget:i("filterType")
    kcutoff = chnget:k("filterCutoff")
    kcutoff = port(kcutoff, 0.1, chnget:i("filterCutoff"))
    if (kfiltType == 1)  then
        asig = zdf_2pole(asig, kcutoff, 0.5)
    elseif (kfiltType == 2) then
        asig = zdf_ladder(asig, kcutoff, 0.5)
    endif

    ;; DECLICK ENVELOPE
    asig *= linen:a(ampdbfs(-12), 0.01, p3, 0.01)

    out(asig, asig)
endin

instr 2
    irun = chnget:i("run")
    ivals[] = fillarray(0,2,4,5,7,9,11)
    inn = ivals[int(random:i(0,7))]
    if(irun == 1) then
        schedule(1, 0, 1, cpsmidinn(48 + inn))
        schedule(p1, 1, 0)
    endif
endin
`;

const Additive = ({ csound }) => {
    const [started, setStarted] = useState(false);

    const startCsound = () => {
        csound.setOption("-+msg_color=false");
        csound.compileOrc(orc);
        csound.start();
        csound.audioContext.resume();
        setStarted(true);
    };

    useEffect(() => {
        return () => {
            csound.reset();
        };
    }, [csound]);

    return (
        <div className="container">
            <h2>Subtractive Synthesis</h2>
            {started ? (
                <>
                    <div className="subGrid">
                        <SourcePanel csound={csound} />
                        <FilterPanel csound={csound} />
                    </div>
                    <PlayButtons csound={csound} />
                    <div>
                    </div>
                </>
            ) : (
                <button onClick={startCsound}>Start Project</button>
            )}
        </div>
    );
};

export default Additive;
