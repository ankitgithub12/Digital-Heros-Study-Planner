import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import usePlanStore from '../store/planStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/dashboard/ProgressBar';
import DailyTasks from '../components/dashboard/DailyTasks';
import { formatDate, getDayName, getDaysRemaining, isTodayDate, isPastDate } from '../lib/utils/dates';
import { calculateProgress, getTotalTasks, getTotalHours } from '../lib/utils/calculations';
import toast from 'react-hot-toast';
import Loader from '../components/ui/Loader';

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plans = usePlanStore((s) => s.plans);
  const deletePlan = usePlanStore((s) => s.deletePlan);
  const fetchPlans = usePlanStore((s) => s.fetchPlans);
  const isLoading = usePlanStore((s) => s.isLoading);

  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, [plans.length, fetchPlans]);

  const [expandedDay, setExpandedDay] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const plan = useMemo(() => plans.find((p) => p.id === id), [plans, id]);

  if (isLoading && !plan) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <Loader text="Loading plan details..." />
      </div>
    );
  }

  if (!plan) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <p style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</p>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
          Plan not found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          This study plan doesn't exist or may have been deleted.
        </p>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button>
            <FiArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const progress = calculateProgress(plan);
  const totalTasks = getTotalTasks(plan);
  const completedCount = plan.completedTasks?.length || 0;
  const totalHours = getTotalHours(plan);
  const daysLeft = getDaysRemaining(plan.deadline);

  const handleDelete = () => {
    deletePlan(plan.id);
    toast.success('Plan deleted');
    navigate('/dashboard');
  };

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text(plan.goalName || 'Study Plan', 20, 20);

      doc.setFontSize(12);
      doc.text(`Deadline: ${formatDate(plan.deadline)}`, 20, 35);
      doc.text(`Progress: ${progress}%`, 20, 45);
      doc.text(`Total Tasks: ${totalTasks}`, 20, 55);

      let y = 70;
      if (plan.schedule) {
        plan.schedule.forEach((day) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(14);
          doc.text(`Day ${day.day} - ${formatDate(day.date)} - ${day.theme}`, 20, y);
          y += 10;

          doc.setFontSize(10);
          day.tasks?.forEach((task) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(`  * [${task.type}] ${task.topic} (${task.duration})`, 25, y);
            y += 7;
          });
          y += 5;
        });
      }

      doc.save(`${plan.goalName || 'study-plan'}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  // Find today's day index
  const todayIndex = plan.schedule?.findIndex((d) => isTodayDate(d.date)) ?? -1;

  // Auto-expand today
  const effectiveExpanded = expandedDay ?? (todayIndex >= 0 ? todayIndex : 0);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Button */}
      <Link
        to="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '24px',
          fontWeight: 500,
        }}
      >
        <FiArrowLeft size={16} /> Back to Dashboard
      </Link>

      {/* Plan Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {plan.goalName}
            </h1>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>📅 Deadline: {formatDate(plan.deadline)}</span>
              <span>⏱ {totalHours}h total</span>
              <span>📋 {totalTasks} tasks</span>
              <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" size="sm" onClick={handleExportPDF}>
              <FiDownload size={14} /> Export PDF
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
              <FiTrash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '24px' }}>
          <ProgressBar progress={progress} />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {completedCount} of {totalTasks} tasks completed
          </p>
        </div>
      </motion.div>

      {/* Tips */}
      {plan.schedule && plan.schedule[0]?.tasks && (
        <Card hover={false} style={{ marginBottom: '24px', padding: '20px 24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>💡 Study Tips</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(plan.tips || ['Stay consistent with your daily hours', 'Take breaks every 45 minutes', 'Review previous material regularly']).map((tip, i) => (
              <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--primary)' }}>•</span> {tip}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Day-by-Day Schedule */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
          📅 Day-by-Day Schedule
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {plan.schedule?.map((day, dayIdx) => {
            const isExpanded = effectiveExpanded === dayIdx;
            const isToday = isTodayDate(day.date);
            const isPast = isPastDate(day.date);
            const dayCompleted = day.tasks?.every((_, tIdx) =>
              plan.completedTasks?.includes(`${dayIdx}-${tIdx}`)
            );

            return (
              <motion.div
                key={dayIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.02 }}
              >
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? -1 : dayIdx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                    border: `1px solid ${isToday ? 'var(--primary)' : 'var(--border)'}`,
                    borderBottom: isExpanded ? 'none' : undefined,
                    background: isToday
                      ? 'rgba(99, 102, 241, 0.06)'
                      : dayCompleted
                        ? 'rgba(16, 185, 129, 0.04)'
                        : 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Day Number */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: dayCompleted
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : isToday
                          ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                          : 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: dayCompleted || isToday ? 'white' : 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    {dayCompleted ? '✓' : day.day}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {day.theme}
                      </span>
                      {isToday && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'var(--primary)',
                            color: 'white',
                          }}
                        >
                          TODAY
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {getDayName(day.date)} · {formatDate(day.date)} · {day.tasks?.length || 0} tasks
                    </span>
                  </div>

                  {isExpanded ? <FiChevronUp size={18} color="var(--text-muted)" /> : <FiChevronDown size={18} color="var(--text-muted)" />}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        overflow: 'hidden',
                        borderRadius: '0 0 12px 12px',
                        border: `1px solid ${isToday ? 'var(--primary)' : 'var(--border)'}`,
                        borderTop: 'none',
                        padding: '20px',
                        background: 'var(--bg-card)',
                      }}
                    >
                      <DailyTasks plan={plan} dayIndex={dayIdx} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Plan">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Are you sure you want to delete "{plan.goalName}"? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Plan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
