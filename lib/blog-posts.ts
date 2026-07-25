export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readTime: string;
  category: "Employers" | "Individuals" | "Industry";
  content: string; // HTML content
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "financial-wellness-programs-actually-work",
    title: "Do financial wellness programs actually work? What the research says.",
    description:
      "Most financial wellness programs are run by the companies selling financial products. Here's what happens when you remove the conflict of interest.",
    date: "2026-07-18",
    readTime: "6 min read",
    category: "Employers",
    content: `
<p>If you're an HR leader evaluating financial wellness benefits, you've probably seen the pitch: "Our program reduces stress, improves retention, and pays for itself." Every vendor says this. Most of them are also selling financial products to your employees on the back end.</p>

<p>That's not a wellness program. That's a sales channel wearing a benefits badge.</p>

<p>So let's separate the signal from the noise. Does financial coaching — real coaching, without product sales — actually move the needle? Here's what the independent research says.</p>

<h2>The cost of doing nothing</h2>

<p>The numbers on financial stress at work are hard to argue with. PwC's 2026 Employee Financial Wellness Survey found that 59% of employees report financial stress, and Valoir's 2025 research shows those employees lose an average of 3.3 hours per week to money worries during work hours. That's not scrolling their 401(k) — it's distraction, anxiety, and reduced focus.</p>

<p>Financially stressed employees are twice as likely to actively job-search (PwC), and replacing someone costs 50–200% of their annual salary (SHRM). For a 250-person company with 18% turnover and a $65,000 average salary, the math adds up to hundreds of thousands in preventable costs.</p>

<h2>What the independent studies show</h2>

<p>The most rigorous study comes from the Personal Finance Employee Education Foundation (PFEEF), which tracked 8,233 participants across multiple employers. Their findings:</p>

<ul>
<li><strong>$5.50 returned for every $1 invested</strong> under conservative assumptions — up to $15:1 optimistically</li>
<li><strong>Healthcare costs decreased 4.5%</strong> for program participants while increasing 19.4% for non-participants</li>
<li><strong>5 fewer unscheduled absence days</strong> per participant per year</li>
<li><strong>Measurable improvements</strong> in retirement readiness, debt management, and emergency savings</li>
</ul>

<p>These aren't vendor-sponsored stats. This is independent research across real employer programs.</p>

<h2>Why most programs underperform</h2>

<p>The financial wellness market is projected to reach $4.87 billion. But most of that spending goes to programs run by insurance companies, banks, or brokerage firms. The incentive structure is broken: the "coach" has a financial reason to recommend their employer's products.</p>

<p>Employees sense this. Engagement rates for vendor-run financial wellness programs are typically 5–15%. People don't trust it, so they don't use it.</p>

<p>The programs that work — the ones behind the $5.50:1 ROI — share a common trait: the coach has no products to sell. The only thing they're paid to do is help.</p>

<h2>What a conflict-free program looks like</h2>

<p>At 12th & Good Street, we built the platform around one idea: the coach's only incentive should be helping your employee. No commissions, no product recommendations, no upselling.</p>

<p>The program works like this: your employees get access to vetted, conflict-free financial coaches for 1:1 sessions. The coach helps with whatever's actually on their mind — debt, budgeting, benefits optimization, retirement planning, a big financial decision. Sessions are paid by the employer as a benefit, or by the individual directly.</p>

<p>Between sessions, employees have free access to self-service tools: a 401(k) match calculator, debt payoff planner, emergency fund calculator, budget builder, and an AI-powered money coach available 24/7.</p>

<h2>The bottom line</h2>

<p>Financial wellness programs work when they're actually about wellness — not about selling products. The research supports a clear ROI, but only when the incentive structure is clean.</p>

<p>If you want to see what the numbers look like for your team specifically, our <a href="/employers/roi-calculator">ROI calculator</a> uses the same research cited above with conservative assumptions. And if you want to talk through whether this is a fit, the <a href="/employers#contact">intro conversation</a> is free and low-pressure.</p>
`,
  },
  {
    slug: "what-is-conflict-free-financial-coaching",
    title: "What does 'conflict-free' actually mean in financial coaching?",
    description:
      "The financial industry is full of advisors who earn money from what they recommend. Here's how to tell the difference — and why it matters.",
    date: "2026-07-15",
    readTime: "5 min read",
    category: "Individuals",
    content: `
<p>If you've ever felt a little uneasy talking to a financial advisor — like maybe they're steering you toward something that benefits them — you're not imagining things. The financial industry has a terminology problem, and it's designed to be confusing.</p>

<h2>The three models you'll encounter</h2>

<p><strong>Commission-based:</strong> The advisor earns money when you buy a product — insurance, a mutual fund, an annuity. Their incentive is to sell. They might call themselves a "financial advisor," "financial consultant," or "wealth manager." This is the most common model, and it's the reason people are skeptical.</p>

<p><strong>Fee-based (not the same as fee-only):</strong> The advisor charges you a fee AND earns commissions on products. The word "based" is doing a lot of work in that phrase. This is where most of the confusion lives — it sounds like they work for you, but they also have product incentives.</p>

<p><strong>Fee-only / Advice-only:</strong> The advisor is paid exclusively by you (or your employer), for their time and advice. They don't sell products, don't earn commissions, and don't benefit from recommending one fund over another. This is what "conflict-free" means.</p>

<h2>Why the distinction matters</h2>

<p>Imagine going to a doctor who gets paid by pharmaceutical companies every time they prescribe a specific drug. They might still give you good advice — but you'd always wonder. That's the financial industry for most people.</p>

<p>A conflict-free coach has one incentive: help you. Their income doesn't change based on what you decide to do with your money. Whether you invest in index funds, pay down debt, or stuff cash in a mattress, their paycheck is the same.</p>

<p>This isn't a moral judgment about advisors who earn commissions — many of them are good at what they do and genuinely care about their clients. But the structure creates a tension that doesn't need to exist. You shouldn't have to evaluate whether your advisor's advice is for you or for their bottom line.</p>

<h2>How to check (in 30 seconds)</h2>

<p>Ask one question: <strong>"Are you a fiduciary, and are you compensated solely by client fees?"</strong></p>

<p>A fiduciary is legally required to act in your best interest. But fiduciary duty alone isn't enough — a fiduciary can still earn commissions. You want both: fiduciary + fee-only.</p>

<p>If that conversation feels awkward, you're not alone. It's one of the reasons we built 12th & Good Street — every coach on the platform is pre-vetted for conflict-free compensation. You don't have to ask the question because we already did.</p>

<h2>What this looks like in practice</h2>

<p>A conflict-free coaching session at 12th & Good Street works like this: you book time with a coach, you talk about whatever's on your mind — your 401(k), a debt that feels stuck, a big purchase you're weighing, benefits you're not sure you're using — and the coach helps you think through it. No product pitch at the end. No "I know a great fund for you." Just advice.</p>

<p>If you want to try it before talking to anyone, our <a href="/coach-ai">AI Money Coach</a> is free and available right now. Ask it anything — it's trained on the same conflict-free principles our human coaches follow.</p>
`,
  },
  {
    slug: "employer-401k-match-leaving-money",
    title: "Your employees are leaving free money on the table. Here's how much.",
    description:
      "About 25% of employees don't capture their full 401(k) match. For a 500-person company, that's over $1M in unclaimed benefits every year.",
    date: "2026-07-10",
    readTime: "4 min read",
    category: "Employers",
    content: `
<p>Here's a stat that surprises most HR leaders: about one in four employees don't contribute enough to their 401(k) to capture the full employer match. They're literally walking past free money.</p>

<p>For a company with 500 employees, a 4% match, and a $70,000 average salary, that's roughly $1.4 million in employer contributions that go unclaimed every year. The company budgeted for it. The employees earned it. Nobody picked it up.</p>

<h2>Why it happens</h2>

<p>It's not because employees don't care about retirement. It's usually one of three things:</p>

<p><strong>They don't understand the match.</strong> "We match 50% of the first 6%" is clear to an HR professional. To someone who hasn't thought about percentages since high school, it's gibberish. They know there's a match. They don't know how much they need to contribute to get it all.</p>

<p><strong>They can't afford to contribute more (or think they can't).</strong> When money is tight, increasing your 401(k) contribution feels like taking a pay cut. What most people don't realize is that a 1% increase in contribution on a $60,000 salary is about $23 per paycheck before tax. For many people, that's findable.</p>

<p><strong>Nobody sat down with them.</strong> Auto-enrollment helps, but it typically defaults to 3% — below most match thresholds. Nobody follows up to say "you're leaving $1,200 a year on the table."</p>

<h2>What a coaching conversation does</h2>

<p>This is one of the highest-ROI coaching conversations that exists. It takes 15 minutes, costs the employer almost nothing relative to the benefit, and the employee walks away with an immediate, measurable financial gain.</p>

<p>A coach does three things:</p>

<p>First, they translate the match formula into plain English: "If you put in 6%, your employer adds another 3%. That's a 50% return on your money before it even hits the market."</p>

<p>Second, they look at the employee's budget together and find the contribution increase. It's almost always smaller than the person expects.</p>

<p>Third, they help the employee actually make the change — log in, adjust the percentage, done.</p>

<p>Total time: 15 minutes. Annual value to the employee: $1,000–$3,000+ depending on salary and match. Compounded over a career: tens of thousands.</p>

<h2>The free version</h2>

<p>We built a <a href="/resources/401k-calculator">401(k) match calculator</a> that does the first step — translates the match into real dollars. It's free, it takes 60 seconds, and it's often enough to get someone to act.</p>

<p>If you want to make this part of a broader program, that's what <a href="/employers">12th & Good Street for employers</a> is. Our coaches handle the conversation. Your employees get the money. Everyone wins.</p>
`,
  },
  {
    slug: "financial-stress-costs-employers",
    title: "Financial stress is your most expensive invisible benefit gap",
    description:
      "59% of your workforce is distracted by money problems. The cost is real — but most companies aren't measuring it.",
    date: "2026-07-05",
    readTime: "5 min read",
    category: "Employers",
    content: `
<p>If 59% of your employees showed up sick, you'd notice. If 59% couldn't use their primary work tool, you'd fix it. But when 59% are distracted by financial stress — losing 3+ hours a week to money worries — it's invisible. It doesn't show up on a dashboard. It shows up in turnover you can't explain, absenteeism you attribute to something else, and productivity gaps that feel cultural.</p>

<p>PwC's 2026 Employee Financial Wellness Survey puts the number at 59% of full-time employees reporting that finances are their top source of stress. Valoir's 2025 research quantifies the productivity loss: 3.3 hours per week spent on personal financial matters during work hours.</p>

<p>Let's run that math for a 500-person company with a $65,000 average salary.</p>

<h2>The hidden cost</h2>

<p><strong>Productivity:</strong> 295 stressed employees × 3.3 hours/week × 48 weeks × $31/hour = roughly $1.45 million in lost productive time. Even if coaching recovers just 30% of that, you're looking at $435,000.</p>

<p><strong>Turnover:</strong> If 18% of your workforce turns over annually (90 people), and financially stressed employees are 2× more likely to leave, a meaningful portion of that turnover is stress-driven. At 50% of salary per replacement, even preventing 14 departures saves $455,000.</p>

<p><strong>Absenteeism:</strong> Financial Finesse's longitudinal data shows program participants average 5 fewer unscheduled absence days per year. At 295 stressed employees × 3 days × $250/day, that's $221,000.</p>

<p><strong>Healthcare:</strong> The same Fortune 100 study showed healthcare costs decreased 4.5% for program users while increasing 19.4% for non-users. At $271 per employee, that's $80,000 for a 500-person company.</p>

<p>Add it up: roughly $1.2 million in recoverable costs, conservatively. Against a program cost of $60,000–$120,000 per year.</p>

<h2>Why companies don't act</h2>

<p>Three reasons come up over and over.</p>

<p><strong>"We already offer an EAP."</strong> You do, and utilization is probably 3–5%. EAPs cover financial counseling in theory, but in practice most employees don't know it, and the financial counselors are typically generalists doing 30-minute phone calls. It's a checkbox, not a program.</p>

<p><strong>"Our 401(k) provider has financial wellness tools."</strong> They do — and they're using those tools to cross-sell products to your employees. The "financial wellness" tab on your 401(k) platform exists to drive assets into their funds. Your employees know this, which is why they don't engage with it.</p>

<p><strong>"We can't measure the ROI."</strong> You can. The PFEEF study of 8,233 participants found $5.50 returned per $1 invested. Our <a href="/employers/roi-calculator">ROI calculator</a> lets you run the numbers with your own headcount and salary data in 60 seconds.</p>

<h2>What works</h2>

<p>The programs that actually reduce financial stress share three traits: the coaches are conflict-free (no product sales), the sessions are 1:1 (not webinars), and the access is ongoing (not a one-time workshop).</p>

<p>That's what we built at 12th & Good Street. If you want to explore whether it fits your team, the <a href="/employers#contact">scoping conversation</a> is free and typically takes 20 minutes.</p>
`,
  },
  {
    slug: "how-to-choose-financial-coach",
    title: "How to choose a financial coach (and what to ask before you book)",
    description:
      "Not all coaches are created equal. Here are the five questions that separate good advice from a sales pitch.",
    date: "2026-06-28",
    readTime: "4 min read",
    category: "Individuals",
    content: `
<p>Looking for a financial coach can feel like dating — everyone's profile sounds great, but you don't know what you're actually getting until you're in the room. Here are five questions that cut through the noise.</p>

<h2>1. "How do you get paid?"</h2>

<p>This is the most important question, and most people don't ask it. If the coach earns commissions on financial products (insurance, investments, annuities), their advice may be influenced by what pays them the most. You want someone who is paid for their time and expertise — not for what they sell you.</p>

<p>The gold standard: <strong>fee-only</strong> or <strong>advice-only</strong>. That means you (or your employer) pay for the session, and that's the only money changing hands.</p>

<h2>2. "What's your approach to financial planning?"</h2>

<p>Some coaches focus heavily on investments. Others focus on budgeting and cash flow. Some specialize in debt, retirement, or small business finances. There's no wrong answer — but the right coach for you is the one whose approach matches what you actually need help with.</p>

<p>If you're not sure what you need, that's fine. A good coach will help you figure that out in the first session. But if a coach can't clearly describe their approach in plain language, that's a red flag.</p>

<h2>3. "Do I need a minimum amount of assets to work with you?"</h2>

<p>Many traditional financial advisors require $250,000+ in investable assets. That eliminates most people. If you're earlier in your financial journey — paying down debt, building savings, trying to understand your benefits — you need a coach who works with people at your stage, not one who manages portfolios for high-net-worth clients.</p>

<h2>4. "What credentials do you hold?"</h2>

<p>Look for: <strong>CFP (Certified Financial Planner)</strong>, <strong>AFC (Accredited Financial Counselor)</strong>, or <strong>ChFC (Chartered Financial Consultant)</strong>. These require real education, exams, and continuing education. They don't guarantee quality, but they filter out people who took a weekend course and called themselves a coach.</p>

<p>Also ask whether they're a <strong>fiduciary</strong> — legally required to act in your best interest. Not all credentials require fiduciary duty.</p>

<h2>5. "Can I try a session before committing?"</h2>

<p>Any coach worth working with will offer a free or low-cost intro session. This is where you figure out whether you trust them, whether their communication style works for you, and whether they understand your situation. If a coach requires a long-term contract upfront, keep looking.</p>

<h2>Where 12th & Good Street fits</h2>

<p>We built 12th & Good Street to answer these questions before you ever have to ask them. Every coach on the platform is pre-vetted: conflict-free compensation, relevant credentials, no asset minimums, and a first-session promise: if it isn't worth every dollar, you don't pay.</p>

<p>If you're not ready to talk to a person yet, our <a href="/coach-ai">AI Money Coach</a> can help you think through what you'd even want to ask about. It's free, private, and available right now.</p>

<p>And if you want a quick gut-check on your financial situation first, the <a href="/resources/wellness-assessment">financial wellness checkup</a> takes two minutes and helps you see which areas might benefit from a conversation.</p>
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
