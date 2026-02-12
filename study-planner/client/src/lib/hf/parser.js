/**
 * Parse the AI response to extract a valid study plan JSON.
 * Handles cases where the model returns extra text or markdown around the JSON.
 */
export function parseStudyPlanResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return generateFallbackPlan();
  }

  try {
    // Try direct parse first
    const parsed = JSON.parse(rawText.trim());
    if (isValidPlan(parsed)) return parsed;
  } catch {
    // Continue to extraction
  }

  // Try to extract JSON from text
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (isValidPlan(parsed)) return parsed;
    } catch {
      // Continue to fallback
    }
  }

  // Return fallback plan
  return generateFallbackPlan();
}

function isValidPlan(plan) {
  return (
    plan &&
    typeof plan === 'object' &&
    Array.isArray(plan.schedule) &&
    plan.schedule.length > 0 &&
    plan.schedule[0].tasks &&
    Array.isArray(plan.schedule[0].tasks)
  );
}

/**
 * Generate a sample/fallback plan when AI parsing fails
 */
export function generateFallbackPlan(formData = {}) {
  const {
    goalName = 'Study Plan',
    deadline = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    dailyHours = 3,
    topics = [{ name: 'General Study', priority: 'High' }],
  } = formData;

  const startDate = new Date();
  const endDate = new Date(deadline);
  const totalDays = Math.max(1, Math.ceil((endDate - startDate) / 86400000));
  const schedule = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const isRevisionDay = (i + 1) % 4 === 0;

    const dayTasks = [];
    if (isRevisionDay) {
      dayTasks.push({
        subject: 'Revision',
        topic: 'Review previous topics',
        duration: `${dailyHours} hours`,
        type: 'revision',
        description: 'Review and consolidate material from the past 3 days',
      });
    } else {
      const topicIndex = i % topics.length;
      const topic = topics[topicIndex];
      const studyTime = Math.max(1, dailyHours - 0.5);

      dayTasks.push({
        subject: topic.name,
        topic: `${topic.name} - Day ${Math.floor(i / topics.length) + 1}`,
        duration: `${studyTime} hours`,
        type: 'study',
        description: `Focus on ${topic.name} concepts and fundamentals`,
      });
      dayTasks.push({
        subject: topic.name,
        topic: 'Practice',
        duration: '0.5 hours',
        type: 'practice',
        description: `Practice exercises for ${topic.name}`,
      });
    }

    schedule.push({
      day: i + 1,
      date: currentDate.toISOString().split('T')[0],
      theme: isRevisionDay ? 'Revision Day' : topics[i % topics.length]?.name || 'Study',
      tasks: dayTasks,
    });
  }

  return {
    planName: goalName,
    totalDays,
    schedule,
    tips: [
      'Stay consistent with your daily study hours',
      'Take short breaks every 45 minutes',
      'Review previous material before starting new topics',
    ],
  };
}
