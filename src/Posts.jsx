import "./Posts.css";
import Post1 from "./Image/1.webp";
import Post2 from "./Image/2.webp";
import Post3 from "./Image/3.webp";
import Post4 from "./Image/4.webp";
import { useSpring, useSprings, animated, easings } from "react-spring";
import React, { useRef, useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoMdShare } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import { AiFillInstagram, AiFillHeart } from "react-icons/ai";
import { FaComment, FaShareAlt } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { RWebShare } from "react-web-share";

const Posts = () => {
  const NOPost = {
    0: {
      key: 1000,
      Images: [Post1, Post2, Post3, Post4],
      LikedOne: [Post1, Post2, Post3],
      date: 1,
      Location: "Rome,Italy-0",
      Caption: "This is Caption 1",
      Likes: 125 - 1,
      Comments: 25 - 1,
      Shares: 25 - 1,
      Bookmarks: 25 - 1,
      Liked: "Ali Inanlo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    1: {
      key: 1001,
      Images: [Post2, Post1, Post2, Post3],
      LikedOne: [Post1, Post2, Post3],
      date: 2,
      Location: "Rome,Italy-1",
      Caption: "This is Caption 2",
      Likes: 125 - 2,
      Comments: 25 - 2,
      Shares: 25 - 2,
      Bookmarks: 25 - 2,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    2: {
      key: 1002,
      Images: [Post3, Post4, Post1, Post2],
      LikedOne: [Post1, Post2, Post3],
      date: 3,
      Location: "Rome,Italy-2",
      Caption: "This is Caption 3",
      Likes: 125 - 3,
      Comments: 25 - 3,
      Shares: 25 - 3,
      Bookmarks: 25 - 3,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    3: {
      key: 1003,
      Images: [Post4, Post1, Post2, Post3],
      LikedOne: [Post1, Post2, Post3],
      date: 4,
      Location: "Rome,Italy-3",
      Caption: "This is Caption 4",
      Likes: 125 - 4,
      Comments: 25 - 4,
      Shares: 25 - 4,
      Bookmarks: 25 - 4,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    4: {
      key: 1004,
      Images: [Post2, Post1, Post4, Post3],
      LikedOne: [Post1, Post2, Post3],
      date: 2,
      Location: "Rome,Italy-4",
      Caption: "This is Caption 5",
      Likes: 125 - 2,
      Comments: 25 - 2,
      Shares: 25 - 2,
      Bookmarks: 25 - 2,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    5: {
      key: 1005,
      Images: [Post3, Post4, Post1, Post2],
      LikedOne: [Post1, Post2, Post3],
      date: 3,
      Location: "Rome,Italy-5",
      Caption: "This is Caption 6",
      Likes: 125 - 3,
      Comments: 25 - 3,
      Shares: 25 - 3,
      Bookmarks: 25 - 3,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
    6: {
      key: 1006,
      Images: [Post4, Post1, Post2, Post3, Post1],
      LikedOne: [Post1, Post2, Post3],
      date: 4,
      Location: "Rome,Italy-6",
      Caption: "This is Caption 7",
      Likes: 125 - 4,
      Comments: 25 - 4,
      Shares: 25 - 4,
      Bookmarks: 25 - 4,
      Liked: "Ali Inanloo",
      Link: "https://www.instagram.com/p/CfiKuQMtsN9/?utm_source=ig_web_copy_link",
    },
  };

  function Card(props, { number }) {
    const ref = useRef();
    const [isHovered, setHovered] = useState(false);

    const Image = useSpring({
      opacity: isHovered ? 0.7 : 0.9,
      filter: isHovered ? "brightness(0.4)" : "brightness(0.7)",
    });
    const span = useSpring({
      opacity: isHovered ? 1 : 0.7,
    });

    const item = props.item;

    return (
      <animated.div
        ref={ref}
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => OpenThePost()}
      >
        {number}

        <animated.span style={span}>
          {Object.values(NOPost)[item].Location}{" "}
        </animated.span>
        <animated.img
          style={Image}
          src={Object.values(NOPost)[item].Images[0]}
        />

        <div
          style={{ display: isHovered ? "flex" : "none" }}
          className="PostData"
        >
          <AiFillHeart />
          <p>{Object.values(NOPost)[item].Likes}</p>
        </div>
      </animated.div>
    );
  }

  function Circles() {
    const PostCircles = Object.values(NOPost)[PostClickedKey].Images.map(
      (number, index) => (
        <animated.div
          style={{
            width: ImegeIndex === index ? "12px" : "6px",
            opacity: ImegeIndex === index ? "0.7" : "0.4",
          }}
          className="PostCircle"
          key={"circle" + index}
        ></animated.div>
      )
    );
    return <>{PostCircles}</>;
  }
  function arrayRotate(arr, reverse) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  }
  const [ImegeOrderO, setImegeOrderO] = useState(0);
  const [ArrowDir, setArrowDir] = useState(0);
  const [Imegeorder, setImegeorder] = useState([0]);
  const [ImegeIndex, setImegeIndex] = useState(0);

  function ArrowClicked(PostClickedKey, arrow) {
    const ImegeLength = Object.values(NOPost)[PostClickedKey].Images.length;
    setArrowDir(arrow);
    if (arrow === "right") {
      var Order = arrayRotate(ImegeOrderO, true);
      if (ImegeIndex < ImegeLength - 1) {
        setImegeIndex(ImegeIndex + 1);
      } else {
        setImegeIndex(0);
      }
      setImegeorder(Order);
    }
    if (arrow === "left") {
      Order = arrayRotate(ImegeOrderO, false);
      if (ImegeIndex > 0) {
        setImegeIndex(ImegeIndex - 1);
      } else {
        setImegeIndex(ImegeLength - 1);
      }
      setImegeorder(Order);
    }
    setTimeout(() => {
      setArrowDir(null);
    }, 1000);
  }

  let IMG = useRef([]);
  function PostImages() {
    var OpacityS = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var OpacityE = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var FromTo = [0, 0];

    if (ArrowDir === "right") {
      OpacityS = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      OpacityE = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
      FromTo = [1, -1];
    }
    if (ArrowDir === "left") {
      OpacityS = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      OpacityE = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
      FromTo = [1, -1];
    }
    const ImageStyle = useSprings(
      Imegeorder.length,
      Imegeorder.map((element, item) => ({
        from: {
          zIndex: element === 0 ? 1000 : 999,
          opacity:
            ArrowDir === "right"
              ? OpacityE[Imegeorder[item] + 1]
              : OpacityE[Imegeorder[item] + 1],
          transform:
            ArrowDir === "right"
              ? "translateX(" +
                IMGwidth[0] * ((Imegeorder[item] + FromTo[0]) * 0.4) +
                "px)"
              : "translateX(" +
                IMGwidth[0] * ((Imegeorder[item] + FromTo[1]) * 0.4) +
                "px)",
        },
        to: {
          // zIndex: element === 0 ? 1000 : 999,
          opacity:
            ArrowDir === "right"
              ? OpacityS[Imegeorder[item] + 1]
              : OpacityS[Imegeorder[item] + 1],
          transform:
            ArrowDir === "right"
              ? "translateX(" + IMGwidth[0] * (Imegeorder[item] * 0.4) + "px)"
              : "translateX(" + IMGwidth[0] * (Imegeorder[item] * 0.4) + "px)",
        },
        config: {
          duration: 200,
        },
      }))
    );

    const PostImages = Object.values(NOPost)[PostClickedKey].Images.map(
      (number, index) => (
        <>
          <animated.img
            key={"PostImages" + index.toString()}
            ref={(element) => (IMG.current[index] = element)}
            style={ImageStyle[index]}
            src={Object.values(NOPost)[PostClickedKey].Images[index]}
            alt=""
          />
        </>
      )
    );
    return (
      <div
        style={{ transform: "translateX(" + -IMGwidth[1] + "px)" }}
        className="OriginalPostImg"
      >
        <div
          className="ImageOverlay"
          style={{ width: IMGwidth[0], opacity: PostChangeClicked ? 1 : 0 }}
        ></div>
        {PostImages}
      </div>
    );
  }

  const [PostChangeClicked, setPostChangeClicked] = useState(false);
  function PostChange(arrow) {
    setPostChangeClicked(true);
    setTimeout(() => {
      OpenThePost();
      setImegeIndex(0);
      if (arrow === "Right") {
        var temp = parseInt(PostClickedKey) + 1;
        if (temp > Object.values(NOPost).length - 1) {
          temp = 0;
        }
      }
      if (arrow === "Left") {
        temp = parseInt(PostClickedKey) - 1;
        if (temp < 0) {
          temp = Object.values(NOPost).length - 1;
        }
      }
      setPostClickedKey(temp);
      setPostChangeClicked(false);
    }, 1000);
  }

  const PostChangeAnim = useSpring({
    opacity: PostChangeClicked ? 0 : 1,
    transform: PostChangeClicked ? "translateY(10px)" : "translateY(0px)",
  });

  const PostD = useRef();
  const [IMGwidth, setIMGwidth] = useState("100%");
  const [IMGheight, setIMGheight] = useState("100%");
  const [IMGTransform, setIMGTransform] = useState("100%");
  const CardStyle = [];

  function handleResize() {
    const width = IMG.current[1].offsetWidth;
    const widthD = (PostD.current.offsetWidth + width) / 4 + 5;
    const height = IMG.current[1].offsetHeight - 25;
    setIMGheight(
      "translate(" + -(widthD + width / 2 + 5) + "px," + height + "px)"
    );
    setIMGTransform("translateY(" + -(height / 2 - 8) + "px)");
    setIMGwidth([width, widthD]);
  }

  useEffect(() => {
    if (PostClicked && IMGwidth[0] !== IMG.current[1].offsetWidth) {
      setTimeout(() => {
        handleResize();
      }, 10);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function CloseThePost() {
    setPostClicked(false);
    setImegeIndex(0);
  }

  function OpenThePost() {
    setPostClicked(true);
    const ImegeLength = Object.values(NOPost)[PostClickedKey].Images.length;
    var Order = Array.from(Array(ImegeLength).keys());
    Order[ImegeLength - 1] = -1;
    setImegeorder(Order);
    setImegeOrderO(Order);
    setArrowDir(null);
  }

  const [PostClicked, setPostClicked] = useState(false);
  const [PostClickedKey, setPostClickedKey] = useState(0);
  const PostClickOpen = useSpring({
    opacity: PostClicked ? 1 : 0,
    display: PostClicked ? "flex" : "none",
  });

  for (let i = 0; i < Object.keys(NOPost).length; i++) {
    const N = 3;

    var AR = 0;
    for (let j = 0; j < Object.keys(NOPost).length; j++) {
      if (i % N === j % N && j < i) {
        var img = new Image();
        img.src = Object.values(NOPost)[j].Images[0];
        AR = AR + img.height * ((432 - 7) / N / img.width);
      }
    }

    const trsnsX = ((i % N) * 432) / N;
    const trsnsY = AR;

    CardStyle.push({
      transform: "translateX(" + trsnsX + "px) translateY(" + trsnsY + "px)",
    });
  }

  const Posts = Object.keys(NOPost).map((number, index) => (
    <div
      style={CardStyle[number]}
      key={"Posts" + index}
      onClick={() => setPostClickedKey(number)}
    >
      <Card item={number} />
    </div>
  ));

  return (
    <>
      <div className="PostMain">
        <p className="PostText">Posts</p>
        <hr className="PostLine" />
        <div className="Posts">{Posts}</div>
      </div>

      <animated.div style={PostClickOpen} className="PostClick">
        <div className="OriginalPost">
          <PostImages />
          <div
            style={{ width: IMGwidth[0] + "px", transform: IMGheight }}
            className="PostBottom"
          >
            <div
              style={{ transform: IMGTransform }}
              className="LeftArrow"
              onClick={() => ArrowClicked(PostClickedKey, "left")}
            >
              <IoIosArrowBack />
            </div>
            <div className="PostCircles">
              <Circles />
            </div>
            <div
              style={{ transform: IMGTransform }}
              className="RightArrow"
              onClick={() => ArrowClicked(PostClickedKey, "right")}
            >
              <IoIosArrowForward />
            </div>
          </div>
        </div>

        <div className="PostBottomH">
          <div className="LeftArrow" onClick={() => PostChange("Left")}>
            <IoIosArrowBack />
          </div>
          <div className="RightArrow" onClick={() => PostChange("Right")}>
            <IoIosArrowForward />
          </div>
        </div>

        <div
          ref={PostD}
          style={{ transform: "translateX(" + IMGwidth[1] + "px)" }}
          className="PostDescription"
        >
          <div className="TopICONS">
            <p className="PostTime">
              {Object.values(NOPost)[PostClickedKey].date} Weeks Ago
            </p>
            <RiCloseFill onClick={() => CloseThePost()} className="Close" />
          </div>
          <animated.p style={PostChangeAnim} className="PostText">
            <span>Caption: </span>
            {Object.values(NOPost)[PostClickedKey].Caption}
          </animated.p>
          <animated.div style={PostChangeAnim} className="LikeImage">
            <div>
              <img
                src={Object.values(NOPost)[PostClickedKey].LikedOne[0]}
                alt=""
              />
              <img
                src={Object.values(NOPost)[PostClickedKey].LikedOne[1]}
                alt=""
              />
              <img
                src={Object.values(NOPost)[PostClickedKey].LikedOne[2]}
                alt=""
              />
            </div>

            <p>
              Liked by {Object.values(NOPost)[PostClickedKey].Liked} and{" "}
              <span> {Object.values(NOPost)[PostClickedKey].Likes} </span>{" "}
              others
            </p>
          </animated.div>
          <animated.p style={PostChangeAnim} className="PostInsightText">
            <span>Post Insights</span>
          </animated.p>
          <animated.div style={PostChangeAnim} className="PostInsight">
            <p>
              Likes{" "}
              <span>
                <AiFillHeart /> {Object.values(NOPost)[PostClickedKey].Likes}
              </span>
            </p>
            <p>
              Comments
              <span>
                <FaComment /> {Object.values(NOPost)[PostClickedKey].Comments}
              </span>
            </p>
            <p>
              Shares
              <span>
                <FaShareAlt /> {Object.values(NOPost)[PostClickedKey].Shares}
              </span>
            </p>
            <p>
              Saved
              <span>
                <BsFillBookmarkFill />{" "}
                {Object.values(NOPost)[PostClickedKey].Bookmarks}
              </span>
            </p>
          </animated.div>
          <div className="BottomIcons">
            <RWebShare
              data={{
                text: "Share The Post",
                url: Object.values(NOPost)[PostClickedKey].Link,
                title: "Saeed's Post",
              }}
            >
              <p className="ShareOpen">
                {" "}
                <IoMdShare />
                Share Post
              </p>
            </RWebShare>
            <a
              className="ShareOpen"
              target="_blank"
              rel="noreferrer"
              href={Object.values(NOPost)[PostClickedKey].Link}
            >
              {" "}
              <AiFillInstagram />
              Open Instagram
            </a>
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default Posts;
