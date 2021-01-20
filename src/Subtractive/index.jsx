import React, { useState, useEffect } from "react";
import SpectralAnalyzer from "../SpectralAnalyzer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "./index.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import orc from "!!raw-loader!./subtractive.orc";

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
                <option value="12">Triangle (1/n&#x00B2;, odd partials)</option>
                <option value="-1">Impulse</option>
                <option value="-2">
                    Buzz (equal strength harmonics up to Nyquist)
                </option>
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
                <option value="4">
                    Band Reject (Notch): 2-pole (-12dB oct)
                </option>
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
            <div style={{ margin: "auto" }}>{freq} Hz</div>

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
            <div style={{ margin: "auto" }}>{Q} Q</div>
        </div>
    );
};

const PlayButtons = ({ csound }) => {
    return (
        <div className="buttonBox" style={{ marginTop: "30px" }}>
            <button
                onClick={() =>
                    csound.evalCode("schedule(1, 0, 2, cpsmidinn(48))")
                }
            >
                C3
            </button>
            <button
                onClick={() =>
                    csound.evalCode("schedule(1, 0, 2, cpsmidinn(60))")
                }
            >
                C4
            </button>
            <button
                onClick={() =>
                    csound.evalCode("schedule(1, 0, 2, cpsmidinn(72))")
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
            <button onClick={() => csound.setControlChannel("run", 0)}>
                Stop Note Gen
            </button>
        </div>
    );
};

const Subtractive = ({ csound }) => {
    const [started, setStarted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const startCsound = () => {
        csound.setOption("-+msg_color=false");
        csound.compileOrc(orc);
        csound.start();

        csound.getAudioContext().then(ctx => ctx.resume());
        setStarted(true);
    };

    useEffect(() => {
        return () => {
            csound.reset();
        };
    }, [csound]);

    let style = {
        overlay: { background: "#00000055" },
        content: { background: "#000000", color: "#fff", 
                    // display: "grid",
                    // gridTemplateRows: "30 auto 30",
                    // rowGap: "10px",
     },
    };

    return (
        <div className="container">
            <h2>
                Subtractive Synthesis{" "}
                <FontAwesomeIcon
                    onClick={() => setModalOpen(true)}
                    icon={faInfoCircle}
                />
            </h2>
            <Modal
                isOpen={modalOpen}
                contentLabel="Subtractive Synthesis"
                style={style}
            >
                    <h2>Subtractive Synthesis </h2>
                    <div style={{margin: 10}}><emph>(Content to be added here)</emph></div>
                    <button
                        className="closeButton"
                        onClick={() => setModalOpen(false)}
                    >
                        Close
                    </button>
            </Modal>
            {started ? (
                <>
                    <div className="subGrid">
                        <SourcePanel csound={csound} />
                        <FilterPanel csound={csound} />
                    </div>
                    <PlayButtons csound={csound} />
                    <div style={{ height: "180px" }}>
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
