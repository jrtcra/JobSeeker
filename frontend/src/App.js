import { BrowserRouter as Router, Routes, Route } from "react-router"
import Login from "./components/login/Login"
import Signup from "./components/login/Signup"
import Profile from "./components/user/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  )
}

export default App
