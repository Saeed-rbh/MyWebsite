import { ExternalLink } from "../PersonalInfo/ExternalLink";
import { animated } from "react-spring";

const ImageDiv = ({ animatedStyle, imageSrc, height }) => (
  <animated.div style={animatedStyle}>
    <animated.img
      src={imageSrc}
      style={{
        margin: 0,
        borderRadius: "100%",
        opacity: 1,
        height: `${height - 30}px`,
        width: `${height - 30}px`,
        imageRendering: "auto",
        objectFit: "cover",
      }}
    />
  </animated.div>
);

const ContentDiv = ({ animatedStyle, name, size, title, height }) => (
  <animated.div className={name} style={animatedStyle}>
    <animated.p
      style={{
        transform: `translateY(${-height / 2}px)`,
      }}
    >
      {title}
    </animated.p>
    <animated.h1>
      PhD, <ExternalLink href="https://www.picssl.ca/">PICSSL Lab</ExternalLink>
    </animated.h1>
    <animated.h1>Lassonde School of Engineering</animated.h1>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: "2px" }}>
      <animated.h1 style={{ margin: 0, marginRight: "5px" }}>
        <ExternalLink href="https://www.yorku.ca/">York University</ExternalLink>
      </animated.h1>
      <animated.h1 style={{ margin: 0 }}>Toronto, CA</animated.h1>
    </div>
  </animated.div>
);

const calculateBackgroundImage = (value, randomStart, openClose) => {
  const position = value * 100 * randomStart;
  return `radial-gradient(circle at ${openClose * (100 * randomStart - position)
    }% ${position}%, rgb(29 30 34 / ${38 * value * randomStart
    }%), transparent 70%), radial-gradient(circle at ${openClose * (100 * randomStart - position)
    }% ${position}%, rgba(29, 30, 34, ${0.1 * (1 - value * randomStart)
    }), transparent 70%), radial-gradient(circle at ${openClose * (100 * randomStart - position)
    }% ${position}%, rgb(212 157 129 / ${30 * value * randomStart
    }%), transparent 70%), radial-gradient(circle at ${openClose * (100 * randomStart - position)
    }% ${position}%, rgb(36 69 83 / ${30 * (1 - value * randomStart)
    }%), transparent 70%)`;
};

export { calculateBackgroundImage, ImageDiv, ContentDiv };
