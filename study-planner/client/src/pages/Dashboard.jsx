import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import usePlanStore from '../store/planStore';
import StatsCards from '../components/dashboard/StatsCards';
import DailyTasks from '../components/dashboard/DailyTasks';
import ProgressBar from '../components/dashboard/ProgressBar';
import CalendarView from '../components/dashboard/CalendarView';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/Loader';
import { getDaysRemaining, formatDate, getTodayISO } from '../lib/utils/dates';
import { getTotalTasks, getUniqueSubjects, getTotalHours, calculateProgress } from '../lib/utils/calculations';

export default function Dashboard() {
  const plans = usePlanStore((s) => s.plans);
  const deletePlan = usePlanStore((s) => s.deletePlan);
  const getStreak = usePlanStore((s) => s.getStreak);
  const fetchPlans = usePlanStore((s) => s.fetchPlans);
  const isLoading = usePlanStore((s) => s.isLoading);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const [deleteModal, setDeleteModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const activePlan = plans.length > 0 ? plans[plans.length - 1] : null;

  // Compute stats
  const stats = useMemo(() => {
    if (!activePlan) return { daysLeft: 0, topics: 0, hours: 0, streak: 0 };
    return {
      daysLeft: getDaysRemaining(activePlan.deadline),
      topics: getUniqueSubjects(activePlan).length || activePlan.topics?.length || 0,
      hours: getTotalHours(activePlan),
      streak: getStreak(),
    };
  }, [activePlan, getStreak]);

  // Progress chart data
  const progressData = useMemo(() => {
    if (!activePlan) return [];
    const progress = calculateProgress(activePlan);
    return [
      { name: 'Completed', value: progress, color: '#10b981' },
      { name: 'Remaining', value: 100 - progress, color: 'var(--border)' },
    ];
  }, [activePlan]);

  // Find today's schedule index
  const todayIndex = useMemo(() => {
    if (!activePlan?.schedule) return -1;
    return activePlan.schedule.findIndex((d) => d.date === selectedDate);
  }, [activePlan, selectedDate]);

  const handleDelete = (planId) => {
    deletePlan(planId);
    setDeleteModal(null);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {greeting()} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Link to="/dashboard/new" style={{ textDecoration: 'none' }}>
          <Button>
            <FiPlus size={16} /> New Plan
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div style={{ marginBottom: '32px' }}>
        <StatsCards stats={stats} />
      </div>

      {plans.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
          }}
        >
          <p style={{ fontSize: '64px', marginBottom: '16px' }}>📚</p>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            No study plans yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
            Create your first AI-powered study plan to get started with personalized scheduling.
          </p>
          <Link to="/dashboard/new" style={{ textDecoration: 'none' }}>
            <Button size="lg">
              <FiPlus size={16} /> Create Your First Plan
            </Button>
          </Link>
        </motion.div>
      ) : (
        /* Dashboard Content */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start',
          }}
          className="dashboard-grid"
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Progress */}
            {activePlan && (
              <Card hover={false}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
                      {activePlan.goalName}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Deadline: {formatDate(activePlan.deadline)}
                    </p>
                    <ProgressBar progress={calculateProgress(activePlan)} />
                  </div>

                  {/* Pie Chart */}
                  <div style={{ width: '120px', height: '120px' }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          strokeWidth={0}
                        >
                          {progressData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            )}

            {/* Today's Tasks */}
            {activePlan && (
              <Card hover={false}>
                <DailyTasks plan={activePlan} dayIndex={todayIndex >= 0 ? todayIndex : 0} />
              </Card>
            )}

            {/* Active Plans */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
                Your Study Plans
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                          {plan.goalName}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {formatDate(plan.deadline)} · {plan.topics?.length || 0} topics
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal(plan.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '4px',
                        }}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <ProgressBar
                      progress={calculateProgress(plan)}
                      label=""
                      height={6}
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Link to={`/plan/${plan.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outline" size="sm" style={{ width: '100%' }}>
                          View Plan <FiArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <Card hover={false}>
              <CalendarView
                plan={activePlan}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </Card>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Plan"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Are you sure you want to delete this plan? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteModal)}>
            Delete
          </Button>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
