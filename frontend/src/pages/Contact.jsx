import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Contact = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Regex rules
  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate name
    if (!nameRegex.test(name)) {
      alert("Name can only contain letters.");
      return;
    }

    // Validate surname
    if (!nameRegex.test(surname)) {
      alert("Surname can only contain letters.");
      return;
    }

    // Validate email
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Validate message is not empty
    if (message.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }

    // Success
    alert("Message sent!");

    // Clear fields
    setName("");
    setSurname("");
    setEmail("");
    setMessage("");
  };

  return (

    <>
    <h1 className='text-center sectionTitle' style={{marginTop: "2%"}}>Contact Us</h1>
    <div className="d-flex justify-content-center">
    <Form className="PM" style={{ width: "300px" }} onSubmit={handleSubmit}>
      
{/* Name */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

{/* Surname */}
      <Form.Group className="mb-3">
        <Form.Label>Surname</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
      </Form.Group>

{/* Email */}
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

{/* Message */}
      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </Form.Group>

{/* Submit Button */}
      <Button
        variant="dark"
        style={{ width: "300px", marginBottom: "5%", backgroundColor: "#208AAE", borderColor: "#208AAE" }}
        type="submit"
      >
        Submit
      </Button>
    </Form>
    </div>
    </>
  );
};

export default Contact;
