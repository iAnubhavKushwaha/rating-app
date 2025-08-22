export const RatingStars = ({ rating, onSelect, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          } ${!readOnly ? "cursor-pointer" : ""}`}
          onClick={() => !readOnly && onSelect && onSelect(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};
