import React, { useEffect, useState } from "react";
import GrapheneCell from "./GrapheneCell";
import "./Loader.css";

const FallbackLoader = () => {
    // We can reuse the same layout logic if needed, or keeping it simple
    // Copied from Loader.jsx to ensure safe area padding on mobile
    useEffect(() => {
        const updateLayout = () => {
            const element = document.getElementById("IntroFallback");
            if (element) {
                const computedStyle = window.getComputedStyle(document.body);
                const safeAreaInsetBottom = computedStyle.getPropertyValue(
                    "--safe-area-inset-bottom"
                );
                element.style.paddingBottom = `calc(${safeAreaInsetBottom} + 20px)`;
            }
        };
        updateLayout();
        window.addEventListener("resize", updateLayout);
        window.addEventListener("orientationchange", updateLayout);
        return () => {
            window.removeEventListener("resize", updateLayout);
            window.removeEventListener("orientationchange", updateLayout);
        };
    }, []);

    return (
        <div className="Intro" id="IntroFallback">
            <div className="GrapheneIntro">
                <GrapheneCell
                    fade={false}
                    text="Welcome To My Personal Website"
                    subtext="LOADING"
                />
            </div>
        </div>
    );
};

export default FallbackLoader;
