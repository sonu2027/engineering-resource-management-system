import { useUser } from "../context/UseProvider";
import ManagerHome from "../components/ManagerHome";
import EngineerHome from "../components/EngineerHome";
import { ManagerNavbar } from "../components/ManagerNavbar";
import { EngineerNavbar } from "../components/EngineerNavbar";
import { useEffect } from "react";
import { checkCookies } from "../apiCall/checkCookies";
import { useNavigate } from "react-router-dom";

function Home() {

  const { user } = useUser();
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