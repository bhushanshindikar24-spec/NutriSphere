
export default function Footer() {
  return (
    <footer style={{ padding: '1.5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8125rem', background: 'var(--bg-surface)' }}>
      &copy; {new Date().getFullYear()} NutriSphere Platform. Precision Clinical Nutrition Intelligence.
    </footer>
  );
}
