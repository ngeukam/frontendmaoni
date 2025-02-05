import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { FaHourglassStart, FaMapPin, FaPhone } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import GoBackButton from '../components/UI/GoBackButton';

const ContactUs: React.FC = () => {
    const { t } = useLanguage()
    return (
        <div>
            <GoBackButton />
            <div className="bg-gray-50 flex justify-center items-center py-10">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
                    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">{t.contactUs || "Contact Us"}</h2>

                    <div className="space-y-6">
                        <a href="tel:+237690343431" className="flex items-center space-x-4 hover:text-blue-500">
                            <FaPhone className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700">+237 690 34 34 31</p>
                        </a>

                        {/* Email cliquable */}
                        <a href="mailto:business@maonidrive.com" className="flex items-center space-x-4 hover:text-blue-500">
                            <AiOutlineMail className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700">business@maonidrive.com</p>
                        </a>

                        <div className="flex items-center space-x-4">
                            <FaMapPin className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700">Nsam, Yaoundé, Cameroun</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaHourglassStart className="w-6 h-6 text-blue-600" />
                            <p className="text-gray-700">{t.workingHours || "Working Hours: Mon-Fri, 8AM - 6PM"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
