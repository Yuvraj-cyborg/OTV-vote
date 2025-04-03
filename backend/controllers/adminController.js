const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCurrentPhase = async (req, res) => {
  try {
    const adminState = await prisma.adminState.findFirst({ select: { phase: true } });

    if (!adminState) {
      const newState = await prisma.adminState.create({ data: { phase: 'nomination' } });
      return res.status(200).json({ phase: newState.phase });
    }

    res.status(200).json({ phase: adminState.phase });
  } catch (error) {
    res.status(200).json({ phase: 'nomination', fromFallback: true });
  }
};

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
    res.status(500).json({ error: 'Failed to toggle phase' });
  }
};

module.exports = { getCurrentPhase, togglePhase };