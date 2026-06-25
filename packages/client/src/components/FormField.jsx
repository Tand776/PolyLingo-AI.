export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  placeholder,
}) {
  return (
    <div className={`form-field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
