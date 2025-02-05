import { useEffect, useRef, useState } from 'react';
import { toast } from "react-toastify";
import Input, { IImperativeHandler } from '../../components/UI/Input';
import { useLanguage } from '../../hooks/useLanguage';
import { useRouter } from 'next/router';
import { camelToKebab } from '../../utilities/camel';
import { IBusiness } from '../../lib/types/business';
import { postReview } from '../../lib/types/helpers/backendHelpers';
import getUserCountry from '../../utilities/getUserCountry';
import Anonymous from '../entering/Anonymous';

interface WriteReviewProps {
    BusinessInfo: IBusiness;
    rating: number;
}

const WriteReview: React.FC<WriteReviewProps> = ({ BusinessInfo, rating }) => {
    const [reviewText, setReviewText] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    // const [title, setTitle] = useState("");
    // const [code, setCode] = useState("");
    const [userContact, setUserContact] = useState("");
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [isTitleValid, setIsTitleValid] = useState(false);
    const [isAnonymousValid, setIsAnonymousValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useLanguage();
    // const [formDate, setFormDate] = useState({ date: '' });
    const dateRef = useRef<IImperativeHandler | null>(null);
    const codeRef = useRef<IImperativeHandler | null>(null);
    const titleRef = useRef<IImperativeHandler | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCountry = async () => {
            const userCountry: string = await getUserCountry(); // Ensure this function returns a string
            setCountry(userCountry);
        };

        fetchCountry();
    }, []);

    const handleSubmit = async (e: any) => {
        const invitation_code = codeRef.current?.getValue();
        const review_title = titleRef.current?.getValue();
        const review_date = dateRef.current?.getValue();

        e.preventDefault();
        if (!isCodeValid || !isTitleValid || !isAnonymousValid) return;
        if (reviewText.trim() === '' || review_date?.trim() === '' || review_title?.trim() === '') {
            toast.error(t.requiredFieldsError);
            return;
        }
        if (rating === 0) {
            return toast.error(t.please_give_a_rating);
        }

        setLoading(true);
        try {
            const response = await postReview({
                business_id: BusinessInfo.id,
                evaluation: rating,
                text: reviewText.trim(),
                invitation_code: invitation_code?.trim().toUpperCase(),
                title: review_title?.trim(),
                expdate: review_date,
                authorname: userName.trim(),
                contact: userContact.toLowerCase(),
                authorcountry: country,
            });
            if (response.detail) return toast.error(t[response.detail] || response.detail);
            toast.success(t.review_published_successfully);
            router.push(`/${camelToKebab(response?.business.category.name)}/${response?.business.country.toLowerCase()}/${encodeURIComponent(response?.business.city).toLowerCase()}/${response?.business.name.replace(/\s+/g, '-')}`);
            setReviewText("");
            setUserName("");
            setUserContact("");
            titleRef.current?.clear();
            codeRef.current?.clear();
            dateRef.current?.clear();
            setAnonymous(false);
            setErrorMessage('');
        } catch (error: any) {
            setErrorMessage(error?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-4 border rounded-lg mt-4">
            <h2 className="text-2xl font-semibold mb-4">{t["Write_a_Review"]}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <textarea
                    value={reviewText}
                    maxLength={999}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t.write_your_review_here}
                    className="mb-4 w-full p-6 border-[1px] placeholder:text-xl border-gainsboro bg-palette-card outline-none rounded-lg shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        type="date"
                        // value={formDate.date}
                        ref={dateRef}
                        // onChange={(value) => setFormDate({ ...formDate, date: value })}
                        id="dateOfYourExperience"
                        title="dateOfYourExperience"
                        required
                    />
                    <Input
                        type="text"
                        // value={code}
                        ref={codeRef}
                        // onChange={(value) => setCode(value)}
                        id="invitationCode"
                        title="invitationCode"
                        placeholder="enterInvitationCode"
                        required
                        validationType="code"
                        validateCode
                        onValidate={setIsCodeValid}
                    />
                </div>
                <Input
                    type="text"
                    // value={title}
                    ref={titleRef}
                    // onChange={(value) => setTitle(value)}
                    id="experienceTitle"
                    title="experienceTitle"
                    placeholder="enterExperienceTitle"
                    required
                    validationType="title"
                    validateTitle
                    onValidate={setIsTitleValid}
                    maxLength={50}
                />
                <Anonymous
                    isAnonymous={anonymous}
                    onAnonymousChange={setAnonymous}
                    onInputChange={(field, value) => {
                        if (field === "name") setUserName(value);
                        if (field === "contact") setUserContact(value);
                    }}
                    onValidate={setIsAnonymousValid}
                />
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className='flex items-center justify-center'>
                    <button
                        type="submit"
                        disabled={!isCodeValid || !isTitleValid || !isAnonymousValid || loading}
                        className="p-4 bg-palette-primary hover:bg-rose-900 text-white py-3 rounded-md transition-colors shadow-md"
                    >
                        {loading ? t.loading : t.save}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WriteReview;
