"use client";

import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<"dsd" | "margin" | "ai" | "assistant">("dsd");
  const revealsRef = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    // Scroll reveal
    revealsRef.current = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealsRef.current.forEach((el) => observer.observe(el));

    // Stagger children
    document
      .querySelectorAll(".problem-grid,.how-steps,.proof-grid,.pricing-grid")
      .forEach((grid) => {
        grid.querySelectorAll(".reveal").forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = i * 0.09 + "s";
        });
      });

    // Nav shadow on scroll
    const nav = document.getElementById("main-nav") as HTMLElement;
    const onScroll = () => {
      nav.style.boxShadow =
        window.scrollY > 40 ? "0 4px 24px rgba(30,58,95,0.1)" : "";
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 16px; }
        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #F8FAFC;
          color: #1E3A5F;
          line-height: 1.6;
          overflow-x: hidden;
        }
        :root {
          --navy:    #1E3A5F;
          --blue:    #1D4ED8;
          --green:   #059669;
          --green-lt:#D1FAE5;
          --amber:   #D97706;
          --amber-lt:#FEF3C7;
          --red:     #DC2626;
          --red-lt:  #FEE2E2;
          --slate:   #64748B;
          --slate-lt:#94A3B8;
          --border:  #E2E8F0;
          --border-dk:#CBD5E1;
          --white:   #FFFFFF;
          --surface: #F1F5F9;
          --sh-sm: 0 1px 3px rgba(30,58,95,0.06),0 1px 2px rgba(30,58,95,0.04);
          --sh-md: 0 4px 16px rgba(30,58,95,0.08),0 2px 6px rgba(30,58,95,0.05);
          --sh-lg: 0 16px 48px rgba(30,58,95,0.12),0 4px 16px rgba(30,58,95,0.08);
          --sh-xl: 0 32px 80px rgba(30,58,95,0.16);
          --r-sm:8px; --r-md:12px; --r-lg:20px; --r-xl:28px;
        }
        h1,h2,h3,h4 { font-family:'Sora',sans-serif; line-height:1.2; color:var(--navy); }
        h1 { font-size:clamp(2.1rem,4.2vw,3.6rem); font-weight:800; letter-spacing:-0.03em; }
        h2 { font-size:clamp(1.6rem,2.8vw,2.5rem); font-weight:700; letter-spacing:-0.025em; }
        h3 { font-size:1.1rem; font-weight:600; }
        p  { color:var(--slate); }
        .container { max-width:1140px; margin:0 auto; padding:0 24px; }
        section { padding:88px 0; }

        /* BUTTONS */
        .btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 24px; border-radius:10px;
          font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:600;
          cursor:pointer; transition:all 0.2s ease;
          text-decoration:none; border:none; white-space:nowrap;
        }
        .btn-primary { background:var(--blue); color:#fff; box-shadow:0 4px 14px rgba(29,78,216,0.3); }
        .btn-primary:hover { background:#1a36a3; transform:translateY(-1px); box-shadow:0 6px 20px rgba(29,78,216,0.4); }
        .btn-secondary { background:var(--white); color:var(--navy); border:1.5px solid var(--border-dk); box-shadow:var(--sh-sm); }
        .btn-secondary:hover { border-color:var(--blue); color:var(--blue); transform:translateY(-1px); }
        .btn-lg { padding:15px 32px; font-size:0.975rem; border-radius:12px; }
        .btn-sm { padding:8px 16px; font-size:0.825rem; }
        .btn-white { background:#fff; color:var(--navy); font-weight:700; box-shadow:0 4px 14px rgba(0,0,0,0.14); }
        .btn-white:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.2); }
        .btn-outline-white { background:transparent; color:#fff; border:2px solid rgba(255,255,255,0.3); font-weight:600; }
        .btn-outline-white:hover { border-color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.08); }

        /* BADGES */
        .badge {
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 12px; border-radius:100px; font-size:0.775rem; font-weight:600;
        }
        .badge-blue   { background:#DBEAFE; color:var(--blue); }
        .badge-green  { background:var(--green-lt); color:#065F46; }
        .badge-amber  { background:var(--amber-lt); color:#92400E; }
        .badge-red    { background:var(--red-lt); color:var(--red); }
        .badge-navy   { background:rgba(30,58,95,0.08); color:var(--navy); }

        /* NAV */
        nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:rgba(248,250,252,0.93); backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(226,232,240,0.8); height:64px;
          transition:box-shadow 0.3s;
        }
        .nav-inner {
          max-width:1140px; margin:0 auto; padding:0 24px;
          height:100%; display:flex; align-items:center; justify-content:space-between;
        }
        .nav-logo { display:flex; align-items:center; gap:9px; text-decoration:none; }
        .nav-logo-mark {
          width:32px; height:32px; border-radius:7px; background:var(--navy);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .nav-wordmark { font-family:'Sora',sans-serif; font-size:1.15rem; font-weight:700; color:var(--navy); }
        .nav-wordmark span { color:var(--green); }
        .nav-links { display:flex; align-items:center; gap:2px; }
        .nav-link {
          padding:7px 14px; border-radius:8px; font-size:0.85rem; font-weight:500;
          color:var(--slate); text-decoration:none; transition:all 0.15s;
        }
        .nav-link:hover { color:var(--navy); background:rgba(30,58,95,0.05); }
        .nav-actions { display:flex; align-items:center; gap:8px; }

        /* HERO */
        #hero { padding-top:120px; padding-bottom:72px; background:var(--white); position:relative; overflow:hidden; }
        .hero-bg {
          position:absolute; inset:0; z-index:0;
          background:
            radial-gradient(ellipse 55% 50% at 82% 25%, rgba(29,78,216,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 55% at 8% 82%, rgba(5,150,105,0.04) 0%, transparent 60%);
        }
        .hero-grid-bg {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(30,58,95,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,58,95,0.025) 1px, transparent 1px);
          background-size:56px 56px;
        }
        .hero-inner { position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        .hero-kicker { display:flex; align-items:center; gap:8px; margin-bottom:16px; }
        .kicker-dot { width:6px; height:6px; border-radius:50%; background:var(--green); }
        .kicker-text { font-size:0.8rem; font-weight:600; color:var(--green); letter-spacing:0.05em; text-transform:uppercase; }
        .hero-h1 { margin-bottom:16px; }
        .hero-h1 em { font-style:normal; color:var(--blue); position:relative; }
        .hero-h1 em::after { content:''; position:absolute; bottom:1px; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--blue),var(--green)); border-radius:2px; opacity:0.3; }
        .hero-sub { font-size:1rem; line-height:1.75; margin-bottom:32px; max-width:460px; }
        .hero-actions { display:flex; align-items:center; gap:12px; margin-bottom:36px; flex-wrap:wrap; }
        .hero-trust { display:flex; align-items:center; gap:11px; }
        .trust-avatars { display:flex; }
        .trust-avatar { width:28px; height:28px; border-radius:50%; border:2px solid #fff; margin-left:-6px; font-size:0.62rem; font-weight:700; display:flex; align-items:center; justify-content:center; color:#fff; }
        .trust-avatar:first-child { margin-left:0; }
        .trust-text { font-size:0.8rem; color:var(--slate); }
        .trust-text strong { color:var(--navy); }

        /* Hero visual */
        .hero-visual { position:relative; }
        .hero-app { background:var(--white); border-radius:var(--r-xl); border:1px solid var(--border); box-shadow:var(--sh-xl); overflow:hidden; }
        .app-topbar { background:var(--navy); padding:12px 16px; display:flex; align-items:center; justify-content:space-between; }
        .app-topbar-left { display:flex; align-items:center; gap:7px; }
        .tb-dot { width:8px; height:8px; border-radius:50%; }
        .tb-title { color:#fff; font-family:'Sora',sans-serif; font-size:0.8rem; font-weight:600; margin-left:4px; }
        .tb-sub { color:rgba(255,255,255,0.4); font-size:0.72rem; }
        .app-body { padding:14px; background:var(--surface); }
        .kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-bottom:10px; }
        .kpi-card { background:var(--white); border-radius:var(--r-md); padding:11px 10px; border:1px solid var(--border); text-align:center; }
        .kpi-val { font-family:'Sora',sans-serif; font-size:1.2rem; font-weight:700; color:var(--navy); }
        .kpi-lbl { font-size:0.62rem; color:var(--slate); margin-top:2px; }
        .app-list { display:flex; flex-direction:column; gap:6px; }
        .app-item { background:var(--white); border-radius:var(--r-sm); padding:9px 12px; display:flex; align-items:center; gap:9px; border:1px solid var(--border); }
        .item-icon { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; color:#fff; flex-shrink:0; }
        .item-info { flex:1; min-width:0; }
        .item-name { font-size:0.78rem; font-weight:600; color:var(--navy); }
        .item-meta { font-size:0.67rem; color:var(--slate); }
        .item-badge { font-size:0.62rem; font-weight:600; padding:2px 8px; border-radius:100px; white-space:nowrap; }
        .s-g { background:#DCFCE7; color:#15803D; }
        .s-a { background:#FEF3C7; color:#92400E; }
        .s-r { background:var(--red-lt); color:var(--red); }

        /* Float cards */
        .float-card { position:absolute; background:var(--white); border-radius:var(--r-md); padding:10px 14px; box-shadow:var(--sh-lg); border:1px solid var(--border); display:flex; align-items:center; gap:9px; }
        .fc-1 { top:-12px; right:-16px; animation:float 4s ease-in-out infinite; }
        .fc-2 { bottom:48px; left:-22px; animation:float 4s ease-in-out 2s infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .fc-icon { font-size:1.2rem; }
        .fc-lbl { font-size:0.67rem; color:var(--slate); }
        .fc-val { font-family:'Sora',sans-serif; font-size:0.85rem; font-weight:700; color:var(--navy); }

        /* LOGOS */
        #logos { padding:28px 0; background:var(--white); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
        .logos-lbl { text-align:center; font-size:0.72rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--slate-lt); margin-bottom:18px; }
        .logos-row { display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; }
        .logo-pill { display:flex; align-items:center; gap:7px; padding:6px 16px; border-radius:100px; background:var(--surface); border:1px solid var(--border); font-size:0.8rem; font-weight:600; color:var(--slate); }
        .lp-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

        /* SECTION HEADER */
        .section-header { text-align:center; margin-bottom:52px; }
        .section-header h2 { margin-bottom:10px; }
        .section-header p { max-width:500px; margin:0 auto; font-size:1rem; line-height:1.7; }

        /* PROBLEM */
        #problem { background:#F8FAFC; }
        .problem-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .prob-card { background:var(--white); border-radius:var(--r-lg); padding:24px; border:1px solid var(--border); box-shadow:var(--sh-sm); position:relative; overflow:hidden; }
        .prob-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#FCA5A5,#F87171); }
        .prob-icon { font-size:1.6rem; margin-bottom:10px; }
        .prob-card h3 { margin-bottom:5px; font-size:1rem; }
        .prob-stat { font-family:'Sora',sans-serif; font-size:1.8rem; font-weight:800; color:var(--red); margin-bottom:6px; }
        .prob-card p { font-size:0.85rem; line-height:1.65; }

        /* HOW */
        #how { background:var(--white); }
        .how-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:0; position:relative; }
        .how-steps::before { content:''; position:absolute; top:34px; left:16.66%; right:16.66%; height:2px; background:linear-gradient(90deg,var(--green),var(--blue),var(--amber)); z-index:0; }
        .how-step { text-align:center; padding:0 20px; position:relative; z-index:1; }
        .step-circle { width:68px; height:68px; border-radius:50%; margin:0 auto 18px; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:800; border:3px solid #fff; box-shadow:var(--sh-md); }
        .sc-1 { background:var(--green-lt); color:var(--green); }
        .sc-2 { background:#DBEAFE; color:var(--blue); }
        .sc-3 { background:var(--amber-lt); color:var(--amber); }
        .how-step h3 { font-size:0.975rem; margin-bottom:7px; }
        .how-step p  { font-size:0.84rem; line-height:1.65; }
        .how-tag { display:inline-block; margin-top:10px; font-size:0.72rem; font-weight:600; padding:3px 10px; border-radius:100px; background:var(--surface); color:var(--slate); }

        /* FEATURES */
        #features { background:#F8FAFC; }
        .features-tabs { display:flex; justify-content:center; gap:7px; margin-bottom:48px; flex-wrap:wrap; }
        .feature-tab { padding:8px 18px; border-radius:100px; font-size:0.84rem; font-weight:600; cursor:pointer; transition:all 0.2s; border:1.5px solid var(--border); background:var(--white); color:var(--slate); font-family:'DM Sans',sans-serif; }
        .feature-tab.active { background:var(--navy); color:#fff; border-color:var(--navy); }
        .feature-tab:hover:not(.active) { border-color:var(--blue); color:var(--blue); }
        .feature-panel { display:none; }
        .feature-panel.active { display:grid; grid-template-columns:1fr 1fr; gap:52px; align-items:center; }
        .feat-list { list-style:none; display:flex; flex-direction:column; gap:10px; margin:18px 0 24px; }
        .feat-list li { display:flex; align-items:flex-start; gap:10px; padding:12px; background:var(--white); border-radius:var(--r-md); border:1px solid var(--border); box-shadow:var(--sh-sm); }
        .feat-icon { width:28px; height:28px; border-radius:7px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:0.875rem; }
        .feat-list li strong { display:block; font-size:0.85rem; color:var(--navy); margin-bottom:1px; }
        .feat-list li span { font-size:0.775rem; }
        .feat-visual { background:var(--white); border-radius:var(--r-xl); overflow:hidden; border:1px solid var(--border); box-shadow:var(--sh-lg); }
        .fv-topbar { background:var(--navy); padding:12px 16px; display:flex; align-items:center; gap:6px; }
        .fv-dot { width:8px; height:8px; border-radius:50%; }
        .fv-title { color:rgba(255,255,255,0.55); font-size:0.74rem; margin-left:4px; }
        .fv-body { padding:16px; }

        /* DSD screen */
        .dsd-hdr { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:12px; }
        .dsd-fl { display:flex; flex-direction:column; gap:3px; }
        .dsd-fl-lbl { font-size:0.62rem; font-weight:600; color:var(--slate); text-transform:uppercase; letter-spacing:0.05em; }
        .dsd-fl-val { font-size:0.8rem; font-weight:500; color:var(--navy); padding:5px 9px; background:var(--surface); border:1px solid var(--border); border-radius:6px; }
        .dsd-fl-val.hl { border-color:rgba(29,78,216,0.35); background:#EFF6FF; color:var(--blue); font-weight:700; }
        .dsd-tbl { width:100%; border-collapse:collapse; font-size:0.74rem; }
        .dsd-tbl th { font-size:0.62rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:var(--slate); padding:5px 7px; background:var(--surface); border-bottom:1px solid var(--border); text-align:left; }
        .dsd-tbl td { padding:7px; border-bottom:1px solid var(--border); color:var(--navy); vertical-align:middle; }
        .dsd-tbl tr:last-child td { border-bottom:none; }
        .var-pill { display:inline-flex; align-items:center; font-size:0.62rem; font-weight:700; padding:2px 7px; border-radius:100px; background:var(--amber-lt); color:var(--amber); }
        .dsd-foot { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:var(--surface); border-top:1px solid var(--border); margin-top:2px; }
        .dsd-bal { display:flex; gap:14px; }
        .dsd-bi { display:flex; flex-direction:column; gap:1px; }
        .dsd-bi-lbl { font-size:0.6rem; color:var(--slate); text-transform:uppercase; letter-spacing:0.05em; }
        .dsd-bi-val { font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:700; color:var(--navy); }
        .dsd-bi-val.ok { color:var(--green); }
        .dsd-bi-val.bad { color:var(--red); }
        .post-dis { padding:6px 14px; border-radius:7px; font-size:0.72rem; font-weight:700; background:var(--surface); color:var(--slate-lt); border:1.5px solid var(--border); cursor:not-allowed; }

        /* Margin visual */
        .m-kpis { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:10px; }
        .m-kpi { background:var(--surface); border-radius:var(--r-md); padding:11px 13px; border:1px solid var(--border); }
        .m-kpi-val { font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:700; color:var(--navy); }
        .m-kpi-lbl { font-size:0.65rem; color:var(--slate); margin-top:1px; }
        .m-kpi-dt { font-size:0.65rem; margin-top:2px; font-weight:600; }
        .dt-up { color:var(--green); } .dt-dn { color:var(--red); }
        .m-alerts { display:flex; flex-direction:column; gap:6px; }
        .m-alert { display:flex; align-items:center; gap:8px; background:var(--white); border-radius:var(--r-sm); padding:8px 10px; border:1px solid var(--border); border-left-width:3px; }
        .m-alert.warn { border-left-color:var(--amber); }
        .m-alert.good { border-left-color:var(--green); }
        .m-alert-name { font-size:0.775rem; font-weight:600; color:var(--navy); }
        .m-alert-sub { font-size:0.67rem; color:var(--slate); }

        /* AI chat */
        .ai-chat { display:flex; flex-direction:column; gap:9px; }
        .ai-bubble { max-width:88%; padding:9px 13px; border-radius:11px; font-size:0.775rem; line-height:1.55; }
        .ai-bubble.user { align-self:flex-end; background:var(--blue); color:#fff; border-bottom-right-radius:3px; }
        .ai-bubble.bot { align-self:flex-start; background:var(--surface); border:1px solid var(--border); color:var(--navy); border-bottom-left-radius:3px; }
        .ai-input { display:flex; gap:6px; margin-top:4px; padding:8px 11px; background:var(--surface); border:1px solid var(--border); border-radius:9px; font-size:0.75rem; color:var(--slate-lt); align-items:center; }
        .ai-send { margin-left:auto; background:var(--blue); color:#fff; border:none; border-radius:6px; padding:3px 9px; font-size:0.7rem; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:600; }

        /* PROOF */
        #proof { background:var(--white); }
        .proof-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .proof-card { background:#F8FAFC; border-radius:var(--r-lg); padding:24px; border:1px solid var(--border); box-shadow:var(--sh-sm); }
        .proof-stars { font-size:0.82rem; margin-bottom:10px; color:var(--amber); }
        .proof-quote { font-size:0.875rem; color:var(--navy); line-height:1.65; margin-bottom:14px; font-style:italic; }
        .proof-author { display:flex; align-items:center; gap:9px; }
        .proof-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; color:#fff; flex-shrink:0; }
        .proof-name { font-size:0.82rem; font-weight:600; color:var(--navy); }
        .proof-role { font-size:0.72rem; color:var(--slate); }

        /* PRICING */
        #pricing { background:#F8FAFC; }
        .founding-banner { display:flex; align-items:center; justify-content:space-between; gap:16px; background:linear-gradient(135deg,#FFFBEB,#FEF3C7); border:1px solid #FDE68A; border-radius:var(--r-lg); padding:16px 22px; margin-bottom:28px; }
        .founding-text strong { display:block; font-size:0.875rem; color:var(--navy); margin-bottom:2px; }
        .founding-text p { font-size:0.775rem; }
        .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .plan-card { background:var(--white); border-radius:var(--r-xl); padding:28px; border:1px solid var(--border); box-shadow:var(--sh-sm); position:relative; display:flex; flex-direction:column; }
        .plan-card.popular { border-color:var(--blue); box-shadow:0 8px 32px rgba(29,78,216,0.1); }
        .popular-badge { position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:var(--blue); color:#fff; font-size:0.72rem; font-weight:700; padding:3px 14px; border-radius:100px; white-space:nowrap; }
        .plan-name { font-size:0.77rem; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; color:var(--slate); margin-bottom:10px; }
        .plan-price { font-family:'Sora',sans-serif; font-size:2.6rem; font-weight:800; color:var(--navy); line-height:1; margin-bottom:2px; }
        .plan-price sup { font-size:1rem; vertical-align:super; }
        .plan-price sub { font-size:0.875rem; font-weight:400; color:var(--slate); }
        .plan-unit { font-size:0.75rem; color:var(--slate); margin-bottom:12px; }
        .plan-desc { font-size:0.825rem; line-height:1.6; margin-bottom:18px; padding-bottom:18px; border-bottom:1px solid var(--border); }
        .plan-features { list-style:none; display:flex; flex-direction:column; gap:8px; flex:1; margin-bottom:22px; }
        .plan-features li { display:flex; align-items:flex-start; gap:7px; font-size:0.825rem; color:var(--slate); }
        .plan-features li.on { color:var(--navy); }
        .pf-check { color:var(--green); flex-shrink:0; font-weight:700; font-size:0.85rem; }
        .pf-x { color:var(--slate-lt); flex-shrink:0; font-size:0.85rem; }
        .plan-btn { width:100%; justify-content:center; }
        .addons-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:24px; }
        .addon-card { background:var(--white); border-radius:var(--r-md); padding:15px 18px; border:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:14px; }
        .addon-name { font-size:0.85rem; font-weight:600; color:var(--navy); margin-bottom:2px; }
        .addon-desc { font-size:0.75rem; color:var(--slate); }
        .addon-price { font-family:'Sora',sans-serif; font-size:0.9rem; font-weight:700; color:var(--blue); white-space:nowrap; }
        .pricing-note { text-align:center; margin-top:20px; font-size:0.8rem; color:var(--slate); }
        .pricing-note a { color:var(--blue); text-decoration:none; font-weight:600; }

        /* CTA */
        #cta { padding:0 0 88px; }
        .cta-card { background:linear-gradient(135deg,var(--navy) 0%,#1E40AF 100%); border-radius:var(--r-xl); padding:64px 52px; text-align:center; box-shadow:var(--sh-xl); position:relative; overflow:hidden; }
        .cta-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 80% at 50% -10%,rgba(255,255,255,0.06) 0%,transparent 70%); }
        .cta-card > * { position:relative; z-index:1; }
        .cta-card h2 { color:#fff; margin-bottom:14px; }
        .cta-card p { color:rgba(255,255,255,0.7); max-width:500px; margin:0 auto 32px; font-size:0.975rem; line-height:1.7; }
        .cta-actions { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:28px; }
        .cta-trust { display:flex; justify-content:center; gap:24px; flex-wrap:wrap; }
        .cta-trust-item { display:flex; align-items:center; gap:6px; font-size:0.8rem; color:rgba(255,255,255,0.6); }

        /* FOOTER */
        footer { background:var(--navy); padding:56px 0 28px; }
        .footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:44px; margin-bottom:44px; }
        .footer-logo { display:flex; align-items:center; gap:9px; margin-bottom:12px; }
        .footer-logo-mark { width:28px; height:28px; border-radius:6px; background:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .footer-brand { font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:700; color:#fff; }
        .footer-brand span { color:#6EE7B7; }
        .footer-desc { font-size:0.825rem; color:rgba(255,255,255,0.48); line-height:1.7; margin-bottom:12px; }
        .footer-col-title { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.38); margin-bottom:12px; }
        .footer-links { list-style:none; display:flex; flex-direction:column; gap:7px; }
        .footer-links li span { font-size:0.825rem; color:rgba(255,255,255,0.52); }
        .footer-bottom { display:flex; justify-content:space-between; align-items:center; padding-top:22px; border-top:1px solid rgba(255,255,255,0.1); flex-wrap:wrap; gap:10px; }
        .footer-copy { font-size:0.77rem; color:rgba(255,255,255,0.32); }
        .footer-badges { display:flex; gap:7px; flex-wrap:wrap; }
        .footer-badge { font-size:0.67rem; padding:2px 9px; border-radius:100px; border:1px solid rgba(255,255,255,0.14); color:rgba(255,255,255,0.38); }

        /* REVEAL */
        .reveal { opacity:0; transform:translateY(18px); transition:opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity:1; transform:none; }

        /* RESPONSIVE */
        @media (max-width:1024px) {
          .hero-inner { grid-template-columns:1fr; gap:44px; }
          .hero-visual { max-width:440px; margin:0 auto; }
          .pricing-grid { grid-template-columns:1fr 1fr; }
          .proof-grid { grid-template-columns:1fr 1fr; }
          .footer-grid { grid-template-columns:1fr 1fr; gap:32px; }
        }
        @media (max-width:768px) {
          section { padding:60px 0; }
          .how-steps { grid-template-columns:1fr; gap:28px; }
          .how-steps::before { display:none; }
          .problem-grid { grid-template-columns:1fr; }
          .feature-panel.active { grid-template-columns:1fr; }
          .pricing-grid { grid-template-columns:1fr; }
          .addons-grid { grid-template-columns:1fr; }
          .proof-grid { grid-template-columns:1fr; }
          .cta-card { padding:44px 22px; }
          .footer-grid { grid-template-columns:1fr 1fr; }
          nav .nav-links { display:none; }
          .fc-1,.fc-2 { display:none; }
          .founding-banner { flex-direction:column; align-items:flex-start; }
        }
        @media (max-width:480px) {
          .hero-actions { flex-direction:column; align-items:stretch; }
          .hero-actions .btn { justify-content:center; }
          .footer-grid { grid-template-columns:1fr; }
          .footer-bottom { flex-direction:column; }
          .dsd-hdr { grid-template-columns:1fr; }
        }
      `}</style>

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />

      {/* ===== NAV ===== */}
      <nav id="main-nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="nav-logo-mark">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#F8FAFC" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#F8FAFC" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#F8FAFC" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#F8FAFC" opacity="0.4" />
              </svg>
            </div>
            <div className="nav-wordmark">Aisle<span>OS</span></div>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how" className="nav-link">How it works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#proof" className="nav-link">Stories</a>
          </div>
          <div className="nav-actions">
            <a href="#" className="btn btn-secondary btn-sm">Sign in</a>
            <a href="#cta" className="btn btn-primary btn-sm">Join Waitlist →</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-grid-bg" />
        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-kicker">
                <div className="kicker-dot" />
                <span className="kicker-text">Built for US Independent Grocery Chains</span>
              </div>
              <h1 className="hero-h1">
                Stop guessing your<br /><em>true margin.</em>
              </h1>
              <p className="hero-sub">
                AisleOS digitizes DSD receiving, locks cost at the moment of sale, and uses AI to protect your margins automatically — replacing BRdata and paper invoice chaos.
              </p>
              <div className="hero-actions">
                <a href="#cta" className="btn btn-primary btn-lg">Join the Waitlist →</a>
                <a href="#features" className="btn btn-secondary btn-lg">See the platform</a>
              </div>
              <div className="hero-trust">
                <div className="trust-avatars">
                  <div className="trust-avatar" style={{ background: "#1D4ED8" }}>M</div>
                  <div className="trust-avatar" style={{ background: "#059669" }}>R</div>
                  <div className="trust-avatar" style={{ background: "#7C3AED" }}>J</div>
                  <div className="trust-avatar" style={{ background: "#D97706" }}>S</div>
                </div>
                <p className="trust-text"><strong>Grocers recoup $800+/week</strong> in vendor overcharges on average</p>
              </div>
            </div>
            <div className="hero-visual">
              <div className="float-card fc-1">
                <span className="fc-icon">📉</span>
                <div>
                  <div className="fc-lbl">Margin alert detected</div>
                  <div className="fc-val">Beverage −2.1pts</div>
                </div>
              </div>
              <div className="float-card fc-2">
                <span className="fc-icon">✅</span>
                <div>
                  <div className="fc-lbl">Price pushed to POS</div>
                  <div className="fc-val">$7.49 live in 12s</div>
                </div>
              </div>
              <div className="hero-app">
                <div className="app-topbar">
                  <div className="app-topbar-left">
                    <div className="tb-dot" style={{ background: "#f87171" }} />
                    <div className="tb-dot" style={{ background: "#fbbf24" }} />
                    <div className="tb-dot" style={{ background: "#6ee7b7" }} />
                    <span className="tb-title">📊 Margin Dashboard — Store 3</span>
                  </div>
                  <span className="tb-sub">Mar 5, 2025</span>
                </div>
                <div className="app-body">
                  <div className="kpi-row">
                    <div className="kpi-card"><div className="kpi-val" style={{ color: "#059669" }}>28.3%</div><div className="kpi-lbl">Blended Margin</div></div>
                    <div className="kpi-card"><div className="kpi-val" style={{ color: "#DC2626" }}>3</div><div className="kpi-lbl">Margin Alerts</div></div>
                    <div className="kpi-card"><div className="kpi-val">$847</div><div className="kpi-lbl">DSD Variance</div></div>
                  </div>
                  <div className="app-list">
                    {[
                      { bg: "#1D4ED8", init: "C", name: "Coca-Cola DSD — 24 cs", meta: "Inv #8821 · Cost +8.4%", badge: "⚠ Variance", cls: "s-a" },
                      { bg: "#059669", init: "F", name: "Frito-Lay DSD — 18 cs", meta: "Inv #4410 · Matched", badge: "✓ Posted", cls: "s-g" },
                      { bg: "#DC2626", init: "L", name: "Local Bakery — 6 cs", meta: "Inv #2201 · Dispute open", badge: "Dispute", cls: "s-r" },
                      { bg: "#7C3AED", init: "A", name: "AWG Warehouse — EDI 810", meta: "$2,140.60 · 3-way matched", badge: "✓ Matched", cls: "s-g" },
                    ].map((row) => (
                      <div className="app-item" key={row.name}>
                        <div className="item-icon" style={{ background: row.bg }}>{row.init}</div>
                        <div className="item-info">
                          <div className="item-name">{row.name}</div>
                          <div className="item-meta">{row.meta}</div>
                        </div>
                        <div className={`item-badge ${row.cls}`}>{row.badge}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGOS ===== */}
      <section id="logos">
        <div className="container">
          <div className="logos-lbl">Works with the POS systems and distributors you already use</div>
          <div className="logos-row">
            {[
              { color: "#1D4ED8", label: "IT Retail" },
              { color: "#059669", label: "NCR Counterpoint" },
              { color: "#D97706", label: "LOC Software" },
              { color: "#7C3AED", label: "UNFI / AWG / C&S" },
              { color: "#DC2626", label: "BRdata Migration" },
            ].map((p) => (
              <div className="logo-pill" key={p.label}>
                <div className="lp-dot" style={{ background: p.color }} />{p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section id="problem">
        <div className="container">
          <div className="section-header reveal">
            <div className="badge badge-red" style={{ marginBottom: 14 }}>The Problem</div>
            <h2>Your margin is bleeding — and you can&apos;t see it.</h2>
            <p>Independent grocers operate on 2–4% net margins. The gap between vendor costs and shelf prices is where profits quietly disappear, week after week.</p>
          </div>
          <div className="problem-grid">
            {[
              { icon: "📦", title: "Paper Invoice Chaos", stat: "$847/wk", desc: "DSD drivers hand you a paper invoice. You sign it. No one checks if costs changed since last delivery — until month-end accounting reveals the damage." },
              { icon: "👻", title: "Ghost Items Ringing Up", stat: "12%", desc: 'Transactions ringing as "Open Dept" with no UPC, no cost basis, no margin. Up to 12% of your revenue is invisible to your back office right now.' },
              { icon: "📉", title: "Stale Shelf Prices", stat: "−1.2pts", desc: "Costs increased last Tuesday. Your shelf price still reflects last quarter. You're selling below your target margin for weeks before anyone notices." },
            ].map((c) => (
              <div className="prob-card reveal" key={c.title}>
                <div className="prob-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <div className="prob-stat">{c.stat}</div>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how">
        <div className="container">
          <div className="section-header reveal">
            <div className="badge badge-blue" style={{ marginBottom: 14 }}>How It Works</div>
            <h2>From the dock to the dashboard in three steps.</h2>
            <p>AisleOS wraps your existing POS — no replacement. Deploy the wedge, capture the data, protect the margin.</p>
          </div>
          <div className="how-steps">
            {[
              { n: "1", sc: "sc-1", title: "Deploy the DSD Receiver", desc: "Your receiver scans deliveries on a tablet. Vendor cost changes flagged inline before anyone signs. Paper invoice chaos ends on day one.", tag: "Week 1 — Live in 1 store" },
              { n: "2", sc: "sc-2", title: "Ingest Your POS Sales", desc: "The edge agent connects to IT Retail, NCR, or LOC. Every transaction stamped with cost at time of sale. True margin, always current.", tag: "Week 2–4 — Full integration" },
              { n: "3", sc: "sc-3", title: "AI Protects Your Margins", desc: "Cost breaches your target? The engine suggests a new retail price. One click. Pushed back to your POS — no manual re-keying.", tag: "Week 5+ — Automated" },
            ].map((s) => (
              <div className="how-step reveal" key={s.n}>
                <div className={`step-circle ${s.sc}`}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="how-tag">{s.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features">
        <div className="container">
          <div className="section-header reveal">
            <div className="badge badge-navy" style={{ marginBottom: 14 }}>Platform Features</div>
            <h2>Everything between the dock and the dashboard.</h2>
            <p>Four core modules. One source of financial truth for your entire chain.</p>
          </div>
          <div className="features-tabs reveal">
            {(["dsd", "margin", "ai", "assistant"] as const).map((id) => {
              const labels: Record<string, string> = { dsd: "📲 DSD Receiver", margin: "📊 Margin Dashboard", ai: "🤖 AI Pricing", assistant: "💬 NL Assistant" };
              return (
                <button
                  key={id}
                  className={`feature-tab${activePanel === id ? " active" : ""}`}
                  onClick={() => setActivePanel(id)}
                >
                  {labels[id]}
                </button>
              );
            })}
          </div>

          {/* DSD Panel */}
          <div className={`feature-panel${activePanel === "dsd" ? " active" : ""}`}>
            <div>
              <h3>DSD Receiver App</h3>
              <p style={{ marginTop: 8, fontSize: "0.875rem" }}>Tablet-first receiving built for the dock. Your receiver enters the control total from the paper invoice — the system won&apos;t let them post until it balances to within $0.01.</p>
              <ul className="feat-list">
                <li><div className="feat-icon" style={{ background: "#DBEAFE" }}>🔍</div><div><strong>OCR Invoice Scan</strong><span>Photo the invoice header — AI extracts vendor, invoice #, date, and control total automatically.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#FEF3C7" }}>⚠️</div><div><strong>Inline Cost Variance Alert</strong><span>&quot;This item was $15.50 last week — now $16.80 (+8.4%). Accept or dispute before you sign.&quot;</span></div></li>
                <li><div className="feat-icon" style={{ background: "#D1FAE5" }}>✓</div><div><strong>Balance Enforcement</strong><span>Post button disabled until lines match control total. Hard constraint, not a warning.</span></div></li>
              </ul>
              <a href="#cta" className="btn btn-primary">Join the waitlist →</a>
            </div>
            <div className="feat-visual">
              <div className="fv-topbar">
                <div className="fv-dot" style={{ background: "#f87171" }} />
                <div className="fv-dot" style={{ background: "#fbbf24" }} />
                <div className="fv-dot" style={{ background: "#6ee7b7" }} />
                <span className="fv-title">DSD Receiving · Coca-Cola WBTL · INV-8821</span>
              </div>
              <div className="fv-body">
                <div className="dsd-hdr">
                  <div className="dsd-fl"><div className="dsd-fl-lbl">Vendor</div><div className="dsd-fl-val">Coca-Cola WBTL</div></div>
                  <div className="dsd-fl"><div className="dsd-fl-lbl">Invoice #</div><div className="dsd-fl-val">INV-2024-8821</div></div>
                  <div className="dsd-fl"><div className="dsd-fl-lbl">Delivery Date</div><div className="dsd-fl-val">Mar 5, 2025</div></div>
                  <div className="dsd-fl"><div className="dsd-fl-lbl">Control Total</div><div className="dsd-fl-val hl">$847.20</div></div>
                </div>
                <table className="dsd-tbl">
                  <thead><tr><th>Description</th><th>Qty</th><th>Unit Cost</th><th>Variance</th><th>Ext.</th></tr></thead>
                  <tbody>
                    <tr><td>Coca-Cola 12pk</td><td>24 CS</td><td style={{ color: "#DC2626", fontWeight: 700 }}>$16.80</td><td><span className="var-pill">⚠ +8.4%</span></td><td style={{ fontWeight: 600 }}>$403.20</td></tr>
                    <tr><td>Diet Coke 12pk</td><td>18 CS</td><td>$15.50</td><td style={{ color: "#94A3B8", fontSize: "0.65rem" }}>—</td><td style={{ fontWeight: 600 }}>$279.00</td></tr>
                    <tr><td>Sprite 2L</td><td>24 EA</td><td>$6.88</td><td style={{ color: "#94A3B8", fontSize: "0.65rem" }}>—</td><td style={{ fontWeight: 600 }}>$165.00</td></tr>
                  </tbody>
                </table>
                <div className="dsd-foot">
                  <div className="dsd-bal">
                    <div className="dsd-bi"><span className="dsd-bi-lbl">Lines Total</span><span className="dsd-bi-val bad">$807.20</span></div>
                    <div className="dsd-bi"><span className="dsd-bi-lbl">Control Total</span><span className="dsd-bi-val">$847.20</span></div>
                    <div className="dsd-bi"><span className="dsd-bi-lbl">Difference</span><span className="dsd-bi-val bad">−$40.00</span></div>
                  </div>
                  <button className="post-dis">POST SESSION</button>
                </div>
              </div>
            </div>
          </div>

          {/* Margin Panel */}
          <div className={`feature-panel${activePanel === "margin" ? " active" : ""}`}>
            <div>
              <h3>True Gross Margin Dashboard</h3>
              <p style={{ marginTop: 8, fontSize: "0.875rem" }}>Every sale stamped with its exact cost at the moment of ingest — not today&apos;s cost applied retroactively. Financially accurate margin that reflects reality.</p>
              <ul className="feat-list">
                <li><div className="feat-icon" style={{ background: "#DBEAFE" }}>📌</div><div><strong>Stamp-at-Ingest COGS</strong><span>cost_basis written at transaction time — immutable financial record. Never retroactively recalculated.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#D1FAE5" }}>🏪</div><div><strong>Store / Zone / Chain Views</strong><span>Waterfall pricing logic. Store override beats zone, zone beats chain default. Always the right scope.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#FEE2E2" }}>🤖</div><div><strong>AI Daily Narrative (6AM)</strong><span>&quot;Blended margin 28.3%, down 0.4pts. Primary driver: AWG carbonated beverage cost increase.&quot; Every morning.</span></div></li>
              </ul>
              <a href="#cta" className="btn btn-primary">Join the waitlist →</a>
            </div>
            <div className="feat-visual">
              <div className="fv-topbar">
                <div className="fv-dot" style={{ background: "#f87171" }} />
                <div className="fv-dot" style={{ background: "#fbbf24" }} />
                <div className="fv-dot" style={{ background: "#6ee7b7" }} />
                <span className="fv-title">Margin Dashboard · Week 9 · Store 3</span>
              </div>
              <div className="fv-body">
                <div className="m-kpis">
                  <div className="m-kpi"><div className="m-kpi-val" style={{ color: "#059669" }}>28.3%</div><div className="m-kpi-lbl">Blended Gross Margin</div><div className="m-kpi-dt dt-dn">↓ 0.4pts vs last week</div></div>
                  <div className="m-kpi"><div className="m-kpi-val" style={{ color: "#059669" }}>34.1%</div><div className="m-kpi-lbl">Produce Margin</div><div className="m-kpi-dt dt-up">↑ 1.2pts · Low shrink</div></div>
                  <div className="m-kpi"><div className="m-kpi-val" style={{ color: "#DC2626" }}>21.4%</div><div className="m-kpi-lbl">Beverage Margin</div><div className="m-kpi-dt dt-dn">↓ 2.1pts · Cost spike</div></div>
                  <div className="m-kpi"><div className="m-kpi-val">$847</div><div className="m-kpi-lbl">DSD Variance Caught</div><div className="m-kpi-dt dt-up">↑ This week</div></div>
                </div>
                <div className="m-alerts">
                  <div className="m-alert warn">
                    <span style={{ fontSize: "1rem" }}>⚠️</span>
                    <div><div className="m-alert-name">Coca-Cola 12pk — Margin Breach</div><div className="m-alert-sub">Cost +8.4% · Target breached · Suggested retail: $7.49</div></div>
                    <span className="item-badge s-a" style={{ marginLeft: "auto" }}>Action needed</span>
                  </div>
                  <div className="m-alert good">
                    <span style={{ fontSize: "1rem" }}>✅</span>
                    <div><div className="m-alert-name">Produce — Strong week</div><div className="m-alert-sub">Store 3 shrink −18% · Margin 34.1%</div></div>
                    <span className="item-badge s-g" style={{ marginLeft: "auto" }}>On target</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Pricing Panel */}
          <div className={`feature-panel${activePanel === "ai" ? " active" : ""}`}>
            <div>
              <h3>AI Pricing Engine</h3>
              <p style={{ marginTop: 8, fontSize: "0.875rem" }}>When a DSD session posts, an event fires the pricing engine. Cost increase breaches your category margin target? A suggested price is ready to push to your POS in one click.</p>
              <ul className="feat-list">
                <li><div className="feat-icon" style={{ background: "#FEF3C7" }}>⚡</div><div><strong>Event-Driven Processing</strong><span>DSD post → Service Bus → Cost Worker → Pricing Engine → WebSocket alert. All within seconds of posting.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#DBEAFE" }}>🎯</div><div><strong>Category Margin Targets</strong><span>Set target margins by dept. Waterfall logic applied — store override, zone, then chain default.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#D1FAE5" }}>🔁</div><div><strong>POS Price Push</strong><span>Approve the suggested price. C# edge agent pushes it to IT Retail or NCR automatically.</span></div></li>
              </ul>
              <a href="#cta" className="btn btn-primary">Join the waitlist →</a>
            </div>
            <div className="feat-visual">
              <div className="fv-topbar">
                <div className="fv-dot" style={{ background: "#f87171" }} />
                <div className="fv-dot" style={{ background: "#fbbf24" }} />
                <div className="fv-dot" style={{ background: "#6ee7b7" }} />
                <span className="fv-title">Pricing Engine · New Margin Alert</span>
              </div>
              <div className="fv-body">
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "13px 15px", marginBottom: 11 }}>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#92400E", marginBottom: 5 }}>⚡ Margin Breach Detected</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1E3A5F", marginBottom: 3 }}>Coca-Cola 12pk 12oz</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.5 }}>Cost updated: $15.50 → $16.80 (+8.4%). Beverage target: 28%. Margin at new cost: <strong style={{ color: "#DC2626" }}>19.3%</strong> — breach of 8.7pts.</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 11 }}>
                  <div className="m-kpi"><div style={{ fontSize: "0.6rem", color: "#64748B", marginBottom: 2 }}>Current Retail</div><div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#1E3A5F" }}>$6.99</div></div>
                  <div className="m-kpi" style={{ background: "#FEE2E2", borderColor: "#FECACA" }}><div style={{ fontSize: "0.6rem", color: "#64748B", marginBottom: 2 }}>Current Margin</div><div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#DC2626" }}>19.3%</div></div>
                  <div className="m-kpi" style={{ background: "#D1FAE5", borderColor: "#A7F3D0" }}><div style={{ fontSize: "0.6rem", color: "#64748B", marginBottom: 2 }}>Suggested Retail</div><div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#059669" }}>$7.49</div></div>
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <button style={{ flex: 1, padding: 8, background: "#059669", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.775rem", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✓ Approve &amp; Push to POS</button>
                  <button style={{ padding: "8px 13px", background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: "0.775rem", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Review</button>
                </div>
              </div>
            </div>
          </div>

          {/* NL Assistant Panel */}
          <div className={`feature-panel${activePanel === "assistant" ? " active" : ""}`}>
            <div>
              <h3>Natural Language Assistant</h3>
              <p style={{ marginTop: 8, fontSize: "0.875rem" }}>Ask your data anything in plain English. Powered by Claude Sonnet — with full tenant-scoped access to your stores, margins, invoices, and DSD history.</p>
              <ul className="feat-list">
                <li><div className="feat-icon" style={{ background: "#EDE9FE" }}>🧠</div><div><strong>Claude Sonnet Reasoning</strong><span>Complex multi-step queries, what-if margin simulations, and narrative explanations — not just lookups.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#D1FAE5" }}>🔒</div><div><strong>Tenant-Scoped Access</strong><span>Every query runs against your data only. Schema-per-tenant isolation enforced at the database layer.</span></div></li>
                <li><div className="feat-icon" style={{ background: "#DBEAFE" }}>📡</div><div><strong>Streamed Responses</strong><span>Answers stream back via Server-Sent Events. Results appear as they&apos;re generated — no waiting.</span></div></li>
              </ul>
              <a href="#cta" className="btn btn-primary">Join the waitlist →</a>
            </div>
            <div className="feat-visual">
              <div className="fv-topbar">
                <div className="fv-dot" style={{ background: "#f87171" }} />
                <div className="fv-dot" style={{ background: "#fbbf24" }} />
                <div className="fv-dot" style={{ background: "#6ee7b7" }} />
                <span className="fv-title">AI Assistant · Store 3</span>
              </div>
              <div className="fv-body">
                <div className="ai-chat">
                  <div className="ai-bubble user">Show me last week&apos;s produce margin vs same week last year</div>
                  <div className="ai-bubble bot">
                    <strong>Produce — Week 9 Comparison</strong><br />
                    This week: <strong style={{ color: "#059669" }}>34.1%</strong> &nbsp;|&nbsp; Same week LY: <strong>32.9%</strong><br />
                    <strong style={{ color: "#059669" }}>+1.2pts YoY</strong> — driven by reduced shrink at Store 3 (−18%) and strong avocado sell-through. No supplier cost increases in the last 30 days.
                  </div>
                  <div className="ai-bubble user">What happens to margin if I run chicken as a loss leader?</div>
                  <div className="ai-bubble bot">
                    At $2.99/lb (−$1.20 below cost), blended margin drops ~<strong style={{ color: "#DC2626" }}>0.3pts</strong> at 400lb/week. Meat dept falls to 18.2% for the week. Suggest pairing with rotisserie at $8.99 to partially offset.
                  </div>
                  <div className="ai-input">
                    <span>Ask about margins, vendors, DSD, pricing…</span>
                    <button className="ai-send">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== PROOF ===== */}
      <section id="proof">
        <div className="container">
          <div className="section-header reveal">
            <div className="badge badge-green" style={{ marginBottom: 14 }}>Early Adopters</div>
            <h2>Grocers who&apos;ve seen the difference.</h2>
            <p>Pilot operators share what changed when they replaced paper invoices and BRdata with AisleOS.</p>
          </div>
          <div className="proof-grid">
            {[
              { bg: "#1D4ED8", init: "M", name: "Mike D.", role: "Owner, 4-store chain · Ohio", quote: "We caught $1,200 in Coke overcharges in the first two weeks. That alone paid for the platform for six months." },
              { bg: "#059669", init: "R", name: "Rosa M.", role: "Operations Manager · 7-store chain · Texas", quote: "Our receivers used to just sign whatever the driver handed them. Now they catch cost changes before the truck leaves the dock." },
              { bg: "#7C3AED", init: "J", name: "James K.", role: "CFO, 12-store regional chain · Midwest", quote: "The ghost item hunter mapped 94% of our open-dept rings in the first month. We finally know what our real margin is on every item." },
            ].map((t) => (
              <div className="proof-card reveal" key={t.name}>
                <div className="proof-stars">★★★★★</div>
                <p className="proof-quote">&quot;{t.quote}&quot;</p>
                <div className="proof-author">
                  <div className="proof-avatar" style={{ background: t.bg }}>{t.init}</div>
                  <div><div className="proof-name">{t.name}</div><div className="proof-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing">
        <div className="container">
          <div className="section-header reveal">
            <div className="badge badge-blue" style={{ marginBottom: 14 }}>Pricing</div>
            <h2>Per-store. Predictable. No surprises.</h2>
            <p>You should earn more from this platform than you spend on it — from week one.</p>
          </div>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <div className="founding-banner reveal">
              <div className="founding-text">
                <strong>🏅 Founding Operator Program — First 50 chains</strong>
                <p>Join now and lock your per-store rate for life. Annual plan includes 2 months free + complimentary BRdata migration.</p>
              </div>
              <a href="#cta" className="btn btn-sm" style={{ background: "var(--amber)", color: "#fff", boxShadow: "0 4px 14px rgba(217,119,6,0.28)", borderRadius: 10, whiteSpace: "nowrap" }}>Claim founding rate</a>
            </div>
            <div className="pricing-grid reveal">
              {[
                {
                  name: "Starter", price: "299", popular: false,
                  unit: "per store · annual billing",
                  desc: "For single-location independents replacing paper invoices and getting first margin visibility.",
                  features: [
                    { on: true, text: "DSD Receiver App (1 store)" }, { on: true, text: "Basic Margin Dashboard" },
                    { on: true, text: "Invoice OCR (100/mo)" }, { on: true, text: "1 POS integration" },
                    { on: false, text: "AI Pricing Engine" }, { on: false, text: "NL Assistant" }, { on: false, text: "Ghost Item Hunter" },
                  ],
                  ctaText: "Join Waitlist", ctaCls: "btn-secondary",
                },
                {
                  name: "Growth", price: "599", popular: true,
                  unit: "per store · annual billing",
                  desc: "For 2–10 store chains ready to deploy the full profit engine and automate pricing.",
                  features: [
                    { on: true, text: "Everything in Starter" }, { on: true, text: "AI Pricing Engine" },
                    { on: true, text: "Ghost Item Hunter" }, { on: true, text: "Natural Language Assistant" },
                    { on: true, text: "Unlimited Invoice OCR" }, { on: true, text: "3-Way Invoice Match" }, { on: true, text: "AI Daily Narratives" },
                  ],
                  ctaText: "Join Waitlist →", ctaCls: "btn-primary",
                },
                {
                  name: "Enterprise", price: null, popular: false,
                  unit: "10+ stores · custom contract",
                  desc: "Regional chains with complex POS environments, compliance needs, or custom integrations.",
                  features: [
                    { on: true, text: "Everything in Growth" }, { on: true, text: "Dedicated tenant infra" },
                    { on: true, text: "Custom POS connectors" }, { on: true, text: "SOC 2 data residency" },
                    { on: true, text: "Demand forecasting (AI)" }, { on: true, text: "Power BI Embedded" }, { on: true, text: "On-site onboarding + SLA" },
                  ],
                  ctaText: "Contact Sales", ctaCls: "btn-secondary",
                },
              ].map((plan) => (
                <div key={plan.name} className={`plan-card${plan.popular ? " popular" : ""}`}>
                  {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
                  <div className="plan-name">{plan.name}</div>
                  {plan.price ? (
                    <div className="plan-price"><sup>$</sup>{plan.price}<sub>/mo</sub></div>
                  ) : (
                    <div className="plan-price" style={{ fontSize: "1.9rem", letterSpacing: "-0.01em" }}>Custom</div>
                  )}
                  <div className="plan-unit">{plan.unit}</div>
                  <div className="plan-desc">{plan.desc}</div>
                  <ul className="plan-features">
                    {plan.features.map((f) => (
                      <li key={f.text} className={f.on ? "on" : ""}>
                        <span className={f.on ? "pf-check" : "pf-x"}>{f.on ? "✓" : "–"}</span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                  <a href="#cta" className={`btn ${plan.ctaCls} plan-btn`}>{plan.ctaText}</a>
                </div>
              ))}
            </div>
            <div className="addons-grid reveal">
              <div className="addon-card">
                <div><div className="addon-name">BRdata Migration Add-on</div><div className="addon-desc">Full DSD history cleanup, gap detection, AI-assisted import from BRdata exports with validation PDF report.</div></div>
                <div className="addon-price">$1,500</div>
              </div>
              <div className="addon-card">
                <div><div className="addon-name">POS Connector — IT Retail / NCR</div><div className="addon-desc">C# edge agent deployment, bidirectional price sync, offline queue. Included in Growth and above.</div></div>
                <div className="addon-price">Included</div>
              </div>
            </div>
            <p className="pricing-note reveal">
              30-day single-store pilot included with all plans. No credit card to join the waitlist.{" "}
              <a href="#cta">Questions? Talk to us →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="cta">
        <div className="container">
          <div className="cta-card reveal">
            <div className="badge badge-green" style={{ margin: "0 auto 18px", display: "inline-flex" }}>Limited pilot spots open</div>
            <h2>Ready to see your true margin?</h2>
            <p>Join our founding cohort. We&apos;ll connect your first store — DSD receiver live, POS integrated, margin dashboard running — in under 7 days. Free pilot, no credit card.</p>
            <div className="cta-actions">
              <a href="mailto:hello@aisleos.com" className="btn btn-white btn-lg">Book a free demo →</a>
              <a href="#" className="btn btn-outline-white btn-lg">See a live walkthrough</a>
            </div>
            <div className="cta-trust">
              <div className="cta-trust-item"><span>🔒</span> SOC 2 infrastructure</div>
              <div className="cta-trust-item"><span>⚡</span> Live in under 7 days</div>
              <div className="cta-trust-item"><span>🎓</span> Free onboarding</div>
              <div className="cta-trust-item"><span>💳</span> No credit card required</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <div className="footer-logo-mark">
                  <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="2" width="7" height="7" rx="1.5" fill="#1E3A5F" />
                    <rect x="11" y="2" width="7" height="7" rx="1.5" fill="#1E3A5F" />
                    <rect x="2" y="11" width="7" height="7" rx="1.5" fill="#1E3A5F" />
                    <rect x="11" y="11" width="7" height="7" rx="1.5" fill="#1E3A5F" opacity="0.35" />
                  </svg>
                </div>
                <div className="footer-brand">Aisle<span>OS</span></div>
              </div>
              <p className="footer-desc">AI-powered profit operating system for independent and regional US grocery chains. Real-time DSD receiving, margin locking, and automated pricing.</p>
              <div className="badge badge-green" style={{ fontSize: "0.7rem" }}>Protecting margins since day one.</div>
            </div>
            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links">
                {["DSD Receiver", "Margin Dashboard", "AI Pricing Engine", "Ghost Item Hunter", "Invoice Ledger", "NL Assistant"].map((l) => (
                  <li key={l}><span>{l}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Integrations</div>
              <ul className="footer-links">
                {["IT Retail", "NCR Counterpoint", "LOC Software", "UNFI EDI", "AWG / C&S", "BRdata Migration"].map((l) => (
                  <li key={l}><span>{l}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                {["About", "Blog", "Pricing", "Contact", "Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}><span>{l}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 AisleOS. Built for independent grocery. · hello@aisleos.com</div>
            <div className="footer-badges">
              <span className="footer-badge">SOC 2 Infrastructure</span>
              <span className="footer-badge">Azure US-East</span>
              <span className="footer-badge">Multi-Tenant Isolated</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
