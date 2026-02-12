export function buildStudyPlanPrompt({ goalName, deadline, dailyHours, topics, learningStyle, difficulty }) {
  const topicList = topics
    .map((t) => `- ${t.name} (Priority: ${t.priority})`)
    .join('\n');

  const today = new Date().toISOString().split('T')[0];

  return `<s>[INST] You are an expert study planner AI. Create a detailed, day-by-day study plan based on the following information.

STUDY GOAL: ${goalName}
START DATE: ${today}
DEADLINE: ${deadline}
DAILY STUDY HOURS: ${dailyHours} hours
LEARNING STYLE: ${learningStyle}
DIFFICULTY LEVEL: ${difficulty}

SUBJECTS/TOPICS:
${topicList}

INSTRUCTIONS:
1. Create a day-by-day study schedule from ${today} to ${deadline}
2. Break each day into specific tasks with time allocations
3. Prioritize high-priority topics accordingly
4. Include revision slots every 3-4 days
5. Add practice/exercise sessions based on learning style
6. Keep daily study time to ${dailyHours} hours
7. Include breaks and buffer time

RESPOND ONLY WITH A VALID JSON object in this EXACT format (no markdown, no extra text):
{
  "planName": "${goalName}",
  "totalDays": <number>,
  "schedule": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "Topic focus for the day",
      "tasks": [
        {
          "subject": "Subject name",
          "topic": "Specific topic",
          "duration": "X hours",
          "type": "study|practice|revision|break",
          "description": "What to do"
        }
      ]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}
[/INST]`;
}
