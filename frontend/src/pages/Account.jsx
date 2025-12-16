import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

import EditProfile from "../components/EditProfile";
import AddItem from "../components/AddItem";
import YourItems from "../components/YourItems";

const Account = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.email) navigate("/register");
  }, [auth, navigate]);

  return (
    <div className="container py-4">
      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-lg-8 col-12">
          <AddItem />
          <div className="mt-4">
            <YourItems />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4 col-12">
          <EditProfile />
        </div>

      </div>
    </div>
  );
};

export default Account;