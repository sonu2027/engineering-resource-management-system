import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from './pages/Signup'
import Home from './pages/Home'
import { EngineerListPage } from './pages/EngineerListPage'
import Dashboard from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { Profile } from './pages/Profile'
import { ResetPassword } from './pages/ResetPassword'
import ChangePassword from './pages/ChangePassword'
import Message from './pages/Message.jsx'

function Routing() {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/profile' element={< Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/home' element={<Home />} />
            <Route path='/engineer' element={<EngineerListPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/message' element={<Message />} />
        </Routes>
    )
}

export default Routing