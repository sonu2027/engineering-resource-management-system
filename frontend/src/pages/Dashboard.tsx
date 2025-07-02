import { AssignmentSummaryTable } from "../components/AssignmentSummaryTable"
import { TimelineChart } from "../components/TimeLineChart"
import { TeamLoadPieChart } from "../components/TeamLoadPieChart "
import { ManagerNavbar } from "../components/ManagerNavbar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { checkCookies } from "../apiCall/checkCookies"

function Dashboard() {

    const navigate = useNavigate()

    useEffect(() => {
        checkCookies()
            .then((res) => {
                if (!res.success) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.log("error in home: ", error);
                navigate("/login")
            })
    }, [])

    return (
        <>
            <ManagerNavbar />
            <div className="space-y-8 p-6">
                <h1 className="text-2xl font-semibold">Team Assignment Overview</h1>
                <TimelineChart />
                <AssignmentSummaryTable />
                <TeamLoadPieChart />
            </div></>

    )
}

export default Dashboard