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

const ContactDetails = ({ MainStyle, info }) => (
  <animated.div style={{ ...MainStyle, maxWidth: "390px" }}>
    <ContactInfo label="CA Cell" phone={info?.caPhone || "+1 - 416 836 5851"} />
    <ContactInfo label="IR Cell" phone={info?.irPhone || "+98 - 919 659 5351"} />
  </animated.div>
);

const PersonalDetails = ({ MainStyle, info }) => (
  <animated.div style={{ ...MainStyle, maxWidth: "390px" }}>
    <h1>
      <strong>Name:</strong>
      <ExternalLink href="https://www.example.com/">{info?.name || "Saeed Arabha"}</ExternalLink>
    </h1>
    <BirthdayLink date={info?.dateOfBirth} />
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
