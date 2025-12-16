import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

const API_BASE = "http://localhost:5000/api";
const PRODUCTS_API = `${API_BASE}/products`;

const YourItems = () => {
  const { auth } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.id) return;

    const load = async () => {
      setLoading(true);

      const res = await fetch(PRODUCTS_API);
      const data = await res.json();

      setItems(
        data.filter(
          (i) =>
            String(i.user?.id || i.user) === String(auth.id) &&
            i.traded === false
        )
      );

      setLoading(false);
    };

    load();
  }, [auth?.id]);


  const togglePublic = async (item) => {
    await fetch(`${PRODUCTS_API}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public: !item.public }),
    });

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, public: !i.public } : i
      )
    );
  };

  const deleteItem = async (id) => {
    await fetch(`${PRODUCTS_API}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3">Your Items</h5>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && items.length === 0 && (
        <p className="text-muted">No items yet.</p>
      )}

      {!loading && items.map((item) => (
        <div
          key={item.id}
          className="d-flex justify-content-between align-items-center mb-3"
        >
          <span>{item.title}</span>

          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => togglePublic(item)}
            >
              {item.public ? "Public" : "Private"}
            </button>

            <i className="bi bi-trash trash-icon"
                    onClick={() => deleteItem(item.id)}
            ></i>
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourItems;
