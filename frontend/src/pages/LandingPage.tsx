import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/seprator";
import { checkCookies } from "../apiCall/checkCookies";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const LandingPage = () => {

  const navigate = useNavigate()
  
  useEffect(() => {
      checkCookies()
          .then((res) => {
              if (res.success) {
                  navigate("/home");
              }
          })
          .catch((error) => {
              console.log("error in home: ", error);
          })
  }, [])
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-xl shadow-md border border-gray-200">
        <CardContent className="p-8 text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            Engineer Resource Management
          </h1>
          <p className="text-gray-600 text-base">
            Manage your engineering teams efficiently. Visualize workload and assignments with ease.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link to="/login">
              <Button className="w-40">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="w-40">
                Sign Up
              </Button>
            </Link>
          </div>

          <Separator />

          <p className="text-sm text-muted-foreground">
            Built by Sonu 🚀 | Designed with ShadCN ✨
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
