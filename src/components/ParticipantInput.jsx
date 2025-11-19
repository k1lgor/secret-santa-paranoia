import React, { useState } from "react";

const ParticipantInput = ({ participants, onAdd, onRemove }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  return (
    <div className="glass-card">
      <h2>The Naughty List</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter victim's name..."
          maxLength={20}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button
          type="submit"
          style={{ borderRadius: "12px", padding: "0 1.5rem" }}
        >
          Add
        </button>
      </form>

      <div style={{ marginTop: "1.5rem" }}>
        {participants.length === 0 ? (
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            No names added yet. The list is empty... for now.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {participants.map((p, index) => (
              <li
                key={index}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "0.5rem 1rem",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span style={{ fontWeight: 600 }}>{p}</span>
                <button
                  className="danger"
                  onClick={() => onRemove(index)}
                  style={{
                    padding: "0.1rem 0.4rem",
                    fontSize: "0.8rem",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    marginLeft: "0.5rem",
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p
        style={{
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
          marginTop: "1rem",
          textAlign: "right",
        }}
      >
        {participants.length} souls on the list
      </p>
    </div>
  );
};

export default ParticipantInput;
