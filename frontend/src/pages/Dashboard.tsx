import { AssignmentSummaryTable } from "../component/AssignmentSummaryTable"
import { TimelineChart } from "../component/TimeLineChart"
import { TeamLoadPieChart } from "../component/TeamLoadPieChart "
import { ManagerNavbar } from "../component/ManagerNavbar"

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