import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { GoArrowUpRight, GoArrowDownLeft, GoPlus } from "react-icons/go";

const Notif = ({ addTransaction, setAddTransaction }) => {
  const Amount = new Intl.NumberFormat().format(addTransaction.Amount);
  const open = addTransaction.length !== 0;
  //   useEffect(() => {
  //     if (open) {
  //       const timer = setTimeout(() => {
  //         setAddTransaction("");
  //       }, 5000);

  //       return () => clearTimeout(timer);
  //     }
  //   }, [open, setAddTransaction]);
  console.log(addTransaction, open);

  const openStyle = useSpring({
    // scale: open ? 1 : 0.85,
    // y: open ? 0 : -120,
    // config: { tension: 200, friction: 40 },
    // delay: 100,
  });
  return (
    <animated.div style={openStyle} className="addedTransactionNotif">
      <div className="Notif_Type">
        <GoArrowDownLeft color="var(--Fc-2)" />
        <animated.div style={{ opacity: 0.4 }}></animated.div>
        <h1>
          <span>{addTransaction.Type}</span> {addTransaction.Category}
        </h1>
      </div>
      <div className="Notif_Amount">
        <h1>Amount:</h1>
        <h2>${Amount}</h2>
      </div>
      <div className="Notif_Reason">
        <h1>Reason:</h1>
        <h2>{addTransaction.Reason}</h2>
      </div>
      <div className="Notif_Time">
        <h1>Date & Time:</h1>
        <h2>
          {addTransaction.Timestamp.split(" ")[0]}{" "}
          <span>{addTransaction.Timestamp.split(" ")[1]}</span>
        </h2>
      </div>
    </animated.div>
  );
};

export default Notif;
