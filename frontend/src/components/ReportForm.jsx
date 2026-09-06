import { useState } from "react";

function ReportForm({ onSubmit, loading = false }) {

    const [form, setForm] = useState({
        category: "Waste",
        location: "",
        description: ""
    });

    const [error, setError] = useState("");

    const categories = [
        ["Waste", "🗑️ Waste"],
        ["Road", "🛣️ Damaged Road"],
        ["Water", "💧 Water"],
        ["Drainage", "🚰 Drainage"],
        ["Streetlight", "💡 Streetlight"],
        ["Pollution", "🌫️ Pollution"],
        ["Other", "⚠️ Other"]
    ];

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.location.trim()) {
            setError("Please enter the problem location.");
            return;
        }

        if (!form.description.trim()) {
            setError("Please describe the problem.");
            return;
        }

        if (onSubmit) {
            await onSubmit(form);

            setForm({
                category: "Waste",
                location: "",
                description: ""
            });
        }
    }

    return (
        <form
            className="civic-report-form"
            onSubmit={handleSubmit}
        >

            <div className="form-group">

                <label>
                    Problem Category
                </label>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    {categories.map(([value, label]) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>
                    ))}
                </select>

            </div>

            <div className="form-group">

                <label>
                    Problem Location
                </label>

                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Example: Ramanathapuram, Coimbatore"
                />

            </div>

            <div className="form-group">

                <label>
                    Describe the Problem
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe what is happening..."
                />

            </div>

            {error && (
                <div className="form-error">
                    ⚠️ {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="report-submit-button"
            >
                {loading
                    ? "⏳ Analysing..."
                    : "Submit Civic Report →"}
            </button>

        </form>
    );
}

export default ReportForm;