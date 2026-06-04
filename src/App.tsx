import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Game from '@/pages/Game';
import History from '@/pages/History';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
