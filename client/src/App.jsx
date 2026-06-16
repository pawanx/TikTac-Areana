import { BrowserRouter,Routes,Route } from "react-router-dom"

import Auth from "./pages/Auth/Auth"
import ProtectedRoutes from "./routes/ProtectedRoutes"
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/dashboard" element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
