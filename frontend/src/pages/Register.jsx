import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

//const API_URL = "http://localhost:8000/users";
const API_BASE = "http://localhost:5000/api";
const AUTH_API = `${API_BASE}/auth`;

// REGEX
const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//should have letters and numbers...length: 8 to 28
const password_regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  // MODES: "login" | "signup" | "reset"
  const [mode, setMode] = useState("login");

  // FORM FIELDS
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  // VALIDATIONS
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validCpwd, setValidCpwd] = useState(false);

  // COUNTRY-STATE-CITY
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);


  // ERROR
  const [error, setError] = useState("");

  // VALIDATION HOOKS
  useEffect(() => {
    setValidEmail(email_regex.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(password_regex.test(pwd));
    setValidCpwd(pwd === cpwd);
  }, [pwd, cpwd]);

  // ========================================
  // LOGIN
  // ========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const out = await res.json();
      if (!res.ok) {
        setError(out.message || "Incorrect email or password");
        return;
      }

      setAuth({
        id: out.user.id,
        email: out.user.email,
        country: out.user.country,
        state: out.user.state,
        city: out.user.city,
        cart: out.user.cart || {},
      });

      navigate("/");

    } catch (err) {
      setError("Error connecting to server");
    }
  };

  // ========================================
  // SIGNUP
  // ========================================
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pwd,
          country: country?.name,
          state: state?.name,
          city: city?.name,
        }),
      });

      const out = await res.json();
      if (!res.ok) {
        setError(out.message || "Email already registered");
        return;
      }

      setAuth({
        id: out.user.id,
        email: out.user.email,
        country: out.user.country,
        state: out.user.state,
        city: out.user.city,
        cart: out.user.cart || {},
      });

      navigate("/");

    } catch (err) {
      setError("Error creating account");
      console.log(err);
    }
  };

  // ========================================
  // RESET PASSWORD
  // ========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/users/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: pwd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "No account found with this email.");
        return;
      }

      alert("Password updated successfully!");

      // return to login
      setMode("login");
      setPwd("");
      setCpwd("");
      setError("");


    } catch (err) {
      setError("Error resetting password");
    }
  };

  // ========================================
  // MASTER SUBMIT HANDLER
  // ========================================
  const handleSubmit = (e) => {
    if (mode === "login") return handleLogin(e);
    if (mode === "signup") return handleSignup(e);
    if (mode === "reset") return handleResetPassword(e);
  };

  return (
    <>
{/* TITLE */}
      <h1 className="text-center sectionTitle" style={{ marginTop: "2%" }}>
        {mode === "login" && "Log In"}
        {mode === "signup" && "Create Account"}
        {mode === "reset" && "Reset Password"}
      </h1>

{/* ERROR MESSAGE */}
      {error && (
        <p className="text-danger text-center" style={{ marginTop: "10px" }}>
          {error}
        </p>
      )}

{/* FORM */}
      <div className="d-flex justify-content-center">
        <Form className="PM" style={{ width: "300px" }} onSubmit={handleSubmit}>

{/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={email && !validEmail}
              required
            />
          </Form.Group>

{/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              isInvalid={pwd && !validPwd}
              required
            />
            {(mode === "signup" || mode === "reset") && (
              <Form.Text className="text-muted">
                Should contain letters and numbers.<br />
                length: 8 to 28.
              </Form.Text>
            )}

          </Form.Group>

{/* Confirm password in signup + reset mode */}
          {(mode === "signup" || mode === "reset") && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={cpwd}
                onChange={(e) => setCpwd(e.target.value)}
                isInvalid={cpwd && !validCpwd}
                required
              />
              {(mode === "signup" || mode === "reset") && (
                <Form.Text className="text-muted">
                  Must match password.
                </Form.Text>
              )}
            </Form.Group>
          )}

{/* COUNTRY  */}
          {mode === "signup" && (
            <>
              {/* Country */}
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <CountrySelect
                  value={country}
                  onChange={(value) => {
                    setCountry(value);
                    setState(null);
                    setCity(null);
                  }}
                  placeHolder="Select Country"
                />
              </Form.Group>

              {/* State */}
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <StateSelect
                  countryid={country?.id}
                  value={state}
                  onChange={(value) => {
                    setState(value);
                    setCity(null);
                  }}
                  placeHolder="Select State"
                />
              </Form.Group>

              {/* City */}
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <CitySelect
                  countryid={country?.id}
                  stateid={state?.id}
                  value={city}
                  onChange={(value) => setCity(value)}
                  placeHolder="Select City"
                />
              </Form.Group>
            </>
          )}


{/* BUTTON */}
          <Button
            variant="dark"
            style={{ width: "300px", marginBottom: "5%", backgroundColor: "#208AAE", borderColor: "#208AAE",}}
            type="submit"
            disabled={
              mode === "signup"
                ? !validEmail || !validPwd || !validCpwd || !country || !state || !city
                : mode === "reset"
                  ? !validEmail || !validPwd || !validCpwd
                  : !email || !pwd
            }

          >
            {mode === "login" && "Log In"}
            {mode === "signup" && "Sign Up"}
            {mode === "reset" && "Reset Password"}
          </Button>

{/* LINKS */}
          <span>
{/* Reset Password */}
            {mode === "login" && (
              <p
                style={{ float: "left", cursor: "pointer", color: "#208AAE", textDecoration: "underline" }}
                onClick={() => setMode("reset")}
              >
                Forgot password?
              </p>
            )}

{/* Toggle login <-> signup */}
            {(mode === "login" || mode === "signup") && (
              <p
                style={{ float: "right", cursor: "pointer", textDecoration: "underline", color: "#208AAE" }}
                onClick={() =>
                  setMode(mode === "signup" ? "login" : "signup")
                }
              >
                {mode === "signup" ? "Already have an account?" : "Create Account"}
              </p>
            )}

{/* Back to login in reset mode */}
            {mode === "reset" && (
              <p
                style={{
                  float: "right",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setMode("login")}
              >
                Back to Login
              </p>
            )}
          </span>

        </Form>
        </div>
    </>
  );
};

export default Register;