const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new poll
const createPoll = async (req, res) => {
  const { question, options } = req.body;

  try {
    const poll = await prisma.poll.create({
      data: {
        question,
        options,
      },
    });
    res.status(201).json({ message: "Poll created successfully", poll });
  } catch (error) {
    res.status(400).json({ error: "Poll creation failed" });
  }
};

// Get all polls
const getPolls = async (req, res) => {
  try {
    const polls = await prisma.poll.findMany();
    res.json(polls);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch polls" });
  }
};

const deletePoll = async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.poll.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Poll deleted successfully" });
    } catch (error) {
      console.error("Delete poll error:", error);
      res.status(400).json({ error: "Failed to delete poll" });
    }
  };
  

  module.exports = { createPoll, getPolls, deletePoll };