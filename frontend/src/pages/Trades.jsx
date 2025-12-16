import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../assets/css/Cart.css";

const API_BASE = "http://localhost:5000/api";
const USERS_API = `${API_BASE}/users`;
const PRODUCTS_API = `${API_BASE}/products`;

const Trades = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [trades, setTrades] = useState([]);
  const [products, setProducts] = useState([]);

  // ============================
  // Redirect if not logged in
  // ============================
  useEffect(() => {
    if (!auth?.email) navigate("/register");
  }, [auth, navigate]);

  // ============================
  // Load trades from ALL users
  // ============================
  useEffect(() => {
    if (!auth?.id) return;

    const loadTrades = async () => {
      setLoading(true);

      const usersRes = await fetch(USERS_API);
      const users = await usersRes.json();

      const productsRes = await fetch(PRODUCTS_API);
      const productsData = await productsRes.json();
      setProducts(productsData);

      const myProductIds = productsData
        .filter((p) => String(p.user?.id || p.user) === String(auth.id))
        .map((p) => p.id);

      const collected = [];

      users.forEach((user) => {
        Object.entries(user.cart || {}).forEach(([key, entry]) => {
          if (
            entry.status === "complete" &&
            (myProductIds.includes(entry.item) ||
              myProductIds.includes(entry.tradeitem))
          ) {
            collected.push({ ...entry, cartKey: key });
          }
        });
      });

      setTrades(collected);
      setLoading(false);
    };

    loadTrades();
  }, [auth]);


  return (
    <div className="container py-4">
      <h1 className="sectionTitle">My Trades</h1>

      <div className="mt-4">

        {/* HEADER */}
        <div className="cart-header">
          <span>Product</span>
          <span>Trading With</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && (
          <p className="text-center mt-3">Loading...</p>
        )}

        {!loading && trades.length === 0 && (
          <p className="text-center mt-3 text-muted">
            No completed trades yet.
          </p>
        )}

        {!loading && trades.map((trade, idx) => {
          const item = products.find((p) => p.id === trade.item);
          const tradeItem = products.find((p) => p.id === trade.tradeitem);

          return (
            <div key={idx} className="cart-row">
              <div>{item?.title || "Loading..."}</div>
              <div>{tradeItem?.title || "Loading..."}</div>

              <div>
                <span className="status approved">Completed</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="keep-browsing-btn mt-4"
        onClick={() => navigate("/browse")}
      >
        Keep browsing
      </button>
    </div>
  );
};

export default Trades;