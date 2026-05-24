import { useEffect, useState } from "react";

export type FieldType = "text" | "number" | "email" | "date" | "select" | "textarea";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  fullWidth?: boolean;
}

export interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  panelLabel: string;
  fields: FormField[];
}

export default function AddItemModal({
  open,
  onClose,
  onSubmit,
  title,
  panelLabel,
  fields,
}: AddItemModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const defaults: Record<string, string> = {};
      fields.forEach((f) => {
        defaults[f.name] = f.defaultValue ?? (f.type === "select" && f.options ? f.options[0] : "");
      });
      setValues(defaults);
    }
  }, [open, fields]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div
      className="fixed inset-0 z-[280] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-dark-500 border border-gold-500/30 shadow-2xl shadow-black/60 animate-[scaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 text-gray-400 hover:text-gold-400 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4">
          <div className="text-[11px] uppercase tracking-[0.28em] text-gold-400 mb-3">{panelLabel}</div>
          <h2 className="font-display text-3xl text-white font-bold">{title}</h2>
          <div className="w-12 h-[2px] bg-gold-500 mt-3" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.fullWidth ? "sm:col-span-2" : ""}>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2 font-medium">
                  {field.label}
                </label>

                {field.type === "select" && field.options ? (
                  <select
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-dark-400 border border-white/10 px-4 py-3 text-white focus:border-gold-500 outline-none transition-colors"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-dark-400 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-gold-500 outline-none transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-dark-400 border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:border-gold-500 outline-none transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
            >
              Create Customer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-dark-400 hover:bg-dark-300 border border-white/10 text-gray-300 hover:text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
