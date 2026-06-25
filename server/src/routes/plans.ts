import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateSection } from "../lib/claude";
import { buildPrompt, TAB_IDS, FormData } from "../lib/prompts";

const router = Router();

const formDataSchema = z.object({
  business: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  audience: z.string().min(1).max(200),
  budget: z.string().min(1).max(100),
  edge: z.string().max(300).optional(),
});

const sectionSchema = z.object({
  section: z.enum(TAB_IDS),
});

// POST /api/plans — deduct 1 credit, create plan record, return planId
router.post("/", async (req, res) => {
  const parsed = formDataSchema.safeParse(req.body.formData);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const userId = req.user!.id;
  const planCost = parseInt(process.env.PLAN_CREDIT_COST ?? "1", 10);

  try {
    const plan = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user || user.credits < planCost) {
        const err = new Error("Insufficient credits") as Error & { code: string };
        err.code = "INSUFFICIENT_CREDITS";
        throw err;
      }

      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: planCost } },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -planCost,
          type: "DEDUCT",
          reason: `Business plan: ${parsed.data.business}`,
        },
      });

      return tx.plan.create({ data: { userId, formData: parsed.data } });
    });

    res.status(201).json({ planId: plan.id });
  } catch (err: unknown) {
    if (err instanceof Error && (err as Error & { code?: string }).code === "INSUFFICIENT_CREDITS") {
      res.status(402).json({ error: "Not enough credits. Contact @DisenyoDigitals to top up. 💛" });
      return;
    }
    console.error("Start plan error:", err);
    res.status(500).json({ error: "Failed to start plan. Please try again." });
  }
});

// POST /api/plans/:planId/sections — generate one section (free after plan is started)
router.post("/:planId/sections", async (req, res) => {
  const { planId } = req.params;
  const parsed = sectionSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid section ID" });
    return;
  }

  const userId = req.user!.id;

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!plan || plan.userId !== userId) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const formData = plan.formData as unknown as FormData;
    const prompt = buildPrompt(parsed.data.section, formData);
    const content = await generateSection(prompt);

    res.json({ content });
  } catch (err) {
    console.error("Generate section error:", err);
    res.status(500).json({ error: "Generation failed. Please retry this section." });
  }
});

export default router;
