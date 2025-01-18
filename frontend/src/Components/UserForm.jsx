import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    year: "",
    month: "",
    date: "",
    hours: "",
    minutes: "",
    seconds: 30, // Hardcoded value
    gender: "",
    latitude: "",
    longitude: "",
    timezone: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // Variable to store user data
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchLocationDetails = async (city, state) => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY; // Replace with your OpenCage API key
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )},${encodeURIComponent(state)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const result = data.results[0];
        const timezone = result.annotations.timezone.offset_string;
        const { lat, lng } = result.geometry;

        setFormData((prevData) => ({
          ...prevData,
          latitude: lat.toString(),
          longitude: lng.toString(),
          timezone: timezone.replace('+', '')
        }));

        return { lat, lng, timezone };
      } else {
        alert("Unable to fetch location details. Please check the city name.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      alert("Failed to fetch location details. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.city || !formData.state) {
      alert("Please provide the city and state.");
      return;
    }

    const locationDetails = await fetchLocationDetails(formData.city, formData.state);
    
    if (locationDetails) {
      const updatedFormData = {
        ...formData,
        latitude: locationDetails.lat.toString(),
        longitude: locationDetails.lng.toString(),
        timezone: locationDetails.timezone.replace('+', '')
      };
      
      setFormData(updatedFormData);
      setUserData(updatedFormData);
      console.log("Final User Data===>", updatedFormData);
      navigate("/chatbot");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Enter Your Birth Details</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Year:
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Month (1-12):
          <input
            type="number"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="number"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Hours (0-23):
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Minutes:
          <input
            type="number"
            name="minutes"
            value={formData.minutes}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <fieldset>
          <legend>Gender:</legend>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
              required
            />
            Male
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
              required
            />
            Female
          </label>
        </fieldset>
        <br />
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Fetching Location Details..." : "Submit"}
        </button>
      </form>
      {userData && (
        <div style={{ marginTop: "20px" }}>
          <h3>User Data:</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserForm;