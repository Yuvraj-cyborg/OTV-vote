const isAdmin = async (req, res, next) => {
    const userId = req.user.id;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admins only." });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  module.exports = isAdmin;