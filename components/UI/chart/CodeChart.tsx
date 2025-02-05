import React from 'react'
import { AiOutlineDownload } from 'react-icons/ai';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { MultidownloadExcel } from '../../../utilities/downloadExcel';
import { IUserBusiness } from '../../../lib/types/user';
import { useLanguage } from '../../../hooks/useLanguage';

interface Props {
    codeData: { name: string; value: number }[]
    businessesCode: IUserBusiness[]
}
const CodeChart: React.FC<Props> = ({ codeData, businessesCode }) => {
    const { t } = useLanguage();
    const COLORS = ["#4CAF50", "#FF5733"];
    return (
        <div>
            <div className="flex items-center justify-center space-x-2 mb-4">
                <h2 className="text-xl font-semibold">{t.usedUnusedCodes || "Used vs. unused codes"}</h2>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        MultidownloadExcel(businessesCode);
                    }}
                >
                    <AiOutlineDownload className="cursor-pointer" size={30} title={`${t["downloadCode"]}`} />
                </button>
            </div>

            <PieChart width={300} height={300}>
                <Pie data={codeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {codeData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>
        </div>
    )
}

export default CodeChart
