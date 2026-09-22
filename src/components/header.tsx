"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { groups, Logo } from "./site";
export function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => {
    function dismiss(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setActive(null);
        setMobile(false);
      }
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (mobile) toggle.current?.focus();
        else
          (
            ref.current?.querySelector('[aria-expanded="true"]') as HTMLElement
          )?.focus();
        setActive(null);
        setMobile(false);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [mobile]);
  function close() {
    setActive(null);
    setMobile(false);
  }
  return (
    <header
      className="header"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      }}
    >
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {Object.entries(groups).map(([name, links]) => (
            <div className="nav-group" key={name}>
              <button
                aria-expanded={active === name}
                aria-controls={`nav-${name}`}
                onClick={() => setActive(active === name ? null : name)}
              >
                {name}
                <ChevronDown size={13} />
              </button>
              {active === name && (
                <div className="nav-dropdown" id={`nav-${name}`}>
                  <span className="eyebrow">MONARDAS / {name}</span>
                  {links.map(([label, url]) => (
                    <Link
                      href={url}
                      key={url}
                      onClick={close}
                      aria-current={path === url ? "page" : undefined}
                    >
                      {label}
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <Link className="header-cta" href="/current-focus" onClick={close}>
          Current Focus
          <ArrowUpRight size={15} />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={mobile ? "Close navigation" : "Open navigation"}
          aria-expanded={mobile}
          aria-controls="mobile-navigation"
          onClick={() => setMobile(!mobile)}
        >
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
      {mobile && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {Object.entries(groups).map(([name, links]) => (
            <div key={name}>
              <span className="eyebrow">{name}</span>
              {links.map(([label, url]) => (
                <Link
                  key={url}
                  href={url}
                  onClick={close}
                  aria-current={path === url ? "page" : undefined}
                >
                  {label}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
