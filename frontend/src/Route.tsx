import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from './pages/Signup'
import Home from './pages/Home'
import { EngineerListPage } from './pages/EngineerListPage'
import Dashboard from './pages/Dashboard'

function Routing() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home />} />
            <Route path='/engineer' element={<EngineerListPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
    )
}

export default Routing