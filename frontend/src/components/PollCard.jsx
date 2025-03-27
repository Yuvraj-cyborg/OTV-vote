export default function PollCard({ poll, onVote }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold mb-4">{poll.question}</h3>
      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onVote(poll.id, option)}
            className="w-full bg-blue-100 p-2 rounded hover:bg-blue-200"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}