export default function Spinner({ size = 18, label }) {
  return (
    <span className="spinner-wrap" role="status" aria-live="polite">
      <span
        className="spinner"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label && <span className="spinner-label">{label}</span>}
    </span>
  );
}
