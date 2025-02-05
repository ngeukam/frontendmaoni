import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";

interface Props {
  title: string;
  description: string;
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
  href: string;
}
const BannerBox: React.FC<Props> = ({
  title,
  description,
  imgSrc,
  imgWidth,
  imgHeight,
  href
}) => {
  const { width } = useWindowDimensions();
  let imageWidth = width >= 2000 ? 1300 : imgWidth;
  return (
    <Link href={href || "#"} passHref>
      <div className="col-span-6 lg:col-span-6 flex justify-center shadow-2xl relative rounded-lg overflow-hidden dark:bg-gray-500/70 !dark:bg-blend-multiply">
        <Image
          src={imgSrc}
          width={imageWidth}
          height={imgHeight}
          alt={title}
          className="drop-shadow-lg object-cover w-full object-center hover:scale-110 transition duration-1000"
        />

        <div className="flex justify-between items-center sm:block absolute top-[25%] ltr:top-[15%] ltr:sm:top-3 sm:top-3 ltr:md:top-8 md:top-8 ltr:lg:top-2 lg:top-2 ltr:2xl:top-6 2xl:top-6 sm:left-6 sm:w-[55%] md:w-1/2 lg:w-[55%] xl:w-1/2">
          <h3 className="text-white text-xl font-bold sm:text-2xl sm:font-normal md:text-2xl 2xl:text-3xl ltr:mr-4  sm:pt-8 lg:pt-2 xl:pt-8">
            {title}
          </h3>
          <p className="hidden sm:block text-white leading-6 lg:text-[12px] xl:text-base my-2 sm:my-4 lg:my-2 2xl:my-4 rtl:2xl:mt-6">
            {description}
          </p>

        </div>
      </div>
    </Link>
  );
};

export default BannerBox;
