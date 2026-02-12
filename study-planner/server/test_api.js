import axios from 'axios';

const API_URL = 'http://localhost:5000/api/plans';

const testPlan = {
  goalName: 'Test Plan',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  dailyHours: 2,
  topics: [{ id: '1', name: 'Math', priority: 'High' }],
  learningStyle: 'Balanced',
  difficulty: 'Beginner',
  schedule: [],
};

async function testCreatePlan() {
  try {
    console.log('Creating test plan...');
    const response = await axios.post(API_URL, testPlan);
    console.log('Plan created:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('Error creating plan:', error.response?.data || error.message);
  }
}

async function testGetPlans() {
  try {
    console.log('Fetching plans...');
    const response = await axios.get(API_URL);
    console.log('Plans fetched:', response.data.length);
  } catch (error) {
    console.error('Error fetching plans:', error.message);
  }
}

async function runTest() {
  const planId = await testCreatePlan();
  if (planId) {
    await testGetPlans();
  }
}

runTest();
