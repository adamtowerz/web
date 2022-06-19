import React, { MouseEventHandler, useRef, useState } from "react";
import { useTogglableAnimation } from "../utilities/animation";

// const patternStyles = {
//   backgroundColor: "white",
//   backgroundImage:
//     "radial-gradient(midnightblue 9px, transparent 10px), repeating-radial-gradient(midnightblue 0, midnightblue 4px, transparent 5px, transparent 20px, midnightblue 21px, midnightblue 25px, transparent 26px, transparent 50px)",
//   backgroundSize: "30px 30px, 90px 90px",
//   backgroundPosition: "0 0",
// };

const patternStyles = {
  backgroundColor: "#e5e5f7",
  background:
    "linear-gradient(135deg, #444cf755 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(225deg, #444cf7 25%, transparent 25%) -10px 0/ 20px 20px, linear-gradient(315deg, #444cf755 25%, transparent 25%) 0px 0/ 20px 20px, linear-gradient(45deg, #444cf7 25%, #e5e5f7 25%) 0px 0/ 20px 20px",
};

function Card() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseLoc, setMouseLoc] = useState<{ x: number; y: number } | null>(
    null
  );

  const {
    isYes: isCoverOpen,
    toggle: toggleCover,
    style: coverStyle,
  } = useTogglableAnimation({
    name: "openCover",
    length: 1000,
  });

  const {
    isYes: isPaperOut,
    toggle: togglePaper,
    style: paperStyle,
  } = useTogglableAnimation({
    name: "upAndOut",
    length: 1500,
  });

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (ev) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (ev.clientX - rect.x) / rect.width;
      const y = (ev.clientY - rect.y) / rect.height;

      setMouseLoc({
        x,
        y,
      });
    }
  };

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = (ev) => {
    setMouseLoc(null);
  };

  function lerp(
    v: number,
    minI: number,
    maxI: number,
    minO: number,
    maxO: number,
    clamp: boolean = false
  ) {
    if (clamp) {
      v = Math.max(Math.min(maxI, v), minI);
    } else if (v < minI || v > maxI) {
      throw new Error(`Lerp out of range, ${v} not in [${minI}, ${maxI}]`);
    }

    const per = (maxI - v) / (maxI - minI);

    return minO + (maxO - minO) * per;
  }

  function getRotation(scale: number = 1) {
    if (mouseLoc) {
      let y = mouseLoc.y * 2 - 1;
      let x = mouseLoc.x * 2 - 1;

      const xRotate = `rotate3d(0, 1, 0, ${
        lerp(-x, -1, 1, -15, 15, true) * scale
      }deg)`;

      const yRotate = `rotate3d(1, 0, 0, ${
        lerp(y, -1, 1, -15, 15, true) * scale
      }deg)`;

      return [xRotate, yRotate].join(" ");
    } else {
      return `rotate3d(0, 0, 0, 15deg)`;
    }
  }

  function getTranslate(scale: number = 1) {
    if (mouseLoc) {
      let y = mouseLoc.y * 2 - 1;
      let x = mouseLoc.x * 2 - 1;

      const xTranslate = lerp(x, -1, 1, 5, -5, true);
      const yTranslate = lerp(y, -1, 1, 5, -5, true);
      return `translate(${xTranslate}px, ${yTranslate}px)`;
    } else {
      return `translate(0, 0)`;
    }
  }

  const transform = !isPaperOut
    ? [getRotation(), getTranslate()].join(" ")
    : "";

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative"
      style={{
        width: "500vw",
        maxWidth: "600px",
        height: "250vw",
        maxHeight: "300px",
      }}
    >
      <div
        className="w-full h-full absolute"
        style={{
          transform,
          transformStyle: "preserve-3d",
          boxShadow: "0 16px 16px #0002",
        }}
      >
        <div
          style={{
            background: "blue",
            filter: "saturate(0.9)",
            transform: "translateZ(0px)",
          }}
          className="absolute w-full h-full top-0 left-0"
        ></div>

        <div
          onClick={togglePaper}
          className="absolute w-90 l-[5%] h-auto top-2 bg-white p-8 rounded-lg shadow-lg"
          style={{
            fontFamily: "serif",
            transform: "translateZ(0.1px)",
            ...paperStyle,
            ...(!isPaperOut && {
              cursor: "pointer",
            }),
          }}
        >
          <h1>Hello, world.</h1>
          <p>
            It's a letter. some mail. over the internet. perhaps: an electronic
            mail. We could call it an email.
          </p>
          <p>Hope you're well, bye for now.</p>
          <p>-A</p>
        </div>

        <div
          style={{
            ...patternStyles,
            clipPath:
              "polygon(8% 0, 50% 65%, 92% 0, 100% 0, 100% 100%, 0 100%, 0 0)",
            filter: "saturate(0.9)",
            transform: "translateZ(0.1px)",
            pointerEvents: "painted",
          }}
          className="absolute w-full h-full top-0 left-0"
        ></div>

        <div
          className="w-full h-full relative"
          onClick={toggleCover}
          style={{
            cursor: "pointer",
            transform: "translateZ(3px)",
            transformOrigin: "top",
            transformStyle: "preserve-3d",
            ...coverStyle,
            ...(!(isCoverOpen || isPaperOut) && {
              filter: "drop-shadow(-1px 30px 30px rgba(50, 50, 0, 0.8))",
            }),
          }}
        >
          <div
            id="top-cover-glue"
            className="w-full h-full absolute top-0 left-0"
            style={{
              backgroundColor: "blue",
              clipPath: "polygon(10% 0%, 50% 75%, 90% 0, 100% 0, 50% 94%, 0 0)",
              transform: "translateZ(0.4px)",
              opacity: 0.3,
            }}
          ></div>
          <div
            id="top-cover-paper"
            className="w-full h-full absolute top-0 left-0"
            style={{
              ...patternStyles,
              clipPath: "polygon(50% 94%, 0 0, 100% 0)",
              transform: "translateZ(0.5px)",
            }}
          ></div>
        </div>
      </div>
      {/* <div
        className="absolute"
        style={{
          background: "radial-gradient(#fff7, transparent 70%)",
          pointerEvents: "none",
          animation: "all ease-in-out 100ms",
          transform: getRotation(0.4),
          transformStyle: "preserve-3d",
          width: "150%",
          height: "150%",
          top: "-50%",
          left: "-25%",
        }}
      /> */}
    </div>
  );
}

export default Card;
