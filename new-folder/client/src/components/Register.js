import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Registration successful!");
        setIsError(false);
        setFormData({
          username: "",
          password: "",
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          address: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Registration failed!");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Error connecting to the server.");
      setIsError(true);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="header">
        <a href="/">Home</a>
        <div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
      <div className="register-container">
        <div className="card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          {message && (
            <p className={isError ? "error" : "success"}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
