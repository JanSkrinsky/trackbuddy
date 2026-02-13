import React from "react";

export default function ConfirmButton({ children, confirmText, onConfirm, className = "" }) {
  return (
    <button
      className={`btn ${className}`}
      onClick={() => { if (window.confirm(confirmText || "Are you sure?")) onConfirm(); }}
    >
      {children}
    </button>
  );
}
