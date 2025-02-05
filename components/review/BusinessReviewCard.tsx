import React, { useEffect, useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { FaMapMarkerAlt, FaReply, FaUser } from "react-icons/fa"; // Added FaReply for the reply icon
import DateComponent from "./DateFormat";
import { RiShareLine } from "react-icons/ri";
import { IUserInfoRootState } from "../../lib/types/user";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { camelToKebab } from "../../utilities/camel";
import capitalizeWords from "../../utilities/capitalize";
import { IReview } from "../../lib/types/review";
import { getComment, postComment } from "../../lib/types/helpers/backendHelpers";
import { shareComment } from "../../utilities/sharecomment";
import { getStarColor2 } from "../../utilities/getStarColor";

interface BusinessReviewCardProps {
    reviewElements: IReview[];
}

const BusinessReviewCard: React.FC<BusinessReviewCardProps> = ({ reviewElements }) => {
    const { t } = useLanguage();
    const router = useRouter();
    // State to manage replies (each reply is linked to the review's id)
    const [replies, setReplies] = useState<{ [key: string]: string }>({});
    const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [repliedComments, setRepliedComments] = useState<{ [key: string]: string }>({});
    const [contactInfoVisible, setContactInfoVisible] = useState<string | null>(null);
    const [userBusIsActive, setUserBusIsActive] = useState(false)

    const userInfo = useSelector((state: IUserInfoRootState) => {
        return state.userInfo.userInformation;
    });
    // Fonction pour gérer le défilement vers l'ancre
    const scrollToAnchor = () => {
        const { hash } = window.location;
        if (hash) {
            const elementId = hash.substring(1); // Retire le '#' du hash
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                // Ajouter la classe de surbrillance
                element.classList.add("highlighted");
                // Supprimer la classe après une courte période
                setTimeout(() => {
                    element.classList.remove("highlighted");
                }, 5000); // 2 secondes
            }
        }
    };
    useEffect(() => {
        scrollToAnchor(); // Défilement dès que le composant est monté ou lorsque l'URL change
    }, [router.asPath]); // L'écouteur réagit aux changements d'URL

    // Toggle reply form visibility
    const handleReplyToggle = (reviewId: string) => {
        setShowReplyForm((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId], // Toggle the visibility for that review
        }));
    };

    // Handle change for the reply text input (Textarea)
    const handleReplyChange = (event: React.ChangeEvent<HTMLTextAreaElement>, reviewId: string) => {
        const { value } = event.target;
        setReplies((prevReplies) => ({
            ...prevReplies,
            [reviewId]: value
        }));
    };

    // Handle form submission (when the reply is submitted)
    const handleReplySubmit = async (event: React.FormEvent, reviewId: string) => {
        event.preventDefault();
        try {
            setLoading(true);
            const replyText = replies[reviewId];
            if (replyText.trim()) {
                const response = await postComment({ text: replyText }, userInfo?.access_token ?? '', reviewId);
                if (response?.error) {
                    return toast.error(response?.error)
                }
                if (response.text) {
                    const com_response = await getComment({}, userInfo?.access_token ?? '', reviewId);
                    if (com_response.length > 0 && com_response[0].text) {
                        // Store the replied comment
                        setRepliedComments((prev) => ({
                            ...prev,
                            [reviewId]: com_response[0].text // Save the reply for that review
                        }));
                    }
                }
                setReplies((prevReplies) => ({
                    ...prevReplies,
                    [reviewId]: "" // Clear the reply text after submission
                }));
                setShowReplyForm((prev) => ({
                    ...prev,
                    [reviewId]: false // Close the reply form after submitting
                }));
            }
        } catch (error) {
            console.error("Post comment failed:", error);
            toast.error('Failed to submit your reply, please try again.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const idToCheck = reviewElements[0]?.business?.id
        const business = (userInfo?.business_data ?? []).find(item => item.business_id === idToCheck);
        if (business) {
            setUserBusIsActive(business?.is_active ?? false)
        }
    }, [userInfo, reviewElements]);

    const handleOpenToggle = (reviewId: string) => {
        setContactInfoVisible((prev) => (prev === reviewId ? null : reviewId)); // Bascule l'état
    };

    return (
        <>
            {reviewElements.map((item) => (
                <div key={item.id} id={`review-${item.id}`} className="border-[1px] border-gray-300 rounded-lg shadow-sm p-4 bg-white mb-2">
                    {/* User Info */}
                    <div className="flex flex-row sm:flex-row items-center space-x-4 justify-between">
                        {/* User Info - Avatar + Name */}
                        <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                            {/* Avatar */}
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-200 text-orange-600 font-bold text-lg sm:text-xl">
                                {item.authorname ? capitalizeWords(item.authorname.charAt(0)) : "X"}
                            </div>

                            {/* User Details */}
                            <div className="ml-1 text-center sm:text-left">
                                <h3 className="text-sm sm:text-base font-bold">
                                    {item.authorname ? capitalizeWords(item.authorname) : t["userx"]}
                                </h3>
                                <p className="flex flex-row items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-500">
                                    <FaMapMarkerAlt className="mr-1" size={16} /> {item.authorcountry || "..."}
                                </p>
                            </div>
                        </div>

                        {/* Date alignée à droite */}
                        <div className="right-2 sm:w-auto sm:text-right sm:mt-0">
                            <DateComponent createdDate={new Date(item.created_at)} />
                        </div>
                    </div>


                    {/* Rating and Verified Status */}
                    <div className="flex flex-wrap mb-2">
                        {/* Stars */}
                        <div className="flex">
                            {[...Array(5)].map((_, index) => {
                                const starIndex = index + 1;
                                const isActive = starIndex <= (item.evaluation || 0);
                                return (
                                    <span
                                        key={index}
                                        className="star"
                                        style={{
                                            backgroundColor: isActive ? getStarColor2(item.evaluation || 0) : "#ccc",
                                        }}
                                    >
                                        ★
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review Content */}
                    <h4 className="text-xm sm:text-base font-bold mb-2 text-gray-800">{item.title}</h4>
                    <p className="text-gray-800 mb-4">{item.text}</p>

                    {/* Experience Date */}
                    <div className="flex flex-row mb-4">
                        <p className="text-base font-bold text-gray-800 sm:text-sm mr-1 font-medium">
                            {t["expDateReview"]}:
                        </p>
                        <p className="text-base sm:text-sm font-medium">
                            {item.expdate}
                        </p>
                    </div>

                    <hr className="my-4 border-t-1 border-gray-300 dark:border-gray-600" />
                    {/* Footer */}
                    <div className="flex space-x-4 items-center text-xl text-gray-500">
                        <div className="hover:text-rose-600 transition-colors sm:px-3 md:px-0">
                            <button
                                onClick={() => shareComment(
                                    camelToKebab(item.business?.category?.name ?? ''),
                                    (item.business?.country ?? ''),
                                    (item.business?.city ?? ''),
                                    (item.business?.name ?? ''),
                                    encodeURIComponent(item.title ?? ''),
                                    encodeURIComponent(item.text ?? ''),
                                    item.id
                                )}
                                className="flex items-center space-x-2"
                            >
                                <RiShareLine style={{ fontSize: "1.2rem" }} />
                            </button>
                        </div>

                        {/* Reply Icon */}
                        {userBusIsActive && (
                            <div className="hover:text-rose-600 transition-colors sm:px-3 md:px-0">
                                <FaReply
                                    title="Reply"
                                    onClick={() => handleReplyToggle(item.id)} // Trigger reply form visibility
                                />
                            </div>
                        )}
                        {/* (userInfo?.business_data ?? []).some(param => param?.business_id === item.business?.id ) */}
                        {item.authorname && userBusIsActive && (
                            <div className="hover:text-rose-600 transition-colors sm:px-3 md:px-0">
                                <FaUser
                                    title="AuthorInfo"
                                    onClick={() => handleOpenToggle(item.id)} // Trigger reply form visibility
                                />
                            </div>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm[item.id] && (!repliedComments[item.id] && !item.comments[0]?.text) && (
                        <form onSubmit={(e) => handleReplySubmit(e, item.id)} className="mt-4">
                            <textarea
                                value={replies[item.id] || ""}
                                onChange={(e) => handleReplyChange(e, item.id)} // Unique change handler based on review ID
                                className="w-full py-4 px-4 border-[1px] border-gainsboro bg-palette-card outline-none rounded-lg shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                placeholder={t["writeYourReply"]}
                                required
                            />
                            <button
                                type="submit"
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                                disabled={loading}
                            >
                                {loading ? t["submitting"] : t["submit"]}
                            </button>
                        </form>
                    )}
                    {contactInfoVisible === item.id && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-800">
                                <strong>{t["contact"]}: </strong>{item.contact || t["notAvailabe"]}
                            </p>
                        </div>
                    )}
                    {/* Display the reply after submission */}
                    {(repliedComments[item.id] || item.comments[0]?.text) && (
                        <div className="mt-4">
                            <p className="text-gray-800 px-4 text-lg">{t["reply"]}: {repliedComments[item.id] || item.comments[0]?.text}</p>
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};

export default BusinessReviewCard;
