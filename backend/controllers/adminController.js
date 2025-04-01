const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL); // Ensure Redis is set up

// Get the current phase (with Redis caching)
const getCurrentPhase = async (req, res) => {
  try {
    // Check if the phase is cached
    const cachedPhase = await redis.get("current_phase");
    if (cachedPhase) {
      return res.status(200).json({ phase: cachedPhase });
    }

    // Fetch from database if not cached
    const adminState = await prisma.adminState.findFirst({ select: { phase: true } });

    if (!adminState) {
      // If no state exists, create a default one
      const newState = await prisma.adminState.create({ data: { phase: 'nomination' } });

      // Cache it in Redis
      await redis.set("current_phase", newState.phase, "EX", 60); // Cache for 60 seconds

      return res.status(200).json({ phase: newState.phase });
    }

    // Cache the phase
    await redis.set("current_phase", adminState.phase, "EX", 60); // Cache for 60 seconds

    res.status(200).json({ phase: adminState.phase });
  } catch (error) {
    console.error('Error fetching phase:', error);
    res.status(500).json({ error: 'Failed to fetch phase' });
  }
};

// Toggle the phase between nomination and voting
const togglePhase = async (req, res) => {
  try {
    const adminState = await prisma.adminState.findFirst();
    if (!adminState) {
      return res.status(404).json({ error: 'Admin state not found' });
    }

    const newPhase = adminState.phase === 'nomination' ? 'voting' : 'nomination';

    // Update database
    const updatedState = await prisma.adminState.update({
      where: { id: adminState.id },
      data: { phase: newPhase },
    });

    // Remove old cache so the new phase gets stored
    await redis.del("current_phase");

    res.status(200).json({ phase: updatedState.phase });
  } catch (error) {
    console.error('Error toggling phase:', error);
    res.status(500).json({ error: 'Failed to toggle phase' });
  }
};

module.exports = { getCurrentPhase, togglePhase };