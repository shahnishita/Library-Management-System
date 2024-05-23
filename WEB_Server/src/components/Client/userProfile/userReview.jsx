import React from "react";

const UserReview = ({ user }) => {
  const renderStars = (rating) => {
    const filledStars = [];
    const emptyStars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        filledStars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            className="bi bi-star-fill w-[16px] h-[16px] md:w-[18px] md:h-[18px]"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        );
      } else {
        emptyStars.push(
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-star w-[16px] h-[16px] md:w-[18px] md:h-[18px]"
            viewBox="0 0 16 16"
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
          </svg>
        );
      }
    }
    return [...filledStars, ...emptyStars];
  };

  if (user.is_reviewed == true) {


  return (
    <div className="text-white h-[500px] container mx-auto px-4 md:px-0">
      <div className="relative w-full md:w-[70%] md:h-[400px] bg-[#161616] p-8 rounded-xl my-8 md:my-16">
        <div className="flex gap-4">
          <img
            className="w-auto h-[85px] md:h-[95px] rounded-xl"
            src={`${user.profile_pic}`}
            alt="profile_pic"
          />
          <div className="flex md:flex-row flex-col relative w-full justify-center md:justify-start md:items-center">
            <div>
              <p className="text-[17px] md:text-xl font-bold ">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-[12px] md:text-[13px] ">{user.role}</p>
            </div>
            <div className="md:absolute bottom-0 md:top-0 md:right-0 flex gap-1">
              {renderStars(user.reviews.rating)}
            </div>
          </div>
        </div>
        <hr className="my-7 border-[#3F3F3F]"/>
        <div>
          <p className="text-[14px] md:text-[16px]">{user.reviews.ratingMessage}</p>
        </div>
      </div>
    </div>
  );


  } else {
    return (
      <div className="text-white h-auto container mx-auto px-4 md:px-0 w-full py-40">
        <p className="text-white text-center">User has not reviewed yet</p>
      </div>
    )
  }

};

export default UserReview;
