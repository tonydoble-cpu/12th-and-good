"""Reading-level check for the Blueprint quiz copy.

Two checks:
1. Flesch-Kincaid grade on each question stem (treated as a sentence) and
   on each question's answers combined.
2. Flag any word of 4+ syllables (the practical killer of easy reading),
   excluding numbers/dollar amounts.

FK on short fragments is noisy, so the syllable flag is the harder gate.
"""
import re
import textstat

QUIZ = {
    "Q1 stem": "What's driving your money choices right now?",
    "Q1 answers": [
        "Helping my family while I build my own future",
        "Growing my income and what I own",
        "Keeping the people I love safe",
        "Getting past debt, a setback, or old habits",
        "Taking care of what I've built so it lasts",
        "Figuring out what's right for me",
    ],
    "Q2 stem": "Think about money and the people close to you. Which sounds most like you?",
    "Q2 answers": [
        "I'm the one people lean on for money help",
        "I want to give more, but I'm still building my own life",
        "I want my family safe no matter what",
        "I'm still working through what I learned about money growing up",
        "I want what I build to outlast me",
        "I'm just starting to figure this part out",
    ],
    "Q3 stem": "When money feels stressful, it's usually because...",
    "Q3 answers": [
        "I'm carrying money worries for more than just me",
        "Even when I hit a goal, I never feel done",
        "I'm worried about what could go wrong",
        "I'm still recovering from something",
        "I'm not sure I'm using what I have well",
        "I don't know if I'm making the right choices",
    ],
    "Q4 stem": "About how much does your household make in a year?",
    "Q4 answers": ["Under $50k", "$50k to $100k", "$100k to $200k", "$200k to $500k", "$500k+"],
    "Q5 stem": "Where are you in life right now?",
    "Q5 answers": [
        "Starting out",
        "Building my career",
        "Juggling work and family",
        "Settled, and thinking ahead",
        "Starting a new chapter",
    ],
    "Q6 stem": "What's your #1 money goal for the next year?",
    "Q6 answers": [
        "Pay off debt",
        "Save for emergencies",
        "Save for something big — a home, a business, school",
        "Invest more often",
        "Make more money",
        "Get a clear plan for my money",
    ],
    "Q7 stem": "What would you want in a money coach? Pick all that fit.",
    "Q7 answers": [
        "They share my culture or background",
        "They speak my language",
        "They've been where I am",
        "They really know their stuff",
        "They understand how family and money mix",
        "I'm not sure yet",
    ],
    "Q8 stem": "What would make you trust a money coach? Pick all that fit.",
    "Q8 answers": [
        "They have nothing to sell me",
        "They've worked with people like me",
        "Someone I trust recommends them",
        "They're upfront about how they get paid",
        "I can meet them face to face or on video",
    ],
    "Intro sub": "Find your money style — the strength it gives you, and the habit that may be holding you back.",
    "Intro note": "8 quick questions. Your Blueprint at the end.",
    "Gate sub": "See what shaped your money style, what you need right now, and three moves for your next 90 days — made just for you.",
}

def words(text):
    return re.findall(r"[A-Za-z']+", text)

print(f"{'block':<12} {'FK grade':>8}   4+ syllable words")
print("-" * 64)
worst = 0.0
flags = []
for key, val in QUIZ.items():
    text = val if isinstance(val, str) else ". ".join(val) + "."
    grade = textstat.flesch_kincaid_grade(text)
    worst = max(worst, grade)
    hard = [w for w in words(text) if textstat.syllable_count(w) >= 4]
    if hard:
        flags.extend((key, w) for w in hard)
    print(f"{key:<12} {grade:>8.1f}   {', '.join(hard) if hard else '—'}")

print("-" * 64)
print(f"Worst FK grade: {worst:.1f}  (target: ≤ 6)")
print(f"4+ syllable flags: {flags if flags else 'none'}")
