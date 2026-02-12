/**
 * Calculate overall plan progress percentage
 */
export function calculateProgress(plan) {
  if (!plan?.schedule) return 0;
  const totalTasks = plan.schedule.reduce((acc, day) => acc + (day.tasks?.length || 0), 0);
  if (totalTasks === 0) return 0;
  const completedCount = plan.completedTasks?.length || 0;
  return Math.min(100, Math.round((completedCount / totalTasks) * 100));
}

/**
 * Get today's tasks from a plan
 */
export function getTodayTasks(plan) {
  if (!plan?.schedule) return [];
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = plan.schedule.find((day) => day.date === today);
  return todaySchedule?.tasks || [];
}

/**
 * Count total number of tasks in a plan
 */
export function getTotalTasks(plan) {
  if (!plan?.schedule) return 0;
  return plan.schedule.reduce((acc, day) => acc + (day.tasks?.length || 0), 0);
}

/**
 * Get unique subjects from a plan
 */
export function getUniqueSubjects(plan) {
  if (!plan?.schedule) return [];
  const subjects = new Set();
  plan.schedule.forEach((day) => {
    day.tasks?.forEach((task) => {
      if (task.subject) subjects.add(task.subject);
    });
  });
  return [...subjects];
}

/**
 * Calculate total study hours from a plan
 */
export function getTotalHours(plan) {
  if (!plan?.schedule) return 0;
  let total = 0;
  plan.schedule.forEach((day) => {
    day.tasks?.forEach((task) => {
      const match = task.duration?.match(/[\d.]+/);
      if (match) total += parseFloat(match[0]);
    });
  });
  return Math.round(total * 10) / 10;
}

/**
 * Get task type color
 */
export function getTaskTypeColor(type) {
  const colors = {
    study: '#6366f1',
    practice: '#06b6d4',
    revision: '#f59e0b',
    break: '#10b981',
  };
  return colors[type] || '#6366f1';
}

/**
 * Get task type label
 */
export function getTaskTypeLabel(type) {
  const labels = {
    study: '📚 Study',
    practice: '💻 Practice',
    revision: '🔄 Revision',
    break: '☕ Break',
  };
  return labels[type] || '📝 Task';
}

/**
 * Calculate priority weight for sorting
 */
export function priorityWeight(priority) {
  const weights = { High: 3, Medium: 2, Low: 1 };
  return weights[priority] || 1;
}
