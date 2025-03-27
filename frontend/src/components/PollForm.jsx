import { useState } from "react";

export default function PollForm({ onSubmit }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      question,
      options: options.split(",").map((opt) => opt.trim()),
    });
    setQuestion("");
    setOptions("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Create a New Poll</h3>
      <input
        type="text"
        placeholder="Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Options (comma separated)"
        value={options}
        onChange={(e) => setOptions(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Create Poll
      </button>
    </form>
  );
}