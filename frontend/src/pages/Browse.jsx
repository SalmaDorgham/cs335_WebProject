import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthProvider";
import { useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";
const PRODUCTS_API = `${API_BASE}/products`;

const Browse = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const params = new URLSearchParams(location.search);
  const sortFromLink = params.get("sort");
  const categoryFromLink = params.get("category");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const categories = ["Home", "Electronics", "Accessories", "Collectibles", "Clothes", "Toys"];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");

  // SORT & FILTER FROM VIEW ALL BUTTON (Home)
  useEffect(() => {
    if (sortFromLink === "close") setSortOption("close-far");
    if (sortFromLink === "new") setSortOption("new-old");
    if (categoryFromLink) {setSelectedCategories([categoryFromLink]);}
  }, [location.search]);

  // FETCH PRODUCTS
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

  // CATEGORY FILTER
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  let filteredProducts = selectedCategories.length
    ? products.filter((p) => selectedCategories.includes(p.category))
    : products;

  // SEARCH FILTER
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // SORTING
  if (sortOption === "old-new") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }
  if (sortOption === "new-old") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }
  if (sortOption === "az") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }
  if (sortOption === "za") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }
  if (sortOption === "close-far") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aMatch =
        a.country === auth.country &&
        a.state === auth.state &&
        a.city === auth.city;

      const bMatch =
        b.country === auth.country &&
        b.state === auth.state &&
        b.city === auth.city;

      return bMatch - aMatch;
    });
  }

  return (
    <>
      <h1 className="text-center sectionTitle" style={{ marginTop: "2%" }}>
        All Items
      </h1>

      <div className="row mt-4">
        {/* FILTERS */}
        <div className="col-lg-3 col-12">
          <div className="border p-3 mb-4">
            <h5>Sort</h5>
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Select</option>
              <option value="old-new">Oldest to Newest</option>
              <option value="new-old">Newest to Oldest</option>
              <option value="close-far">Closest to you</option>
              <option value="az">Title: A → Z</option>
              <option value="za">Title: Z → A</option>
            </Form.Select>
          </div>

          <div className="border p-3 mb-4">
            <h5>Categories</h5>
            <Form>
              {categories.map((cat, i) => (
                <Form.Check
                  key={i}
                  type="checkbox"
                  label={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
              ))}
            </Form>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="col-lg-9 col-12">
          <div className="row row-cols-2 row-cols-md-5 g-4">
            {loading && (
              <p className="text-center mt-3">Loading...</p>
            )}

            {!loading && filteredProducts.length === 0 && (
              <p className="text-center mt-3">No products found.</p>
            )}

            {!loading &&
              filteredProducts.map((p) => (
                <div className="col" key={p.id}>
                  <ProductCard
                    id={p.id}
                    title={p.title}
                    image={p.images?.[0]}
                  />
                </div>
              ))}
          </div>

        </div>

      </div>
    </>
  );
};

export default Browse;
