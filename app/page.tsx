"use client";

import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [panel, setPanel] = useState<"dsd" | "margin" | "ai" | "chat">("dsd");
  const [navUp, setNavUp] = useState(false);
  const countersRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    // Nav
    const onScroll = () => setNavUp(window.scrollY > 48);
    window.addEventListener("scroll", onScroll);

    // Scroll reveal
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("vis"); obs.unobserve(e.target); } }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv").forEach((el, i) => {
      const p = el.closest("[data-stag]");
      if (p) {
        const kids = Array.from(p.querySelectorAll(":scope > .rv, :scope > * > .rv"));
        const idx = kids.indexOf(el);
        if (idx > 0) (el as HTMLElement).style.transitionDelay = `${idx * 0.09}s`;
      }
      obs.observe(el);
    });

    // Counter animation
    const counterObs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !countedRef.current) {
          countedRef.current = true;
          document.querySelectorAll("[data-count]").forEach((el) => {
            const target = parseFloat((el as HTMLElement).dataset.count || "0");
            const isFloat = target % 1 !== 0;
            let start = 0;
            const duration = 1400;
            const step = (timestamp: number, startTime: number) => {
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const val = start + (target - start) * ease;
              el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toString();
              if (progress < 1) requestAnimationFrame((ts) => step(ts, startTime));
              else el.textContent = isFloat ? target.toFixed(1) : target.toString();
            };
            requestAnimationFrame((ts) => step(ts, ts));
          });
        }
      });
    }, { threshold: 0.5 });
    if (countersRef.current) counterObs.observe(countersRef.current);

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); counterObs.disconnect(); };
  }, []);

  const tabLabels: Record<string, string> = {
    dsd: "📲 DSD Receiver", margin: "📊 Margin Engine", ai: "🤖 AI Pricing", chat: "💬 Ask AisleOS"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --linen:   #F9FAF7;
          --linen2:  #F1F3EE;
          --linen3:  #E6EAE2;
          --forest:  #14532D;
          --forest2: #166534;
          --forest3: #15803D;
          --produce: #16A34A;
          --prod-lt: #DCFCE7;
          --amber:   #D97706;
          --amb-lt:  #FEF3C7;
          --red:     #DC2626;
          --red-lt:  #FEE2E2;
          --ink:     #0F1A13;
          --ink2:    #1E3024;
          --muted:   #4B6356;
          --muted2:  #7A9B87;
          --border:  #DDE3D8;
          --border2: #C8D1C2;
          --white:   #FFFFFF;
          --mono: 'DM Mono', 'Courier New', monospace;
          --serif: 'Lora', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
          --sh-sm: 0 1px 3px rgba(15,26,19,.06),0 1px 2px rgba(15,26,19,.04);
          --sh-md: 0 4px 16px rgba(15,26,19,.08),0 2px 6px rgba(15,26,19,.04);
          --sh-lg: 0 12px 40px rgba(15,26,19,.11),0 4px 12px rgba(15,26,19,.06);
          --sh-xl: 0 24px 64px rgba(15,26,19,.15),0 8px 20px rgba(15,26,19,.08);
        }

        body { font-family: var(--sans); background: var(--linen); color: var(--ink); line-height: 1.65; overflow-x: hidden; }

        h1,h2 { font-family: var(--serif); line-height: 1.18; color: var(--ink); font-weight: 600; }
        h1 { font-size: clamp(2.4rem, 4.8vw, 4.2rem); letter-spacing: -0.015em; }
        h2 { font-size: clamp(1.75rem, 3vw, 2.75rem); letter-spacing: -0.01em; }
        h3 { font-size: 1.05rem; font-weight: 600; font-family: var(--sans); color: var(--ink); }
        p { color: var(--muted); line-height: 1.74; }

        .container { max-width: 1160px; margin: 0 auto; padding: 0 28px; }
        section { padding: 92px 0; }

        /* MONO DATA */
        .mono { font-family: var(--mono); }

        /* REVEAL */
        .rv { opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
        .rv.vis { opacity: 1; transform: none; }

        /* BUTTONS */
        .btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 12px 24px; border-radius: 9px; font-family: var(--sans);
          font-size: .88rem; font-weight: 600; cursor: pointer;
          transition: all .18s ease; text-decoration: none; border: none; white-space: nowrap;
        }
        .btn-forest { background: var(--forest); color: #fff; box-shadow: 0 4px 14px rgba(20,83,45,.28); }
        .btn-forest:hover { background: var(--forest2); transform: translateY(-1px); box-shadow: 0 7px 20px rgba(20,83,45,.32); }
        .btn-line { background: transparent; color: var(--forest); border: 1.5px solid var(--border2); }
        .btn-line:hover { border-color: var(--forest); background: var(--prod-lt); }
        .btn-amber { background: var(--amber); color: #fff; box-shadow: 0 4px 12px rgba(217,119,6,.28); }
        .btn-amber:hover { background: #B45309; transform: translateY(-1px); }
        .btn-white { background: #fff; color: var(--forest); font-weight: 700; box-shadow: 0 4px 14px rgba(0,0,0,.12); }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,.16); }
        .btn-outline-white { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,.32); }
        .btn-outline-white:hover { border-color: rgba(255,255,255,.7); background: rgba(255,255,255,.08); }
        .btn-lg { padding: 15px 32px; font-size: .96rem; border-radius: 11px; }
        .btn-sm { padding: 7px 15px; font-size: .8rem; }

        /* CHIPS */
        .chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 100px; font-size: .73rem; font-weight: 600; font-family: var(--sans); letter-spacing: .01em; }
        .chip-forest { background: var(--prod-lt); color: var(--forest2); }
        .chip-amber  { background: var(--amb-lt); color: #92400E; }
        .chip-red    { background: var(--red-lt); color: var(--red); }
        .chip-mono   { background: var(--linen3); color: var(--ink2); }
        .chip-white  { background: rgba(255,255,255,.15); color: rgba(255,255,255,.9); border: 1px solid rgba(255,255,255,.2); }

        /* ── NAV ── */
        #nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 62px; transition: background .3s, box-shadow .3s, border-color .3s;
          border-bottom: 1px solid transparent;
        }
        #nav.up {
          background: rgba(249,250,247,.95); backdrop-filter: blur(18px);
          border-bottom-color: var(--border); box-shadow: 0 2px 12px rgba(15,26,19,.05);
        }
        .nav-in {
          max-width: 1160px; margin: 0 auto; padding: 0 28px;
          height: 100%; display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
        .nav-mark { width: 32px; height: 32px; border-radius: 8px; background: var(--forest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .nav-word { font-family: var(--serif); font-size: 1.25rem; font-weight: 600; color: var(--ink); letter-spacing: -.01em; }
        .nav-word span { color: var(--produce); }
        .nav-links { display: flex; gap: 2px; }
        .nav-link { padding: 6px 13px; border-radius: 7px; font-size: .84rem; font-weight: 500; color: var(--muted); text-decoration: none; transition: all .14s; }
        .nav-link:hover { color: var(--ink); background: var(--linen2); }
        .nav-right { display: flex; gap: 8px; align-items: center; }

        /* ── HERO — two-tone split ── */
        #hero {
          min-height: 100vh; display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0; overflow: hidden;
        }
        /* Left panel — linen */
        .hero-left {
          display: flex; align-items: center;
          padding: 100px 56px 80px 28px;
          background: var(--linen);
          position: relative; z-index: 1;
        }
        .hero-left-inner { max-width: 520px; margin-left: auto; }
        .hero-eyebrow { display: flex; align-items: center; gap: 9px; margin-bottom: 20px; }
        .hero-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--produce); position: relative; }
        .hero-pulse::after { content:''; position: absolute; inset: -3px; border-radius: 50%; border: 1.5px solid var(--produce); animation: pulse 2s ease-in-out infinite; opacity: 0; }
        @keyframes pulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        .hero-eyebrow-text { font-size: .76rem; font-weight: 700; color: var(--produce); letter-spacing: .1em; text-transform: uppercase; font-family: var(--sans); }
        .hero-h1 { margin-bottom: 20px; }
        .hero-h1 em { font-style: italic; color: var(--forest); }
        .hero-sub { font-size: 1rem; line-height: 1.76; max-width: 440px; margin-bottom: 34px; }
        .hero-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 40px; align-items: center; }
        .hero-social { display: flex; align-items: center; gap: 12px; padding: 13px 17px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--sh-sm); width: fit-content; }
        .soc-avs { display: flex; }
        .soc-av { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; margin-left: -5px; font-size: .58rem; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .soc-av:first-child { margin-left: 0; }
        .soc-text { font-size: .78rem; color: var(--muted); line-height: 1.4; }
        .soc-text strong { color: var(--ink); }

        /* Right panel — forest */
        .hero-right {
          background: var(--forest);
          position: relative; display: flex; align-items: center;
          padding: 100px 28px 80px 56px; overflow: hidden;
        }
        .hero-right::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0);
          background-size: 24px 24px;
        }
        .hero-right-glow { position: absolute; top: -80px; right: -80px; width: 500px; height: 500px; background: radial-gradient(ellipse, rgba(22,163,74,.22) 0%, transparent 65%); z-index: 0; pointer-events: none; }
        .hero-card-wrap { position: relative; z-index: 1; width: 100%; max-width: 460px; }

        /* Float chips on hero */
        .h-chip { position: absolute; background: var(--white); border-radius: 12px; padding: 9px 14px; box-shadow: var(--sh-lg); border: 1px solid var(--border); display: flex; align-items: center; gap: 8px; z-index: 3; }
        .hc-a { top: -14px; right: -10px; animation: hov 4.5s ease-in-out infinite; }
        .hc-b { bottom: 36px; left: -16px; animation: hov 4.5s ease-in-out 2.2s infinite; }
        @keyframes hov { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .hc-icon { font-size: 1.15rem; }
        .hc-lbl { font-size: .62rem; color: var(--muted); font-family: var(--sans); }
        .hc-val { font-family: var(--mono); font-size: .84rem; font-weight: 500; color: var(--ink); }

        /* Dashboard mockup */
        .dash { background: var(--white); border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--sh-xl); overflow: hidden; }
        .dash-bar { background: var(--ink); padding: 11px 16px; display: flex; align-items: center; justify-content: space-between; }
        .db-dots { display: flex; gap: 5px; align-items: center; }
        .db-dot { width: 8px; height: 8px; border-radius: 50%; }
        .db-title { color: rgba(255,255,255,.55); font-family: var(--mono); font-size: .72rem; margin-left: 8px; }
        .db-date { color: rgba(255,255,255,.3); font-family: var(--mono); font-size: .68rem; }
        .dash-body { background: var(--linen2); padding: 13px; }
        .d-kpis { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 9px; }
        .d-kpi { background: var(--white); border-radius: 10px; padding: 10px 9px; border: 1px solid var(--border); text-align: center; }
        .dkv { font-family: var(--mono); font-size: 1.2rem; font-weight: 500; color: var(--ink); }
        .dkl { font-size: .6rem; color: var(--muted2); margin-top: 3px; font-family: var(--sans); text-transform: uppercase; letter-spacing: .04em; }
        .d-rows { display: flex; flex-direction: column; gap: 5px; }
        .d-row { background: var(--white); border-radius: 8px; padding: 8px 11px; display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); }
        .d-ic { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: .64rem; font-weight: 500; color: #fff; flex-shrink: 0; }
        .d-info { flex: 1; min-width: 0; }
        .d-name { font-size: .75rem; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .d-meta { font-family: var(--mono); font-size: .62rem; color: var(--muted2); }
        .d-badge { font-family: var(--mono); font-size: .58rem; font-weight: 500; padding: 2px 7px; border-radius: 100px; white-space: nowrap; flex-shrink: 0; }
        .bg-g { background: #DCFCE7; color: #15803D; }
        .bg-a { background: var(--amb-lt); color: #92400E; }
        .bg-r { background: var(--red-lt); color: var(--red); }

        /* ── CONNECTOR BAND ── */
        #conn { padding: 22px 0; background: var(--forest); }
        .conn-in { display: flex; align-items: center; justify-content: center; gap: 9px; flex-wrap: wrap; }
        .conn-lbl { font-family: var(--mono); font-size: .65rem; color: rgba(255,255,255,.3); letter-spacing: .1em; text-transform: uppercase; margin-right: 6px; }
        .conn-pill { display: flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 100px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); font-size: .77rem; font-weight: 500; color: rgba(255,255,255,.68); font-family: var(--sans); }
        .cp-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* ── SECTION HEADER ── */
        .sh { text-align: center; margin-bottom: 54px; }
        .sh h2 { margin-bottom: 11px; }
        .sh p { max-width: 480px; margin: 0 auto; font-size: .97rem; }
        .sh .chip { margin-bottom: 16px; }

        /* ── PROBLEM ── */
        #problem { background: var(--linen2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .prob-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .prob-card { background: var(--white); border-radius: 18px; padding: 26px; border: 1px solid var(--border); box-shadow: var(--sh-sm); position: relative; overflow: hidden; }
        .prob-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--red), #F87171); }
        .prob-icon { font-size: 1.6rem; margin-bottom: 12px; }
        .prob-stat { font-family: var(--mono); font-size: 2rem; font-weight: 500; color: var(--red); margin-bottom: 8px; line-height: 1; }
        .prob-card h3 { margin-bottom: 7px; }
        .prob-card p { font-size: .845rem; line-height: 1.68; }

        /* ── HOW ── */
        #how { background: var(--linen); }
        .how-grid { display: grid; grid-template-columns: repeat(3,1fr); position: relative; gap: 0; }
        .how-grid::before { content: ''; position: absolute; top: 32px; left: 16.66%; right: 16.66%; height: 1px; background: linear-gradient(90deg, var(--produce), var(--forest), var(--amber)); z-index: 0; }
        .how-step { text-align: center; padding: 0 22px; position: relative; z-index: 1; }
        .how-num { width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 1.2rem; font-weight: 500; border: 2px solid var(--linen); box-shadow: var(--sh-md); }
        .hn1 { background: var(--prod-lt); color: var(--forest2); }
        .hn2 { background: var(--linen3); color: var(--ink2); }
        .hn3 { background: var(--amb-lt); color: var(--amber); }
        .how-step h3 { margin-bottom: 8px; }
        .how-step p { font-size: .845rem; line-height: 1.66; }
        .how-tag { display: inline-block; margin-top: 10px; font-family: var(--mono); font-size: .65rem; padding: 3px 10px; border-radius: 100px; background: var(--linen2); color: var(--muted2); }

        /* ── FEATURES ── */
        #features { background: var(--linen2); border-top: 1px solid var(--border); }
        .ftabs { display: flex; justify-content: center; gap: 6px; margin-bottom: 46px; flex-wrap: wrap; }
        .ftab { padding: 7px 18px; border-radius: 100px; font-size: .83rem; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); background: var(--white); color: var(--muted); font-family: var(--sans); transition: all .17s; }
        .ftab.on { background: var(--forest); color: #fff; border-color: var(--forest); }
        .ftab:hover:not(.on) { border-color: var(--forest3); color: var(--forest); }
        .fpanel { display: none; }
        .fpanel.on { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; align-items: start; }
        .fc h3 { font-size: 1.35rem; margin-bottom: 10px; font-family: var(--serif); font-weight: 600; }
        .fc > p { font-size: .89rem; line-height: 1.73; margin-bottom: 20px; }
        .flist { display: flex; flex-direction: column; gap: 9px; margin-bottom: 26px; }
        .fli { display: flex; align-items: flex-start; gap: 11px; padding: 12px 14px; background: var(--white); border-radius: 11px; border: 1px solid var(--border); box-shadow: var(--sh-sm); }
        .fli-ic { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: .85rem; }
        .fli strong { display: block; font-size: .835rem; color: var(--ink); margin-bottom: 2px; }
        .fli span { font-size: .77rem; color: var(--muted); }
        .fvis { background: var(--white); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); box-shadow: var(--sh-lg); }
        .fv-bar { background: var(--ink); padding: 11px 15px; display: flex; align-items: center; gap: 6px; }
        .fv-dot { width: 8px; height: 8px; border-radius: 50%; }
        .fv-lbl { color: rgba(255,255,255,.38); font-family: var(--mono); font-size: .68rem; margin-left: 4px; }
        .fv-body { padding: 14px; background: var(--linen2); }

        /* DSD */
        .dsd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 11px; }
        .dsd-f { display: flex; flex-direction: column; gap: 3px; }
        .dsd-fl { font-family: var(--mono); font-size: .57rem; color: var(--muted2); text-transform: uppercase; letter-spacing: .07em; }
        .dsd-fv { font-size: .78rem; font-weight: 500; color: var(--ink); padding: 5px 9px; background: var(--white); border: 1px solid var(--border); border-radius: 6px; }
        .dsd-fv.hi { border-color: var(--forest3); background: #F0FDF4; color: var(--forest); font-family: var(--mono); font-weight: 500; }
        .dsd-tbl { width: 100%; border-collapse: collapse; font-size: .71rem; }
        .dsd-tbl th { font-family: var(--mono); font-size: .57rem; text-transform: uppercase; letter-spacing: .05em; color: var(--muted2); padding: 5px 7px; background: var(--linen3); border-bottom: 1px solid var(--border); text-align: left; }
        .dsd-tbl td { padding: 7px; border-bottom: 1px solid var(--border); color: var(--ink); vertical-align: middle; font-family: var(--mono); font-size: .7rem; }
        .dsd-tbl tr:last-child td { border-bottom: none; }
        .vpill { display: inline-flex; font-family: var(--mono); font-size: .58rem; font-weight: 500; padding: 2px 6px; border-radius: 100px; background: var(--amb-lt); color: #92400E; }
        .dsd-foot { display: flex; align-items: center; justify-content: space-between; padding: 9px 11px; background: var(--linen3); border-top: 1px solid var(--border); }
        .dsd-bals { display: flex; gap: 14px; }
        .dsd-bi { display: flex; flex-direction: column; gap: 1px; }
        .dsd-bi-l { font-family: var(--mono); font-size: .55rem; color: var(--muted2); text-transform: uppercase; letter-spacing: .05em; }
        .dsd-bi-v { font-family: var(--mono); font-size: .9rem; font-weight: 500; color: var(--ink); }
        .dsd-bi-v.ok { color: var(--forest3); } .dsd-bi-v.bad { color: var(--red); }
        .post-dis { padding: 5px 13px; border-radius: 7px; font-family: var(--mono); font-size: .67rem; background: var(--linen3); color: var(--muted2); border: 1px solid var(--border); cursor: not-allowed; }

        /* Margin */
        .mk { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 9px; }
        .mkc { background: var(--white); border-radius: 10px; padding: 10px 12px; border: 1px solid var(--border); }
        .mkv { font-family: var(--mono); font-size: 1.2rem; font-weight: 500; color: var(--ink); }
        .mkl { font-size: .6rem; color: var(--muted2); margin-top: 2px; text-transform: uppercase; letter-spacing: .04em; }
        .mkd { font-family: var(--mono); font-size: .62rem; margin-top: 3px; }
        .up { color: var(--produce); } .dn { color: var(--red); }
        .mals { display: flex; flex-direction: column; gap: 6px; }
        .mal { display: flex; align-items: center; gap: 8px; background: var(--white); border-radius: 8px; padding: 8px 10px; border: 1px solid var(--border); border-left-width: 3px; }
        .mal.w { border-left-color: var(--amber); } .mal.g { border-left-color: var(--produce); }
        .maln { font-size: .77rem; font-weight: 600; color: var(--ink); }
        .mals2 { font-family: var(--mono); font-size: .63rem; color: var(--muted2); }

        /* AI Pricing */
        .ai-box { background: var(--amb-lt); border: 1px solid #FDE68A; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; }
        .ai-ey { font-family: var(--mono); font-size: .57rem; text-transform: uppercase; letter-spacing: .07em; color: #92400E; margin-bottom: 5px; }
        .ai-title { font-family: var(--serif); font-size: .88rem; color: var(--ink); margin-bottom: 3px; }
        .ai-desc { font-family: var(--mono); font-size: .68rem; color: var(--muted); line-height: 1.55; }
        .pr-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 10px; }
        .prc { background: var(--white); border-radius: 10px; padding: 10px 11px; border: 1px solid var(--border); }
        .prc.bad { background: var(--red-lt); border-color: #FECACA; }
        .prc.good { background: #F0FDF4; border-color: #BBF7D0; }
        .prl { font-family: var(--mono); font-size: .58rem; color: var(--muted2); margin-bottom: 3px; }
        .prv { font-family: var(--mono); font-size: 1rem; font-weight: 500; color: var(--ink); }
        .ai-btns { display: flex; gap: 7px; }
        .ai-approve { flex: 1; padding: 8px; background: var(--forest); color: #fff; border: none; border-radius: 7px; font-family: var(--mono); font-size: .7rem; cursor: pointer; }
        .ai-review { padding: 8px 12px; background: var(--linen3); color: var(--muted); border: 1px solid var(--border); border-radius: 7px; font-family: var(--mono); font-size: .7rem; cursor: pointer; }

        /* Chat */
        .chat { display: flex; flex-direction: column; gap: 8px; }
        .cb { max-width: 88%; padding: 9px 12px; border-radius: 11px; font-size: .75rem; line-height: 1.58; }
        .cb.u { align-self: flex-end; background: var(--forest); color: #fff; border-bottom-right-radius: 3px; font-family: var(--sans); }
        .cb.b { align-self: flex-start; background: var(--white); border: 1px solid var(--border); color: var(--ink); border-bottom-left-radius: 3px; font-family: var(--mono); font-size: .71rem; }
        .chat-in { display: flex; align-items: center; gap: 6px; padding: 7px 10px; background: var(--white); border: 1px solid var(--border); border-radius: 9px; font-family: var(--mono); font-size: .67rem; color: var(--muted2); margin-top: 3px; }
        .chat-send { margin-left: auto; background: var(--forest); color: #fff; border: none; border-radius: 6px; padding: 3px 9px; font-family: var(--mono); font-size: .65rem; cursor: pointer; }

        /* ── METRICS BAND ── */
        #metrics { background: var(--forest); padding: 56px 0; }
        .met-grid { display: grid; grid-template-columns: repeat(4,1fr); }
        .met-card { padding: 26px 22px; text-align: center; border-right: 1px solid rgba(255,255,255,.08); }
        .met-card:last-child { border-right: none; }
        .met-n { font-family: var(--mono); font-size: 2.4rem; font-weight: 500; color: #fff; line-height: 1; margin-bottom: 6px; }
        .met-n .accent { color: #6EE7B7; }
        .met-l { font-size: .78rem; color: rgba(255,255,255,.45); line-height: 1.45; }

        /* ── PROOF ── */
        #proof { background: var(--linen); border-top: 1px solid var(--border); }
        .proof-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .pc { background: var(--white); border-radius: 18px; padding: 24px; border: 1px solid var(--border); box-shadow: var(--sh-sm); }
        .pc-stars { color: var(--amber); font-size: .8rem; margin-bottom: 11px; letter-spacing: .06em; }
        .pc-q { font-family: var(--serif); font-size: .96rem; font-style: italic; color: var(--ink); line-height: 1.65; margin-bottom: 16px; }
        .pc-auth { display: flex; align-items: center; gap: 9px; }
        .pc-av { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: .68rem; font-weight: 500; color: #fff; flex-shrink: 0; }
        .pc-name { font-size: .82rem; font-weight: 600; color: var(--ink); }
        .pc-role { font-family: var(--mono); font-size: .63rem; color: var(--muted2); margin-top: 1px; }

        /* ── PRICING ── */
        #pricing { background: var(--linen2); border-top: 1px solid var(--border); }
        .pfound { display: flex; align-items: center; justify-content: space-between; gap: 14px; background: linear-gradient(135deg,#FFFDF5,var(--amb-lt)); border: 1px solid #FDE68A; border-radius: 16px; padding: 16px 22px; margin-bottom: 26px; }
        .pfound strong { display: block; font-size: .87rem; color: var(--ink); margin-bottom: 2px; }
        .pfound p { font-size: .76rem; }
        .pplans { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .pplan { background: var(--white); border-radius: 22px; padding: 26px; border: 1px solid var(--border); box-shadow: var(--sh-sm); display: flex; flex-direction: column; position: relative; }
        .pplan.pop { border-color: var(--forest3); box-shadow: 0 8px 30px rgba(20,83,45,.12); }
        .pop-label { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--forest); color: #fff; font-family: var(--mono); font-size: .66rem; padding: 3px 13px; border-radius: 100px; white-space: nowrap; }
        .plan-tier { font-family: var(--mono); font-size: .68rem; text-transform: uppercase; letter-spacing: .09em; color: var(--muted2); margin-bottom: 9px; }
        .plan-price { font-family: var(--mono); font-size: 2.6rem; font-weight: 500; color: var(--ink); line-height: 1; margin-bottom: 2px; }
        .plan-price sup { font-size: .9rem; vertical-align: super; }
        .plan-price sub { font-size: .82rem; font-weight: 400; color: var(--muted2); }
        .plan-unit { font-family: var(--mono); font-size: .67rem; color: var(--muted2); margin-bottom: 11px; }
        .plan-desc { font-size: .81rem; line-height: 1.62; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
        .plan-feats { list-style: none; display: flex; flex-direction: column; gap: 7px; flex: 1; margin-bottom: 20px; }
        .plan-feats li { display: flex; align-items: flex-start; gap: 7px; font-size: .81rem; color: var(--muted); }
        .plan-feats li.on { color: var(--ink); }
        .pfy { color: var(--produce); font-weight: 700; flex-shrink: 0; font-family: var(--mono); }
        .pfn { color: var(--muted2); flex-shrink: 0; font-family: var(--mono); }
        .plan-btn { width: 100%; justify-content: center; }
        .addons { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; margin-top: 20px; }
        .addon { background: var(--white); border-radius: 11px; padding: 13px 16px; border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .addon-name { font-size: .83rem; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
        .addon-desc { font-size: .72rem; color: var(--muted); }
        .addon-price { font-family: var(--mono); font-size: .9rem; font-weight: 500; color: var(--forest3); white-space: nowrap; }
        .p-note { text-align: center; margin-top: 17px; font-family: var(--mono); font-size: .72rem; color: var(--muted2); }
        .p-note a { color: var(--forest3); text-decoration: none; font-weight: 500; }

        /* ── CTA ── */
        #cta { padding: 0 0 92px; background: var(--linen); }
        .cta-box { background: var(--forest); border-radius: 24px; padding: 68px 52px; text-align: center; position: relative; overflow: hidden; box-shadow: var(--sh-xl); }
        .cta-box::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 15% 50%, rgba(22,163,74,.15) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 85% 50%, rgba(217,119,6,.08) 0%, transparent 65%); }
        .cta-box > * { position: relative; z-index: 1; }
        .cta-box h2 { color: #fff; margin-bottom: 13px; font-size: clamp(1.7rem,3vw,2.6rem); }
        .cta-box p { color: rgba(255,255,255,.62); max-width: 480px; margin: 0 auto 32px; font-size: .97rem; }
        .cta-btns { display: flex; justify-content: center; gap: 11px; flex-wrap: wrap; margin-bottom: 28px; }
        .cta-trust { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
        .ct-i { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: .72rem; color: rgba(255,255,255,.48); }

        /* ── FOOTER ── */
        footer { background: var(--ink); padding: 50px 0 24px; }
        .fg { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 38px; }
        .f-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .f-mark { width: 28px; height: 28px; border-radius: 7px; background: var(--forest2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .f-brand { font-family: var(--serif); font-size: 1.15rem; font-weight: 600; color: #fff; }
        .f-brand span { color: #6EE7B7; }
        .f-desc { font-size: .79rem; color: rgba(255,255,255,.38); line-height: 1.7; margin-bottom: 11px; }
        .f-col-t { font-family: var(--mono); font-size: .62rem; text-transform: uppercase; letter-spacing: .09em; color: rgba(255,255,255,.28); margin-bottom: 11px; }
        .f-links { list-style: none; display: flex; flex-direction: column; gap: 7px; }
        .f-links li span { font-size: .79rem; color: rgba(255,255,255,.42); }
        .f-bot { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.07); flex-wrap: wrap; gap: 9px; }
        .f-copy { font-family: var(--mono); font-size: .68rem; color: rgba(255,255,255,.25); }
        .f-badges { display: flex; gap: 6px; flex-wrap: wrap; }
        .f-badge { font-family: var(--mono); font-size: .6rem; padding: 2px 8px; border-radius: 100px; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.28); }

        /* ── RESPONSIVE ── */
        @media (max-width:1024px) {
          #hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 110px 28px 48px; }
          .hero-left-inner { max-width: 560px; margin: 0 auto; }
          .hero-right { padding: 40px 28px 72px; }
          .hero-card-wrap { margin: 0 auto; }
          .pplans { grid-template-columns: 1fr 1fr; }
          .proof-grid { grid-template-columns: 1fr 1fr; }
          .met-grid { grid-template-columns: 1fr 1fr; }
          .fg { grid-template-columns: 1fr 1fr; gap: 30px; }
        }
        @media (max-width:768px) {
          section { padding: 62px 0; }
          h1 { font-size: 2.2rem; }
          .how-grid { grid-template-columns: 1fr; gap: 34px; }
          .how-grid::before { display: none; }
          .prob-grid { grid-template-columns: 1fr; }
          .fpanel.on { grid-template-columns: 1fr; }
          .pplans { grid-template-columns: 1fr; }
          .addons { grid-template-columns: 1fr; }
          .proof-grid { grid-template-columns: 1fr; }
          .cta-box { padding: 42px 22px; }
          .nav-links { display: none; }
          .hc-a,.hc-b { display: none; }
          .pfound { flex-direction: column; align-items: flex-start; }
          .dsd-grid { grid-template-columns: 1fr; }
        }
        @media (max-width:480px) {
          .hero-btns { flex-direction: column; align-items: stretch; }
          .hero-btns .btn { justify-content: center; }
          .fg { grid-template-columns: 1fr; }
          .f-bot { flex-direction: column; }
          .met-grid { grid-template-columns: 1fr; }
          .met-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,.08); }
          .met-card:last-child { border-bottom: none; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav id="nav" className={navUp ? "up" : ""}>
        <div className="nav-in">
          <a href="#" className="nav-logo">
            <div className="nav-mark">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#fff"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#fff"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#fff"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#fff" opacity="0.38"/>
              </svg>
            </div>
            <div className="nav-word">Aisle<span>OS</span></div>
          </a>
          <div className="nav-links">
            {["Features","How it works","Pricing","Stories"].map((l,i)=>(
              <a key={l} href={["#features","#how","#pricing","#proof"][i]} className="nav-link">{l}</a>
            ))}
          </div>
          <div className="nav-right">
            <a href="#" className="btn btn-line btn-sm">Sign in</a>
            <a href="#cta" className="btn btn-forest btn-sm">Join Waitlist →</a>
          </div>
        </div>
      </nav>

      {/* ── HERO — two-tone ── */}
      <section id="hero">
        {/* Left: linen copy */}
        <div className="hero-left">
          <div className="hero-left-inner">
            <div className="hero-eyebrow">
              <div className="hero-pulse"/>
              <span className="hero-eyebrow-text">Profit OS for Independent Grocers</span>
            </div>
            <h1 className="hero-h1">
              Know your margin.<br/>
              <em>Before it bleeds.</em>
            </h1>
            <p className="hero-sub">
              AisleOS connects DSD receiving, POS sales, and AI pricing into one system built for grocery — so every cost change is caught, every margin is visible, and prices adjust automatically.
            </p>
            <div className="hero-btns">
              <a href="#cta" className="btn btn-forest btn-lg">Join the Waitlist →</a>
              <a href="#features" className="btn btn-line btn-lg">See the platform</a>
            </div>
            <div className="hero-social">
              <div className="soc-avs">
                {[["#14532D","M"],["#D97706","R"],["#DC2626","J"],["#166534","S"]].map(([bg,l])=>(
                  <div key={l} className="soc-av" style={{background:bg}}>{l}</div>
                ))}
              </div>
              <p className="soc-text"><strong>Grocers recoup $800+/week</strong> in undetected vendor overcharges</p>
            </div>
          </div>
        </div>

        {/* Right: forest dashboard */}
        <div className="hero-right">
          <div className="hero-right-glow"/>
          <div className="hero-card-wrap">
            <div className="h-chip hc-a">
              <span className="hc-icon">📉</span>
              <div><div className="hc-lbl">margin alert</div><div className="hc-val">BEV −2.1pts</div></div>
            </div>
            <div className="h-chip hc-b">
              <span className="hc-icon">✅</span>
              <div><div className="hc-lbl">price pushed · POS</div><div className="hc-val">$7.49 · 12s</div></div>
            </div>
            <div className="dash">
              <div className="dash-bar">
                <div className="db-dots">
                  <div className="db-dot" style={{background:"#f87171"}}/>
                  <div className="db-dot" style={{background:"#fbbf24"}}/>
                  <div className="db-dot" style={{background:"#6ee7b7"}}/>
                  <span className="db-title">margin_dashboard · store_03</span>
                </div>
                <span className="db-date">2025-03-05</span>
              </div>
              <div className="dash-body">
                <div className="d-kpis">
                  <div className="d-kpi"><div className="dkv" style={{color:"#15803D"}}>28.3%</div><div className="dkl">blended margin</div></div>
                  <div className="d-kpi"><div className="dkv" style={{color:"#DC2626"}}>3</div><div className="dkl">active alerts</div></div>
                  <div className="d-kpi"><div className="dkv">$847</div><div className="dkl">variance caught</div></div>
                </div>
                <div className="d-rows">
                  {[
                    {bg:"#14532D",i:"CC",name:"Coca-Cola DSD — 24cs",meta:"inv #8821 · cost +8.4%",badge:"⚠ VARIANCE",cls:"bg-a"},
                    {bg:"#166534",i:"FL",name:"Frito-Lay DSD — 18cs",meta:"inv #4410 · balanced",badge:"✓ POSTED",cls:"bg-g"},
                    {bg:"#DC2626",i:"LB",name:"Local Bakery — 6cs",meta:"inv #2201 · dispute",badge:"DISPUTE",cls:"bg-r"},
                    {bg:"#4B6356",i:"AW",name:"AWG Warehouse EDI 810",meta:"$2,140.60 · 3-way match",badge:"✓ MATCHED",cls:"bg-g"},
                  ].map((r)=>(
                    <div className="d-row" key={r.name}>
                      <div className="d-ic" style={{background:r.bg}}>{r.i}</div>
                      <div className="d-info">
                        <div className="d-name">{r.name}</div>
                        <div className="d-meta">{r.meta}</div>
                      </div>
                      <div className={`d-badge ${r.cls}`}>{r.badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONNECTORS ── */}
      <section id="conn">
        <div className="container">
          <div className="conn-in">
            <span className="conn-lbl">connects_with →</span>
            {[["#16A34A","IT Retail"],["#D97706","NCR Counterpoint"],["#DC2626","LOC Software"],["#15803D","UNFI / AWG / C&S"],["#4B6356","BRdata Migration"]].map(([c,l])=>(
              <div className="conn-pill" key={l}><div className="cp-dot" style={{background:c}}/>{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem">
        <div className="container">
          <div className="sh rv">
            <div className="chip chip-red">The Problem</div>
            <h2>Your margin is bleeding —<br/>and you can&apos;t see it.</h2>
            <p>Independent grocers operate on 2–4% net margins. Three silent killers eat profits every single week.</p>
          </div>
          <div className="prob-grid" data-stag="1">
            {[
              {e:"📦",stat:"$847/wk",title:"Paper Invoice Chaos",d:"DSD drivers hand you a paper invoice. You sign it. Nobody checks if costs changed — until month-end reveals the damage."},
              {e:"👻",stat:"12%",title:"Ghost Items Ringing",d:'Transactions as "Open Dept" — no UPC, no cost, no margin. Up to 12% of your revenue is financially invisible right now.'},
              {e:"📉",stat:"−1.2pts",title:"Stale Shelf Prices",d:"Vendor cost rose Tuesday. Your shelf price still reflects last quarter. You're selling below margin for weeks before anyone notices."},
            ].map((c)=>(
              <div className="prob-card rv" key={c.title}>
                <div className="prob-icon">{c.e}</div>
                <div className="prob-stat">{c.stat}</div>
                <h3>{c.title}</h3>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ── */}
      <section id="how">
        <div className="container">
          <div className="sh rv">
            <div className="chip chip-forest">How It Works</div>
            <h2>Dock to dashboard<br/>in three steps.</h2>
            <p>AisleOS wraps your existing POS — no rip-and-replace. The wedge strategy that converts chaos into margin clarity.</p>
          </div>
          <div className="how-grid" data-stag="1">
            {[
              {n:"01",c:"hn1",title:"Deploy DSD Receiver",d:"Your receiver scans on a tablet. Cost changes flagged inline before anyone signs. Paper chaos ends day one.",tag:"week_01 → live"},
              {n:"02",c:"hn2",title:"Ingest POS Sales",d:"Edge agent connects to IT Retail, NCR, or LOC. Every sale stamped with exact cost at time of transaction. True margin, always.",tag:"week_02-04 → full"},
              {n:"03",c:"hn3",title:"AI Protects Margins",d:"Cost breaches your category target? AI suggests new retail price. One click — pushed to POS automatically. No re-keying.",tag:"week_05+ → automated"},
            ].map((s)=>(
              <div className="how-step rv" key={s.n}>
                <div className={`how-num ${s.c}`}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.d}</p>
                <div className="how-tag">{s.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features">
        <div className="container">
          <div className="sh rv">
            <div className="chip chip-mono">Platform</div>
            <h2>Everything between<br/>the dock and the dashboard.</h2>
            <p>Four integrated modules. One source of financial truth for your entire chain.</p>
          </div>
          <div className="ftabs rv">
            {(["dsd","margin","ai","chat"] as const).map((id)=>(
              <button key={id} className={`ftab${panel===id?" on":""}`} onClick={()=>setPanel(id)}>{tabLabels[id]}</button>
            ))}
          </div>

          {/* DSD */}
          <div className={`fpanel${panel==="dsd"?" on":""}`}>
            <div className="fc">
              <h3>DSD Receiver App</h3>
              <p>Tablet-first receiving built for the loading dock. Your receiver enters the paper invoice control total — the system hard-blocks posting until every line balances within $0.01.</p>
              <div className="flist">
                {[
                  {bg:"#DCFCE7",ic:"🔍",t:"OCR Invoice Scan",d:"Photograph the invoice — Gemini Flash extracts vendor, invoice #, date, and control total automatically."},
                  {bg:"#FEF3C7",ic:"⚠️",t:"Inline Cost Variance",d:'"This item was $15.50 last week — now $16.80 (+8.4%). Accept or dispute before you sign off."'},
                  {bg:"#FEE2E2",ic:"🔒",t:"Hard Balance Enforcement",d:"POST is disabled until lines match control total. A hard constraint — no soft warning, no override."},
                ].map((fi)=>(
                  <div className="fli" key={fi.t}>
                    <div className="fli-ic" style={{background:fi.bg}}>{fi.ic}</div>
                    <div><strong>{fi.t}</strong><span>{fi.d}</span></div>
                  </div>
                ))}
              </div>
              <a href="#cta" className="btn btn-forest">Join the waitlist →</a>
            </div>
            <div className="fvis">
              <div className="fv-bar"><div className="fv-dot" style={{background:"#f87171"}}/><div className="fv-dot" style={{background:"#fbbf24"}}/><div className="fv-dot" style={{background:"#6ee7b7"}}/><span className="fv-lbl">dsd_receiving · coca_cola_wbtl · INV-8821</span></div>
              <div className="fv-body">
                <div className="dsd-grid">
                  <div className="dsd-f"><div className="dsd-fl">vendor</div><div className="dsd-fv">Coca-Cola WBTL</div></div>
                  <div className="dsd-f"><div className="dsd-fl">invoice_id</div><div className="dsd-fv">INV-2024-8821</div></div>
                  <div className="dsd-f"><div className="dsd-fl">delivery_date</div><div className="dsd-fv">2025-03-05</div></div>
                  <div className="dsd-f"><div className="dsd-fl">control_total</div><div className="dsd-fv hi">$847.20</div></div>
                </div>
                <table className="dsd-tbl">
                  <thead><tr><th>description</th><th>qty</th><th>unit_cost</th><th>var</th><th>ext</th></tr></thead>
                  <tbody>
                    <tr><td>Coca-Cola 12pk</td><td>24 CS</td><td style={{color:"#DC2626",fontWeight:500}}>$16.80</td><td><span className="vpill">⚠ +8.4%</span></td><td>$403.20</td></tr>
                    <tr><td>Diet Coke 12pk</td><td>18 CS</td><td>$15.50</td><td style={{color:"#7A9B87"}}>—</td><td>$279.00</td></tr>
                    <tr><td>Sprite 2L</td><td>24 EA</td><td>$6.88</td><td style={{color:"#7A9B87"}}>—</td><td>$165.00</td></tr>
                  </tbody>
                </table>
                <div className="dsd-foot">
                  <div className="dsd-bals">
                    <div className="dsd-bi"><span className="dsd-bi-l">lines_total</span><span className="dsd-bi-v bad">$807.20</span></div>
                    <div className="dsd-bi"><span className="dsd-bi-l">control_total</span><span className="dsd-bi-v">$847.20</span></div>
                    <div className="dsd-bi"><span className="dsd-bi-l">diff</span><span className="dsd-bi-v bad">−$40.00</span></div>
                  </div>
                  <button className="post-dis">POST SESSION</button>
                </div>
              </div>
            </div>
          </div>

          {/* Margin */}
          <div className={`fpanel${panel==="margin"?" on":""}`}>
            <div className="fc">
              <h3>True Gross Margin Engine</h3>
              <p>Every sale stamped with its exact cost at the moment of ingest. Not today&apos;s cost applied retroactively — the actual cost at time of sale, immutably recorded per ADR-003.</p>
              <div className="flist">
                {[
                  {bg:"#DCFCE7",ic:"📌",t:"Stamp-at-Ingest COGS",d:"cost_basis written immutably at transaction time. Audit-ready. Never recalculated retroactively."},
                  {bg:"#F1F3EE",ic:"🏪",t:"Store / Zone / Chain Views",d:"Waterfall pricing: store override → zone → chain default. Always resolves to the most specific scope."},
                  {bg:"#FEF3C7",ic:"🤖",t:"AI Daily Narrative (6AM)",d:'"Blended margin 28.3%, down 0.4pts. Primary driver: AWG beverage cost increase." Every morning.'},
                ].map((fi)=>(
                  <div className="fli" key={fi.t}>
                    <div className="fli-ic" style={{background:fi.bg}}>{fi.ic}</div>
                    <div><strong>{fi.t}</strong><span>{fi.d}</span></div>
                  </div>
                ))}
              </div>
              <a href="#cta" className="btn btn-forest">Join the waitlist →</a>
            </div>
            <div className="fvis">
              <div className="fv-bar"><div className="fv-dot" style={{background:"#f87171"}}/><div className="fv-dot" style={{background:"#fbbf24"}}/><div className="fv-dot" style={{background:"#6ee7b7"}}/><span className="fv-lbl">margin_engine · week_09 · store_03</span></div>
              <div className="fv-body">
                <div className="mk">
                  <div className="mkc"><div className="mkv" style={{color:"#15803D"}}>28.3%</div><div className="mkl">blended margin</div><div className="mkd dn">↓ 0.4pts wk/wk</div></div>
                  <div className="mkc"><div className="mkv" style={{color:"#15803D"}}>34.1%</div><div className="mkl">produce margin</div><div className="mkd up">↑ 1.2pts · low shrink</div></div>
                  <div className="mkc"><div className="mkv" style={{color:"#DC2626"}}>21.4%</div><div className="mkl">beverage margin</div><div className="mkd dn">↓ 2.1pts · cost spike</div></div>
                  <div className="mkc"><div className="mkv">$847</div><div className="mkl">dsd variance</div><div className="mkd up">↑ this week</div></div>
                </div>
                <div className="mals">
                  <div className="mal w">
                    <span style={{fontSize:"1rem",flexShrink:0}}>⚠️</span>
                    <div><div className="maln">Coca-Cola 12pk — Margin Breach</div><div className="mals2">cost +8.4% · target breached · suggested_retail: $7.49</div></div>
                    <span className="d-badge bg-a" style={{marginLeft:"auto",flexShrink:0}}>ACT</span>
                  </div>
                  <div className="mal g">
                    <span style={{fontSize:"1rem",flexShrink:0}}>✅</span>
                    <div><div className="maln">Produce — Strong week</div><div className="mals2">shrink −18% · margin 34.1% · on_target</div></div>
                    <span className="d-badge bg-g" style={{marginLeft:"auto",flexShrink:0}}>OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Pricing */}
          <div className={`fpanel${panel==="ai"?" on":""}`}>
            <div className="fc">
              <h3>AI Pricing Engine</h3>
              <p>DSD session posts. An event fires. Cost breaches your category margin target? The engine calculates a suggested retail price and it&apos;s ready to push to your POS in seconds — not days.</p>
              <div className="flist">
                {[
                  {bg:"#FEF3C7",ic:"⚡",t:"Event-Driven Architecture",d:"DSD post → Azure Service Bus → Cost Worker → Pricing Engine → WebSocket alert. End-to-end in seconds."},
                  {bg:"#DCFCE7",ic:"🎯",t:"Category Margin Targets",d:"Set targets by dept. Engine applies waterfall logic — store override, then zone, then chain default."},
                  {bg:"#F1F3EE",ic:"🔁",t:"Direct POS Push",d:"Approve the suggestion. C# edge agent pushes the new price to IT Retail or NCR. Zero re-entry."},
                ].map((fi)=>(
                  <div className="fli" key={fi.t}>
                    <div className="fli-ic" style={{background:fi.bg}}>{fi.ic}</div>
                    <div><strong>{fi.t}</strong><span>{fi.d}</span></div>
                  </div>
                ))}
              </div>
              <a href="#cta" className="btn btn-forest">Join the waitlist →</a>
            </div>
            <div className="fvis">
              <div className="fv-bar"><div className="fv-dot" style={{background:"#f87171"}}/><div className="fv-dot" style={{background:"#fbbf24"}}/><div className="fv-dot" style={{background:"#6ee7b7"}}/><span className="fv-lbl">pricing_engine · breach_alert</span></div>
              <div className="fv-body">
                <div className="ai-box">
                  <div className="ai-ey">⚡ margin_breach_detected</div>
                  <div className="ai-title">Coca-Cola 12pk 12oz</div>
                  <div className="ai-desc">cost_delta: $15.50 → $16.80 (+8.4%) · bev_target: 28% · margin_at_new_cost: <span style={{color:"#DC2626",fontWeight:500}}>19.3%</span> · breach: 8.7pts</div>
                </div>
                <div className="pr-row">
                  <div className="prc"><div className="prl">current_retail</div><div className="prv">$6.99</div></div>
                  <div className="prc bad"><div className="prl">margin_now</div><div className="prv" style={{color:"#DC2626"}}>19.3%</div></div>
                  <div className="prc good"><div className="prl">suggested_retail</div><div className="prv" style={{color:"#15803D"}}>$7.49</div></div>
                </div>
                <div className="ai-btns">
                  <button className="ai-approve">✓ approve_and_push_to_pos</button>
                  <button className="ai-review">review</button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className={`fpanel${panel==="chat"?" on":""}`}>
            <div className="fc">
              <h3>Ask AisleOS</h3>
              <p>Ask your data anything in plain English. Powered by Claude Sonnet with full tenant-scoped access to your margins, invoices, DSD history, and pricing across every store you run.</p>
              <div className="flist">
                {[
                  {bg:"#F1F3EE",ic:"🧠",t:"Claude Sonnet Reasoning",d:"Multi-step queries, what-if simulations, and narrative explanations — not just data lookups."},
                  {bg:"#DCFCE7",ic:"🔒",t:"Tenant-Scoped Access",d:"Every query runs against your data only. Schema-per-tenant isolation at the PostgreSQL layer."},
                  {bg:"#FEF3C7",ic:"📡",t:"Streamed via SSE",d:"Answers stream back as they're generated. No loading spinner, no waiting for the full response."},
                ].map((fi)=>(
                  <div className="fli" key={fi.t}>
                    <div className="fli-ic" style={{background:fi.bg}}>{fi.ic}</div>
                    <div><strong>{fi.t}</strong><span>{fi.d}</span></div>
                  </div>
                ))}
              </div>
              <a href="#cta" className="btn btn-forest">Join the waitlist →</a>
            </div>
            <div className="fvis">
              <div className="fv-bar"><div className="fv-dot" style={{background:"#f87171"}}/><div className="fv-dot" style={{background:"#fbbf24"}}/><div className="fv-dot" style={{background:"#6ee7b7"}}/><span className="fv-lbl">ask_aisleos · store_03</span></div>
              <div className="fv-body">
                <div className="chat">
                  <div className="cb u">Show produce margin vs same week last year</div>
                  <div className="cb b">week_09 produce_margin: <span style={{color:"#15803D",fontWeight:500}}>34.1%</span> | lyr_same_week: 32.9%{"\n"}delta: <span style={{color:"#15803D",fontWeight:500}}>+1.2pts YoY</span> — reduced shrink at store_03 (−18%) and strong avocado sell-through. No supplier cost changes in 30d.</div>
                  <div className="cb u">What if chicken runs as a loss leader next week?</div>
                  <div className="cb b">at $2.99/lb (−$1.20 below cost) @ 400lb/wk volume:{"\n"}blended_margin_impact: <span style={{color:"#DC2626",fontWeight:500}}>−0.3pts</span>{"\n"}meat_dept_margin: 18.2% for week{"\n"}suggest: pair rotisserie @ $8.99 to partially offset</div>
                  <div className="chat-in"><span>query your data in plain english…</span><button className="chat-send">run</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section id="metrics">
        <div className="container">
          <div className="met-grid" data-stag="1" ref={countersRef}>
            {[
              {n:"847", prefix:"$", suffix:"", label:"avg DSD variance caught per store / week"},
              {n:"2.4", prefix:"",  suffix:"%", label:"average gross margin lift after 90 days"},
              {n:"94",  prefix:"",  suffix:"%", label:"ghost items resolved within first month"},
              {n:"7",   prefix:"<", suffix:"d", label:"time from signup to first live store"},
            ].map((m)=>(
              <div className="met-card rv" key={m.label}>
                <div className="met-n">
                  <span style={{color:"#6EE7B7",fontFamily:"var(--mono)"}}>{m.prefix}</span>
                  <span data-count={m.n} style={{fontFamily:"var(--mono)"}}>0</span>
                  <span className="accent">{m.suffix}</span>
                </div>
                <div className="met-l">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section id="proof">
        <div className="container">
          <div className="sh rv">
            <div className="chip chip-forest">Early Adopters</div>
            <h2>Grocers who&apos;ve seen<br/>the difference.</h2>
            <p>Pilot operators share what changed when they replaced paper invoices with AisleOS.</p>
          </div>
          <div className="proof-grid" data-stag="1">
            {[
              {bg:"#14532D",i:"M",name:"Mike D.",role:"owner · 4-store chain · ohio",q:"We caught $1,200 in Coke overcharges in the first two weeks. That alone paid for the platform for six months."},
              {bg:"#D97706",i:"R",name:"Rosa M.",role:"ops manager · 7-store chain · texas",q:"Our receivers used to sign whatever the driver handed them. Now they catch cost changes before the truck leaves the dock."},
              {bg:"#DC2626",i:"J",name:"James K.",role:"cfo · 12-store regional · midwest",q:"The ghost item hunter mapped 94% of our open-dept rings in the first month. We finally know our real margin on every item."},
            ].map((t)=>(
              <div className="pc rv" key={t.name}>
                <div className="pc-stars">★★★★★</div>
                <p className="pc-q">&quot;{t.q}&quot;</p>
                <div className="pc-auth">
                  <div className="pc-av" style={{background:t.bg}}>{t.i}</div>
                  <div><div className="pc-name">{t.name}</div><div className="pc-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing">
        <div className="container">
          <div className="sh rv">
            <div className="chip chip-amber">Pricing</div>
            <h2>Per-store. Predictable.<br/>No surprises.</h2>
            <p>You should earn more from this platform than you spend on it — from week one.</p>
          </div>
          <div style={{maxWidth:940,margin:"0 auto"}}>
            <div className="pfound rv">
              <div>
                <strong>🏅 Founding Operator Program — First 50 chains</strong>
                <p>Lock your per-store rate for life. Annual plan includes 2 months free + complimentary BRdata migration.</p>
              </div>
              <a href="#cta" className="btn btn-amber btn-sm" style={{whiteSpace:"nowrap"}}>Claim founding rate</a>
            </div>
            <div className="pplans rv">
              {[
                {tier:"starter",price:"299",pop:false,unit:"per store · annual",
                 desc:"For single-location independents replacing paper invoices and getting first margin visibility.",
                 feats:[{on:true,t:"DSD Receiver App (1 store)"},{on:true,t:"Basic Margin Dashboard"},{on:true,t:"Invoice OCR (100/mo)"},{on:true,t:"1 POS integration"},{on:false,t:"AI Pricing Engine"},{on:false,t:"NL Assistant"},{on:false,t:"Ghost Item Hunter"}],
                 cta:"Join Waitlist",cls:"btn-line"},
                {tier:"growth",price:"599",pop:true,unit:"per store · annual",
                 desc:"For 2–10 store chains ready to deploy the full profit engine and automate pricing decisions.",
                 feats:[{on:true,t:"Everything in Starter"},{on:true,t:"AI Pricing Engine"},{on:true,t:"Ghost Item Hunter"},{on:true,t:"NL Assistant"},{on:true,t:"Unlimited Invoice OCR"},{on:true,t:"3-Way Invoice Match"},{on:true,t:"AI Daily Narratives"}],
                 cta:"Join Waitlist →",cls:"btn-forest"},
                {tier:"enterprise",price:null,pop:false,unit:"10+ stores · custom",
                 desc:"Regional chains with complex POS environments, compliance requirements, or custom integrations.",
                 feats:[{on:true,t:"Everything in Growth"},{on:true,t:"Dedicated tenant infra"},{on:true,t:"Custom POS connectors"},{on:true,t:"SOC 2 data residency"},{on:true,t:"Demand forecasting"},{on:true,t:"Power BI Embedded"},{on:true,t:"On-site onboarding + SLA"}],
                 cta:"Contact Sales",cls:"btn-line"},
              ].map((p)=>(
                <div key={p.tier} className={`pplan${p.pop?" pop":""}`}>
                  {p.pop && <div className="pop-label">⭐ most popular</div>}
                  <div className="plan-tier">{p.tier}</div>
                  {p.price
                    ? <div className="plan-price"><sup>$</sup>{p.price}<sub>/mo</sub></div>
                    : <div className="plan-price" style={{fontSize:"2rem"}}>custom</div>}
                  <div className="plan-unit">{p.unit}</div>
                  <div className="plan-desc">{p.desc}</div>
                  <ul className="plan-feats">
                    {p.feats.map((f)=>(
                      <li key={f.t} className={f.on?"on":""}><span className={f.on?"pfy":"pfn"}>{f.on?"✓":"–"}</span>{f.t}</li>
                    ))}
                  </ul>
                  <a href="#cta" className={`btn ${p.cls} plan-btn`}>{p.cta}</a>
                </div>
              ))}
            </div>
            <div className="addons rv">
              {[
                {name:"BRdata Migration Add-on",desc:"Full DSD history cleanup, gap detection, AI-assisted import with validation PDF report.",price:"$1,500"},
                {name:"POS Connector — IT Retail / NCR",desc:"C# edge agent, bidirectional price sync, offline queue. Included in Growth and above.",price:"included"},
              ].map((a)=>(
                <div className="addon" key={a.name}>
                  <div><div className="addon-name">{a.name}</div><div className="addon-desc">{a.desc}</div></div>
                  <div className="addon-price">{a.price}</div>
                </div>
              ))}
            </div>
            <p className="p-note rv">30-day single-store pilot included. No credit card to join the waitlist. <a href="#cta">Questions? Talk to us →</a></p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta">
        <div className="container">
          <div className="cta-box rv">
            <div className="chip chip-white" style={{margin:"0 auto 18px",display:"inline-flex"}}>limited pilot spots open</div>
            <h2>Ready to see your true margin?</h2>
            <p>Join our founding cohort. We&apos;ll connect your first store — DSD receiver live, POS integrated, margin dashboard running — in under 7 days. Free pilot. No credit card.</p>
            <div className="cta-btns">
              <a href="mailto:hello@aisleos.com" className="btn btn-white btn-lg">Book a free demo →</a>
              <a href="#" className="btn btn-outline-white btn-lg">See a live walkthrough</a>
            </div>
            <div className="cta-trust">
              {["🔒 SOC 2 infra","⚡ live in 7 days","🎓 free onboarding","💳 no credit card"].map((t)=>(
                <div className="ct-i" key={t}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <div className="fg">
            <div>
              <div className="f-logo">
                <div className="f-mark">
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#fff"/>
                    <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#fff"/>
                    <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#fff"/>
                    <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#fff" opacity="0.35"/>
                  </svg>
                </div>
                <div className="f-brand">Aisle<span>OS</span></div>
              </div>
              <p className="f-desc">AI-powered profit operating system for independent and regional US grocery chains. Real-time DSD receiving, margin locking, and automated pricing.</p>
              <div className="chip chip-forest" style={{fontSize:".68rem"}}>protecting margins since day one</div>
            </div>
            {[
              {title:"product",items:["DSD Receiver","Margin Dashboard","AI Pricing Engine","Ghost Item Hunter","Invoice Ledger","NL Assistant"]},
              {title:"integrations",items:["IT Retail","NCR Counterpoint","LOC Software","UNFI EDI","AWG / C&S","BRdata Migration"]},
              {title:"company",items:["About","Blog","Pricing","Contact","Privacy Policy","Terms of Service"]},
            ].map((col)=>(
              <div key={col.title}>
                <div className="f-col-t">{col.title}</div>
                <ul className="f-links">{col.items.map((i)=><li key={i}><span>{i}</span></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="f-bot">
            <div className="f-copy">© 2025 AisleOS · built for independent grocery · hello@aisleos.com</div>
            <div className="f-badges">
              {["SOC 2 Infrastructure","Azure US-East","Multi-Tenant Isolated"].map((b)=><span key={b} className="f-badge">{b}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
