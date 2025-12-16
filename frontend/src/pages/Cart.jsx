import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "../assets/css/Cart.css";

const API_BASE = "http://localhost:5000/api";
const USERS_API = `${API_BASE}/users`;
const PRODUCTS_API = `${API_BASE}/products`;

const Cart = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [cartEntries, setCartEntries] = useState([]);
  const [products, setProducts] = useState([]);

  // ============================
  // REDIRECT IF NOT LOGGED IN
  // ============================
  useEffect(() => {
    if (!auth?.email) navigate("/register");
  }, [auth, navigate]);

  // ============================
  // LOAD CART + PRODUCTS
  // ============================
  useEffect(() => {
    if (!auth?.id) return;

    const loadData = async () => {
      setLoading(true);

      const userRes = await fetch(`${USERS_API}/${auth.id}`);
      const userData = await userRes.json();

      const visibleEntries = Object.entries(userData.cart || {})
        .filter(([_, entry]) => entry.status !== "complete")
        .map(([cartKey, entry]) => ({
          cartKey,
          ownerId: auth.id,
          ...entry,
        }));

      setCartEntries(visibleEntries);

      const prodRes = await fetch(PRODUCTS_API);
      const prodData = await prodRes.json();
      setProducts(prodData);

      setLoading(false);
    };

    loadData();
  }, [auth?.id]);


  // ============================
  // DELETE FROM CART
  // ============================
  const handleDelete = async (cartKeyToRemove) => {
    try {
      const userRes = await fetch(`${USERS_API}/${auth.id}`);
      const userData = await userRes.json();

      const newCart = { ...userData.cart };
      delete newCart[cartKeyToRemove];

      await fetch(`${USERS_API}/${auth.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: newCart }),
      });

      setAuth((prev) => ({
        ...prev,
        cart: newCart,
      }));

      setCartEntries((prev) =>
        prev.filter((e) => e.cartKey !== cartKeyToRemove)
      );
    } catch (err) {
      console.error("Failed to delete cart item", err);
    }
  };


  // ============================
  // MAIL TO
  // ============================
  const openMailToTrader = async (tradeItem) => {
    try {
      const res = await fetch(`${USERS_API}/${tradeItem.user}`);
      const user = await res.json();

      if (!user?.email) return;

      const subject = encodeURIComponent(
        `Trading "${tradeItem.title}"`
      );

      window.location.href = `mailto:${user.email}?subject=${subject}`;
    } catch (err) {
      console.error("Failed to open mail", err);
    }
  };

  // ============================
  // MARK TRADE AS COMPLETE
  // ============================
  const handleTalkToTrader = async (cartKey) => {
    try {
      const userRes = await fetch(`${USERS_API}/${auth.id}`);
      const userData = await userRes.json();

      const oldCart = userData.cart || {};
      const entry = oldCart[cartKey];
      if (!entry) return;

      const updatedCart = {
        ...oldCart,
        [cartKey]: { ...entry, status: "complete" },
      };

      // update MY cart
      await fetch(`${USERS_API}/${auth.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });

      // mark both products as traded
      await fetch(`${PRODUCTS_API}/${entry.item}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traded: true }),
      });

      await fetch(`${PRODUCTS_API}/${entry.tradeitem}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traded: true }),
      });

      setAuth((prev) => ({ ...prev, cart: updatedCart }));
      navigate("/trades");

    } catch (err) {
      console.error("Failed to complete trade", err);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="sectionTitle">My Trades</h1>

      <div className="mt-4">

        <div className="cart-header">
          <span>Product</span>
          <span>Trading With</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && (
          <p className="text-center mt-4">Loading...</p>
        )}

        {!loading && cartEntries.length === 0 && (
          <p className="text-center mt-4 text-muted">No active trades.</p>
        )}
        
        {!loading && cartEntries.map((entry, idx) => {
          const item = products.find((p) => p.id === entry.item);
          const tradeItem = products.find((p) => p.id === entry.tradeitem);

          return (
            <div key={idx} className="cart-row">
              <div>{item?.title || "Loading..."}</div>
              <div>{tradeItem?.title || "Loading..."}</div>

              <div>
                {entry.status === "waiting" && (
                  <span className="status waiting">Waiting Approval</span>
                )}
                {entry.status === "approved" && (
                  <span className="status approved">Approved</span>
                )}
                {entry.status === "denied" && (
                  <span className="status denied">Denied</span>
                )}
              </div>

              <div className="cart-actions">
                {entry.status === "approved" && (
                  <span className="talk" onClick={() => {
                    openMailToTrader(tradeItem);
                    handleTalkToTrader(entry.cartKey)
                  }}>
                    <i className="bi bi-arrow-repeat"></i> talk to trader
                  </span>
                )}

                {/* hide trash/ delete option if trade is approved */}
                {entry.status !== "approved" && (
                  <i
                    className="bi bi-trash trash-icon"
                    onClick={() => handleDelete(entry.cartKey)}
                  ></i>
                )}
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

export default Cart;