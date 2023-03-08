import "./Posts.css";
import Post1 from "./Image/1.webp";
import Post2 from "./Image/2.webp";
import Post3 from "./Image/3.webp";
import Post4 from "./Image/4.webp";
import { useSpring, useSprings, animated } from "react-spring";
import React, { useRef, useState, useEffect, Component } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoMdShare } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import { AiFillInstagram, AiFillHeart } from "react-icons/ai";
import { FaComment, FaShareAlt } from "react-icons/fa";
import { BsFillBookmarkFill } from "react-icons/bs";
import { RWebShare } from "react-web-share";
class Images extends Component {
  constructor(props) {
    super(props);
    this.stepInput = React.createRef();
  }

  render() {
    return <input type="text" ref={this.stepInput} />;
  }
}
