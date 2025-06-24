import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from './pages/Signup'
import Home from './pages/Home'

function Routing() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
           <Route path='/home' element={<Home />} />
        </Routes>
    )
}

export default Routing