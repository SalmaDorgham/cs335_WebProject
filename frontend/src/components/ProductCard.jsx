import { Link } from "react-router-dom";
import "../assets/css/ProductCard.css";

const API_BASE = "http://localhost:5000";

const ProductCard = ({ id, title = "Product X", image }) => {
  return (
    <Link to={`/product/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="col">
        <div className="card">
          <div className="card-img-wrapper">
            <img src={`${API_BASE}${image}`} alt={title} className="card-img-top product-img" />
          </div>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
