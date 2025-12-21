import { useState } from "react";
import { useSelector } from "react-redux";
import { useSpring } from "react-spring";

const useGraphenePageLogic = () => {
    const { stages } = useSelector((state) => state.data);

    const [endAnimation, setEndAnimation] = useState(false);
    const [reverseAnimation, setReverseAnimation] = useState(false);
    const [animationCompleted, setAnimationCompleted] = useState(false);
    const [startAnimation, setStartAnimation] = useState(false);
    const [startRotationAdjustment, setStartRotationAdjustment] = useState(false);
    const [startPositionAdjustment, setStartPositionAdjustment] = useState(false);
    const [startScaleDown, setStartScaleDown] = useState(false);

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const moveUpStyle = useSpring({
        from: {
            y: screenHeight / 2 - 250,
            x: screenWidth / 2 - 280,
            height: "500px",
            width: "500px",
            scale: 1,
            opacity: 0,
        },
        to: {
            position: "absolute",
            top: 0,
            left: 0,
            opacity: endAnimation ? 0.9 : 1,
            y: endAnimation && stages[1] ? -80 : screenHeight / 2 - 250,
            x:
                endAnimation && !stages[1]
                    ? 0
                    : startPositionAdjustment
                        ? screenWidth / 2 - 250
                        : screenWidth / 2 - 280,
            scale: endAnimation
                ? stages[1]
                    ? Math.round(screenHeight / 100) / 9
                    : Math.round(screenHeight / 100) / 7
                : 1,
        },
        config: {
            tension: endAnimation ? 75 : 20,
            friction: endAnimation ? 20 : 25,
        },
    });

    const [mouseDown, setMouseDown] = useState(false);
    const handleMouseDown = () => {
        setMouseDown(true);
    };
    const handleMouseUp = () => {
        setMouseDown(false);
    };

    const sharedModelProps = {
        setEndAnimation,
        reverseAnimation,
        setReverseAnimation,
        animationCompleted,
        setAnimationCompleted,
        startAnimation,
        setStartAnimation,
        startRotationAdjustment,
        setStartRotationAdjustment,
        startScaleDown,
        setStartScaleDown,
        mouseDown,
        startPositionAdjustment,
        setStartPositionAdjustment,
        endAnimation,
    };

    return {
        screenHeight,
        startAnimation,
        reverseAnimation,
        endAnimation,
        mouseDown,
        handleMouseDown,
        handleMouseUp,
        moveUpStyle,
        sharedModelProps,
    };
};

export default useGraphenePageLogic;
