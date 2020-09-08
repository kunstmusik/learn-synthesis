import React, { useState, useEffect } from "react";
import SpectralAnalyzer from "../SpectralAnalyzer";
import "./index.css";

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
                <option value="0">Sawtooth (1/n)</option>
                <option value="10">Square (1/n, odd partials)</option>
                <option value="12">Triangle (1/n&#x00B2, odd partials)</option>
                <option value="-1">Impulse</option>
                <option value="-2">Buzz (equal strength harmonics up to Nyquist)</option>
                <option value="-3">White Noise</option>
                <option value="-4">Pink Noise</option>
            </select>
        </div>
    );
};

const FilterPanel = ({ csound }) => {
    const [freq, setFreq] = useState(1000);
    const [Q, setQ] = useState(0.5);

    csound.setControlChannel("filterCutoff", freq);
    csound.setControlChannel("filterQ", Q);
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
                <option value="1">Low Pass: 2-pole (-12dB oct)</option>
                <option value="2">High Pass: 2-pole (-12dB oct)</option>
                <option value="3">Band Pass: 2-pole (-12dB oct)</option>
                <option value="4">Band Reject (Notch): 2-pole (-12dB oct)</option>
                <option value="5">Low Pass: 4-pole (-24dB oct)</option>
            </select>

            <input
                type="range"
                min="20"
                max="20000"
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

            <input
                type="range"
                min="0.5"
                max="25"
                value={Q}
                onInput={(evt) => {
                    const val = evt.target.value;
                    setQ(val);
                }}
                onDoubleClick={(evt) => {
                    setQ(0.5);
                }}
            />
            <div style={{margin: "auto"}}>{Q} Q</div>
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

const orc = `
sr=48000
ksmps=128
0dbfs=1
nchnls=2

gisine ftgen 0, 0, 65536, 10, 1

instr 1
    ifreq = p4 

    print ifreq

    ;; SOURCE
    iwave = chnget:i("waveform")

    if(iwave == -1) then
        asig = mpulse(1, 1/ifreq)
    elseif (iwave == -2) then
        asig = buzz(1, ifreq, (sr / 2) / ifreq, gisine)
    elseif (iwave == -3) then
        asig = random:a(-1, 1) 
    elseif (iwave == -4) then
        asig = pinker()
    else 
        asig = vco2(1, ifreq, iwave)
    endif


    ;; FILTER 
    kfiltType = chnget:i("filterType")
    kcutoff = chnget:k("filterCutoff")
    kcutoff = port(kcutoff, 0.1, chnget:i("filterCutoff"))

    kQ = chnget:k("filterQ")
    kQ = port(kQ, 0.1, chnget:i("filterQ"))
    if (kfiltType == 1)  then
        asig = zdf_2pole(asig, kcutoff, kQ)
    elseif (kfiltType == 2)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 1)
    elseif (kfiltType == 3)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 3)
    elseif (kfiltType == 4)  then
        asig = zdf_2pole(asig, kcutoff, kQ, 4)
    elseif (kfiltType == 5) then
        asig = zdf_ladder(asig, kcutoff, kQ)
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

const Subtractive = ({ csound }) => {
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
                    <div style={{height: "180px"}}>
                        <SpectralAnalyzer csound={csound} />
                    </div>
                </>
            ) : (
                <button onClick={startCsound}>Start Project</button>
            )}
        </div>
    );
};

export default Subtractive;
