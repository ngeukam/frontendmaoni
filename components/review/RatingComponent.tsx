import React from "react";
// import { getStarColor } from "../../utilities/getStarColor";

interface RatingProps {
    evaluation: number; // The numeric rating value (e.g., 4.5, 3.0, etc.)
    getColor: (e:number) => string
}
const RatingComponent: React.FC<RatingProps> = ({ evaluation, getColor }) => {

    // Function to render the stars
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFullStar = i <= Math.floor(evaluation); // Full star if the index is less than or equal to the integer part of the rating
            const isHalfStar = i === Math.ceil(evaluation) && evaluation % 1 !== 0; // Half star if the index equals the next decimal point
            const isEmptyStar = i > evaluation; // Empty star if the index is greater than the rating

            let starStyle = {};
            let backgroundStyle = { backgroundColor: "#ccc" }; // Gray background for all stars

            if (isFullStar) {
                starStyle = {
                    backgroundColor: getColor(evaluation),
                    color: "white", // Full star with color
                };
            } else if (isHalfStar) {
                // For a half star, apply clipping dynamically based on the decimal part
                const decimalPart = evaluation % 1; // Get the decimal part of the rating
                const clipPercentage = decimalPart * 100; // Calculate the fill percentage of the star (0 to 100)
                starStyle = {
                    backgroundColor: getColor(evaluation),
                    color: "white",
                    clipPath: `inset(0 ${100 - clipPercentage}% 0 0)`, // Clip the right side of the star based on the decimal
                };
            }

            // Add the star with the gray background and color-filled portion
            stars.push(
                <span
                    key={i}
                    className="star"
                    style={{
                        width: "20px", // Size of the star
                        height: "20px",
                        display: "inline-block",
                        fontSize: "20px",
                        lineHeight: "20px",
                        textAlign: "center",
                        borderRadius: "50%",
                        margin: "0 4px",
                        position: "relative",
                    }}
                >
                    <span
                        style={{
                            ...backgroundStyle, // Apply the gray background
                            position: "absolute", // Gray background that covers the whole star
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: "10%",
                        }}
                    />
                    <span
                        style={{
                            ...starStyle, // Apply the filled portion (colored) of the star
                            position: "absolute", // Colored part overlaid on top of the gray background
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: "10%",
                        }}
                    >
                        ★ {/* Star character */}
                    </span>
                </span>
            );
        }
        return stars;
    };

    return <div className="flex">{renderStars()}</div>;
};

export default RatingComponent;
