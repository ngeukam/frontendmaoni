import React from "react";
import Image from "next/image";
import Link from "next/link";
import RatingComponent from "../../review/RatingComponent";
import { IBusiness } from "../../../lib/types/business";
import { camelToKebab } from "../../../utilities/camel";
import capitalizeWords from "../../../utilities/capitalize";
import { getStarColor } from "../../../utilities/getStarColor";

interface Props {
  business: IBusiness;
}

const Card: React.FC<Props> = ({ business }) => {
  return (
    <div className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-palette-card rounded-xl flex relative">
      <Link
        href={`/${camelToKebab(business.category?.name ?? '')}/${(business.country ?? '').toLowerCase()}/${encodeURIComponent(business.city ?? '').toLowerCase()}/${(business.name ?? '').replace(/\s+/g, '-')}`}
      >
        <a className="flex md:items-center md:flex-col relative w-full">
          <div className="w-1/2 md:w-full relative bg-slate-400/30 px-1 md:px-6 py-2 rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center">
            <div className="flex items-center h-full">
              {business.logo ?
                <Image
                  src={`${business.logo}`}
                  width={280}
                  height={300}
                  alt={business.name}
                  className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out !py-2 "
                /> :
                <Image
                  src="/images/default-business.webp"
                  width={280}
                  height={300}
                  alt={business.name}
                  className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out !py-2 "
                />
              }
            </div>
            {business?.isverified ? (
              <span className="w-8 sm:w-auto block absolute -top-2 -right-2">
                <Image
                  src="/images/discount-icon/check-badge.png"
                  width={40}
                  height={40}
                  alt="check-icon"
                />
              </span>
            ) : null}
          </div>
          <div className="flex flex-col justify-between  flex-grow  w-1/2 md:w-full  px-1 md:px-3 py-2 md:py-4">
            <div className="flex justify-center md:justify-start flex-col  flex-grow overflow-hidden">
              <div className="self-center">
                <RatingComponent evaluation={(business?.total_evaluation ?? 0)} getColor={getStarColor}/>
              </div>
              <h3 className="text-sm sm:text-[12px] md:text-lg text-center text-gray-800 font-semibold mt-2">
                {capitalizeWords(business.name ?? '')}
              </h3>
              <h3 className="text-sm sm:text-[12px] md:text-sm text-center text-gray-800 font-medium">
                {capitalizeWords(business.city ?? '')} • {capitalizeWords(business.countrynamecode ?? '')}
              </h3>
            </div>
          </div>
        </a>
      </Link>

    </div>
  );
};

export default Card;
