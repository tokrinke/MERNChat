import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import LogIn from "./pages/login";
import ProtectedRoute from './components/protectedRoute';
import Settings from './pages/settings';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>}>
          </Route>
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>}>
          </Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<LogIn />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
