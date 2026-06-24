export type TabId =
  | "overview"
  | "market"
  | "operations"
  | "marketing"
  | "financials"
  | "action"
  | "pitchdeck";

export const TAB_IDS: [TabId, ...TabId[]] = [
  "overview",
  "market",
  "operations",
  "marketing",
  "financials",
  "action",
  "pitchdeck",
];

export interface FormData {
  business: string;
  location: string;
  audience: string;
  budget: string;
  edge?: string;
}

export function buildPrompt(tab: TabId, form: FormData): string {
  const ctx =
    `Filipino entrepreneur. Business: "${form.business}". Location: ${form.location}. ` +
    `Target customers: ${form.audience}. Budget: ${form.budget}. Unique edge: ${form.edge || "not specified"}.`;

  const prompts: Record<TabId, string> = {
    overview:
      `${ctx}\n\nWrite a Business Overview with these sections (use ** for headers):\n` +
      `**Business Concept** – 3 sentences explaining the business idea\n` +
      `**Mission & Vision** – 2 sentences each (Mission: what you do now, Vision: where you're going)\n` +
      `**Business Model** – how it earns money\n` +
      `**Competitive Advantage** – why customers will choose this over competitors\n` +
      `**Business Structure** – Sole Proprietorship/Partnership, DTI/SEC registration steps\n` +
      `**Year-1 KPIs** – 5 measurable targets (revenue, customers, etc.)\n\n` +
      `IMPORTANT: Write in a natural mix of Taglish and English - use English for business terms and Tagalog/Taglish for explanations and encouragement. Make it conversational and warm.`,

    market:
      `${ctx}\n\nWrite a Market Analysis with:\n` +
      `**Industry Overview** – market size and trends in Philippines\n` +
      `**Target Market Profile** – detailed demographics and psychographics\n` +
      `**Market Size** – TAM/SAM/SOM in simple terms\n` +
      `**Top 5 Customer Pain Points** – what problems they face\n` +
      `**3 Competitor Profiles** – name, strengths, weaknesses\n` +
      `**Market Gaps** – opportunities your business can fill\n` +
      `**SWOT Analysis** – 3 points each (Strengths, Weaknesses, Opportunities, Threats)\n\n` +
      `Use Taglish naturally - mix English business terms with Filipino explanations. Use bullets and emojis for readability.`,

    operations:
      `${ctx}\n\nWrite an Operations Plan with:\n` +
      `**Location & Setup** – requirements and estimated costs\n` +
      `**Equipment & Supplies** – itemized list with PHP costs\n` +
      `**Staffing** – roles needed, typical PH salaries\n` +
      `**Daily Operations Flow** – step by step\n` +
      `**Suppliers** – where to source materials in Philippines\n` +
      `**Tools & Technology** – apps, POS systems, software\n` +
      `**Legal Requirements** – DTI registration, Mayor's permit, BIR, etc.\n` +
      `**Quality Control** – how to maintain standards\n\n` +
      `Write in Taglish - business terms in English, practical advice in natural Filipino-English mix. Include realistic PHP amounts.`,

    marketing:
      `${ctx}\n\nWrite a Marketing Plan with:\n` +
      `**Brand Identity** – suggest 3 business name ideas with taglines\n` +
      `**Visual Direction** – recommended colors, fonts, aesthetic\n` +
      `**Social Media Strategy** – best PH platforms (FB, IG, TikTok), content pillars\n` +
      `**10 Content Ideas** – actual post ideas with Taglish captions\n` +
      `**30-Day Launch Plan** – week-by-week action steps\n` +
      `**Customer Loyalty Programs** – retention strategies\n` +
      `**10 Low-Budget Marketing Tactics** – each under ₱500\n` +
      `**Online Presence** – Google Business, Shopee/Lazada tips\n\n` +
      `Make it fun and practical! Mix Taglish naturally - parang nag-uusap lang kayo ng business.`,

    financials:
      `${ctx}\n\nWrite a Financial Plan with:\n` +
      `**Startup Cost Breakdown** – itemized list that fits within ${form.budget}\n` +
      `**Monthly Operating Expenses** – fixed and variable costs in PHP\n` +
      `**Pricing Strategy** – with sample product/service prices\n` +
      `**Revenue Projections** – conservative, realistic, optimistic scenarios for Months 1-6\n` +
      `**Break-Even Analysis** – units/customers needed per month\n` +
      `**Cash Flow Management Tips** – practical advice for Filipino businesses\n` +
      `**Funding Options** – DTI BMBE, SBGFC, Go Negosyo, microfinance\n` +
      `**12-Month Profit & Loss Template** – simple table format\n\n` +
      `CRITICAL: For ALL financial tables (Startup Costs, Monthly Expenses, Revenue Projections, P&L), format as proper markdown tables:\n` +
      `| Category | Amount (PHP) |\n|----------|-------------|\n| Item 1   | 5,000       |\n\n` +
      `Use Taglish - financial terms in English, explanations in natural Filipino-English. All amounts in PHP (₱).`,

    action:
      `${ctx}\n\nCreate a detailed 90-Day Action Plan (use ** for headers, ✅ for tasks):\n\n` +
      `**WEEK 1-2 — Research & Legal Setup**\n8 specific actionable tasks\n\n` +
      `**WEEK 3-4 — Supplier Sourcing & Setup**\n8 specific tasks\n\n` +
      `**WEEK 5-6 — Soft Launch Preparation**\n8 tasks with deadlines\n\n` +
      `**WEEK 7-8 — Testing & Optimization**\n6 tasks\n\n` +
      `**WEEK 9-12 — Full Launch & Scale**\n8 tasks\n\n` +
      `**Monthly Revenue Targets** – realistic goals for Months 1-6\n` +
      `**5 Daily Non-Negotiables** – habits every entrepreneur must do\n` +
      `**When to Pivot** – 3 warning signals that mean change direction\n\n` +
      `Write in warm Taglish - encouraging but realistic. Parang mentor ka na nag-guide.`,

    pitchdeck:
      `${ctx}\n\nWrite a 10-slide investor pitch deck (use ** for slide titles):\n\n` +
      `**Slide 1 – Cover Slide** – business name, tagline, location\n` +
      `**Slide 2 – The Problem** – customer pain point you're solving\n` +
      `**Slide 3 – Our Solution** – how your business solves it\n` +
      `**Slide 4 – Market Opportunity** – Philippines market size\n` +
      `**Slide 5 – Competitive Advantage** – your unique edge\n` +
      `**Slide 6 – Business Model** – how you make money\n` +
      `**Slide 7 – Key Milestones** – 6-month and 1-year goals\n` +
      `**Slide 8 – The Team** – skills and experience needed\n` +
      `**Slide 9 – Financial Highlights** – investment ask, projected ROI\n` +
      `**Slide 10 – The Ask** – how much funding, what it's for\n\n` +
      `For each slide, provide talking points and key data.\n\n` +
      `**Bonus: Bank Loan Tips** – How to approach BDO, BPI, Landbank\n` +
      `**DTI/DOST Grant Guide** – Available programs for Filipino entrepreneurs\n\n` +
      `Use Taglish naturally throughout - make it sound professional pero hindi pretentious.`,
  };

  return prompts[tab];
}
