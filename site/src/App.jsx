import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight, Clock, MapPin, Menu as MenuIcon, X } from 'lucide-react';

import SplitText from './components/reactbits/SplitText';
import ScrollReveal from './components/reactbits/ScrollReveal';
import CircularText from './components/reactbits/CircularText';
import ScrollVelocity from './components/reactbits/ScrollVelocity';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Smooth scroll: Lenis driven by GSAP's ticker so ScrollTrigger stays in sync */
/* ------------------------------------------------------------------ */
let lenisInstance = null;

function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.35, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

function scrollToId(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e?.preventDefault();
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: 'about', label: 'Our story' },
  { id: 'menu', label: 'Menu' },
  { id: 'beans', label: 'Beans' },
  { id: 'visit', label: 'Visit' }
];

const VALUES = [
  { name: 'Patience', line: 'We brew by hand, even when it’s slower.' },
  { name: 'Honesty', line: 'We know the farms our beans come from, and we pay them fairly.' },
  { name: 'Community', line: 'The shop is a living room for the neighbourhood.' },
  { name: 'Craft over hype', line: 'No trendy gimmicks. Just coffee done right.' }
];

// Prices are placeholders until the owners set them.
const SIGNATURES = [
  {
    name: 'The Sunday',
    price: '5.50',
    note: 'A slow pour-over, served with a small card that tells you about the farm it came from.',
    img: '/img/green-beans.webp',
    alt: 'Green coffee beans in a roaster’s sample scoop, partway through roasting'
  },
  {
    name: 'Honey Oat Latte',
    price: '5.25',
    tag: 'Best seller',
    note: 'Espresso, steamed oat milk and a spoon of local honey. The one everybody orders twice.',
    img: '/img/tamping.webp',
    alt: 'A barista’s hands tamping fresh coffee grounds at the espresso machine'
  },
  {
    name: 'The Long Pause',
    price: '4.75',
    note: 'Cold brew, steeped for twelve hours. It waited, so you don’t have to.',
    img: '/img/roasted-beans.webp',
    alt: 'Freshly roasted coffee beans held up in a steel scoop'
  },
  {
    name: 'Morning Bun',
    price: '3.75',
    note: 'Baked here at 6am every day. Cinnamon, orange zest, a little sticky.',
    img: '/img/morning-buns.webp',
    alt: 'A tray of buns baking in an open stone oven'
  }
];

const REGULARS = [
  ['Espresso', '3.00'],
  ['Cortado', '3.75'],
  ['Flat white', '4.25'],
  ['Cappuccino', '4.25'],
  ['Americano', '3.50'],
  ['Drip coffee', '3.00'],
  ['Chai latte', '4.50'],
  ['Hot chocolate', '4.00'],
  ['Loose-leaf tea', '3.25']
];

// Farm names are placeholders — swap in the real growers.
const FARMS = [
  { who: 'The Ospina family', where: 'Huila, Colombia', cup: 'Brown sugar, red apple, a soft finish.' },
  { who: 'The Bekele family', where: 'Sidama, Ethiopia', cup: 'Blueberry, jasmine, bright and clean.' },
  { who: 'Doña Marta’s farm', where: 'Antigua, Guatemala', cup: 'Cocoa, toasted almond, very round.' }
];

// Hours and street are placeholders until confirmed.
const HOURS = [
  ['Monday – Friday', '7am – 6pm'],
  ['Saturday', '8am – 6pm'],
  ['Sunday', '8am – 4pm']
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */
function Wordmark({ light }) {
  return (
    <a href="#top" className={`wordmark${light ? ' is-light' : ''}`} onClick={e => scrollToId(e, 'top')} aria-label="Slow Rise Coffee Co., back to top">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="wordmark__mark">
        <path d="M7 14h15v5a7.5 7.5 0 0 1-15 0z" fill="currentColor" />
        <path d="M22 15.5h2a3 3 0 0 1 0 6h-2.4" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 4c-2 2.5 2 3.5 0 6.5M17 4c-2 2.5 2 3.5 0 6.5" fill="none" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>
        Slow Rise <em>Coffee Co.</em>
      </span>
    </a>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) lenisInstance?.stop();
    else lenisInstance?.start();
    const onKey = e => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, id) => {
    setOpen(false);
    scrollToId(e, id);
  };

  return (
    <header className={`nav${solid ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="wrap nav__inner">
        <Wordmark />
        <nav aria-label="Main" className="nav__links">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={e => go(e, n.id)} className="link">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#visit" className="btn btn--small nav__cta" onClick={e => go(e, 'visit')}>
          Find a seat
        </a>
        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>
      <div id="mobile-menu" className={`sheet${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile" className="sheet__links">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} onClick={e => go(e, n.id)}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#visit" className="btn" onClick={e => go(e, 'visit')}>
          Find a seat <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const root = useRef(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.hero__photo', { clipPath: 'inset(18% 12% 18% 12% round 400px 400px 28px 28px)', scale: 1.08, duration: 1.8 }, 0.1)
        .from('.hero__photo img', { scale: 1.25, duration: 2.2 }, 0.1)
        .from('.hero__lede, .hero__actions', { y: 24, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.9)
        .from('.hero__stamp', { scale: 0.6, opacity: 0, rotate: -40, duration: 1.4 }, 1.1);

      // Gentle drift on the photo as you leave the hero
      gsap.to('.hero__photo img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root} aria-label="Welcome to Slow Rise Coffee Co.">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <SplitText
            tag="h1"
            text="Good things take a minute."
            className="hero__title"
            splitType="words, chars"
            delay={28}
            duration={1.1}
            effect="rise"
            mask
            textAlign="left"
            rootMargin="0px"
            threshold={0}
          />
          <p className="hero__lede">
            Most coffee shops sell speed. We sell the pause. Every cup is made by hand and served in a real mug, and nobody rushes you
            out the door.
          </p>
          <div className="hero__actions">
            <a href="#visit" className="btn" onClick={e => scrollToId(e, 'visit')}>
              Find a seat <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#menu" className="link link--arrow" onClick={e => scrollToId(e, 'menu')}>
              See what we pour
            </a>
          </div>
        </div>
        <div className="hero__media">
          <figure className="hero__photo">
            <img
              src="/img/espresso.webp"
              alt="Espresso running into a small white cup held under the machine"
              width="1600"
              height="1143"
              fetchPriority="high"
            />
          </figure>
          <div className="hero__stamp">
            <CircularText
              text="SLOW RISE · COFFEE CO · MADE BY HAND · "
              size={150}
              fontSize={13}
              fontWeight={600}
              letterSpacing={2}
              spinDuration={28}
              onHover="slowDown"
              color="var(--cream)"
            >
              <span className="hero__stamp-center" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="34" height="34">
                  <path d="M7 14h15v5a7.5 7.5 0 0 1-15 0z" fill="currentColor" />
                  <path d="M22 15.5h2a3 3 0 0 1 0 6h-2.4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 4c-2 2.5 2 3.5 0 6.5M17 4c-2 2.5 2 3.5 0 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </CircularText>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <ScrollVelocity
        texts={['Pull up a chair. We’ll bring it over.  ·  Good things take a minute.  ·  ']}
        velocity={32}
        numCopies={4}
        className="marquee__text"
        parallaxClassName="marquee__track"
        scrollerClassName="marquee__scroller"
      />
    </div>
  );
}

function About() {
  const root = useRef(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('.about__photo img', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    },
    { scope: root }
  );

  return (
    <section className="about" id="about" ref={root} aria-labelledby="about-title">
      <div className="wrap">
        <div className="about__grid">
          <div className="about__story">
            <h2 id="about-title" className="h2">
              It started in a tiny kitchen.
            </h2>
            <p>
              Slow Rise began with one hand-crank grinder and a founder who was tired of drinking coffee in the car on the way to
              somewhere else.
            </p>
            <p>
              The first customers were neighbours who stopped by on Saturday mornings. They stayed for hours. That’s still the goal:
              a place you want to stay.
            </p>
          </div>
          <figure className="about__photo">
            <img src="/img/tamping.webp" alt="A barista’s hands tamping ground coffee beside the espresso machine" loading="lazy" width="1200" height="800" />
          </figure>
        </div>

        <div className="about__mission">
          <ScrollReveal
            baseOpacity={0.12}
            enableBlur
            baseRotation={0}
            blurStrength={6}
            containerClassName="mission"
            textClassName="mission__text"
            rotationEnd="bottom center"
            wordAnimationEnd="bottom center"
          >
            We’re here to make the best part of your day a little slower, a little warmer, and a little better.
          </ScrollReveal>
        </div>

        <h3 className="sr-only">What we care about</h3>
        <ul className="values" role="list">
          {VALUES.map(v => (
            <li key={v.name} className="value">
              <span className="value__name">{v.name}</span>
              <span className="value__line">{v.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Menu() {
  const [active, setActive] = useState(3);
  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <div className="menu__head">
          <h2 id="menu-title" className="h2">
            What we’re pouring.
          </h2>
          <p className="menu__intro">Four things we’re known for, and the classics we’ll always make. Everything comes in a real mug.</p>
        </div>

        <div className="menu__signature">
          <ul className="sig" role="list">
            {SIGNATURES.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  className={`sig__row${active === i ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  <span className="sig__name">
                    {s.name}
                    {s.tag && <span className="sig__tag">{s.tag}</span>}
                  </span>
                  <span className="sig__price">{s.price}</span>
                  <span className="sig__note">{s.note}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="sig__frame" aria-live="polite">
            {SIGNATURES.map((s, i) => (
              <img key={s.name} src={s.img} alt={active === i ? s.alt : ''} aria-hidden={active !== i} className={active === i ? 'is-active' : ''} loading="lazy" />
            ))}
          </div>
        </div>

        <div className="regulars">
          <h3 className="regulars__title">The regulars</h3>
          <ul className="regulars__list" role="list">
            {REGULARS.map(([name, price]) => (
              <li key={name}>
                <span>{name}</span>
                <span className="dots" aria-hidden="true" />
                <span className="regulars__price">{price}</span>
              </li>
            ))}
          </ul>
          <p className="regulars__note">Oat, almond or whole milk. Paper cups if you really have to go.</p>
        </div>
      </div>
    </section>
  );
}

function Beans() {
  const root = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: '.roast', start: 'top top', end: '+=180%', scrub: 1, pin: true, anticipatePin: 1 }
        });
        tl.to(root.current, { '--bean-bg': '#4a2f1d', ease: 'none', duration: 3 }, 0)
          .to('.roast__img--roasted', { opacity: 1, ease: 'none', duration: 2 }, 0.6)
          .to('.roast__img--green', { scale: 1.06, ease: 'none', duration: 3 }, 0)
          .to('.roast__img--roasted', { scale: 1, ease: 'none', duration: 2.4 }, 0.6)
          .to('.roast__meter-fill', { scaleX: 1, ease: 'none', duration: 3 }, 0)
          .to('.roast__step--1', { opacity: 0.35, duration: 0.3 }, 0.9)
          .to('.roast__step--2', { opacity: 1, duration: 0.3 }, 0.9)
          .to('.roast__step--2', { opacity: 0.35, duration: 0.3 }, 2)
          .to('.roast__step--3', { opacity: 1, duration: 0.3 }, 2);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="beans" id="beans" ref={root} aria-labelledby="beans-title">
      <div className="roast">
        <div className="wrap roast__grid">
          <div className="roast__copy">
            <h2 id="beans-title" className="h2">
              From three farms we know by name.
            </h2>
            <p>
              We buy green coffee straight from three families, pay them fairly, and roast it in small batches every week. Scroll, and
              watch it turn.
            </p>
            <ol className="roast__steps">
              <li className="roast__step roast__step--1">
                <strong>Grown</strong> on hillsides we’ve visited
              </li>
              <li className="roast__step roast__step--2">
                <strong>Roasted</strong> slowly, a few kilos at a time
              </li>
              <li className="roast__step roast__step--3">
                <strong>Poured</strong> by hand, in a real mug
              </li>
            </ol>
            <div className="roast__meter" aria-hidden="true">
              <span>Green</span>
              <span className="roast__meter-bar">
                <span className="roast__meter-fill" />
              </span>
              <span>Roasted</span>
            </div>
          </div>
          <div className="roast__media">
            <img className="roast__img roast__img--green" src="/img/green-beans.webp" alt="Green coffee beans pulled from the roaster early in the roast" loading="lazy" />
            <img className="roast__img roast__img--roasted" src="/img/roasted-beans.webp" alt="The same beans, roasted to a deep brown" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="wrap farms">
        <ul className="farms__list" role="list">
          {FARMS.map(f => (
            <li key={f.who} className="farm">
              <span className="farm__where">
                <MapPin size={16} aria-hidden="true" /> {f.where}
              </span>
              <h3 className="farm__who">{f.who}</h3>
              <p className="farm__cup">{f.cup}</p>
            </li>
          ))}
        </ul>
        <p className="farms__note">Order The Sunday and the card that comes with it tells you which one you’re drinking.</p>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div className="wrap visit__grid">
        <div className="visit__info">
          <h2 id="visit-title" className="h2">
            Come sit for a while.
          </h2>
          <p className="visit__lede">Pull up a chair. We’ll bring it over.</p>

          <div className="visit__block">
            <h3 className="visit__label">
              <Clock size={18} aria-hidden="true" /> Hours
            </h3>
            <dl className="hours">
              {HOURS.map(([d, h]) => (
                <div key={d}>
                  <dt>{d}</dt>
                  <dd>{h}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="visit__block">
            <h3 className="visit__label">
              <MapPin size={18} aria-hidden="true" /> Find us
            </h3>
            <p className="visit__where">Willow Lane, in the Old Town</p>
            <a className="btn" href="https://www.google.com/maps/search/?api=1&query=Slow+Rise+Coffee+Co" target="_blank" rel="noreferrer">
              Get directions <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="visit__side">
          <div className="chalkboard" role="note" aria-label="The chalkboard">
            <p className="chalk chalk--title">Today’s board</p>
            <ul className="chalk chalk--list" role="list">
              <li>Morning Buns out at 6am</li>
              <li>The Sunday: Huila, Colombia</li>
              <li>No laptops rule: there isn’t one</li>
            </ul>
            <p className="chalk chalk--wifi">
              Wi-Fi password? <br />
              It’s on the chalkboard.
            </p>
            <p className="chalk chalk--small">
              (This is the chalkboard. It’s <span className="chalk__pw">takeaminute</span>.)
            </p>
          </div>
          <figure className="visit__photo">
            <img src="/img/oven.webp" alt="Morning buns baking in a stone oven" loading="lazy" width="1200" height="800" />
          </figure>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <SplitText
          tag="p"
          text="Slow down. We saved you a seat."
          className="footer__line"
          splitType="words"
          delay={90}
          duration={1.2}
          effect="rise"
          mask
          textAlign="left"
          rootMargin="-60px"
        />
        <div className="footer__row">
          <Wordmark light />
          <nav aria-label="Footer" className="footer__links">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`} onClick={e => scrollToId(e, n.id)} className="link">
                {n.label}
              </a>
            ))}
            <a href="https://instagram.com" className="link" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </nav>
        </div>
        <p className="footer__credits">
          © {new Date().getFullYear()} Slow Rise Coffee Co. · Photos via Wikimedia Commons: Takeaway (CC BY-SA 3.0), Shixart1985 (CC BY
          2.0), Jameswasswa (CC BY-SA 4.0), Johann Jaritz (CC BY-SA 3.0 AT).
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  useSmoothScroll();
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <Beans />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
