"use client";
import { useEffect, useState } from "react";
import posthog from "posthog-js";

const WelcomeModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const dismissedDate = localStorage.getItem("dismissedDate");
    const today = new Date().toISOString().split("T")[0];

    if (!userInfo && dismissedDate !== today) {
      setIsModalOpen(true);
    } else if (userInfo) {
      const parsedInfo = JSON.parse(userInfo);
      posthog.identify(parsedInfo.email, {
        name: parsedInfo.name,
        designation: parsedInfo.designation,
        company: parsedInfo.company,
      });
    }
  }, []);

  const onClose = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("dismissedDate", today);
    setIsModalOpen(false);
  };

  const onSubmit = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    posthog.identify(data.email, {
      name: data.name,
      designation: data.designation,
      company: data.company,
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    company: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg z-50 w-3/6 max-w-lg">
        <h2 className="text-3xl text-white mb-6 text-center">
          Welcome to DB Lens!
        </h2>
        <p className="text-gray-400 mb-6 text-center">
          {`We'd love to know more about you to serve you better.`}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Designation:</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Get Started
          </button>
        </form>
        <p
          onClick={onClose}
          className="mt-4 w-full text-center text-gray-400 hover:text-gray-300 cursor-pointer"
        >
          Maybe later
        </p>
      </div>
    </div>
  );
};

export default WelcomeModal;
