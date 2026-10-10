import {  useState  } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Contact NutriSphere Clinical Team</h1>
        <p className="text-muted" style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          Have questions about clinical partnerships, hospital integrations, or technical support? Reach out below.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
        <div className="glass-panel" style={{ padding: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Get in Touch</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "0.75rem", borderRadius: "12px", color: "var(--primary)" }}>
              <Mail size={20} />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>Clinical Support</p>
              <p style={{ fontWeight: 600, margin: 0 }}>clinical@nutrisphere.health</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "0.75rem", borderRadius: "12px", color: "var(--primary)" }}>
              <Phone size={20} />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>Toll-Free Partner Inquiries</p>
              <p style={{ fontWeight: 600, margin: 0 }}>+1 (800) 555-NUTR (6887)</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "0.75rem", borderRadius: "12px", color: "var(--primary)" }}>
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>Headquarters</p>
              <p style={{ fontWeight: 600, margin: 0 }}>NutriSphere Clinical Intelligence Labs, Boston, MA</p>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "2.5rem" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <CheckCircle size={48} color="var(--secondary)" style={{ margin: "0 auto 1rem" }} />
              <h3>Message Dispatched</h3>
              <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                Thank you for contacting NutriSphere. Our medical administration team will respond within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Dr. Jane Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="jane.doe@hospital.org"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Clinical Trial / Deployment Inquiry"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="How can our clinical engineering team assist you?"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                <Send size={18} /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
