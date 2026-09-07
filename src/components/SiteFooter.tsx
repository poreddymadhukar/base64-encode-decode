const mariutilUrl = "https://mariutil.com/";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true">
          m
        </span>
        <span>Mariutil</span>
      </div>
      <p>Simple tools. Less friction.</p>
      <nav className="footer-links" aria-label="Footer navigation">
        <a href={`${mariutilUrl}#about`}>About</a>
        <a href={`${mariutilUrl}#blog`}>Blog</a>
        <a href={`${mariutilUrl}#privacy`}>Privacy</a>
        <a href={`${mariutilUrl}#terms`}>Terms</a>
        <a href="mailto:hello@mariutil.com">Contact</a>
      </nav>
      <small>Copyright {new Date().getFullYear()} Mariutil.</small>
    </footer>
  );
}
