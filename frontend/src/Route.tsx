import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from './pages/Signup'
// import Dashboard from './pages/Dashboard.jsx'
// import Transaction from './pages/Transaction.jsx'
// import Budget from './pages/Budget.jsx'
// import RecoverPassword from './pages/RecoverPassword.jsx'

function Routing() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            {/* <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/transaction' element={<Transaction />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/recoverpassword' element={<RecoverPassword />} /> */} 
        </Routes>
    )
}

export default Routing