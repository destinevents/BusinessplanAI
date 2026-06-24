import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/history", async (req, res) => {
  try {
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, amount: true, type: true, reason: true, createdAt: true },
    });
    res.json(transactions);
  } catch (err) {
    console.error("Credit history error:", err);
    res.status(500).json({ error: "Failed to fetch credit history" });
  }
});

// TODO: Wire Stripe or PayMongo (Philippine gateway) here
// PayMongo docs: https://developers.paymongo.com
router.post("/purchase", (_req, res) => {
  res.status(501).json({
    error: "Payment not yet implemented",
    message: "Coming soon! For now, contact @DisenyoDigitals to top up your credits. 💛",
  });
});

export default router;
