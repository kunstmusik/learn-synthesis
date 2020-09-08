import React from "react";
import "./index.css";

const Main = () => {

    return (
        <div className="container">
            <div className="content">
            <h2>Home Page</h2>
            <p>Welcome to the Learn Synthesis home page!  This site contains 
               web-based tools for learning sound synthesis built using <a href="https://csound.com">Csound</a>. 
            </p>
            <p>Please use the navigation links to explore the tools for learning synthesis techniques.</p>
            <p>
                <i>This site is currently under construction for use by the students in the course IGME 670 at RIT's School of Interactive Games and Media. 
                Please direct any questions and comments to <a href="mailto:stevenyi@gmail.com">Steven Yi</a>.

                </i>
                </p>
            </div>
        </div>
    );
};

export default Main;
