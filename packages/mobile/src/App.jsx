import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverApp from './pages/DriverApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/driver-app" element={<DriverApp />} />
        <Route path="/" element={<DriverApp />} />
      </Routes>
    </Router>
  );
}

export default App;
