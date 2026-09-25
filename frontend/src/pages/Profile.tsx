import ProfileHeader from "../components/ProfileHeader";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import { loginPath } from "../paths";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(loginPath());
  };

  return (
    <div className="w-[90%] min-h-160 flex">
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
        <ProfileHeader />
        <div className="p-4 text-slate-200">
          <h2 className="text-lg font-medium mb-2">Profile</h2>
          <div className="text-sm text-slate-300 space-y-2">
            <div>
              <span className="font-medium">Name:</span> {user?.name || "-"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user?.email || "-"}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="text-slate-400">This area can be used for profile settings.</div>
      </div>
    </div>
  );
}
