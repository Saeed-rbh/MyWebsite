import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSpring, animated, easings } from "react-spring";
import PropTypes from "prop-types";

// Constants
const DELAY = 500;
const CUBE_SIZE = 400;

const RotatingBubble = ({ isCross }) => {
  const [shouldRender, setShouldRender] = useState(true);

  const props = useSpring({
    opacity: !isCross ? 0 : 1,
    transform: !isCross ? "translateY(100px)" : "translateY(0px)",

    delay: DELAY,
    config: {
      duration: 800,
      easing: easings.easeOutCubic,
    },
  });

  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(CUBE_SIZE, CUBE_SIZE);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: "#d49d81",
      transparent: true,
    });
    const bubble = new THREE.Mesh(geometry, material);
    scene.add(bubble);

    const light1 = new THREE.PointLight(0xffffff, 0.8);
    light1.position.set(15, 0, 15);
    scene.add(light1);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    camera.position.z = 5;

    let angle = 0;
    const positionVector = new THREE.Vector3();

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      angle += 0.005;
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);

      light1.position.x = 10 * cosAngle;
      light1.position.z = 10 * sinAngle;

      material.opacity = 0.75 + 0.25 * Math.cos(angle + Math.PI / 4);

      positionVector.set(
        0.5 * Math.sin(2 * angle),
        0.5 * sinAngle,
        0.5 * Math.sin(angle + Math.PI / 4)
      );
      bubble.position.copy(positionVector);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [shouldRender]);

  useEffect(() => {
    if (isCross) {
      setShouldRender(true);
    } else {
      setTimeout(() => setShouldRender(false), 1000);
    }
  }, [isCross]);

  return shouldRender ? (
    <animated.div className={"RotatingSphere"} style={props}>
      <div
        ref={containerRef}
        style={{
          filter: "blur(20px)",
          width: `${CUBE_SIZE}px`,
          height: `${CUBE_SIZE}px`,
        }}
      ></div>
    </animated.div>
  ) : null;
};

RotatingBubble.propTypes = {
  isCross: PropTypes.bool.isRequired,
};

export default RotatingBubble;
