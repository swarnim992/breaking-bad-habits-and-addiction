import logging
from groq import Groq
from app.config import settings

logger = logging.getLogger("app.services.ai_service")

class AiService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("GROQ_API_KEY is not set. AI services will use offline fallbacks.")

    def generate_personalized_plan(
        self,
        habit_name: str,
        unit: str,
        current_level: float,
        target_level: float,
        trigger: str,
        motivation: str
    ) -> str:
        """
        Generate a personalized behavior-change plan using Groq LLM.
        Falls back to a structured static plan if Groq is unavailable.
        """
        if not self.client:
            return self._fallback_plan(habit_name, unit, current_level, target_level, trigger, motivation)

        prompt = f"""
You are a highly supportive and empathetic behavior-change coach. Your goal is to help the user reduce their bad habit.

Here is the user's habit profile:
- Bad Habit: {habit_name}
- Current level: {current_level} {unit}
- Target level: {target_level} {unit}
- Main trigger: {trigger}
- Motivation to change: {motivation}

Generate a clear, highly personalized, and actionable behavior-change plan. Use the user's unit ("{unit}") when talking about levels and targets.
Respond ONLY with a clean markdown document structured exactly as follows (do not add introductory or concluding remarks outside these sections):

### Goal
Reduce {habit_name} usage from {current_level} {unit} to {target_level} {unit}.

### Main Trigger
Identify the cue: "{trigger}" and explain briefly in 1-2 sentences how to anticipate or intercept it.

### Your Motivations
Acknowledge the user's core reason: "{motivation}" and write a short, encouraging reminder (2 sentences max) of why this change is worth it.

### Today's Actions
Provide exactly 3 realistic, highly actionable steps the user can take today to make progress. Focus heavily on managing the trigger and replacing the habit.
1. [Action 1]
2. [Action 2]
3. [Action 3]
"""

        try:
            # We use Llama 3 8B model which is fast and widely available on Groq
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional, empathetic behavioral change coach. You output plans strictly in the requested markdown format.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=500,
            )
            ai_content = chat_completion.choices[0].message.content
            return ai_content.strip()
        except Exception as e:
            logger.error(f"Error calling Groq API: {e}", exc_info=True)
            return self._fallback_plan(habit_name, unit, current_level, target_level, trigger, motivation)

    def generate_checkin_feedback(
        self,
        habit_name: str,
        unit: str,
        current_level: float,
        target_level: float,
        trigger: str,
        motivation: str,
        mood: str,
        progress: float,
        note: str | None,
        recent_progress: list[float],
    ) -> str:
        """
        Generate personalized feedback after a daily check-in.
        Falls back to a structured static response if Groq is unavailable.
        """
        if not self.client:
            return self._fallback_checkin_feedback(
                habit_name, unit, target_level, trigger, mood, progress, note
            )

        recent_summary = "No previous check-ins yet."
        if recent_progress:
            recent_summary = ", ".join(f"{p} {unit}" for p in recent_progress[-5:])

        note_text = note.strip() if note else "No additional notes."
        met_target = progress <= target_level

        prompt = f"""
You are a supportive behavior-change coach. The user just completed a daily check-in.

Habit: {habit_name}
Target: {target_level} {unit}
Main trigger: {trigger}
Motivation: {motivation}

Today's check-in:
- Mood: {mood}
- Usage: {progress} {unit}
- Met target today: {"yes" if met_target else "no"}
- Note: {note_text}

Recent usage history: {recent_summary}

Write 2-3 short sentences of empathetic, actionable feedback. Acknowledge today's effort, reference their trigger if relevant, and give one concrete tip for tomorrow. Do not use markdown or bullet points.
"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a warm, concise behavioral coach. Keep responses under 80 words.",
                    },
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=200,
            )
            content = chat_completion.choices[0].message.content
            return content.strip() if content else self._fallback_checkin_feedback(
                habit_name, unit, target_level, trigger, mood, progress, note
            )
        except Exception as e:
            logger.error(f"Error generating check-in feedback: {e}", exc_info=True)
            return self._fallback_checkin_feedback(
                habit_name, unit, target_level, trigger, mood, progress, note
            )

    def _fallback_checkin_feedback(
        self,
        habit_name: str,
        unit: str,
        target_level: float,
        trigger: str,
        mood: str,
        progress: float,
        note: str | None,
    ) -> str:
        met_target = progress <= target_level
        if met_target:
            opening = f"You stayed at or below your target today — that's real progress on {habit_name.lower()}."
        elif mood == "struggled":
            opening = "Today was tough, and showing up to log it still counts."
        else:
            opening = f"You logged {progress} {unit} today — every honest check-in helps you improve."

        trigger_line = f"Your biggest challenge still seems to be {trigger.lower()}."
        tip = "Tomorrow, try planning one offline activity before your usual trigger time."

        if note and note.strip():
            return f"{opening} {trigger_line} {tip}"

        return f"{opening} {trigger_line} {tip}"

    def _fallback_plan(
        self,
        habit_name: str,
        unit: str,
        current_level: float,
        target_level: float,
        trigger: str,
        motivation: str
    ) -> str:
        """Offline/error fallback generator to guarantee the app remains functional."""
        return f"""### Goal
Reduce {habit_name} from {current_level} {unit} to {target_level} {unit}.

### Main Trigger
Your trigger is **"{trigger}"**. Intercepting this craving early is key to succeeding. Try to notice when this trigger happens and take a deep breath before reacting.

### Your Motivations
You are doing this for: **"{motivation}"**. Whenever you feel tempted, visualize how achieving this will improve your daily life.

### Today's Actions
1. **Notice the Cue**: The next time you experience "{trigger}", wait 10 minutes before engaging in the habit.
2. **Friction Setup**: Make it harder to access {habit_name} during your peak trigger times.
3. **Replacement Habit**: Switch to a healthy alternative (like drinking water, taking a walk, or reading a page of a book) when the urge arises.
"""

    def generate_insights(
        self,
        habit_name: str,
        unit: str,
        target_level: float,
        trigger: str,
        motivation: str,
        checkins: list,
        urges: list
    ) -> dict:
        """
        Generate AI insights based on habit, check-ins, and urges history.
        Returns a dictionary with biggestTrigger, pattern, progressText, and recommendation.
        """
        if not self.client or len(checkins) < 2:
            return self._fallback_insights(habit_name, trigger, checkins, urges)

        # Reverse checkins/urges because they usually come sorted desc (newest first)
        # Wait, I should just assume they might be sorted newest first and take the first few
        recent_checkins = ", ".join(f"{c.progress} {unit} (mood: {c.mood})" for c in list(reversed(checkins))[-7:])
        recent_urges = ", ".join(f"felt {u.feeling}, outcome: {u.outcome}" for u in list(reversed(urges))[-5:])

        prompt = f"""
You are an analytical behavior-change coach. Analyze the user's history and extract insights.

Habit: {habit_name}
Trigger: {trigger}
Motivation: {motivation}

Recent check-ins (oldest to newest): {recent_checkins}
Recent urges (oldest to newest): {recent_urges if recent_urges else "No urges logged."}

Generate structured JSON with exactly these 4 keys:
- "biggestTrigger": string (short label of their most common trigger)
- "pattern": string (1-2 sentences identifying a behavioral pattern)
- "progressText": string (1-2 sentences on their overall progress)
- "recommendation": string (1-2 sentences with a concrete recommendation)

Output ONLY valid JSON without any markdown formatting.
"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an analytical behavioral coach. You always respond in valid JSON without any markdown formatting or markdown code blocks. Output exactly the raw JSON."},
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
                temperature=0.5,
                max_tokens=300,
            )
            content = chat_completion.choices[0].message.content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            import json
            return json.loads(content.strip())
        except Exception as e:
            logger.error(f"Error generating insights: {e}", exc_info=True)
            return self._fallback_insights(habit_name, trigger, checkins, urges)

    def _fallback_insights(self, habit_name: str, trigger: str, checkins: list, urges: list) -> dict:
        resisted = sum(1 for u in urges if u.outcome == "resisted")
        pattern = "Log a few check-ins to reveal your patterns."
        if len(checkins) >= 2:
            pattern = "Your progress has been steady with a mix of good and okay days."
        
        if len(urges) >= 2:
            pattern = f"You've logged {len(urges)} urges and resisted {resisted}. Most urges tie back to {trigger.lower()}."

        progressText = "Start logging daily check-ins to track your improvement."
        if len(checkins) >= 2:
            # checkins are newest first, so last element in the list is the oldest
            first = checkins[-1].progress
            latest = checkins[0].progress
            if first > 0:
                improvement = round(((first - latest) / first) * 100)
                if improvement > 0:
                    progressText = f"Usage has decreased by {improvement}% since you started tracking."

        return {
            "biggestTrigger": trigger,
            "pattern": pattern,
            "progressText": progressText,
            "recommendation": f"Create a routine around your trigger: '{trigger}'. Small replacements beat willpower alone."
        }
