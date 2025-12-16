import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthProvider";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";
const USERS_API = `${API_BASE}/users`;

const EditProfile = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // redirect if not logged in
  useEffect(() => {
    if (!auth?.email) navigate("/register");
  }, [auth, navigate]);

  // ===============================
  // FIELDS
  // ===============================
  const [currentEmail] = useState(auth.email);
  const [newEmail, setNewEmail] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // preload address
  useEffect(() => {
    if (auth.country) setCountry({ name: auth.country });
    if (auth.state) setState({ name: auth.state });
    if (auth.city) setCity({ name: auth.city });
  }, [auth]);

  // ===============================
  // SAVE
  // ===============================
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const resProfile = await fetch(`${USERS_API}/${auth.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail || auth.email,
          country: country?.name || auth.country,
          state: state?.name || auth.state,
          city: city?.name || auth.city,
        }),
      });

      const profileOut = await resProfile.json();
      if (!resProfile.ok) {
        setError(profileOut.message || "Error updating profile.");
        return;
      }

      if (currentPwd || newPwd || confirmPwd) {
        if (newPwd !== confirmPwd) {
          setError("New passwords do not match.");
          return;
        }

        const resPwd = await fetch(
          `${USERS_API}/${auth.id}/change-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentPassword: currentPwd,
              newPassword: newPwd,
            }),
          }
        );

        const pwdOut = await resPwd.json();
        if (!resPwd.ok) {
          setError(pwdOut.message || "Password update failed.");
          return;
        }
      }

      setAuth((prev) => ({
        ...prev,
        email: newEmail || prev.email,
        country: country?.name || prev.country,
        state: state?.name || prev.state,
        city: city?.name || prev.city,
      }));

      setSuccess("Profile updated successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");

    } catch {
      setError("Error updating account.");
    }
  };

  const handleCancel = () => {
    setNewEmail("");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");

    setCountry(auth.country ? { name: auth.country } : null);
    setState(auth.state ? { name: auth.state } : null);
    setCity(auth.city ? { name: auth.city } : null);

    setError("");
    setSuccess("");
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <h5 className="mb-3" style={{ color: "#208AAE" }}>
        Edit Your Profile
      </h5>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <Form onSubmit={handleSaveChanges}>

        {/* EMAIL */}
        <Form.Group className="mb-3">
          <Form.Label>Current Email</Form.Label>
          <Form.Control type="email" value={currentEmail} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>New Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Form.Group>

        {/* ADDRESS */}
        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <CountrySelect
            value={country}
            onChange={(val) => {
              setCountry(val);
              setState(null);
              setCity(null);
            }}
            placeHolder="Select Country"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <StateSelect
            countryid={country?.id}
            value={state}
            onChange={(val) => {
              setState(val);
              setCity(null);
            }}
            placeHolder="Select State"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <CitySelect
            countryid={country?.id}
            stateid={state?.id}
            value={city}
            onChange={(val) => setCity(val)}
            placeHolder="Select City"
          />
        </Form.Group>

        {/* PASSWORD */}
        <Form.Group className="mb-2">
          <Form.Control
            type="password"
            placeholder="Current Password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control
            type="password"
            placeholder="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm New Password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </Form.Group>

        {/* BUTTONS */}
        <div className="d-flex justify-content-between">
          <span style={{ cursor: "pointer" }} onClick={handleCancel}>
            Cancel
          </span>

          <Button
            type="submit"
            style={{ backgroundColor: "#208AAE", borderColor: "#208AAE" }}
          >
            Save Changes
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default EditProfile;
