import "./StoryLine.css";
import React, { useRef, useState, useEffect } from "react";
import { useDraggable } from "react-use-draggable-scroll";
import { IoIosArrowBack, IoIosArrowForward, IoMdShare } from "react-icons/io";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { useSpring, animated, useSprings, config, easings } from "react-spring";
import { RiCloseFill } from "react-icons/ri";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import Post1 from "./Image/1.webp";
import Post2 from "./Image/2.webp";
import Post3 from "./Image/3.webp";
import Post4 from "./Image/4.webp";
import { AiFillInstagram } from "react-icons/ai";
import { RWebShare } from "react-web-share";
import { useSwipeable } from "react-swipeable";

const StoryLine = () => {
  const NOStory = {
    0: {
      key: 1000,
      Images: [Post1, Post2, Post3, Post4],
      date: 1,
      Location: "Rome,Italy-0",
      Caption: "Caption 1",
      Likes: 125 - 1,
      Comments: 25 - 1,
      Shares: 25 - 1,
      Bookmarks: 25 - 1,
      Liked: "Ali Inanlo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    1: {
      key: 1001,
      Images: [Post2, Post3, Post1],
      date: 2,
      Location: "Rome,Italy-1",
      Caption: "Caption 2",
      Likes: 125 - 2,
      Comments: 25 - 2,
      Shares: 25 - 2,
      Bookmarks: 25 - 2,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    2: {
      key: 1002,
      Images: [Post3, Post4],
      date: 3,
      Location: "Rome,Italy-2",
      Caption: "Caption 3",
      Likes: 125 - 3,
      Comments: 25 - 3,
      Shares: 25 - 3,
      Bookmarks: 25 - 3,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    3: {
      key: 1003,
      Images: [Post4],
      date: 4,
      Location: "Rome,Italy-3",
      Caption: "Caption 4",
      Likes: 125 - 4,
      Comments: 25 - 4,
      Shares: 25 - 4,
      Bookmarks: 25 - 4,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
  };

  const [ArrowDir, setArrowDir] = useState(0);
  const [ImegeOrderO, setImegeOrderO] = useState(0);
  const [Imegeorder, setImegeorder] = useState([0]);
  const [PostClickedKey, setPostClickedKey] = useState(0);
  const [ImegeIndex, setImegeIndex] = useState(0);
  const contentWrapper = useRef();
  const { events } = useDraggable(contentWrapper);
  const [Start, setStart] = useState(true);
  const [End, setEnd] = useState(false);
  const [ClickedLeft, setClickedLeft] = useState(true);
  const [ClickedRight, setClickedRight] = useState(true);
  const [StoryClicked, setStoryClicked] = useState(true);
  const [StoryClickedOld, setStoryClickedOld] = useState(true);
  const [PlayStory, setPlayStory] = useState(true);
  const [SoundStory, setSoundStory] = useState(true);
  const [NextStories, setNextStories] = useState([]);

  const handlers = useSwipeable({
    onSwipedLeft: () => StoryTouched("right"),
    onSwipedRight: () => StoryTouched("left"),
    onSwipedDown: () => OnClickClose(),
    delta: 10,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  let IMG = useRef([]);
  function Test(event) {
    ImageOrderSet(event);
    setImegeIndex(0);
    setPostClickedKey(event);
  }
  useEffect(() => {
    console.log("----", StoryClicked, ImegeOrderO);
  }, [StoryClicked, ImegeOrderO]);

  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  const updateSize = () =>
    setSize({
      x: window.innerWidth,
      y: window.innerHeight,
    });
  useEffect(() => (window.onresize = updateSize), []);

  const OpenAnim1 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked ? "translateX(0px)" : "translateX(15px)",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked ? "translateX(15px)" : "translateX(0px)",
    },
    duration: 200,
    config: config.molasses,
  });
  const OpenAnim2 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked ? "translateX(0px)" : "translateX(15px)",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked ? "translateX(15px)" : "translateX(0px)",
    },
    duration: 200,
    config: config.molasses,
  });
  const OpenAnim3 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked ? "translateX(0px)" : "translateX(-15px)",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked ? "translateX(-15px)" : "translateX(0px)",
    },
    duration: 200,
    config: config.molasses,
  });
  const OpenAnim4 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked ? "translateX(5px)" : "translateX(35px)",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked ? "translateX(35px)" : "translateX(5px)",
    },
    delay: 300,
    duration: 300,
    config: config.molasses,
  });
  const OpenAnim5 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked
        ? "translateY(calc(-42vh + 25px))"
        : "translateY(translateY(calc(-42vh + 45px)))",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked
        ? "translateY(calc(-42vh + 45px))"
        : "translateY(calc(-42vh + 25px))",
    },
    delay: 300,
    duration: 300,
    config: config.molasses,
  });
  const OpenAnim6 = useSpring({
    from: {
      opacity: StoryClicked ? 1 : 0,
      transform: StoryClicked
        ? "rotateZ(90deg) translate(calc(-2.25479vh - 70px), calc(85vh / 1.774/2 + 25px))"
        : "rotateZ(90deg) translate(calc(-2.25479vh - 50px), calc(85vh / 1.774/2 + 25px))",
    },
    to: {
      opacity: StoryClicked ? 0 : 1,
      transform: StoryClicked
        ? "rotateZ(90deg) translate(calc(-2.25479vh - 50px), calc(85vh / 1.774/2 + 25px))"
        : "rotateZ(90deg) translate(calc(-2.25479vh - 70px), calc(85vh / 1.774/2 + 25px))",
    },
    delay: 300,
    duration: 300,
    config: config.molasses,
  });
  const OpenAnim7 = useSprings(
    Object.values(NOStory)[PostClickedKey].Images.length,
    Object.values(NOStory)[PostClickedKey].Images.map((element, index) => ({
      from: {
        opacity: StoryClicked ? 1 : 0,
        transform: StoryClicked ? "translateX(5px)" : "translateX(35px)",
      },
      to: {
        opacity: StoryClicked ? 0 : ImegeIndex === index ? 0.9 : 0.4,
        transform: StoryClicked ? "translateX(35px)" : "translateX(5px)",
      },
      delay:
        200 *
        (Object.values(NOStory)[PostClickedKey].Images.length - index + 1),
      duration:
        300 *
        (Object.values(NOStory)[PostClickedKey].Images.length - index + 1),
    }))
  );
  const OpenAnim8 = useSprings(
    Object.values(NOStory).length,
    Object.values(NOStory).map((element, index) => ({
      from: {
        filter:
          index !== PostClickedKey ? "brightness(0.4)" : "brightness(0.8)",
        opacity: StoryClicked ? 1 : 0,
        transform: StoryClicked ? "translateY(5px)" : "translateY(35px)",
      },
      to: {
        filter:
          index !== PostClickedKey ? "brightness(0.4)" : "brightness(0.8)",
        opacity: StoryClicked ? 0 : 1,
        transform: StoryClicked ? "translateY(35px)" : "translateY(5px)",
      },
      delay: 200 * (Object.values(NOStory).length - index + 1),
      duration: 100 * (Object.values(NOStory).length - index + 1),
      config: config.molasses,
    }))
  );
  const OpenAnim9 = useSprings(
    Object.values(NOStory)[PostClickedKey].Images.length,
    Object.values(NOStory)[PostClickedKey].Images.map((element, index) => ({
      from: {
        opacity: StoryClicked ? 1 : 0,
        position: "absolute",
        transform: StoryClicked
          ? "translate( calc(-" +
            (size.x > 400 ? 85 : 70) +
            "vh / 1.774/2) , calc(-" +
            (size.x > 400 ? 85 : 62) +
            "vh / 1.774 + 40px) )"
          : "translate( calc(-" +
            (size.x > 400 ? 85 : 70) +
            "vh / 1.774/2) , calc(-" +
            (size.x > 400 ? 85 : 62) +
            "vh / 1.774 + 60px) )",
      },
      to: {
        position: "absolute",
        opacity: StoryClicked ? 0 : 1,
        transform: StoryClicked
          ? "translate( calc(-" +
            (size.x > 400 ? 85 : 70) +
            "vh / 1.774/2) , calc(-" +
            (size.x > 400 ? 85 : 62) +
            "vh / 1.774 + 60px) )"
          : "translate( calc(-" +
            (size.x > 400 ? 85 : 70) +
            "vh / 1.774/2) , calc(-" +
            (size.x > 400 ? 85 : 62) +
            "vh / 1.774 + 40px) )",
      },
      delay: 500,
      duration: 300,
      config: config.molasses,
    }))
  );
  const OpenAnim10 = useSprings(
    Object.values(NOStory).length,
    Object.values(NOStory).map((element, index) => ({
      from: {
        filter:
          index !== PostClickedKey ? "brightness(0.2)" : "brightness(0.8)",
        opacity: StoryClicked ? 1 : 0,
        transform: StoryClicked
          ? "translate(20px, -72px)"
          : "translate(20px, -22px)",
      },
      to: {
        filter:
          index !== PostClickedKey ? "brightness(0.2)" : "brightness(0.8)",
        opacity: StoryClicked ? 0 : 1,
        transform: StoryClicked
          ? "translate(20px, -22px)"
          : "translate(20px, -72px)",
      },
      delay: 200 * (Object.values(NOStory).length - index + 1),
      duration: 100 * (Object.values(NOStory).length - index + 1),
      config: config.molasses,
    }))
  );
  const StoryClickedOpen = useSpring({
    opacity: StoryClicked ? 0 : 1,
    display: StoryClicked ? "none" : "flex",
  });
  const Stories = Object.values(NOStory).map((number, index) => (
    <animated.div
      key={index}
      className="storyCircle"
      onClick={() => OnClickOpen(index)}
    >
      <div className="StoryCircleIn">
        <img src={Object.values(NOStory)[index].Images[0]} alt="" />
      </div>
      <h1>{number.Caption}</h1>
    </animated.div>
  ));
  const sideScroll = (
    element: HTMLDivElement,
    speed: number,
    distance: number,
    step: number
  ) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step;
      if (element.scrollLeft < 17) {
        setStart(true);
      } else {
        setStart(false, element.scrollLeft);
      }
      if (element.scrollLeft > 7 * 17) {
        setEnd(true);
      } else {
        setEnd(false, element.scrollLeft);
      }
      scrollAmount += Math.abs(step);
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed);
  };
  const ClickLeft = useSpring({
    scale: ClickedRight ? 1 : 0.9,
    opacity: End ? 0.3 : 1,
  });
  const ClickRight = useSpring({
    scale: ClickedLeft ? 1 : 0.9,
    opacity: Start ? 0.3 : 1,
  });
  function arrayRotate(arr, reverse) {
    if (size.x > 400) {
      if (reverse) arr.unshift(arr.pop());
      else arr.push(arr.shift());
    } else {
      if (reverse) {
        arr = arr.map(function (x) {
          return x - 1;
        });
      } else {
        arr = arr.map(function (x) {
          return x + 1;
        });
      }
    }
    return arr;
  }
  function StoryTouched(arrow) {
    const ImegeLength = Object.values(NOStory)[PostClickedKey].Images.length;
    const StoryLength = NextStories.length;
    const found = NextStories.find((element) => element === PostClickedKey);
    if (ImegeLength > 0) {
      setArrowDir(arrow);
      if (arrow === "right") {
        var Order = arrayRotate(Imegeorder, true);
        if (Order[0] === -ImegeLength) {
          if (found === StoryLength - 1) {
            Test(NextStories[0]);
            Order = ImegeOrderO;
          } else {
            Test(NextStories[found + 1]);
            Order = ImegeOrderO;
          }
        }
        if (ImegeIndex < ImegeLength - 1) {
          setImegeIndex(ImegeIndex + 1);
        } else {
          console.log(Imegeorder, NextStories[found]);
          if (StoryLength === found + 1) {
            Test(NextStories[0]);
          } else {
            Test(NextStories[found + 1]);
          }
        }
        setImegeorder(Order);
      }
      if (arrow === "left") {
        Order = arrayRotate(Imegeorder, false);
        if (Order[0] === 1) {
          if (found === 0) {
            const LastStoryLen = NOStory[StoryLength - 1].Images.length - 1;
            Test(NextStories[StoryLength - 1]);
            Order = ImegeOrderO.map(function (x) {
              return x - LastStoryLen;
            });
          } else {
            const LastStoryLen = NOStory[found - 1].Images.length - 1;
            ImageOrderSet(found - 1);
            Test(NextStories[found - 1]);
            Order = ImegeOrderO.map(function (x) {
              return x - LastStoryLen;
            });
          }
        }
        setImegeorder(Order);
      }
    }

    setTimeout(() => {
      setArrowDir(null);
    }, 1000);
  }
  function ArrowClicked(PostClickedKey, arrow) {
    const ImegeLength = Object.values(NOStory)[PostClickedKey].Images.length;
    const StoryLength = NextStories.length;
    const found = NextStories.find((element) => element === PostClickedKey);
    if (ImegeLength > 0) {
      setArrowDir(arrow);
      if (arrow === "right") {
        var Order = arrayRotate(ImegeOrderO, true);
        if (ImegeIndex < ImegeLength - 1) {
          setImegeIndex(ImegeIndex + 1);
        } else {
          if (StoryLength === found + 1) {
            Test(NextStories[0]);
          } else {
            Test(NextStories[found + 1]);
          }
        }
        setImegeorder(Order);
      }
      if (arrow === "left") {
        Order = arrayRotate(ImegeOrderO, false);
        if (ImegeIndex > 0) {
          setImegeIndex(ImegeIndex - 1);
        } else {
          setImegeIndex(ImegeLength - 1);
          if (found === 0) {
            Test(NextStories[StoryLength - 1]);
            setImegeIndex(ImegeLength - 1);
          } else {
            setImegeIndex(ImegeLength - 1);
            Test(NextStories[found - 1]);
          }
        }
      }
    }
    setTimeout(() => {
      setArrowDir(null);
    }, 1000);
  }
  function ImageOrderSet(event) {
    const ImegeLength = Object.values(NOStory)[event].Images.length;
    var Order = Array.from(Array(ImegeLength).keys());
    if (ImegeLength > 2 && size.x > 400) {
      Order[ImegeLength - 1] = -1;
    }
    setImegeorder(Order);
    setImegeOrderO(Order);
  }
  function NextStoriesSet() {
    const NewOrder = [];
    for (let i = 0; i < Object.values(NOStory).length; i++) {
      NewOrder.push(i);
    }
    setNextStories(NewOrder);
  }
  function OnClickOpen(event) {
    setPostClickedKey(event);
    setStoryClicked(false);
    setStoryClickedOld(false);
    setArrowDir(null);
    NextStoriesSet();
    ImageOrderSet(event);
  }
  function OnClickClose() {
    setStoryClicked(true);
    setStoryClickedOld(true);
    setPostClickedKey(0);
    setImegeIndex(0);
    setImegeorder(null);
    setImegeOrderO(null);
    setNextStories(null);
  }
  function OnClickPlay(event) {
    if (PlayStory) {
      return (
        <BsFillPlayFill
          className="StoryDescriptionIcon"
          onClick={() => setPlayStory(false)}
        />
      );
    } else {
      return (
        <BsFillPauseFill
          className="StoryDescriptionIcon"
          onClick={() => setPlayStory(true)}
        />
      );
    }
  }
  function OnClickSound(event) {
    if (SoundStory) {
      return (
        <HiVolumeUp
          className="StoryDescriptionIcon"
          onClick={() => setSoundStory(false)}
        />
      );
    } else {
      return (
        <HiVolumeOff
          className="StoryDescriptionIcon"
          onClick={() => setSoundStory(true)}
        />
      );
    }
  }
  function Lines() {
    const PostLines = Object.values(NOStory)[PostClickedKey].Images.map(
      (number, index) => (
        <animated.div
          style={OpenAnim7[index]}
          className="StoryCounter"
          key={"Line" + index}
        ></animated.div>
      )
    );
    return <>{PostLines}</>;
  }

  function StoryImages() {
    if (size.x > 400) {
      var scaleX = 0.4;
      var Opacity = 0;
      var FromToVar = [1, -1];
    } else {
      scaleX = 7;
      Opacity = 0.5;
      FromToVar = [-1, 1];
    }

    var OpacityS = [Opacity, 1, Opacity, 0, 0, 0, 0, 0, 0, 0, 0];
    var OpacityE = [Opacity, 1, Opacity, 0, 0, 0, 0, 0, 0, 0, 0];
    var FromTo = [0, 0];

    if (ArrowDir === "right") {
      OpacityS = [Opacity, 1, Opacity, 0, 0, 0, 0, 0, 0, 0, 0];
      OpacityE = [1, Opacity, 1, 0, 0, 0, 0, 0, 0, 0, 0];
      FromTo = FromToVar;
    }
    if (ArrowDir === "left") {
      OpacityS = [Opacity, 1, Opacity, 0, 0, 0, 0, 0, 0, 0, 0];
      OpacityE = [1, Opacity, 1, 0, 0, 0, 0, 0, 0, 0, 0];
      FromTo = FromToVar;
    }

    const ImageStyle = useSprings(
      Imegeorder.length,
      Imegeorder.map((element, item) => ({
        from: {
          zIndex: element === 0 ? 1 : 0,
          opacity:
            ArrowDir === "right"
              ? OpacityE[Imegeorder[item] + 1]
              : OpacityE[Imegeorder[item] + 1],
          transform:
            size.x > 400
              ? ArrowDir === "right"
                ? "translateY(" +
                  (85 / 1.774) * ((Imegeorder[item] + FromTo[0]) * 0.4) +
                  "px)"
                : "translateY(" +
                  (85 / 1.774) * ((Imegeorder[item] + FromTo[1]) * 0.4) +
                  "px)"
              : ArrowDir === "right"
              ? "translateX(" +
                (85 / 1.774) * ((Imegeorder[item] + FromTo[1]) * scaleX) +
                "px) scale(" +
                (Imegeorder[item] !== 0 ? 0.92 : 1) +
                ")"
              : "translateX(" +
                (85 / 1.774) * ((Imegeorder[item] + FromTo[1]) * scaleX) +
                "px) scale(" +
                (Imegeorder[item] !== 0 ? 0.92 : 1) +
                ")",
        },
        to: {
          opacity:
            ArrowDir === "right"
              ? OpacityS[Imegeorder[item] + 1]
              : OpacityS[Imegeorder[item] + 1],
          transform:
            ArrowDir === "right"
              ? "translateX(" +
                (85 / 1.774) * (Imegeorder[item] * scaleX) +
                "px) scale(" +
                (Imegeorder[item] !== 0 ? 0.92 : 1) +
                ")"
              : "translateX(" +
                (85 / 1.774) * (Imegeorder[item] * scaleX) +
                "px) scale(" +
                (Imegeorder[item] !== 0 ? 0.92 : 1) +
                ")",
        },
        config: {
          mass: 1,
          tension: 120,
          friction: 18,
        },
      }))
    );
    function PostImages() {
      return !StoryClicked
        ? Object.values(NOStory)[PostClickedKey].Images.map((number, index) => (
            <animated.div style={OpenAnim9[index]}>
              <animated.img
                key={"PostImages" + index.toString()}
                ref={(element) => (IMG.current[index] = element)}
                style={ImageStyle[index]}
                src={number}
                alt=""
              />
            </animated.div>
          ))
        : null;
    }

    const StoriesRotate = Object.values(NOStory).map((number, index) => (
      <>
        {
          <animated.div
            onClick={() => Test(NextStories[index])}
            className="StorySelectorMain"
          >
            <animated.div style={OpenAnim8[index]} className="StorySelector">
              <animated.img
                src={Object.values(NOStory)[NextStories[index]].Images[0]}
                alt=""
              />
            </animated.div>

            <animated.p
              style={OpenAnim8[index]}
              className="StoryRotatorCaption"
            >
              {number.Caption}
            </animated.p>
            <animated.div
              style={OpenAnim10[index]}
              className="StoryRotatorCircle"
            ></animated.div>
          </animated.div>
        }
      </>
    ));

    return (
      <div className="OriginalStoryImg">
        <div className="StoryArrows">
          <animated.div
            style={OpenAnim2}
            className="StoryLeftArrow"
            onClick={() => ArrowClicked(PostClickedKey, "right")}
          >
            <p>Next Story</p>
            <IoIosArrowBack />
          </animated.div>
          <animated.div
            style={OpenAnim3}
            className="StoryRightArrow"
            onClick={() => ArrowClicked(PostClickedKey, "left")}
          >
            <p>Last Story</p>
            <IoIosArrowForward />
          </animated.div>
        </div>
        <PostImages />
        <div className="StoryRotator">{StoriesRotate}</div>
      </div>
    );
  }
  function StoryClick() {
    return (
      <>
        <animated.div
          style={StoryClickedOpen}
          className="StoryClick"
          // onTouchStart={handleTouchStart}
          {...handlers}
        >
          <img
            className="StorybackgroundImage"
            src={Object.values(NOStory)[PostClickedKey].Images[ImegeIndex]}
            alt=""
          ></img>
          <animated.div style={OpenAnim4} class="StoryCircle"></animated.div>
          {StoryClicked ? <></> : <StoryImages />}
          <animated.div style={OpenAnim6} className="StoryCounters">
            <RiCloseFill
              onClick={() => OnClickClose()}
              className="CloseStory"
            />
            <Lines />
          </animated.div>
          <animated.div style={OpenAnim5} className="StoryDescription">
            <div className="StoryDescriptionText">
              <h1>{Object.values(NOStory)[PostClickedKey].Caption}</h1>
              <h2>{Object.values(NOStory)[PostClickedKey].date} Weeks Ago</h2>
            </div>
            <animated.div className="StoryDescriptionTextout">
              <h1>{Object.values(NOStory)[PostClickedKey].Caption}</h1>
              <h2>{Object.values(NOStory)[PostClickedKey].date} Weeks Ago</h2>
            </animated.div>
            <OnClickPlay />
            <OnClickSound />
          </animated.div>
          <div className="StoryBottomIcons">
            <RWebShare
              data={{
                text: "Share The Post",
                url: Object.values(NOStory)[PostClickedKey].Link,
                title: "Saeed's Post",
              }}
            >
              <animated.div style={OpenAnim1} className="StoryShareOpen">
                <h1>
                  {" "}
                  <IoMdShare />
                  Share Story
                </h1>
              </animated.div>
            </RWebShare>
            <animated.a
              style={OpenAnim1}
              className="StoryShareOpen"
              target="_blank"
              rel="noreferrer"
              href={Object.values(NOStory)[PostClickedKey].Link}
            >
              <h1>
                {" "}
                <AiFillInstagram />
                Open Instagram
              </h1>
            </animated.a>
          </div>
          <div className="StoryBottomIcons">
            <RWebShare
              data={{
                text: "Share The Post",
                url: Object.values(NOStory)[PostClickedKey].Link,
                title: "Saeed's Post",
              }}
            >
              <animated.div style={OpenAnim1} className="StoryShareOpenOut">
                <h1>
                  {" "}
                  <IoMdShare />
                  Share Post
                </h1>
              </animated.div>
            </RWebShare>
            <animated.a
              style={OpenAnim1}
              className="StoryShareOpenOut"
              target="_blank"
              rel="noreferrer"
              href={Object.values(NOStory)[PostClickedKey].Link}
            >
              <h1>
                {" "}
                <AiFillInstagram />
                Open Instagram
              </h1>
            </animated.a>
          </div>
        </animated.div>
      </>
    );
  }
  return (
    <>
      <StoryClick />
      <div className="StorytMain">
        <p>Stories</p>
        <hr className="StoryLine" />
        <div className="storyline">
          <div className="ul" {...events} ref={contentWrapper}>
            {Stories}
          </div>
          <div className="StoryButtons">
            <animated.button
              style={ClickRight}
              onMouseDown={() => {
                setClickedLeft(!ClickedLeft);
                sideScroll(contentWrapper.current, 30, 69.5, -10);
              }}
              onMouseUp={() => setClickedLeft(!ClickedLeft)}
            >
              {" "}
              <IoIosArrowBack />
            </animated.button>
            <animated.button
              style={ClickLeft}
              onMouseDown={() => {
                setClickedRight(!ClickedRight);
                sideScroll(contentWrapper.current, 30, 69.5, 10);
              }}
              onMouseUp={() => setClickedRight(!ClickedRight)}
            >
              <IoIosArrowForward />
            </animated.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryLine;
