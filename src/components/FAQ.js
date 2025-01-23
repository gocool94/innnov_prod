import React, { useState, useEffect, useRef } from "react";

const FAQ = () => {
  const [categories, setCategories] = useState([]); // Holds categories from JSON
  const [activeCategory, setActiveCategory] = useState(0); // Tracks active category index
  const sectionRefs = useRef([]); // References for scrolling to each section

  // Fetch categories from JSON
  useEffect(() => {
    fetch("/faqs.json")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Error fetching FAQs:", err));
  }, []);

  // Scroll to category section
  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveCategory(index);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar: Categories */}
      <div className="w-full md:w-1/4 sticky top-0 p-4 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <button
                onClick={() => scrollToSection(index)}
                className={`block w-full text-left px-4 py-2 rounded transition ${
                  activeCategory === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: FAQ List */}
      <div className="w-full md:w-3/4 p-6 space-y-8 overflow-y-auto">
        {categories.map((category, index) => (
          <div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)} // Store reference
            className="scroll-mt-16" // Helps with accurate scrolling
          >
            <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
            {category.faqs.map((faq, faqIndex) => (
              <details
                key={faqIndex}
                className="border border-gray-300 rounded-lg mb-2 p-4 group"
              >
                <summary className="cursor-pointer font-semibold text-lg flex justify-between">
                  {faq.question}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">
                    &#x25BC;
                  </span>
                </summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
