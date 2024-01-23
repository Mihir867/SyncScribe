import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateDocument() {
  const [documentId, setDocumentId] = useState("");
  const navigate = useNavigate();

  const inputStyle = {
    margin: "0 15px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width:"300px"
  };

  const buttonStyle = {
    cursor: "pointer",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#007BFF",
    color: "white",
    borderRadius: "4px",
    border: "none",
    marginTop:"10px"
  };

  const containerStyle = {
    textAlign: "center",
    marginTop: "20vh", // Adjusted to center vertically
  };

  const labelStyle = {
    fontSize: "18px",
    marginBottom: "10px", // Added margin for separation
  };

  const handleSearch = () => {
    if (documentId.trim() !== "") {
      navigate(`/editor/${documentId}`);
    }
  };
  return (
    <div style={containerStyle}>
      <label htmlFor="documentId" style={labelStyle}>
        Enter your document ID here:
      </label>
      <br />
      <input
        type="text"
        id="documentId"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        style={inputStyle}
      />
      <br />
      <button style={buttonStyle} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

export default UpdateDocument;
