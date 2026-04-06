import { LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/landing", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F1FB] px-6">

      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] p-12 rounded w-full max-w-xl text-center flex flex-col items-center gap-6 animate-slideInUp">

        <div className="w-24 h-24 bg-[#5D0CA0] border-2 border-black rounded-full flex items-center justify-center text-white">
          <LogOut size={40} />
        </div>

        <h1 className="text-3xl font-bold">
          Are you sure?
        </h1>

        <p className="text-gray-600 max-w-md">
          You are about to log out from your account.
          Any unsaved changes may be lost.
        </p>

        <div className="flex gap-6 mt-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border-2 border-black px-6 py-3 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2 hover:translate-y-[2px] hover:shadow-none transition"
          >
            <ArrowLeft size={18} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            Log Out
          </button>

        </div>

      </div>
    </div>
  );
};
