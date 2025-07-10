import React from "react";

function SimpleApp() {
  console.log("Simple app rendered");
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5"
    }}>
      <h1 style={{ color: "#22c55e", fontSize: "2rem", marginBottom: "1rem" }}>
        ✅ Bistro AGIS - Deploy Funcionando!
      </h1>
      
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        textAlign: "center"
      }}>
        <h2>Status do Sistema:</h2>
        <ul style={{ textAlign: "left", lineHeight: "1.6" }}>
          <li>✅ React carregando</li>
          <li>✅ Tela não está mais branca</li>
          <li>✅ JavaScript funcionando</li>
          <li>⏳ Conectando com APIs...</li>
        </ul>
        
        <button 
          onClick={() => {
            console.log("Testando console...");
            alert("JavaScript funcionando!");
          }}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Testar JavaScript
        </button>
      </div>
      
      <p style={{ marginTop: "1rem", color: "#666" }}>
        Timestamp: {new Date().toLocaleString()}
      </p>
    </div>
  );
}

export default SimpleApp;
