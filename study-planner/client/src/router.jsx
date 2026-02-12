import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PlanDetail from './pages/PlanDetail';
import StudyForm from './components/forms/StudyForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'dashboard/new', element: <StudyForm /> },
      { path: 'plan/:id', element: <PlanDetail /> },
    ],
  },
]);

export default router;
