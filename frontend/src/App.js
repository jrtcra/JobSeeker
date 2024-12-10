import { BrowserRouter as Router, Routes, Route } from "react-router"
import Login from "./components/login/Login"
import Signup from "./components/login/Signup"
import Profile from "./components/user/Profile"
import Home from "./components/home/Home"
import Statistics from "./components/home/Statistics"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  )
}

export default App
