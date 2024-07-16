import React, { useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { GoArrowUpRight, GoArrowDownLeft, GoPlus } from "react-icons/go";
import CircularProgressBar from "./CircularProgressBar";
import { ScalableElement } from "../tools";
import { useDrag } from "@use-gesture/react";

const Notif = ({
  addTransaction,
  setAddTransaction,
  modify,
  setModify,
  setOpen,
  open,
}) => {
  const Amount = new Intl.NumberFormat().format(addTransaction.Amount);
  const Reason =
    addTransaction.Reason && addTransaction.Reason.length > 0
      ? addTransaction.Reason
      : "No Reason Provided";

  const Logo =
    addTransaction.Category === "Income" ? (
      <GoArrowDownLeft color="var(--Fc-2)" />
    ) : addTransaction.Category === "Spending" ? (
      <GoArrowUpRight color="var(--Gc-2)" />
    ) : (
      <GoPlus color="var(--Ac-2)" />
    );

  // useEffect(() => {
  //   if (!open && addTransaction.Type.length > 0) {
  //     setOpen(true);
  //   }
  // }, [addTransaction.Type]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, setAddTransaction]);

  const handleFinish = () => {
    setAddTransaction({
      Amount: 0,
      Category: "",
      Label: "Auto Detect",
      Reason: "",
      Timestamp: "",
      Type: "",
    });
  };

  const [openStyle, api] = useSpring(() => ({
    scale: open ? 1 : 0.95,
    y: open ? 0 : -170,
    config: { tension: 200, friction: 35 },
    delay: !open ? 0 : 100,
    // onRest: !open ? handleFinish : null,
  }));

  useEffect(() => {
    open &&
      api.start({
        scale: 1,
        y: 0,
      });
  }, [open, api, handleFinish]);

  const bind = useDrag(
    ({
      movement: [, y],
      memo = false,
      last,
      velocity,
      initial: [, initialY],
    }) => {
      const isQuickDragUp = velocity[1] > 0.1 && y < initialY;

      if (y < 0) {
        if (last) {
          if (isQuickDragUp) {
            setOpen(false);
            api.start({
              y: -170,
              scale: 0.95,
              onRest: () => {
                handleFinish();
              },
            });
          }
        }
      }
      return memo;
    }
  );

  const HandleDelete = () => {
    setOpen(false);
    api.start({
      scale: 0.95,
      y: -170,
      onRest: () => {
        handleFinish();
      },
    });
  };

  const HandleModify = () => {
    setModify(true);
    setOpen(false);
    api.start({
      scale: 0.95,
      y: -170,
    });
  };

  return (
    <animated.div
      style={openStyle}
      className="addedTransactionNotif"
      {...bind()}
    >
      <div className="Notif_Type">
        {Logo}
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
        <h2>{Reason}</h2>
      </div>
      <div className="Notif_Time">
        <h1>Date & Time:</h1>
        <h2>
          {addTransaction.Timestamp && addTransaction.Timestamp.split(" ")[0]}
          <span>
            {addTransaction.Timestamp && addTransaction.Timestamp.split(" ")[1]}
          </span>
        </h2>
      </div>
      <div className="Notif_counter">
        <CircularProgressBar
          key={open ? "open" : "closed"}
          pathColor="var(--Gc-2)"
          tailColor="var(--Ac-4)"
          valueStart={open ? 100 : 0}
          valueEnd={0}
        />
      </div>
      <ScalableElement as="div" className="Notif_Delete" onClick={HandleDelete}>
        <GoPlus color="var(--Ac-1)" />
        Delete
      </ScalableElement>
      <ScalableElement as="div" className="Notif_Modify" onClick={HandleModify}>
        <GoPlus color="var(--Ac-1)" />
        Modify
      </ScalableElement>
    </animated.div>
  );
};

export default Notif;
