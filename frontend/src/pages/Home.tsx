import { useUser } from "../context/UseProvider";
import ManagerHome from "../components/ManagerHome";
import EngineerHome from "../components/EngineerHome";
import { ManagerNavbar } from "../components/ManagerNavbar";
import { EngineerNavbar } from "../components/EngineerNavbar";

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