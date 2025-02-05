import type { NextPage } from "next";
import { useLanguage } from "../hooks/useLanguage";
import Image from "next/image";
import GoBackButton from "../components/UI/GoBackButton";

const About: NextPage = () => {
  const { t } = useLanguage();
  return (
    <div>
      <GoBackButton />
      <div className="flex w-full xl:max-w-[2100px] mx-auto">
        <div className="w-full lg:w-1/2 mt-8 md:mt-0 px-4 sm:px-8 md:px-0">
          <p className="leading-8 md:text-justify font-bold text-xl">{t.aboutMaoni}</p>
          <p className="leading-8 md:text-justify">{t.maoniDescription}</p>

        </div>
        <div className="hidden md:block flex-grow text-center">
          <Image
            src="/images/about-me.svg"
            alt="about me"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
