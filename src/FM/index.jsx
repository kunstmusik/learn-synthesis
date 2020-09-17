import React, { useState, useEffect } from "react";
import SpectralAnalyzer from "../SpectralAnalyzer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "./index.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import orc from "!!raw-loader!./fm.orc";

const CarrierPanel = ({ csound }) => {
    const [waveForm, setWaveForm] = useState(-1);

    csound.setControlChannel("waveform", waveForm);

    return (
        <div className="subPanel1">
            <h3>Carrier</h3>
            <label htmlFor="waveform">Choose a waveform:</label>
            <select
                id="waveform"
                name="waveform"
                onChange={(evt) => {
                    setWaveForm(evt.target.value);
                }}
            >
                <option value="-1">Sine</option>
                <option value="0">Sawtooth (1/n)</option>
                <option value="10">Square (1/n, odd partials)</option>
                <option value="12">Triangle (1/n&#x00B2;, odd partials)</option>
            </select>
        </div>
    );
};

const HSlider = ({
    id,
    sliderLabel,
    valLabel,
    defaultValue,
    val,
    setVal,
    min,
    max,
}) => {
    return (
        <div className="hslider">
            <label htmlFor={id}>{sliderLabel}</label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step="0.01"
                defaultValue={val}
                onInput={(evt) => {
                    const val = evt.target.value;
                    setVal(val);
                }}
                onDoubleClick={(evt) => {
                    setVal(defaultValue);
                }}
            />
            <div style={{ margin: "auto", gridColumn: 2, gridRow: 2 }}>
                {val} {valLabel}
            </div>
        </div>
    );
};

const ModulatorPanel = ({ csound }) => {
    const [enabled, setEnabled] = useState(false);
    const [freq, setFreq] = useState(220);
    const [amp, setAmp] = useState(1);
    const [offset, setOffset] = useState(0);

    csound.setControlChannel("modEnabled", enabled ? 1 : 0);
    csound.setControlChannel("modFreq", freq);
    csound.setControlChannel("modAmp", amp);
    csound.setControlChannel("modOffset", offset);

    return (
        <div className="subPanel2">
            <h3>Modulator</h3>

            <input
                id="enabledCheckbox"
                type="checkbox"
                checked={enabled}
                onChange={(evt) => setEnabled(!enabled)}
            />
            <label htmlFor="enabledCheckbox">Enable Modulation</label>

            <HSlider
                id="freqSlider"
                sliderLabel="Frequency"
                min={0.01}
                max={440}
                defaultValue={220}
                valLabel="Hz"
                val={freq}
                setVal={setFreq}
            />

            <HSlider
                id="ampSlider"
                sliderLabel="Amplitude"
                min={0}
                max={1}
                defaultValue={1}
                val={amp}
                setVal={setAmp}
            />

            <HSlider
                id="offsetSlider"
                sliderLabel="DC Offset"
                min={0}
                max={1}
                defaultValue={0}
                val={offset}
                setVal={setOffset}
            />
        </div>
    );
};

const PlayButtons = ({ csound }) => {
    return (
        <div
            className="buttonBox"
            style={{ marginTop: "20px", marginBottom: "20px" }}
        >
            <button
                onClick={() =>
                    csound.evaluateCode("schedule(1.1, 0, 2, cpsmidinn(69))")
                }
            >
                A440
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


const FM = ({ csound }) => {
    const [started, setStarted] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

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

    let style = {
        overlay: { background: "#00000055" },
        content: {
            background: "#000000",
            color: "#fff",
            // display: "grid",
            // gridTemplateRows: "30 auto 30",
            // rowGap: "10px",
        },
    };

    return (
        <div className="container">
            <h2>
                Frequency Modulation{" "}
                <FontAwesomeIcon
                    onClick={() => setModalOpen(true)}
                    icon={faInfoCircle}
                />
            </h2>
            <Modal
                isOpen={modalOpen}
                contentLabel="Frequency Modulation"
                style={style}
            >
                <h2>Frequency Modulation</h2>
                <div style={{ margin: 10 }}>
                    <p>Tool for exploring Frequency Modulation.</p>
                    <p><em>(Content to be added here)</em></p>
                </div>
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
                        <ModulatorPanel csound={csound} />
                        <CarrierPanel csound={csound} />
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

export default FM;
