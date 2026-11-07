import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#05060A",
        color: "#F4F6FA",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "linear-gradient(135deg, #2DE2A6 0%, #22D3EE 100%)",
          display: "grid",
          placeItems: "center",
          marginBottom: "1.5rem",
          boxShadow: "0 8px 32px rgba(45, 226, 166, 0.3)",
        }}
      >
        <span style={{ fontSize: 28, color: "#04110C", fontWeight: "bold" }}>◆</span>
      </div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "0 0 0.75rem", letterSpacing: "-0.03em" }}>
        Cadre
      </h1>
      <p style={{ fontSize: "1.125rem", color: "#A7B0C3", maxWidth: "32rem", margin: 0, lineHeight: 1.6 }}>
        The AI team that runs your revenue.
      </p>
    </div>
  );
}

