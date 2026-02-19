# BrainStack Studio (BSS)

BrainStack Studio is an Operational AI Platform designed to automate business workflows with deterministic reliability and AI-powered enhancements.

## 🚀 Key Features

-   **Deterministic Tools:** 15+ built-in calculators, analyzers, and generators (ROI, Cash Flow, SOPs, Job Descriptions).
-   **AI Native Enhancement:** Integrated with Anthropic Claude 3.5 Sonnet to refine and professionalize tool outputs.
-   **Guided Explorer:** Industry-specific workflow mapping.
-   **Revenue Ready:** Full Stripe integration (Pro Plan at $99/mo) with checkout and billing portal.
-   **Enterprise Grade:** Audit trails, confidence scoring, and role-based access control.

## 🛠 Tech Stack

-   **Framework:** Next.js 15 (App Router)
-   **Language:** TypeScript 5
-   **Database:** Supabase (PostgreSQL + Auth)
-   **Styling:** Tailwind CSS + Shadcn UI + Framer Motion
-   **Payments:** Stripe
-   **AI:** Anthropic SDK

## 🤖 AI Integration

BSS uses a hybrid approach:
1.  **Deterministic Core:** Tools run on robust algorithms (in `lib/tools/calculators`) to ensure 100% reliable base outputs.
2.  **AI Enhancement:** Users can click "Refine with AI" to send the output to Claude 3.5 Sonnet for stylistic improvement, expansion, and professional polish.

### Configuration
Ensure `ANTHROPIC_API_KEY` is set in `.env.local` to enable AI features.

## 📦 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## 💰 Billing

Stripe configuration is handled in `lib/stripe/config.ts`.
-   **Pro Plan Product ID:** `prod_TxJIELH1qRihyq`
-   **Pro Plan Price ID:** `price_1SzOg2Fs5YLnaPiWrFezCPyh`

## 📄 License

Proprietary software of BrainOps Systems.
