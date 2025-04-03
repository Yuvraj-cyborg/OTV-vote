const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL); // Ensure Redis is set up

// Cache TTL in seconds (1 day instead of 60 seconds)
const PHASE_CACHE_TTL = 86400;

// Pre-warm the cache on server start
(async function initializeCache() {
  try {
    // Check if cache exists already
    const existingCache = await redis.get("current_phase");
    if (!existingCache) {
      console.log("Pre-warming the phase cache...");
      const adminState = await prisma.adminState.findFirst({ select: { phase: true } });
      if (adminState) {
        await redis.set("current_phase", adminState.phase, "EX", PHASE_CACHE_TTL);
        console.log(`Cache initialized with phase: ${adminState.phase}`);
      } else {
        // Create default state if none exists
        const newState = await prisma.adminState.create({ data: { phase: 'nomination' } });
        await redis.set("current_phase", newState.phase, "EX", PHASE_CACHE_TTL);
        console.log(`No phase found, created default: ${newState.phase}`);
      }
    } else {
      console.log(`Cache already exists with phase: ${existingCache}`);
    }
  } catch (error) {
    console.error("Failed to initialize phase cache:", error);
  }
})();

// Get the current phase (with Redis caching)
const getCurrentPhase = async (req, res) => {
  try {
    // Check if the phase is cached
    const cachedPhase = await redis.get("current_phase");
    if (cachedPhase) {
      // Return cached phase immediately
      return res.status(200).json({ phase: cachedPhase });
    }

    console.log("Cache miss on phase fetch, querying database...");
    // Fetch from database if not cached
    const adminState = await prisma.adminState.findFirst({ select: { phase: true } });

    if (!adminState) {
      // If no state exists, create a default one
      const newState = await prisma.adminState.create({ data: { phase: 'nomination' } });

      // Cache it in Redis with much longer TTL
      await redis.set("current_phase", newState.phase, "EX", PHASE_CACHE_TTL);
      console.log(`Created and cached new phase: ${newState.phase}`);

      return res.status(200).json({ phase: newState.phase });
    }

    // Cache the phase with longer TTL
    await redis.set("current_phase", adminState.phase, "EX", PHASE_CACHE_TTL);
    console.log(`Refreshed cache with phase: ${adminState.phase}`);

    res.status(200).json({ phase: adminState.phase });
  } catch (error) {
    console.error('Error fetching phase:', error);
    
    // Fallback - if Redis fails but we still have a connection to it, try once more
    try {
      const fallbackPhase = await redis.get("current_phase");
      if (fallbackPhase) {
        console.log("Used fallback cache fetch");
        return res.status(200).json({ phase: fallbackPhase });
      }
    } catch (redisError) {
      console.error('Redis fallback error:', redisError);
    }
    
    // Last resort - return a default if everything fails
    // This prevents the client from hanging indefinitely
    res.status(200).json({ phase: 'nomination', fromFallback: true });
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

    // Update cache immediately with new phase (instead of just deleting old cache)
    await redis.set("current_phase", newPhase, "EX", PHASE_CACHE_TTL);
    console.log(`Phase toggled and cached: ${newPhase}`);

    res.status(200).json({ phase: updatedState.phase });
  } catch (error) {
    console.error('Error toggling phase:', error);
    res.status(500).json({ error: 'Failed to toggle phase' });
  }
};

module.exports = { getCurrentPhase, togglePhase };