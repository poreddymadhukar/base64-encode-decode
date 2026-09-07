import { GitFork, Menu, X } from "lucide-react";
import { useState } from "react";

const mariutilUrl = "https://mariutil.com/";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav-wrap" aria-label="Main navigation">
        <a className="brand" href={mariutilUrl} aria-label="Mariutil home">
          <span className="brand-mark" aria-hidden="true">
            m
          </span>
          <span>Mariutil</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <a href={`${mariutilUrl}#tools`} onClick={() => setMenuOpen(false)}>
            Tools
          </a>
          <a href={`${mariutilUrl}#about`} onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href={`${mariutilUrl}#blog`} onClick={() => setMenuOpen(false)}>
            Blog
          </a>
          <a
            className="github-link"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <GitFork size={17} aria-hidden="true" /> GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
