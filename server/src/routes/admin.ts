import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const router = Router();

const grantSchema = z.object({
  email: z.string().email(),
  amount: z.number().int().positive().max(1000),
  reason: z.string().max(200).optional(),
});

// POST /api/admin/grant-credits — manually top up a user's balance
router.post("/grant-credits", async (req, res) => {
  const parsed = grantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, amount, reason } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        const err = new Error("User not found") as Error & { code: string };
        err.code = "NOT_FOUND";
        throw err;
      }

      const updated = await tx.user.update({
        where: { email: normalizedEmail },
        data: { credits: { increment: amount } },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: "GRANT",
          reason: reason ?? `Admin grant by ${req.user!.email}`,
        },
      });

      return updated;
    });

    res.json({ email: result.email, newBalance: result.credits });
  } catch (err: unknown) {
    if (err instanceof Error && (err as Error & { code?: string }).code === "NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Grant credits error:", err);
    res.status(500).json({ error: "Failed to grant credits" });
  }
});

// POST /api/admin/refund — refund 1 credit for a failed generation
router.post("/refund", async (req, res) => {
  const schema = z.object({ email: z.string().email(), reason: z.string().max(200).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        const err = new Error("User not found") as Error & { code: string };
        err.code = "NOT_FOUND";
        throw err;
      }

      const updated = await tx.user.update({
        where: { email: normalizedEmail },
        data: { credits: { increment: 1 } },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 1,
          type: "REFUND",
          reason: parsed.data.reason ?? `Refund by admin ${req.user!.email}`,
        },
      });

      return updated;
    });

    res.json({ email: result.email, newBalance: result.credits });
  } catch (err: unknown) {
    if (err instanceof Error && (err as Error & { code?: string }).code === "NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Refund error:", err);
    res.status(500).json({ error: "Failed to issue refund" });
  }
});

// POST /api/admin/set-credits — set a user's balance to an exact amount
router.post("/set-credits", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    amount: z.number().int().min(0).max(10000),
    reason: z.string().max(200).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, amount, reason } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        const err = new Error("User not found") as Error & { code: string };
        err.code = "NOT_FOUND";
        throw err;
      }

      const diff = amount - user.credits;

      const updated = await tx.user.update({
        where: { email: normalizedEmail },
        data: { credits: amount },
      });

      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: diff,
          type: "GRANT",
          reason: reason ?? `Credit reset to ${amount} by admin ${req.user!.email}`,
        },
      });

      return updated;
    });

    res.json({ email: result.email, newBalance: result.credits });
  } catch (err: unknown) {
    if (err instanceof Error && (err as Error & { code?: string }).code === "NOT_FOUND") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Set credits error:", err);
    res.status(500).json({ error: "Failed to set credits" });
  }
});

export default router;
