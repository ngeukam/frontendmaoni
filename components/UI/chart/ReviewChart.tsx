import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { processReviewData } from '../../../utilities/processReviewsCount';
import { IReview } from '../../../lib/types/review';
import { useLanguage } from '../../../hooks/useLanguage';

interface Props {
  reviews: IReview[]
}
const ReviewChart: React.FC<Props> = ({ reviews }) => {
  const {t} = useLanguage();
  const reviewData = processReviewData(reviews);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {t.reviewVariation || "Variation of Reviews/Day"}
      </h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={reviewData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="nbrreview" stroke="#4A90E2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ReviewChart