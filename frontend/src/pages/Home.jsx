import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import ProductCard from "../components/ProductCard";
import "../assets/css/Home.css";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";
const PRODUCTS_API = `${API_BASE}/products`;

const Home = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Home");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(PRODUCTS_API);
      const data = await res.json();

      const visibleItems = data.filter(
        (p) => p.public === true && p.traded === false
      );

      setProducts(visibleItems);
      setLoading(false);
    };

    fetchProducts();
  }, []);


  // ===============================
  // CATEGORY FILTER
  // ===============================
  const filteredProducts =
    selectedCategory === ""
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  // ===============================
  // CLOSE TO YOU
  // ===============================
  const closeToYou = filteredProducts.filter(
    (p) =>
      p.country === auth.country &&
      p.state === auth.state &&
      p.city === auth.city
  );

  // ===============================
  // NEWLY ADDED
  // ===============================
  const newlyAdded = [...filteredProducts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="container py-4">
      {/* BROWSE BY CATEGORY */}
      <h2 className="section-title">
        <i className="bi bi-square-fill" style={{ color: "#208AAE" }}></i>{" "}
        Browse By Category
      </h2>

      <div className="category-grid">
        <CategoryButton icon="bi-house-fill" label="Home" active={selectedCategory==="Home"} onClick={() => setSelectedCategory("Home")} />
        <CategoryButton icon="bi-laptop" label="Electronics" active={selectedCategory==="Electronics"} onClick={() => setSelectedCategory("Electronics")} />
        <CategoryButton icon="bi-watch" label="Accessories" active={selectedCategory==="Accessories"} onClick={() => setSelectedCategory("Accessories")} />
        <CategoryButton icon="bi-gem" label="Collectibles" active={selectedCategory==="Collectibles"} onClick={() => setSelectedCategory("Collectibles")} />
        <CategoryButton icon="bi-person-arms-up" label="Clothes" active={selectedCategory==="Clothes"} onClick={() => setSelectedCategory("Clothes")} />
        <CategoryButton icon="bi-joystick" label="Toys" active={selectedCategory==="Toys"} onClick={() => setSelectedCategory("Toys")} />
      </div>

      <hr />

      {/* CLOSE TO YOU */}
      <SectionHeader title=" Close to You" button sort="close" category={selectedCategory} />

      <div className="row row-cols-2 row-cols-md-5 g-4">
        {loading && <p className="text-center mt-3">Loading...</p>}

        {!loading && closeToYou.length === 0 && (
          <p>No {selectedCategory} items near you yet.</p>
        )}

        {!loading &&
          closeToYou.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              image={p.images?.[0]}
            />
          ))}
      </div>


      <hr />

      {/* NEWLY ADDED */}
      <SectionHeader title=" Newly Added" button sort="new" category={selectedCategory} />

      <div className="row row-cols-2 row-cols-md-5 g-4">
        {loading && <p className="text-center mt-3">Loading...</p>}

        {!loading && newlyAdded.length === 0 && (
          <p>No newly added {selectedCategory} items.</p>
        )}

        {!loading &&
          newlyAdded.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              image={p.images?.[0]}
            />
          ))}
      </div>

    </div>
  );
};

export default Home;


// =====================================
// SECTION HEADER COMPONENT
// =====================================
const SectionHeader = ({ title, button, sort, category }) => (
  <div className="section-header">
    <h3>
      <i className="bi bi-square-fill" style={{ color: "#208AAE" }}></i>
      {title}
    </h3>

    {button && (
      <Link to={`/browse?sort=${sort}&category=${category}`}>
        <button className="btn-view-small">View All</button>
      </Link>
    )}
  </div>
);

// =====================================
// CATEGORY BUTTON COMPONENT
// =====================================
const CategoryButton = ({ icon, label, active, onClick }) => (
  <div className={`category-btn ${active ? "active" : ""}`} onClick={onClick}>
    <i className={`bi ${icon}`}></i>
    <span>{label}</span>
  </div>
);
