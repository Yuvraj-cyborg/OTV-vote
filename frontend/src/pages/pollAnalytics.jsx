import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PollAnalytics() {
  const { id } = useParams();



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Poll Analytics</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">{analytics.question}</h3>
        <p className="text-gray-600 mb-4">Total Votes: {analytics.totalVotes}</p>
        <div className="space-y-2">
          {Object.entries(analytics.voteCounts).map(([option, count]) => (
            <div key={option} className="flex justify-between">
              <span>{option}</span>
              <span>{count} votes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}