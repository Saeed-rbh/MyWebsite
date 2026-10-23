import React from "react";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";

const FallbackLoader = () => {
    return (
        <div className="Intro Intro--entered" id="IntroFallback" role="status" aria-label="Loading Saeed Arabha's portfolio">
            <GrapheneCell
                text="Saeed Arabha"
                subtext="MATERIALS · RESEARCH · ENGINEERING"
            />
        </div>
    );
};

export default FallbackLoader;
