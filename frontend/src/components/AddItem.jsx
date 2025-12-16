import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const API_BASE = "http://localhost:5000/api";
const PRODUCTS_API = `${API_BASE}/products`;

const AddItem = () => {
  const { auth } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Home");
  const [meeting, setMeeting] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("user", auth.id);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("traded", false);
    formData.append("public", isPublic);
    formData.append("country", auth.country);
    formData.append("state", auth.state);
    formData.append("city", auth.city);
    formData.append("meeting", meeting);
    formData.append("description", description);

    images.forEach((img) => {
      formData.append("images", img);
    });

    await fetch(PRODUCTS_API, {
      method: "POST",
      body: formData,
    });

    // reset
    setTitle("");
    setMeeting("");
    setDescription("");
    setImages([]);
    setIsPublic(true);
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3">Add Item</h5>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-2"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <select
          className="form-select mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["Home", "Electronics", "Accessories", "Collectibles", "Clothes", "Toys"].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          className="form-control mb-2"
          maxLength={50}
          placeholder="Meeting place"
          value={meeting}
          onChange={(e) => setMeeting(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          maxLength={5000}
          rows={4}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <label className="form-check-label">Public</label>
        </div>

        <button className="btn btn-primary w-100">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;