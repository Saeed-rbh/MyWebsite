import "./HomePage.css";
import React from "react";
import { useSpring, animated } from "react-spring";
import { connect } from "react-redux";
import { updateMenu } from "./menuActions";

const Menu = ({ isMenuOpen }) => {
  function MenuIcon() {
    const MenuOpen = useSpring({
      opacity: !isMenuOpen ? "0" : "0.9",
      config: {
        duration: 500,
      },
    });
    const ContactInfoOpen1 = useSpring({
      transform: !isMenuOpen ? "translate3d(0,20px,0)" : "translate3d(0,0px,0)",
      opacity: !isMenuOpen ? "0" : "1",
    });
    const ContactInfoOpen2 = useSpring({
      transform: !isMenuOpen ? "translate3d(0,20px,0)" : "translate3d(0,0px,0)",
      opacity: !isMenuOpen ? "0" : "1",
    });
    const ContactInfoOpen3 = useSpring({
      transform: !isMenuOpen ? "translate3d(0,10px,0)" : "translate3d(0,0px,0)",
      opacity: !isMenuOpen ? "0" : "1",
      config: {
        duration: 200,
        delay: 100,
      },
    });
    return (
      <>
        {isMenuOpen && (
          <div
            className="HomePage-M-T"
            style={{
              zIndex: isMenuOpen ? "10" : "10",
            }}
          >
            <div
              className="HomeAround"
              style={{
                backdropFilter: isMenuOpen ? "blur(10px)" : "blur(0px)",
              }}
            >
              <animated.div className="MenuInsideN" style={MenuOpen}>
                <animated.div className="ContactInfo" style={ContactInfoOpen1}>
                  Contact Information
                </animated.div>
                <div className="ContactInfos">
                  <animated.a
                    className="ContactInfo-In"
                    style={ContactInfoOpen2}
                    href="tel:+14168365851"
                  >
                    <p1>Phone Call</p1>
                    <animated.b style={ContactInfoOpen3}>
                      <span>CA Cell:</span>+1 &nbsp;(416) 836 5851
                    </animated.b>
                    <animated.b style={ContactInfoOpen3}>
                      <span>IR Cell:</span>+98 (919) 659 5351
                    </animated.b>
                  </animated.a>
                  <animated.a
                    style={ContactInfoOpen2}
                    className="ContactInfo-In"
                    href="mailto: SaeedArabha@outlook.com, Arabha@Yorku.ca"
                  >
                    <p1>Email</p1>
                    <animated.b style={ContactInfoOpen3}>
                      Saeedarabha@outlook.com
                    </animated.b>
                    <animated.b style={ContactInfoOpen3}>
                      Arabha@Yorku.ca
                    </animated.b>
                  </animated.a>
                  <animated.a
                    style={ContactInfoOpen2}
                    className="ContactInfo-In"
                    href="https://www.instagram.com/saeed_rbh"
                  >
                    <p1>Social Media</p1>
                    <animated.b style={ContactInfoOpen3}>@saeed_rbh</animated.b>
                  </animated.a>
                  <animated.a
                    style={ContactInfoOpen2}
                    className="ContactInfo-In"
                    href="https://www.researchgate.net/profile/Saeed-Arabha"
                  >
                    <p1>Research Gate</p1>
                    <animated.b style={ContactInfoOpen3}>
                      Saeed Arabha
                    </animated.b>
                  </animated.a>
                </div>
              </animated.div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <MenuIcon />;
};
const mapStateToProps = (state) => {
  return {
    isMenuOpen: state.menu.isMenuOpen,
  };
};
export default connect(mapStateToProps, { updateMenu })(Menu);
