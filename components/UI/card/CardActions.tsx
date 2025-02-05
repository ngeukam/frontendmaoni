import React from "react";
import {
  RiShareLine,
} from "react-icons/ri";
import { IReview } from "../../../lib/types/review";
import { camelToKebab } from "../../../utilities/camel";
import { shareComment } from "../../../utilities/sharecomment";

interface Props {
  review: IReview;
}
const CardActions: React.FC<Props> = ({ review }) => {
  return (
    <div className="md:w-auto md:h-[70px] mt-1 p-2 flex md:flex-col justify-around self-center absolute  md:-top-2 md:bottom-auto right-0  md:-right-1 rounded-lg md:rounded-full shadow-lg backdrop-filter backdrop-blur-[8px] bg-palette-card/20  ">

      <div className="hover:text-rose-600 transition-colors sm:px-3 md:px-0">
        <button
          onClick={() => shareComment(
            camelToKebab(review.business?.category?.name ?? ''),
            (review.business?.country ?? ''),
            (review.business?.city ?? ''),
            (review.business?.name ?? ''),
            encodeURIComponent(review.title ?? ''),
            encodeURIComponent( review.text ?? ''),
            review.id
          )}
          className="flex items-center space-x-2"
        >
          <RiShareLine style={{ fontSize: "1.2rem" }} />
        </button>
      </div>

    </div>
  );
};

export default CardActions;
