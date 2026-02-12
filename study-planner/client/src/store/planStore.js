import { create } from 'zustand';
import api from '../lib/api';

const loadFromLocalStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const usePlanStore = create((set, get) => ({
  // Plans
  plans: [],
  activePlanId: null,
  isLoading: false,
  error: null,

  // Fetch all plans
  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/plans');
      // If we have plans, set the last one as active if no active plan is set
      const activeId = get().activePlanId;
      /*
       * Logic to determine active plan:
       * 1. If currently active plan exists in new data, keep it.
       * 2. If not, default to the last created plan.
       */
      const isValidActive = data.find((p) => p.id === activeId);
      const newActiveId = isValidActive ? activeId : (data.length > 0 ? data[data.length - 1].id : null);

      set({ plans: data, activePlanId: newActiveId, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to fetch plans:', error);
    }
  },

  // Add a new plan
  addPlan: async (planData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/plans', planData);
      set((state) => ({
        plans: [...state.plans, data],
        activePlanId: data.id,
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error('Failed to add plan:', error);
      throw error;
    }
  },

  // Delete a plan
  deletePlan: async (planId) => {
    try {
      await api.delete(`/plans/${planId}`);
      set((state) => {
        const updated = state.plans.filter((p) => p.id !== planId);
        const newActive = state.activePlanId === planId ? (updated.length > 0 ? updated[updated.length - 1].id : null) : state.activePlanId;
        return { plans: updated, activePlanId: newActive };
      });
    } catch (error) {
      console.error('Failed to delete plan:', error);
      // Optimistic update failed? For now just log error.
      // In a real app we might want to rollback or show a toast.
    }
  },

  // Set active plan (client-side state only)
  setActivePlan: (planId) => {
    set({ activePlanId: planId });
  },

  // Get active plan getter
  getActivePlan: () => {
    const state = get();
    return state.plans.find((p) => p.id === state.activePlanId) || null;
  },

  // Toggle task completion
  toggleTask: async (planId, dayIndex, taskIndex) => {
    const state = get();
    const plan = state.plans.find((p) => p.id === planId);
    if (!plan) return;

    const taskKey = `${dayIndex}-${taskIndex}`;
    const completedTasks = plan.completedTasks.includes(taskKey)
      ? plan.completedTasks.filter((t) => t !== taskKey)
      : [...plan.completedTasks, taskKey];

    // Calculate progress
    // (Note: This logic is duplicated from calculations util, but needed for store update)
    // We could just pass the new completedTasks to backend and let backend calc progress,
    // but the backend endpoint accepts progress.
    // Let's recalculate it here for the payload.
    const totalTasks = plan.schedule
      ? plan.schedule.reduce((acc, day) => acc + (day.tasks?.length || 0), 0)
      : 1;
    const progress = Math.round((completedTasks.length / totalTasks) * 100);

    // Optimistic update
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId ? { ...p, completedTasks, progress } : p
      ),
    }));

    try {
      await api.patch(`/plans/${planId}`, { completedTasks, progress });
    } catch (error) {
      console.error('Failed to update task:', error);
      // Rollback would go here
    }
  },

  // Update plan with AI-generated schedule
  updatePlanSchedule: async (planId, schedule) => {
    // Optimistic
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === planId ? { ...p, schedule } : p
      ),
    }));

    try {
      await api.patch(`/plans/${planId}`, { schedule });
    } catch (error) {
      console.error('Failed to update schedule:', error);
    }
  },

  // Get streak (Still local for now as it's user-specific, not plan-specific)
  getStreak: () => {
    // const state = get(); // unused
    const today = new Date().toDateString();
    const streakData = loadFromLocalStorage('studyflow_streak', { count: 0, lastDate: '' });
    if (streakData.lastDate === today) return streakData.count;
    return streakData.count;
  },

  // Update streak
  updateStreak: () => {
    const today = new Date().toDateString();
    const streakData = loadFromLocalStorage('studyflow_streak', { count: 0, lastDate: '' });
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (streakData.lastDate === today) return streakData.count;
    if (streakData.lastDate === yesterday) {
      const newStreak = { count: streakData.count + 1, lastDate: today };
      saveToLocalStorage('studyflow_streak', newStreak);
      return newStreak.count;
    }
    const newStreak = { count: 1, lastDate: today };
    saveToLocalStorage('studyflow_streak', newStreak);
    return newStreak.count;
  },
}));

export default usePlanStore;
