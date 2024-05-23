import React from "react";

const RatingSubmissionForm = ({ isStarSelected ,onSubmit, setState, state }) => {

  const handleStarClick = (rating) => {
    setState(rating);
  };


  const stars = [1, 2, 3, 4, 5];

  return (
    <div onSubmit={(e) => onSubmit(e, state)}>
      <div className="flex gap-2">
        {stars.map((star) => (
          <svg
            key={star}
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill={star <= state ? "#FFD700" : (!isStarSelected ? "#EE0000" : "white")}
            viewBox="0 0 24 24"
            onClick={() => handleStarClick(star)}
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default RatingSubmissionForm;
