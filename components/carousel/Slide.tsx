import React from "react";
import { ISlide } from "../../lib/types/slide";

interface Props {
  elts: ISlide
}
const Slide: React.FC<Props> = ({ elts }) => {
  if (!elts) {
    return null;
  }
  return (
    <div
      className={`relative w-[100%] h-[50vh] md:h-[55vh] bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${elts?.bgImg || '/images/restaurant1.webp'})` }}
    >

    </div>
  );
};

export default Slide;
