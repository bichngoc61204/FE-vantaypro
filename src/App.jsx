import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SignIn from './pages/SignIn';

// Import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/main-theme.css';
import './assets/css/custom.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<SignIn />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

