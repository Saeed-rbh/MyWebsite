import React, {
  Suspense,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { animated, useSpring } from "react-spring";
import "./Graphene.css";
import TWEEN from "@tweenjs/tween.js";
import { CgArrowLongRight } from "react-icons/cg";
import { useSelector } from "react-redux";
import { selectVisibility } from "./reducers/visibilityReducer";
import { BsFillTriangleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { HiArrowSmRight } from "react-icons/hi";
import { SiGooglescholar } from "react-icons/si";
import { RiDownloadCloudFill } from "react-icons/ri";
import { BsArrowDownShort } from "react-icons/bs";
import { GoLinkExternal } from "react-icons/go";

function getMeshNodes(obj) {
  const nodes = [];
  obj.traverse((node) => {
    if (node.isMesh) {
      nodes.push(node);
    }
  });
  return nodes;
}
function Model({ position, opacity, Clicked, ClickedThick }) {
  const gltf = useLoader(GLTFLoader, "/Graphene2.gltf");
  const meshRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const minXPosRef = useRef(Infinity);
  const maxXPosRef = useRef(-Infinity);
  const minZPosRef = useRef(Infinity);
  const maxZPosRef = useRef(-Infinity);
  const amplitudeRef = useRef(0.05);
  const minAmplitudeRef = useRef(Infinity);
  const maxAmplitudeRef = useRef(-Infinity);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      amplitudeRef.current = scrollPosition * 0.00001;
    };
    if (Clicked && !ClickedThick) {
      new TWEEN.Tween(meshRef.current.rotation)
        .to({ x: 0, z: 0 }, 1000)
        .start();
    }
    if (Clicked && !ClickedThick) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [Clicked, ClickedThick]);

  useEffect(() => {
    if (Clicked && ClickedThick && meshRef.current) {
      new TWEEN.Tween(meshRef.current.rotation)
        .to({ x: Math.PI / 2, z: 0 }, 1000)
        .start();
      // Set amplitude to 0
      new TWEEN.Tween(meshRef.current.scale)
        .to({ x: 1.1, y: 1.1, z: 1.1 }, 1000)
        .start();
    } else {
      new TWEEN.Tween(meshRef.current.scale)
        .to({ x: 1, y: 1, z: 1 }, 0)
        .start();
    }
  }, [Clicked, ClickedThick]);
  // Initialize the nodes
  useEffect(() => {
    const nodesToRemove = [];
    const namesToKeep = ["Plane"];
    // Mark all nodes for removal except 'Plane1', 'Plane2', 'Plane3' and their children
    gltf.scene.traverse((node) => {
      if (!node.isMesh) {
        return;
      }
      let current = node;
      while (current !== null) {
        if (namesToKeep.includes(current.name)) {
          return; // One of the names to keep is an ancestor of node, so don't remove node
        }
        current = current.parent;
      }
      // None of the names to keep is an ancestor of node, so mark node for removal
      nodesToRemove.push(node);
    });
    // Remove marked nodes
    nodesToRemove.forEach((node) => {
      node.parent.remove(node);
    });
    if (meshRef.current) {
      const nodes = getMeshNodes(meshRef.current);
      let avgYPos = 0;

      nodes.forEach((node) => {
        avgYPos += node.position.y;
        minXPosRef.current = Math.min(minXPosRef.current, node.position.x);
        maxXPosRef.current = Math.max(maxXPosRef.current, node.position.x);
        minZPosRef.current = Math.min(minZPosRef.current, node.position.z);
        maxZPosRef.current = Math.max(maxZPosRef.current, node.position.z);
      });

      avgYPos /= nodes.length - 1; // Subtract one for the plane

      nodes.forEach((node) => {
        const color = new THREE.Color();
        node.material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.5,
          metalness: 0.7,
          transparent: true,
          opacity: opacity,
        });

        node.userData.initialPosition = node.position.clone();
        if (!Clicked) {
          meshRef.current.rotation.x = Math.PI / 3;
          meshRef.current.rotation.z = -Math.PI / 6;
        }
        node.position.setY(avgYPos); // Set initial position of plane to the average Y position of all other nodes plus half of the average amplitude
        node.userData.initialPositions = [];
        for (let i = 0; i < node.geometry.attributes.position.count; i++) {
          node.userData.initialPositions[i] =
            node.geometry.attributes.position.getY(i);
        }
      });
    }
  }, [gltf.scene, opacity]);

  // Update the amplitude
  useEffect(() => {
    const updateAmplitude = () => {
      const targetAmplitude = Math.random() * 0.3 + 0.01;
      new TWEEN.Tween(amplitudeRef)
        .to({ value: targetAmplitude }, 1000)
        .start();
    };

    let amplitudeInterval;
    if (isAnimating) {
      amplitudeInterval = setInterval(updateAmplitude, 2000);
    }

    return () => {
      clearInterval(amplitudeInterval);
    };
  }, [isAnimating]);

  // Update the frame
  useFrame(() => {
    if (!isAnimating) {
      return;
    }
    const elapsedTime = clockRef.current.getElapsedTime();
    const cycleDuration = 5;
    const progress = (elapsedTime % cycleDuration) / cycleDuration;

    const waveOffset = progress * Math.PI * 2;
    const waveScale = amplitudeRef.current;

    const colorMin = new THREE.Color("#efcfbe");
    const colorMax = new THREE.Color("#d49d81");

    const nodes = getMeshNodes(meshRef.current);

    nodes.forEach((node) => {
      const rangeX = maxXPosRef.current - minXPosRef.current;
      const rangeZ = maxZPosRef.current - minZPosRef.current;

      const normalizedPositionX =
        (node.position.x - minXPosRef.current) / rangeX;
      const normalizedPositionZ =
        (node.position.z - minZPosRef.current) / rangeZ;

      const displacementX =
        Math.cos(
          (normalizedPositionX + normalizedPositionZ) * Math.PI * 2 + waveOffset
        ) * waveScale;
      const displacementZ =
        Math.sin(
          (normalizedPositionX + normalizedPositionZ) * Math.PI * 2 + waveOffset
        ) * waveScale;

      const y = node.userData.initialPosition.y + displacementX + displacementZ;

      if (node.name === "Plane") {
        const planeGeometry = node.geometry;
        const planePositions = planeGeometry.attributes.position;

        for (let i = 0; i < planePositions.count; i++) {
          const x = planePositions.getX(i);
          const z = planePositions.getZ(i);

          const normalizedPositionX = (x - minXPosRef.current) / rangeX;
          const normalizedPositionZ = (z - minZPosRef.current) / rangeZ;

          const displacementX =
            Math.cos(
              (normalizedPositionX + normalizedPositionZ) * Math.PI * 2 +
                waveOffset
            ) * waveScale;
          const displacementZ =
            Math.sin(
              (normalizedPositionX + normalizedPositionZ) * Math.PI * 2 +
                waveOffset
            ) * waveScale;

          const newY =
            node.userData.initialPositions[i] + displacementX + displacementZ;

          planePositions.setXYZ(i, x, newY, z);

          minAmplitudeRef.current = Math.min(minAmplitudeRef.current, newY);
          maxAmplitudeRef.current = Math.max(maxAmplitudeRef.current, newY);
        }

        planePositions.needsUpdate = true;
      } else {
        // Update the position of other nodes
        node.position.y = y;
      }

      minAmplitudeRef.current = Math.min(minAmplitudeRef.current, y);
      maxAmplitudeRef.current = Math.max(maxAmplitudeRef.current, y);

      const normalizedAmplitude =
        (y - minAmplitudeRef.current) /
        (maxAmplitudeRef.current - minAmplitudeRef.current);

      const color = new THREE.Color().lerpColors(
        colorMin,
        colorMax,
        normalizedAmplitude
      );
      node.material.color = color;
    });

    TWEEN.update();
  });
  return <primitive object={gltf.scene} ref={meshRef} position={position} />;
}
const DraggableGraphene = ({ Clicked, setClicked, MenuHide, Text }) => {
  const ref = useRef(null);
  const [springProps, set] = useSpring(() => ({ x: 0, y: 0, opacity: 1 }));
  const [textProps, setText] = useSpring(() => ({ y: 0, opacity: 1 }));

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const buffer = 5;

        const withinRange =
          e.clientX > rect.left &&
          e.clientX < rect.right - 50 &&
          e.clientY > rect.top + buffer &&
          e.clientY < rect.bottom - buffer;

        if (withinRange) {
          set({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        } else {
          set({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [set]);

  const handleClick = () => {
    setClicked((prevClicked) => !prevClicked);
    setText({ y: -20, opacity: 0 });
  };

  const nextProps = useSpring({
    from: { opacity: 0, transform: "translate3d(0,10px,0)" },
    to: {
      opacity: MenuHide ? (Clicked ? 0 : 1) : 0,
      transform: MenuHide
        ? Clicked
          ? "translate3d(0,-50px,0)"
          : "translate3d(0,0px,0)"
        : "translate3d(0,10px,0)",
      alignSelf: "center",
    },
    config: { duration: 500 },
    delay: 350,
  });

  return (
    <animated.div onClick={handleClick} style={nextProps}>
      <animated.div
        ref={ref}
        style={{
          ...springProps,
          position: "relative",
          willChange: "transform",
        }}
        className="GrapheneMore"
      >
        <animated.p style={textProps}>{Text}</animated.p>
        <animated.div
          className="GrapheneMoreC"
          style={textProps}
        ></animated.div>
        <animated.span style={textProps}>
          <CgArrowLongRight />
        </animated.span>
      </animated.div>
    </animated.div>
  );
};
const TDMaterials = ({ textProps, Clicked, setClicked, MenuHide }) => {
  const useTDAnimation = (opacityFactor, delay, MenuHide, Clicked) =>
    useSpring({
      from: { opacity: 0, transform: "translate3d(0,10px,0)" },
      to: {
        opacity: MenuHide ? (Clicked ? 0 : opacityFactor) : 0,
        transform: MenuHide
          ? Clicked
            ? "translate3d(0,-50px,0)"
            : "translate3d(0,0px,0)"
          : "translate3d(0,10px,0)",
      },
      config: { duration: 500 },
      delay: delay,
    });
  const titleProps = useTDAnimation(0.8, 0, MenuHide, Clicked);
  const descProps = useTDAnimation(0.7, 50, MenuHide, Clicked);
  const HrProps = useTDAnimation(0.2, 50, MenuHide, Clicked);
  const introProps = useTDAnimation(1, 150, MenuHide, Clicked);
  const propertiesProps = useTDAnimation(1, 250, MenuHide, Clicked);

  return (
    <div className="GrapheneTextPar" style={{ marginLeft: "40%" }}>
      <div className="GrapheneText">
        <animated.p style={titleProps} className="GrapheneTitle">
          2D Nanomaterials
        </animated.p>
        <animated.p style={descProps} className="GrapheneTitle">
          Atom-thin Wonderland!
        </animated.p>
        <animated.div style={HrProps} className="hr-Graphene"></animated.div>
        <animated.p style={introProps} className="GrapheneDescription">
          The realm of <span className="highlight">2D nanomaterials</span>,
          where the strength of steel meets the delicacy of a spider’s web, and
          the future of tech and medicine unfolds on an atom-thin canvas!
        </animated.p>
        <animated.p style={propertiesProps} className="GrapheneDescription">
          <div style={textProps}>
            Venture into the realm of{" "}
            <span className="highlight">feather-light Titans</span>,
            extraordinarily stronger than steel yet airy as whispers. These
            chameleon-like marvels show remarkable{" "}
            <span className="highlight">elasticity</span>, stunning{" "}
            <span className="highlight">thermal conductivity</span>, and{" "}
            <span className="highlight">transparent visibility</span>.
            Atom-thin, they're the ingenious players revolutionizing the
            material world.
          </div>
        </animated.p>
        <DraggableGraphene
          Clicked={Clicked}
          setClicked={setClicked}
          MenuHide={MenuHide}
          Text={"Heard of Graphene?!"}
        />
      </div>
    </div>
  );
};
const Paper = ({ paper, isOpen, handleInfoClick }) => {
  const OpenInfo = useSpring({
    transform: isOpen ? "translateY(0px)" : "translateY(-40px)",
    opacity: isOpen ? "1" : "0.5",
  });

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <animated.div className="PaperAcademic" onClick={handleInfoClick}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * paper.id }}
        className="PaperData"
      >
        <p1>{paper.title}</p1>
        <div className="paper-details">
          <p1>The Journal of Physical Chemistry C</p1>
          <div>
            <p2>
              Read more
              <HiArrowSmRight />
            </p2>
          </div>
        </div>
      </motion.div>
      <div className="MoreInfo">
        <animated.p
          style={OpenInfo}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(paper.link)}
        >
          Online Version
          <SiGooglescholar />
        </animated.p>
        <animated.p
          style={OpenInfo}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(paper.pdf)}
        >
          Download PDF
          <RiDownloadCloudFill />
        </animated.p>
      </div>
    </animated.div>
  );
};

const GrapheneDes = ({ Clicked, MenuHide, ClickedThick }) => {
  const useGrapheneAnimation = (opacityFactor, delay, MenuHide, Clicked) => {
    const opacity = MenuHide ? (Clicked ? 0 : opacityFactor) : 0;
    const transform = MenuHide
      ? Clicked
        ? "translate3d(0,-50px,0)"
        : "translate3d(0,0px,0)"
      : "translate3d(0,10px,0)";

    return useSpring({
      from: { opacity: 0, transform: "translate3d(0,10px,0)" },
      to: { opacity, transform },
      config: { mass: 1, tension: 280, friction: 60 },
      delay: delay,
    });
  };
  const titleProps = useGrapheneAnimation(0.8, 0, MenuHide, Clicked);
  const descProps = useGrapheneAnimation(0.7, 50, MenuHide, Clicked);
  const HrProps = useGrapheneAnimation(0.2, 50, MenuHide, Clicked);
  const introProps = useGrapheneAnimation(1, 150, MenuHide, Clicked);
  const propertiesProps1 = useGrapheneAnimation(1, 250, MenuHide, Clicked);
  const propertiesProps2 = useGrapheneAnimation(1, 300, MenuHide, Clicked);
  const propertiesProps3 = useGrapheneAnimation(1, 350, MenuHide, Clicked);
  const propertiesProps4 = useGrapheneAnimation(1, 400, MenuHide, Clicked);

  const ListOfPapers = [
    {
      id: 1,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
    {
      id: 2,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
    {
      id: 3,
      title:
        "Interactions of Gas Particles with Graphene during High-Throughput Compressible Flow Exfoliation: A Molecular Dynamics Simulations Study",
      link: "https://pubs.acs.org/doi/10.1021/acsami.0c11319",
      pdf: "https://pubs.acs.org/doi/pdf/10.1021/acsami.0c11319",
    },
  ];
  const [InfoClicked, setInfoClicked] = useState(
    Array.from({ length: ListOfPapers.length }, (_, i) => false)
  );
  const InfoClickedRef = useRef(InfoClicked);
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const OpenInfoMain = useSpring({
    marginBottom: !InfoClickedRef.current ? "0px" : "40px",
  });
  const OpenNothing = useSpring({
    marginBottom: "0px",
  });

  const handleInfoClicked = (index) => {
    const newArray = [...InfoClickedRef.current];
    newArray[index] = !InfoClickedRef.current[index];
    InfoClickedRef.current = newArray;
  };
  const OpenInfo = useSpring({
    transform: !InfoClickedRef.current
      ? "translateY(-40px)"
      : "translateY(0px)",
    opacity: !InfoClickedRef.current ? "0.5" : "1",
  });
  const Nothing = useSpring({
    transform: "translateY(-40px)",
    opacity: "0.5",
  });
  const Papers = ListOfPapers.map((Paper) => (
    <animated.div
      className="PaperAcademic"
      onClick={() => setInfoClicked([handleInfoClicked(Paper.id - 1)])}
      style={InfoClickedRef.current[Paper.id - 1] ? OpenInfoMain : OpenNothing}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 * Paper.id }}
        className="PaperData"
      >
        <p1>{Paper.title}</p1>
        <div className="paper-details">
          <p1>The Journal of Physical Chemistry C</p1>
          <div>
            <p2>
              Read more
              <HiArrowSmRight />
            </p2>
          </div>
        </div>
      </motion.div>

      <div className="MoreInfo">
        <animated.p
          style={InfoClickedRef.current[Paper.id - 1] ? OpenInfo : Nothing}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(Paper.link)}
        >
          Online Version
          <SiGooglescholar />
        </animated.p>
        <animated.p
          style={InfoClickedRef.current[Paper.id - 1] ? OpenInfo : Nothing}
          className="ReferMoreInfo"
          onClick={() => openInNewTab(Paper.pdf)}
        >
          Download PDF
          <RiDownloadCloudFill />
        </animated.p>
      </div>
    </animated.div>
  ));

  const Properties = ({
    title,
    caption,
    whatValue,
    value,
    unit,
    unitLong,
    Animation,
  }) => {
    const [animationDone, setAnimationDone] = useState(false);

    const [props0, set0] = useSpring(() => ({
      ...Animation,
      onRest: () => setAnimationDone(true),
    }));

    const [props, set] = useSpring(() => ({
      transform: "perspective(400px) rotateX(0deg) rotateY(0deg)",
      config: { tension: 170, friction: 26 },
    }));

    const handleMouseMove = (e) => {
      if (!animationDone) return;
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / 50;
      const deltaY = (y - centerY) / 50;

      set({
        transform: `perspective(400px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`,
      });
    };

    const handleMouseLeave = () => {
      if (!animationDone) return;
      set({
        transform: "perspective(400px) rotateX(0deg) rotateY(0deg)",
      });
    };

    return (
      <animated.div
        style={{ ...props0, ...props }}
        className="PropGrMe"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <p>{title}</p>
        <p>{caption}</p>
        <p>
          <span>{whatValue}</span>
          <p1>
            <p2>
              {value}
              <span dangerouslySetInnerHTML={{ __html: unit }} />
            </p2>{" "}
            {unitLong}
          </p1>
        </p>
      </animated.div>
    );
  };

  return (
    <animated.div className="GrapheneTextPar">
      <animated.div className="GrapheneText">
        <animated.p style={{ ...titleProps }} className="GrapheneTitle">
          Graphene
        </animated.p>
        <animated.p style={{ ...descProps }} className="GrapheneTitle">
          Ready for the SUPRISE!?
        </animated.p>
        <animated.div
          style={{ ...HrProps, marginBottom: "3vh" }}
          className="hr-Graphene"
        ></animated.div>
        <animated.p style={{ ...introProps }} className="GrapheneDescription">
          Since its <span className="highlight">discovery in 2004</span>,
          graphene - a single layer of carbon atoms - has been revolutionizing
          technology with unmatched strength, extraordinary conductivity,
          remarkable flexibility, and boundless potential, paving new avenues in
          electronics, energy, and medicine.
        </animated.p>
        <div className="PropGrPar">
          <Properties
            title={"Mechanical strength"}
            caption={
              "Extraordinary mechanical strength, over 200 times that of steel!"
            }
            whatValue={"Elastic modulus"}
            value={"~1.0"}
            unit={" TPa"}
            unitLong={"(TeraPascal)"}
            Animation={propertiesProps1}
          />
          <Properties
            title={"Thermal Properties"}
            caption={
              "Single atomic layer surpasses diamond in the thermal conductivity!"
            }
            whatValue={"Thermal Conductivity"}
            value={"~5"}
            unit={`kW·m<sup>-1</sup>·K<sup>-1</sup>`}
            unitLong={"(KiloWatt per meter Kelvin)"}
            Animation={propertiesProps2}
          />
          <Properties
            title={"Electrical Properties"}
            caption={"Electron freeway, million meters per second speed limit!"}
            whatValue={"Electron Mobility"}
            value={"~20"}
            unit={` m<sup>2</sup>·V<sup>-1</sup>·s<sup>-1</sup>`}
            unitLong={"(Meter square per Volt second)"}
            Animation={propertiesProps3}
          />
          <Properties
            title={"Flexibility"}
            caption={"More stretchable than steel, thinner than a hair!"}
            whatValue={"Ultimate Strain"}
            value={"~20"}
            unit={`%`}
            unitLong={"(Percent)"}
            Animation={propertiesProps4}
          />
        </div>
      </animated.div>
      <motion.div
        className="GrapheneTextMore"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <animated.div
          className="GrapheneTextMoreT"
          style={{ ...propertiesProps4 }}
        >
          <motion.p0
            initial={{ opacity: 0, y: 10, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            My Related Papers
          </motion.p0>
          {Papers}
        </animated.div>

        <motion.div
          className="GrapheneTextMoreB"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p0
            initial={{ opacity: 0, y: 10, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            Related Links
          </motion.p0>
          <div className="RelatedLinks">
            <p1>Wikipedia</p1>
            <p2>General Information</p2>
            <GoLinkExternal />
          </div>
          <div className="RelatedLinks">
            <p1>Wikipedia</p1>
            <p2>General Information</p2>
            <GoLinkExternal />
          </div>
        </motion.div>
      </motion.div>
      <div className="GrapheneTextMoreS">
        <p1>Scroll Down </p1>

        <BsArrowDownShort />
      </div>
    </animated.div>
  );
};
const SideMenu = ({ MenuNumber, MenuHide }) => {
  const useAnimStyles = (delay, RunAnim) =>
    useSpring({
      from: { opacity: 1, transform: "translate3d(0,0px,0)" },
      to: async (next) => {
        if (RunAnim) {
          await next({ opacity: 0, transform: "translate3d(0,-10px,0)" });
          await new Promise((resolve) => setTimeout(resolve, 500));
          await next({ opacity: 1, transform: "translate3d(0,0px,0)" });
        }
      },
      config: { duration: 400 },
      delay: delay,
    });
  const [RunAnim, setRunAnim] = useState(false);
  const SideMenuProps = useSpring({
    from: { opacity: 0, transform: "translate3d(0,10px,0)" },
    to: {
      opacity: MenuHide ? 1 : 0,
      transform: MenuHide ? "translate3d(0,0px,0)" : "translate3d(0,10px,0)",
    },
    config: { duration: 500 },
    delay: 100,
  });

  const AnimStyles1 = useAnimStyles(0, RunAnim);
  const AnimStyles2 = useAnimStyles(300, RunAnim);
  const AnimStyles3 = useAnimStyles(600, RunAnim);

  useEffect(() => {
    if (MenuNumber > 1) {
      setRunAnim((prev) => !prev);
    }
  }, [MenuNumber]);

  return (
    <animated.div style={{ ...SideMenuProps }} className="GrapheneMenu">
      <animated.div
        style={{ ...AnimStyles1 }}
        className="GrapheneMenuLT"
      ></animated.div>
      <animated.div style={{ ...AnimStyles2 }} className="GrapheneMenuC">
        <p>{MenuNumber} </p> <span>/</span>
        <p>5</p>
      </animated.div>
      <animated.div
        style={{ ...AnimStyles3 }}
        className="GrapheneMenuLB"
      ></animated.div>
    </animated.div>
  );
};
const ThicknessInfo = ({
  Clicked,
  ClickedThick,
  setClickedThick,
  canvasHeight,
}) => {
  const numericHeight = parseFloat(canvasHeight) / 2;

  const useMenuSpring = (delay, translateY = "10px") =>
    useSpring({
      from: { opacity: 0, transform: `translate3d(0,${translateY},0)` },
      to: {
        opacity: ClickedThick && Clicked ? 1 : 0,
        transform:
          ClickedThick && Clicked
            ? "translate3d(0,0px,0)"
            : `translate3d(0,${translateY},0)`,
      },
      config: { duration: 500 },
      delay: delay,
    });

  const SideMenuProps = useMenuSpring(300);
  const SideMenuPropsIn = useMenuSpring(ClickedThick ? 800 : 500);
  const SideMenuPropsInT1 = useMenuSpring(ClickedThick ? 800 : 500);
  const SideMenuPropsInT2 = useMenuSpring(ClickedThick ? 900 : 400);
  const SideMenuPropsInT3 = useMenuSpring(ClickedThick ? 1000 : 300);
  return (
    <>
      <animated.div
        style={{ ...SideMenuProps, top: `${numericHeight}px` }}
        className="Ticknesslayer"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <BsFillTriangleFill />
        <animated.div style={{ ...SideMenuPropsIn }}>
          <animated.p style={{ ...SideMenuPropsInT1 }}>Thickness</animated.p>
          <animated.p style={{ ...SideMenuPropsInT2 }}>
            <span>Only</span> ~0.32 <span>nm</span>
          </animated.p>
          <animated.p style={{ ...SideMenuPropsInT3 }}>
            1 meter = 1000000000 (=10<sup>9</sup>) nm
          </animated.p>
        </animated.div>
      </animated.div>
      <div className="DragThickness">
        <DraggableGraphene
          Clicked={!ClickedThick}
          setClicked={setClickedThick}
          MenuHide={Clicked}
          Text={"Unitcell of Graphene"}
        />
      </div>
    </>
  );
};
function Graphene() {
  const [textProps, setText] = useSpring(() => ({ y: 0, opacity: 1 }));
  const [state, setState] = useState({
    ClickedTD: false,
    ClickedGr: false,
    ClickedThick: true,
    ClickedUnitC: true,
    VisibleTD: true,
    VisibleGr: false,
    VisibleUc: false,
    VisibleTot: false,
    VisibleMore: false,
    canvasHeight: 0,
    MenuNumber: 1,
  });

  const MenuHide = !useSelector(selectVisibility);
  const canvasRef = useRef(null);

  const handleTDClick = useCallback(() => {
    setText({
      opacity: 0,
      onRest: () => {
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            MenuNumber: 2,
            VisibleGr: true,
            VisibleUc: true,
          }));
        }, 100);
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            VisibleTD: false,
          }));
        }, 2000);
      },
    });
  }, [setText]);

  const handleThickClick = useCallback(() => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        MenuNumber: 3,
        VisibleTot: true,
      }));
    }, 1000);
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        VisibleUc: false,
      }));
    }, 2000);
  }, []);

  const handleUnitCClick = useCallback(() => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        MenuNumber: 4,
        VisibleMore: true,
      }));
    }, 1000);
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        VisibleTot: false,
      }));
    }, 2000);
  }, []);

  useEffect(() => {
    state.ClickedTD && handleTDClick();
  }, [state.ClickedTD, handleTDClick]);

  useEffect(() => {
    !state.ClickedThick && handleThickClick();
  }, [state.ClickedThick, handleThickClick]);

  useEffect(() => {
    !state.ClickedUnitC && handleUnitCClick();
  }, [state.ClickedUnitC, handleUnitCClick]);

  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      setState((prevState) => ({
        ...prevState,
        canvasHeight: canvasRef.current.style.height,
      }));
    }
  }, [canvasRef]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [MenuHide, state.ClickedTD, handleResize]);

  const GrapheneProps = useSpring({
    from: { opacity: 0, transform: "translate3d(0,10px,0)" },
    to: {
      opacity: MenuHide ? 1 : 0,
      transform: MenuHide ? "translate3d(0,0px,0)" : "translate3d(0,10px,0)",
    },
    config: { duration: 800 },
    delay: 100,
  });
  return (
    <>
      {state.VisibleTD && (
        <TDMaterials
          textProps={textProps}
          Clicked={state.ClickedTD}
          setClicked={() => setState({ ...state, ClickedTD: true })}
          MenuHide={MenuHide}
        />
      )}
      {state.VisibleGr && (
        <GrapheneDes
          textProps={textProps}
          Clicked={state.ClickedGr}
          setClicked={() => setState({ ...state, ClickedGr: true })}
          MenuHide={MenuHide}
          ClickedThick={state.ClickedThick}
        />
      )}
      <SideMenu MenuNumber={state.MenuNumber} MenuHide={MenuHide} />
      <animated.div style={{ ...GrapheneProps }} className="Graphene">
        {state.VisibleUc && (
          <ThicknessInfo
            Clicked={state.ClickedTD}
            ClickedThick={state.ClickedThick}
            setClickedThick={() => setState({ ...state, ClickedThick: false })}
            canvasHeight={state.canvasHeight}
          />
        )}
        {/* {state.VisibleTot && (
          <UnitcellInfo
            Clicked={!state.ClickedThick}
            ClickedThick={state.ClickedUnitC}
            setClickedThick={() => setState({ ...state, ClickedUnitC: false })}
            canvasHeight={state.canvasHeight}
          />
        )} */}

        <Canvas ref={canvasRef} camera={{ position: [0, 0, 3] }}>
          <ambientLight />
          <pointLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <group>
              <Model
                position={[0, 0, 0]}
                opacity={1}
                Clicked={state.ClickedTD}
                ClickedThick={!state.ClickedThick}
              />
            </group>
          </Suspense>
        </Canvas>
      </animated.div>
    </>
  );
}

export default Graphene;
