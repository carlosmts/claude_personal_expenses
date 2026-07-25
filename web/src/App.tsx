import { Route, Routes } from 'react-router-dom';
import { ComingSoon } from './components/ComingSoon';
import { Layout } from './components/Layout';
import { DashboardPage } from './features/home/DashboardPage';
import { PlanPage } from './features/plan/PlanPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/report" element={<ComingSoon title="Report" />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
