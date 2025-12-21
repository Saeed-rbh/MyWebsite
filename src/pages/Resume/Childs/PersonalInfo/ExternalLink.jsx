import React from "react";
import PropTypes from "prop-types";
import { animated } from "react-spring";
import BirthdayLink from "./BirthdayLink";

export const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const ContactInfo = ({ label, phone }) => (
  <h1>
    <b>{label}:</b> <a href={`tel:${phone.replace(/[-\s]/g, "")}`}>{phone}</a>
  </h1>
);

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ContactDetails = ({ MainStyle }) => (
  <animated.div style={{ ...MainStyle, maxWidth: "390px" }}>
    <ContactInfo label="CA Cell" phone="+1 - 416 836 5851" />
    <ContactInfo label="IR Cell" phone="+98 - 919 659 5351" />
  </animated.div>
);

const PersonalDetails = ({ MainStyle }) => (
  <animated.div style={{ ...MainStyle, maxWidth: "390px" }}>
    <h1>
      <strong>Name:</strong>
      <ExternalLink href="https://www.example.com/">Saeed Arabha</ExternalLink>
    </h1>
    <BirthdayLink />
  </animated.div>
);

const PersonalTitle = ({ title, size, padding }) => (
  <animated.p
    style={{
      transform: `translateY(${-size[0] / 2}px)`,
    }}
  >
    {title}
  </animated.p>
);

export { ContactDetails, PersonalDetails, PersonalTitle };
