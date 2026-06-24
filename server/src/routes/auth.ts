import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendVerificationEmail } from "../lib/email";

const router = Router();

const authSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

router.post("/register", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const startingCredits = parseInt(process.env.STARTING_CREDITS ?? "3", 10);
    const useEmailVerification = !!process.env.RESEND_API_KEY;

    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          credits: startingCredits,
          emailVerified: !useEmailVerification,
        },
      });
      await tx.creditTransaction.create({
        data: { userId: u.id, amount: startingCredits, type: "GRANT", reason: "Welcome bonus" },
      });
      return u;
    });

    if (useEmailVerification) {
      const verificationToken = randomBytes(32).toString("hex");
      const verificationTokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { verificationToken, verificationTokenExp },
      });

      await sendVerificationEmail(normalizedEmail, verificationToken);

      res.status(201).json({
        verificationRequired: true,
        message: "Account created! Check your email to verify your account.",
      });
    } else {
      const token = signToken(user.id, user.email, user.isAdmin);
      res.status(201).json({ token, credits: user.credits, verificationRequired: false });
    }
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    if (process.env.RESEND_API_KEY && !user.emailVerified) {
      res.status(403).json({
        error: "Please verify your email before signing in. Check your inbox for the verification link.",
      });
      return;
    }

    const token = signToken(user.id, user.email, user.isAdmin);
    res.json({ token, credits: user.credits });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).send("Invalid verification link.");
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).send("This verification link is invalid or has expired. Please create a new account.");
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null, verificationTokenExp: null },
    });

    const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
    res.redirect(`${frontendOrigin}?verified=true`);
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).send("Verification failed. Please try again.");
  }
});

function signToken(id: string, email: string, isAdmin: boolean): string {
  return jwt.sign(
    { id, email, isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as jwt.SignOptions
  );
}

export default router;
