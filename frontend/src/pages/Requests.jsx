import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../assets/css/Cart.css";

const API_BASE = "http://localhost:5000/api";
const USERS_API = `${API_BASE}/users`;
const PRODUCTS_API = `${API_BASE}/products`;

const Requests = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!auth?.email) navigate("/register");
  }, [auth, navigate]);

  // ============================
  // LOAD REQUESTS
  // ============================
  useEffect(() => {
    const loadRequests = async () => {
      if (!auth?.id) return;

      setLoading(true);

      const usersRes = await fetch(USERS_API);
      const users = await usersRes.json();

      const prodRes = await fetch(PRODUCTS_API);
      const allProducts = await prodRes.json();
      setProducts(allProducts);

      const myProductIds = allProducts
        .filter((p) => String(p.user?.id || p.user) === String(auth.id))
        .map((p) => p.id);

      const incoming = [];

      users.forEach((user) => {
        if (user.id === auth.id) return;

        Object.entries(user.cart || {}).forEach(([cartKey, entry]) => {
          if (myProductIds.includes(entry.item) && entry.status === "waiting") {
            incoming.push({
              fromUserId: user.id,
              cartKey,
              ...entry,
            });
          }
        });
      });

      setRequests(incoming);
      setLoading(false);
    };

    loadRequests();
  }, [auth]);

  // ============================
  // UPDATE REQUEST STATUS
  // ============================
  const updateRequestStatus = async (req, newStatus) => {
    try {
      const userRes = await fetch(`${USERS_API}/${req.fromUserId}`);
      const userData = await userRes.json();

      const updatedCart = {
        ...userData.cart,
        [req.cartKey]: {
          ...userData.cart[req.cartKey],
          status: newStatus,
        },
      };

      await fetch(`${USERS_API}/${req.fromUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });

      setRequests((prev) =>
        prev.filter(
          (r) =>
            !(
              r.fromUserId === req.fromUserId &&
              r.cartKey === req.cartKey
            )
        )
      );
    } catch (err) {
      console.error("Failed to update request", err);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="sectionTitle">Trading Requests</h1>

      <div className="mt-4">

        {/* HEADER */}
        <div className="cart-header">
          <span>Your Item</span>
          <span>They Offer</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && (
          <p className="text-center mt-3">Loading...</p>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-center mt-3">No trading requests.</p>
        )}

        {/* ROWS */}
        {!loading && requests.map((req, idx) => {
          const myItem = products.find((p) => p.id === req.item);
          const theirItem = products.find((p) => p.id === req.tradeitem);

          return (
            <div key={idx} className="cart-row">
              <div>{myItem?.title || "Loading..."}</div>
              <div>{theirItem?.title || "Loading..."}</div>

              <div>
                <span className="status waiting">Waiting</span>
              </div>

              <div className="cart-actions">
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => updateRequestStatus(req, "approved")}
                >
                  Approve
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => updateRequestStatus(req, "denied")}
                >
                  Deny
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;