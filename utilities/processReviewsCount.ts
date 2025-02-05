export const processReviewData = (reviews: any[]) => {
  const reviewCount: { [key: string]: number } = {};

  if (Array.isArray(reviews)) {
    reviews.forEach((review) => {
        const date = new Date(review.created_at).toISOString().split('T')[0];
        reviewCount[date] = (reviewCount[date] || 0) + 1;
    });
}
  // Convert the reviewCount object into an array of objects
  const reviewData = Object.keys(reviewCount).map((date) => ({
    date,
    nbrreview: reviewCount[date],
  }));

  return reviewData;
};