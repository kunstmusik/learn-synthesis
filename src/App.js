import React, { useEffect, useState } from "react";
import "./App.css";
import CsoundObj from "@kunstmusik/csound";
import Additive from "./Additive";
import Subtractive from "./Subtractive";
import Main from "./Main";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><strong>Learn Synthesis</strong></Link>
                </li>
                <li>
                    <Link to="/additive">Additive Synthesis</Link>
                </li>
                <li>
                    <Link to="/subtractive">Subtractive Synthesis</Link>
                </li>
            </ul>
        </nav>
    );
};

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
          <Navigation/>
            {csound == null ? (
                <header className="App-header">
                    <p>Loading...</p>
                </header>
            ) : (
                <Switch>
                    <Route path="/additive">
                        <Additive csound={csound} />
                    </Route>
                    <Route path="/subtractive">
                        <Subtractive csound={csound} />
                    </Route>
                    <Route path="/">
                        <Main />
                    </Route>
                </Switch>
            )}
        </div>
    );
}

export default App;
