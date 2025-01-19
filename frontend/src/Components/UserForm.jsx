import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserForm.css";
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
const UserForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    year: "",
    month: "",
    date: "",
    hours: "",
    minutes: "",
    seconds: 30,
    gender: "",
    latitude: "",
    longitude: "",
    timezone: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchLocationDetails = async (city, state) => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          city
        )},${encodeURIComponent(state)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results.length > 0 && response.status === 200) {
        const result = data.results[0];
        const timezone = result.annotations.timezone.offset_string;
        const { lat, lng } = result.geometry;

        setFormData((prevData) => ({
          ...prevData,
          latitude: lat.toString(),
          longitude: lng.toString(),
          timezone: timezone.replace("+", ""),
        }));

        return { lat, lng, timezone };
      } else {
        alert("Unable to fetch location details. Please check the city name.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      alert("Failed to fetch location details. Please try again.");
      setLoading(false);
      return null;
    }
  };

  const fetchInitialData = async (data) => {
    try {
      localStorage.setItem("formdata", JSON.stringify(data));
      const requestBody = {
        input_value: `Name: ${data.fullname}
      Gender: ${data.gender}
      Date of Birth: ${data.date}/${data.month}/${data.year}
      Time: ${data.hours}:${data.minutes}:${data.seconds}
      Location: ${data.city}, ${data.state}
      Latitude: ${data.latitude}
      Longitude: ${data.longitude}
      Timezone: ${data.timezone} 
      
      Provide a comprehensive analysis including:
        1. Kundali Analysis & Horoscope Reading:
           - Detailed birth chart interpretation
           - Current planetary positions
           - Upcoming astrological predictions
        
        2. Personal Recommendations:
           - Suggested Puja rituals for harmony
           - Beneficial gemstones based on birth chart
           - Essential Dos and Don'ts for spiritual growth
        
        3. Wellness Guidelines:
           - Personalized meditation techniques
           - Recommended workout routines
           - Suitable sleep music and relaxation practices`,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "ChatInput-ptY9L": {},
          "TextInput-4eLMO": {},
          "Prompt-s92xM": {},
          "OpenAIModel-MQPYL": {},
          "ChatOutput-eYBF6": {},
          "ParseData-okg1x": {},
          "AstraDB-4WWLe": {},
          "OpenAIEmbeddings-R0WtN": {},
          "SplitText-v2FBv": {},
          "File-PHABe": {},
          "File-QRe0u": {},
          "File-nm52U": {},
        },
      };
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("formdata", JSON.stringify(data));
      JSON.parse(localStorage.setItem("kundli", JSON.stringify(response?.data)));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.city ||
      !formData.state ||
      !formData.fullname ||
      !formData.gender ||
      !formData.hours ||
      !formData.minutes
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const locationDetails = await fetchLocationDetails(
      formData.city,
      formData.state
    );

    if (locationDetails) {
      const updatedFormData = {
        ...formData,
        latitude: locationDetails.lat.toString(),
        longitude: locationDetails.lng.toString(),
        timezone: locationDetails.timezone.replace("+", ""),
      };

      await fetchInitialData(updatedFormData);
      setLoading(false);
      navigate("/chatbot");
    }
  };

  return (
    <div className="astro-container FlexCenter">
      <div className="form-wrapper">
        <h2 className="form-title">✨ SoulBuddy - AI-Powered Spiritual Guide ✨</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">
              Full Name
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="input-field"
              />
            </label>
          </div>

          <div className="grid-3">
            <label className="input-label">
              Year
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="1990"
                className="input-field"
              />
            </label>
            <label className="input-label">
              Month
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                placeholder="01-12"
                className="input-field"
              />
            </label>
            <label className="input-label">
              Date
              <input
                type="number"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                placeholder="01-31"
                className="input-field"
              />
            </label>
          </div>

          <div className="grid-2">
            <label className="input-label">
              Hours
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                required
                placeholder="0-23"
                className="input-field"
              />
            </label>
            <label className="input-label">
              Minutes
              <input
                type="number"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                required
                placeholder="0-59"
                className="input-field"
              />
            </label>
          </div>

          <fieldset className="gender-fieldset">
            <legend className="gender-legend">Gender</legend>
            <div className="radio-group">
              <label className="radio-label">
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
              <label className="radio-label">
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
            </div>
          </fieldset>

          <div className="grid-2">
            <label className="input-label">
              City
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city of Birth"
                required
                className="input-field"
              />
            </label>
            <label className="input-label">
              State
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                required
                className="input-field"
              />
            </label>
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? "🌟 Consulting the Stars..."
              : "🔮 Reveal Your Cosmic Path"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
