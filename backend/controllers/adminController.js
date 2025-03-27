const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get the current phase
const getCurrentPhase = async (req, res) => {
  try {
    const adminState = await prisma.adminState.findFirst();
    if (!adminState) {
      // If no state exists, create a default one
      const newState = await prisma.adminState.create({
        data: { phase: 'nomination' },
      });
      return res.status(200).json({ phase: newState.phase });
    }
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
      const updatedState = await prisma.adminState.update({
        where: { id: adminState.id },
        data: { phase: newPhase },
      });
  
      res.status(200).json({ phase: updatedState.phase });
    } catch (error) {
      console.error('Error toggling phase:', error);
      res.status(500).json({ error: 'Failed to toggle phase' });
    }
  };

module.exports = { getCurrentPhase, togglePhase };