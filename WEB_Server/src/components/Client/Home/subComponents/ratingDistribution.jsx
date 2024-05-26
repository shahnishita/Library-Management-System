import React from "react";

const RatingDistribution = ({ ratings }) => {
  const totalRatings = ratings && ratings.length;
  const starsDistribution = {};

  for (let i = 1; i <= 5; i++) {
    starsDistribution[i] = 0;
  }

  ratings && ratings.forEach((rating) => {
    if (!rating.rating) {
      return;
    }
    const stars = Math.round(rating.rating);
    starsDistribution[stars]++;
  });

  const starsPercentage = {};
  for (let key in starsDistribution) {
    starsPercentage[key] = (
      (starsDistribution[key] / totalRatings) *
      100
    ).toFixed(2);
  }

  const ratingDistributionArray = Object.keys(starsPercentage).map((key) => ({
    stars: parseInt(key),
    percentage: parseFloat(starsPercentage[key]),
  }));

  return (
    <div className="rating-distribution">
      <ul className="flex flex-col gap-2">
        {ratingDistributionArray.map(({ stars, percentage }) => (
          <li key={stars}>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <p className="text-white text-[19px] mt-[2px]">{stars}</p>
              </div>

            <div className="w-72 mt-1 h-3 bg-[#282828] rounded-full">
              <div className="h-full bg-[#3A3A3A] rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            </div> 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingDistribution;

