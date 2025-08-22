export const RatingStars = ({ rating, onSelect, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`text-xl transition duration-200 ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          } ${!readOnly ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => !readOnly && onSelect && onSelect(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};