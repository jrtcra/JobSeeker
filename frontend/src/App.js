import { BrowserRouter as Router, Routes, Route } from "react-router"
import Login from "./components/login/Login"
import Signup from "./components/login/Signup"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </Router>
  )
}

export default App
