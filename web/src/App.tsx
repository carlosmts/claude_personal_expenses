import { Route, Routes } from 'react-router-dom';
import { ComingSoon } from './components/ComingSoon';
import { Layout } from './components/Layout';
import { DashboardPage } from './features/home/DashboardPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<ComingSoon title="Transactions" />} />
        <Route path="/report" element={<ComingSoon title="Report" />} />
        <Route path="/plan" element={<ComingSoon title="Plan" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
      </Routes>
    </Layout>
  );
}

export default App;
