import React from "react";
import Link from "next/link";
import { IReview } from "../../../lib/types/review";
import { camelToKebab } from "../../../utilities/camel";
import CardActions from "./CardActions";
import RatingComponent from "../../review/RatingComponent";
import capitalizeWords from "../../../utilities/capitalize";
import Image from "next/image";
import DateComponent from "../../review/DateFormat";
import { getStarColor2 } from "../../../utilities/getStarColor";
import { useLanguage } from "../../../hooks/useLanguage";

interface Props {
    review: IReview;
}

const CardReview: React.FC<Props> = ({ review }) => {
    const {t}=useLanguage();
    return (

        <div className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6 bg-white rounded-xl flex flex-col relative p-4">
            <Link href={`/${camelToKebab(review.business?.category?.name ?? '')}/${(review?.business?.country)?.toLowerCase()}/${encodeURIComponent(review?.business?.city ?? '').toLowerCase()}/${review?.business?.name?.replace(/\s+/g, '-')}/#review-${review?.id}`}>
                <a className="block">
                    {/* Business Logo */}
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            {review?.business?.logo ? (
                                <Image
                                    src={`${review?.business?.logo}`}
                                    width={48}
                                    height={48}
                                    alt={review?.business?.name}
                                    className="object-cover"
                                />) : (
                                <Image
                                    src="/images/default-business.webp"
                                    width={48}
                                    height={48}
                                    alt={review?.business?.name}
                                    className="object-cover"
                                />

                            )}
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="font-semibold text-lg text-gray-900">{review?.business?.name}</h3>
                        </div>
                    </div>

                    {/* Review Title */}
                    <h4 className="text-md font-bold text-gray-800">{review.title}</h4>
                    {/* Review Evaluation */}
                    <div className="my-2">
                        <RatingComponent evaluation={review?.evaluation ?? 0} getColor={getStarColor2} />
                    </div>
                    {/* Review Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 mt-2">{review?.text}</p>

                    {/* Author's Name with Initial */}
                    <hr className="mt-2 border-gray-300" />
                    <div className="flex items-center justify-between  mt-2">
                        {/* Avatar */}
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                {capitalizeWords(review?.authorname?.charAt(0) || '')}
                            </div>
                            {/* Author Name */}
                            <span className="ml-2 text-sm text-gray-500 font-semibold">
                                {capitalizeWords(review?.authorname || t.anonymous || 'Anonymous')}
                            </span>
                        </div>
                        <div className="">
                            <DateComponent createdDate={new Date(review.created_at)} />
                        </div>
                    </div>

                </a>
            </Link>
            <CardActions review={review} />
        </div>

    );
};

export default CardReview;
