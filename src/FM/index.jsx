import React, { useState, useEffect } from "react";
import SpectralAnalyzer from "../SpectralAnalyzer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "./index.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import orc from "!!raw-loader!./fm.orc";

const InfoPanel = ({ csound }) => {
    return (
        <div className="subPanel1">
            <h3>Notes</h3>

            <p>Carrier-to-Modulator (C:M) ratio affects the frequencies of the sidebands generated</p>
            <p>Index controls number of significant sidebands generated (roughly index + 1)</p>

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
    step=0.01
}) => {
    return (
        <div className="hslider">
            <label htmlFor={id}>{sliderLabel}</label>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step} 
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

const SimpleFMPanelPanel = ({ csound }) => {

    const [carRatio, setCarRatio] = useState(1);
    const [modRatio, setModRatio] = useState(1);
    const [index, setIndex] = useState(1);

    csound.setControlChannel("modRatio", modRatio / carRatio);
    csound.setControlChannel("index", index);

    return (
        <div className="subPanel2">
            <h3>Simple FM</h3>

            <HSlider
                id="modRatioSlider"
                sliderLabel="Modulator Ratio"
                min={1}
                max={9}
                step={0.1}
                defaultValue={1}
                val={modRatio}
                setVal={setModRatio}
            />

            <HSlider
                id="carRatioSlider"
                sliderLabel="Carrier Ratio"
                min={1}
                max={9}
                defaultValue={1}
                step={0.1}
                val={carRatio}
                setVal={setCarRatio}
            />


            <HSlider
                id="indexSlider"
                sliderLabel="Index"
                min={0}
                max={10}
                step={0.01}
                defaultValue={0}
                val={index}
                setVal={setIndex}
            />
        </div>
    );
};

const PlayButtons = ({ csound }) => {
    return (
        <div
            className="buttonBox4"
            style={{ marginTop: "20px", marginBottom: "20px" }}
        >
            <button
                onClick={() =>
                    csound.evaluateCode("schedule(1.1, 0, -2, cpsmidinn(69), ampdbfs(-12))")
                }
            >
                A440 On
            </button>

            <button
                onClick={() =>
                    csound.evaluateCode("schedule(-1.1, 0, 2)")
                }
            >
                A440 Off
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
                    <img src="https://flossmanual.csound.com/resources/images/04-d-fm.png" width="300" alt="Simple FM Diagram"></img>
                    <p><em>Diagram of Simple FM, from the Csound FLOSS manual chapter on <a href="https://flossmanual.csound.com/sound-synthesis/frequency-modulation">FM Synthesis</a></em></p>
                    <p>Simple FM refers to frequency modulation with two operators (i.e., sine-wave oscillators).</p>
                    <p>There are a few parameters we are concerned with in Simple FM:</p>

                        <dl>
                            <dt>Carrier Ratio</dt>
                            <dd>The ratio of the carrier's frequency to the given base frequency for a note. We typically 
                                use 1 for carrier ratio with simple 2-operator FM so that we hear the fundamental, but 
                                in more complex FM programming (i.e., when using more than 1 carrier), we can use the 
                                carrier ratio to offset where the spectrum for a carrier begins, giving a lot of flexibility 
                                for spectrum design.
                            </dd>

                            <dt>Modulator Ratio</dt>
                            <dd><p>The ratio of the modulator's frequency to the given base frequency for a note.
                                We use the ratio between the modulator and the carrier's calculated frequencies to determine what 
                                frequencies will be generated for sidebands. For example, with a modulator ratio of 2 and a 
                                carrier ratio of 1, we will get side bands at Fc&plusmn;Fm. If the base frequency is 100, 
                                with C:M of 1:2, we should get sidebands at [300, 500, ...] for the positive sidebands and 
                                [-100, -300, -500, ...] for the negative sidebands.</p> 
                                
                                <p>Spectrum can become quite interesting when the negative and 
                                positive sideband frequencies do not overlap. For C:M of 1:3 and base frequency 100, we get positive 
                                sidebands of [400, 700, ...] and negative sidebands of [-200, -500, -800, ...] etc. </p>
                            </dd>

                            <dt>Index</dt>
                            <dd>Value that controls the amplitude of frequency modulation that occurs for the carrier, which 
                                in turn affects the number of sidebands generated. The number of sidebands generated is roughly 
                                Index + 1, so for an index of 1, roughly 2 sidebands will be generated in the positive direction and 2 in the 
                                negative direction.  
                            </dd>
                        </dl>
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
                        <SimpleFMPanelPanel csound={csound} />
                        <InfoPanel csound={csound} />
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
