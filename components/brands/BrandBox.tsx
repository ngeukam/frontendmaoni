import React from "react";
import Image from "next/image";

interface Props {
  brandName: string;
  imageSrc: string;
  link: string; // Ajout d'un prop 'link' pour la destination du clic
}

const BrandBox: React.FC<Props> = ({ brandName, imageSrc, link }) => {
  return (
    <a href={link?link:'#'} className="relative flex items-center p-3 lg:p-2 shadow-md lg:shadow-xl z-10">
      <Image src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${imageSrc}`} width={300} height={175} alt={brandName} />
      <div className="absolute dark:inset-0 dark:bg-slate-800/40"></div>
    </a>
  );
};

export default BrandBox; 
