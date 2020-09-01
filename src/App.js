import React, { useEffect, useState } from "react";
import "./App.css";
import CsoundObj from "@kunstmusik/csound";
import Additive from "./Additive";

function App() {
    const [csound, setCsound] = useState(null);
    useEffect(() => {
        if (csound == null) {
            CsoundObj.initialize().then(() => {
                const cs = new CsoundObj();
                setCsound(cs);
            });
        }
    }, [csound]);

    return (
        <div className="App">
          { csound == null ? 
            (<header className="App-header">
                <p>
                  Loading... 
                </p>
            </header>) :
            <Additive csound={csound}/>
          } 
        </div>
    );
}

export default App;
