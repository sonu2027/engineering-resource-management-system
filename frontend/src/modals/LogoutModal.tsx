import { Button } from "../components/ui/button"
import { logoutUser } from "../apiCall/logoutUser";

type LogoutModalProps = {
  setLogout: React.Dispatch<React.SetStateAction<boolean>>;
};

function LogoutModal({ setLogout }: LogoutModalProps) {

  const handleLogout = async () => {
    await logoutUser()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setLogout(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal