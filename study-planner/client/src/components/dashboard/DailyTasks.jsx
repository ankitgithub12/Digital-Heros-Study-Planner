import { motion } from 'framer-motion';
import { getTaskTypeColor, getTaskTypeLabel } from '../../lib/utils/calculations';
import usePlanStore from '../../store/planStore';

export default function DailyTasks({ plan, dayIndex }) {
  const toggleTask = usePlanStore((s) => s.toggleTask);

  if (!plan?.schedule?.[dayIndex]) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-muted)',
        }}
      >
        <p style={{ fontSize: '48px', marginBottom: '12px' }}>📅</p>
        <p style={{ fontSize: '15px', fontWeight: 500 }}>No tasks scheduled for today</p>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>Enjoy your break or review previous topics!</p>
      </div>
    );
  }

  const day = plan.schedule[dayIndex];
  const tasks = day.tasks || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {day.theme || "Today's Tasks"}
        </h3>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--primary)',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
          }}
        >
          {tasks.length} tasks
        </span>
      </div>

      {tasks.map((task, taskIdx) => {
        const taskKey = `${dayIndex}-${taskIdx}`;
        const isCompleted = plan.completedTasks?.includes(taskKey);

        return (
          <motion.div
            key={taskIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: taskIdx * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px',
              borderRadius: '10px',
              background: isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-primary)',
              border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'var(--border)'}`,
              transition: 'all 0.2s',
              opacity: isCompleted ? 0.7 : 1,
            }}
          >
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={isCompleted}
              onChange={() => toggleTask(plan.id, dayIndex, taskIdx)}
              style={{ marginTop: '2px' }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                  }}
                >
                  {task.topic || task.subject}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: `${getTaskTypeColor(task.type)}15`,
                    color: getTaskTypeColor(task.type),
                  }}
                >
                  {getTaskTypeLabel(task.type)}
                </span>
              </div>
              {task.description && (
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </p>
              )}
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginTop: '4px',
                  display: 'inline-block',
                }}
              >
                ⏱ {task.duration}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
