const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get the current phase (without Redis caching)
const getCurrentPhase = async (req, res) => {
  try {
    // Fetch directly from database
    const adminState = await prisma.adminState.findFirst({ select: { phase: true } });

    if (!adminState) {
      // If no state exists, create a default one
      const newState = await prisma.adminState.create({ data: { phase: 'nomination' } });
      return res.status(200).json({ phase: newState.phase });
    }

    res.status(200).json({ phase: adminState.phase });
  } catch (error) {
    // Return a default if everything fails
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

    res.status(200).json({ phase: updatedState.phase });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle phase' });
  }
};

module.exports = { getCurrentPhase, togglePhase };