import { useUser } from "../context/UseProvider";
import ManagerHome from "../component/ManagerHome";
import EngineerHome from "../component/EngineerHome";
import { ManagerNavbar } from "../component/ManagerNavbar";
import { EngineerNavbar } from "../component/EngineerNavbar";

function Home() {

  const { user } = useUser();

  if (user?.role === "manager") {
    return (
      <>
        <ManagerNavbar />
        <ManagerHome /></>
    )
  }
  return (
    <>
      <EngineerNavbar />
      <EngineerHome />
    </>
  )
}

export default Home