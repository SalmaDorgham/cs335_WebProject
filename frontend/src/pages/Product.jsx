import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import ProductCard from "../components/ProductCard";
import "../assets/css/Product.css";

const BACKEND_URL = "http://localhost:5000";
const API_BASE = "http://localhost:5000/api";
const PRODUCTS_API = `${API_BASE}/products`;
const USERS_API = `${API_BASE}/users`;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [mainImage, setMainImage] = useState("");

  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  // ============================
  // USED TRADE ITEMS (from cart)
  // ============================
  const usedTradeItemIds = auth?.cart
    ? Object.values(auth.cart).map((c) => c.tradeitem)
    : [];

  const isOwnProduct = String(product?.user?.id || product?.user) === String(auth?.id);


  // ============================
  // FETCH USER PRODUCTS
  // ============================
  useEffect(() => {
    if (!auth?.id) return;

    const fetchUserItems = async () => {
      const res = await fetch(PRODUCTS_API);
      const data = await res.json();

      const mine = data.filter(
        (item) =>
          String(item.user?.id || item.user) === String(auth.id) &&
          item.traded === false        // optional but correct
      );
      setUserItems(mine);
    };

    fetchUserItems();
  }, [auth?.id]);

  // ============================
  // FETCH PRODUCT
  // ============================
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`${PRODUCTS_API}/${id}`);

      if (!res.ok) {
        navigate("/404");
        return;
      }

      const data = await res.json();
      setProduct(data);
      setMainImage(data.images?.[0]);
    };

    fetchProduct();
  }, [id, navigate]);

  // ============================
  // FETCH RELATED ITEMS
  // ============================
  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      const res = await fetch(PRODUCTS_API);
      const data = await res.json();

      const filtered = data
        .filter(
          (item) =>
            item.category === product.category &&
            item.id !== product.id &&
            item.public === true &&
            item.traded === false
        )
        .slice(0, 4);


      setRelated(filtered);
    };

    fetchRelated();
  }, [product]);

  // ============================
  // ADD TO CART
  // ============================
  const handleProceedToCart = async () => {
    if (!selectedItem || !auth?.id) return;

    const userRes = await fetch(`${USERS_API}/${auth.id}`);
    const userData = await userRes.json();

    const currentCart = userData.cart || {};
    const nextKey = Object.keys(currentCart).length.toString();

    const updatedCart = {
      ...currentCart,
      [nextKey]: {
        item: product.id,
        tradeitem: selectedItem,
        status: "waiting",
      },
    };

    await fetch(`${USERS_API}/${auth.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: updatedCart }),
    });

    // update auth immediately
    setAuth((prev) => ({
      ...prev,
      cart: updatedCart,
    }));

    navigate("/cart");
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <div className="row">

        {/* LEFT — IMAGES */}
        <div className="col-lg-6 col-12 d-flex">
          <div className="thumbnail-list me-3">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={`${BACKEND_URL}${img}`}
                alt="thumb"
                className={`thumbnail-img ${mainImage === img ? "active-thumb" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>

          <div className="main-image-container">
            <img
              src={mainImage ? `${BACKEND_URL}${mainImage}` : ""}
              alt="product"
              className="main-image"
            />
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="col-lg-6 col-12 ps-lg-5 mt-4 mt-lg-0">
          <h3>{product.title}</h3>
          <p className="text-muted">{product.description}</p>

          {/* TRADE SELECT */}
          <div className="trade-select-box">
            <label className="form-label fw-bold">Trade Now</label>

            {isOwnProduct ? (
              <div className="alert alert-info mt-2">
                You can’t trade your own item.
              </div>
            ) : (
              <>
                <select
                  className="form-select trade-dropdown"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">Select an item to trade</option>

                  {userItems.length === 0 && (
                    <option disabled>You have no items to trade</option>
                  )}

                  {userItems.map((item) => {
                    const isUsed = usedTradeItemIds.includes(item.id);

                    return (
                      <option
                        key={item.id}
                        value={item.id}
                        disabled={isUsed}
                      >
                        {item.title} {isUsed ? "(Already in trade)" : ""}
                      </option>
                    );
                  })}
                </select>

                {selectedItem && (
                  <>
                    <div className="selected-trade-preview mt-3">
                      {userItems
                        .filter((i) => i.id === selectedItem)
                        .map((i) => (
                          <div key={i.id} className="d-flex align-items-center">
                            <img
                              src={`${BACKEND_URL}${i.images?.[0]}`}
                              alt="your item"
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                marginRight: "10px",
                                border: "2px solid #208AAE",
                              }}
                            />
                            <span className="fw-bold">{i.title}</span>
                          </div>
                        ))}
                    </div>

                    <button
                      className="btn btn-primary mt-3"
                      style={{
                        backgroundColor: "#208AAE",
                        borderColor: "#208AAE",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                      onClick={handleProceedToCart}
                    >
                      Proceed to Cart
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* LOCATION */}
          <div className="info-box mt-4">
            <div className="info-row">
              <i className="bi bi-geo-alt"></i>
              <div>
                <strong>Location</strong>
                <p>{product.city}, {product.state}, {product.country}</p>
              </div>
            </div>

            <div className="info-row">
              <i className="bi bi-truck"></i>
              <div>
                <strong>Meeting Place</strong>
                <p>{product.meeting}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED ITEMS */}
      <h4 className="related-title">
        <i className="bi bi-square-fill" style={{ color: "#208AAE" }}></i>
        Related Items
      </h4>

      <div className="row row-cols-2 row-cols-md-5 g-4">
        {related.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.images?.[0]}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;