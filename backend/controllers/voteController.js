const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const submitVote = async (req, res) => {
  try {
    const { nominationId, categoryId } = req.body;
    const userId = req.user?.id; 

    if (!nominationId || !categoryId) {
      return res.status(400).json({ message: "Nomination ID and Category ID are required." });
    }

    const existingVote = await prisma.vote.findFirst({
      where: { userId, categoryId },
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted in this category!" });
    }

    await prisma.vote.create({
      data: { userId, nominationId, categoryId },
    });

    res.json({ message: "Vote submitted successfully!" });
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getVotesForCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    const votes = await prisma.vote.groupBy({
      by: ["nominationId"],
      where: { categoryId: parseInt(categoryId) },
      _count: { nominationId: true },
    });

    res.json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { submitVote, getVotesForCategory };
