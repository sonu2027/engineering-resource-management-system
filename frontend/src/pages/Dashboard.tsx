import { AssignmentSummaryTable } from "../components/AssignmentSummaryTable"
import { TimelineChart } from "../components/TimeLineChart"
import { TeamLoadPieChart } from "../components/TeamLoadPieChart "
import { ManagerNavbar } from "../components/ManagerNavbar"

function Dashboard() {
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