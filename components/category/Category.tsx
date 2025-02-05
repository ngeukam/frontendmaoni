import React from 'react';
import Slider from 'react-slick'; // Importation du composant Slider de react-slick
import SectionTitle from '../UI/SectionTitle';
import { ICategory } from '../../lib/types/categories';
import { useLanguage } from '../../hooks/useLanguage';
import Link from 'next/link';
import { camelToKebab } from '../../utilities/camel';
import { useRouter } from 'next/router';

interface Props {
  categories: ICategory[];
}
const CategorySlider: React.FC<Props> = ({ categories }) => {
  const { t } = useLanguage();
  const router = useRouter()
  const handleShowAll = () => {
    router.push('/categories')
  }
  const settings = {
    infinite: true,
    speed: 10000,
    slidesToShow: 8,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 8000,
    cssEase: "linear",
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <>
      {
        Array.isArray(categories) && categories.length > 0 && (
          <div className="flex flex-col w-full relative">
            <SectionTitle title={"categoriesList"} />
            <div className="mt-4 flex justify-right mb-4">
              <button
                onClick={handleShowAll}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t.all}
              </button>
            </div>
            {/* Conteneur du carrousel */}

            <Slider
              {...settings}>
              {categories.map((category, index) => (
                <Link key={index} href={`/${camelToKebab(category.name)}/`}>
                 <div className="mx-1 md:mx-2">
                    <a>
                      <div
                        className="w-full px-1 py-2 cursor-pointer border border-gray-300 rounded text-center overflow-hidden text-ellipsis whitespace-nowrap"
                        title={t[category.name]}
                      >
                        {t[category.name]}
                      </div>
                    </a>
                  </div>

                </Link>
              ))}
            </Slider>
          </div>
        )
      }
    </>
  );

};

export default CategorySlider;
