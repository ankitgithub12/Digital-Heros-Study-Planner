import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiArrowRight, FiArrowLeft, FiCheck, FiZap } from 'react-icons/fi';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { useHuggingFace } from '../../hooks/useHuggingFace';
import usePlanStore from '../../store/planStore';
import { getMinDeadline, isPastDate } from '../../lib/utils/dates';
import toast from 'react-hot-toast';

const STEPS = ['Goal Setup', 'Topics', 'Preferences'];

export default function StudyForm() {
  const navigate = useNavigate();
  const { generatePlan, isLoading } = useHuggingFace();
  const addPlan = usePlanStore((s) => s.addPlan);
  const updatePlanSchedule = usePlanStore((s) => s.updatePlanSchedule);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  // Step 1: Goal
  const [goalName, setGoalName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [dailyHours, setDailyHours] = useState(3);

  // Step 2: Topics
  const [topics, setTopics] = useState([{ id: crypto.randomUUID(), name: '', priority: 'Medium' }]);

  // Step 3: Preferences
  const [learningStyle, setLearningStyle] = useState('Balanced');
  const [difficulty, setDifficulty] = useState('Intermediate');

  const addTopic = () => {
    setTopics((prev) => [...prev, { id: crypto.randomUUID(), name: '', priority: 'Medium' }]);
  };

  const removeTopic = (id) => {
    if (topics.length <= 1) return;
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTopic = (id, field, value) => {
    setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const validateStep = useCallback(() => {
    const newErrors = {};

    if (step === 0) {
      if (!goalName.trim()) newErrors.goalName = 'Goal name is required';
      if (!deadline) newErrors.deadline = 'Deadline is required';
      if (dailyHours < 0.5 || dailyHours > 8) newErrors.dailyHours = 'Must be between 0.5 and 8 hours';
      if (deadline && isPastDate(deadline)) newErrors.deadline = 'Deadline cannot be in the past';
    }

    if (step === 1) {
      const hasEmptyTopic = topics.some((t) => !t.name.trim());
      if (hasEmptyTopic) newErrors.topics = 'All topic names are required';
      if (topics.length === 0) newErrors.topics = 'At least one topic is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, goalName, deadline, dailyHours, topics]);

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const formData = {
      goalName,
      deadline,
      dailyHours,
      topics: topics.filter((t) => t.name.trim()),
      learningStyle,
      difficulty,
    };

    try {
      // Add plan to store first
      const newPlan = await addPlan(formData);

      // Generate AI schedule
      const planData = await generatePlan(formData);

      // Update plan with generated schedule
      updatePlanSchedule(newPlan.id, planData.schedule);

      toast.success('Study plan created successfully!');
      navigate(`/plan/${newPlan.id}`);
    } catch (err) {
      toast.error('Failed to create plan. Please try again.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          maxWidth: '640px',
          margin: '40px auto',
          padding: '0 24px',
        }}
      >
        <Loader text="Creating your personalized study plan..." />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '40px auto',
        padding: '0 24px',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Create Study Plan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Fill in your study details and let AI generate a personalized schedule.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '40px',
        }}
      >
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                background: i <= step ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--bg-card)',
                color: i <= step ? 'white' : 'var(--text-muted)',
                border: i <= step ? 'none' : '1px solid var(--border)',
                transition: 'all 0.3s ease',
              }}
            >
              {i < step ? <FiCheck size={16} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: i === step ? 600 : 500,
                color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: i < step ? 'var(--primary)' : 'var(--border)',
                  borderRadius: '1px',
                  transition: 'background 0.3s ease',
                  marginLeft: '8px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <motion.div
        className="glass-card"
        style={{ padding: '32px', cursor: 'default' }}
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Goal Setup */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div>
                <label className="form-label">Study Goal Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g., Final Exam Preparation"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
                {errors.goalName && (
                  <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.goalName}</p>
                )}
              </div>

              <div>
                <label className="form-label">Deadline</label>
                <input
                  className="form-input"
                  type="date"
                  min={getMinDeadline()}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                {errors.deadline && (
                  <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.deadline}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  Daily Study Hours: <span className="gradient-text" style={{ fontSize: '16px', fontWeight: 700 }}>{dailyHours}h</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    appearance: 'none',
                    background: `linear-gradient(to right, var(--primary) ${((dailyHours - 0.5) / 7.5) * 100}%, var(--border) ${((dailyHours - 0.5) / 7.5) * 100}%)`,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>0.5h</span>
                  <span>8h</span>
                </div>
                {errors.dailyHours && (
                  <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '4px' }}>{errors.dailyHours}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Topics */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Subjects / Topics
                </label>
                <Button variant="outline" size="sm" onClick={addTopic}>
                  <FiPlus size={14} /> Add Topic
                </Button>
              </div>

              {errors.topics && (
                <p style={{ color: 'var(--danger)', fontSize: '12px' }}>{errors.topics}</p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topics.map((topic, i) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'var(--bg-primary)',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        minWidth: '20px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Subject name"
                      value={topic.name}
                      onChange={(e) => updateTopic(topic.id, 'name', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <select
                      value={topic.priority}
                      onChange={(e) => updateTopic(topic.id, 'priority', e.target.value)}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                    <button
                      onClick={() => removeTopic(topic.id)}
                      disabled={topics.length <= 1}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: topics.length <= 1 ? 'not-allowed' : 'pointer',
                        color: topics.length <= 1 ? 'var(--text-muted)' : 'var(--danger)',
                        padding: '4px',
                        display: 'flex',
                        opacity: topics.length <= 1 ? 0.3 : 1,
                      }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Preferences */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
              {/* Learning Style */}
              <div>
                <label className="form-label">Learning Style</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Theory first', 'Practice heavy', 'Balanced'].map((style) => (
                    <label
                      key={style}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderRadius: '10px',
                        border: `1px solid ${learningStyle === style ? 'var(--primary)' : 'var(--border)'}`,
                        background: learningStyle === style ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <input
                        type="radio"
                        name="learningStyle"
                        value={style}
                        checked={learningStyle === style}
                        onChange={() => setLearningStyle(style)}
                        style={{ display: 'none' }}
                      />
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${learningStyle === style ? 'var(--primary)' : 'var(--border)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        {learningStyle === style && (
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'var(--primary)',
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: learningStyle === style ? 600 : 500,
                          color: learningStyle === style ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {style}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="form-label">Difficulty Level</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: `1px solid ${difficulty === level ? 'var(--primary)' : 'var(--border)'}`,
                        background: difficulty === level ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-primary)',
                        color: difficulty === level ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: difficulty === level ? 600 : 500,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.2s',
                        minWidth: '100px',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 0}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
          >
            <FiArrowLeft size={16} />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Next Step
              <FiArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={isLoading}>
              <FiZap size={16} />
              Generate Plan
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
