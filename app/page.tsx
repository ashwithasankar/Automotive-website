'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshReflectorMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowUpRight, Camera, ChevronRight, Menu, MessageCircle, Moon, Sun, X } from 'lucide-react'

function WrapObject() {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (state.pointer.x * 0.22) + 0.18, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (state.pointer.y * -0.08) - 0.05, 0.04)
  })
  return <group ref={group} rotation={[0, 0.18, 0]}>
    <mesh rotation={[0, 0, -0.04]} castShadow>
      <boxGeometry args={[3.9, 0.72, 1.82]} />
      <meshStandardMaterial color="#c94f32" roughness={0.28} metalness={0.48} />
    </mesh>
    <mesh position={[0.35, 0.58, 0]} rotation={[0, 0, -0.04]} castShadow>
      <boxGeometry args={[2.25, 0.56, 1.55]} />
      <meshStandardMaterial color="#252726" roughness={0.18} metalness={0.7} />
    </mesh>
    {[[-1.35, -0.48, 0.72], [1.35, -0.48, 0.72], [-1.35, -0.48, -0.72], [1.35, -0.48, -0.72]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <torusGeometry args={[0.28, 0.1, 12, 28]} />
      <meshStandardMaterial color="#111311" roughness={0.22} metalness={0.85} />
    </mesh>)}
    <mesh position={[-0.92, 0.05, 0.92]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.72, 0.2]} />
      <meshBasicMaterial color="#e9e6df" />
    </mesh>
  </group>
}

function ScrollTire() {
  const [motionState, setMotionState] = useState({ x: 0, rotation: 0, drift: 0 })
  const lastScroll = useRef(0)
  const target = useRef({ x: 0, rotation: 0, drift: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      const delta = current - lastScroll.current
      lastScroll.current = current
      target.current = {
        x: THREE.MathUtils.clamp(target.current.x + delta * 0.85, -window.innerWidth * 0.42, window.innerWidth * 0.42),
        rotation: target.current.rotation + delta * 2.8,
        drift: THREE.MathUtils.clamp(delta * 0.018, -0.9, 0.9),
      }
    }

    lastScroll.current = window.scrollY
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let frame = 0
    const animate = () => {
      setMotionState((current) => ({
        x: THREE.MathUtils.lerp(current.x, target.current.x, 0.12),
        rotation: THREE.MathUtils.lerp(current.rotation, target.current.rotation, 0.12),
        drift: THREE.MathUtils.lerp(current.drift, target.current.drift, 0.12),
      }))
      target.current.drift *= 0.94
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <motion.div
    className="scroll-tire"
    aria-hidden="true"
    animate={{ x: motionState.x, rotate: motionState.rotation, y: motionState.drift * 12 }}
    transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.7 }}
  >
    <span className="tire-sidewall" />
    <span className="tire-hub"><i /><i /><i /><i /><i /></span>
  </motion.div>
}

function AnimatedScene() {
  return <Canvas camera={{ position: [5.2, 3.1, 5.2], fov: 34 }} shadows dpr={[1, 1.8]}>
    <color attach="background" args={["#191c19"]} />
    <ambientLight intensity={1.1} />
    <directionalLight position={[4, 6, 3]} intensity={4} color="#fff1e6" castShadow />
    <pointLight position={[-4, 1, -3]} intensity={12} color="#d9502f" />
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.25}>
      <WrapObject />
    </Float>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]}>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial blur={[300, 80]} resolution={512} mixBlur={1} mixStrength={1.2} roughness={0.72} metalness={0.35} color="#20231f" />
    </mesh>
    <Environment preset="studio" />
    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.1} maxPolarAngle={1.75} autoRotate autoRotateSpeed={0.7} />
  </Canvas>
}

const copy = {
  EN: { nav: ['About', 'Services', 'Work', 'Contact'], eyebrow: 'Automotive surface studio / South India', title: <>Designed to<br /><i>move.</i></>, intro: 'Vehicle wraps, graphics and finishing for cars that deserve a second look.', services: 'Capabilities', work: 'Selected work', contact: 'Let’s make your car impossible to ignore.', menu: 'Menu', close: 'Close' },
  TA: { nav: ['எங்களைப் பற்றி', 'சேவைகள்', 'வேலைகள்', 'தொடர்பு'], eyebrow: 'ஆட்டோமோட்டிவ் சர்ஃபேஸ் ஸ்டுடியோ / தென் இந்தியா', title: <>நகரும்<br /><i>வடிவமைப்பு.</i></>, intro: 'இரண்டாவது பார்வைக்கு உரிய கார்களுக்கான ராப்கள், கிராபிக்ஸ் மற்றும் ஃபினிஷிங்.', services: 'திறன்கள்', work: 'தேர்ந்தெடுக்கப்பட்ட வேலைகள்', contact: 'உங்கள் காரை மறக்க முடியாததாக மாற்றுவோம்.', menu: 'மெனு', close: 'மூடு' },
} as const

type Lang = keyof typeof copy
type ServiceKey = 'wrap' | 'graphics' | 'finish'

const services: Record<ServiceKey, { title: string; kicker: string; body: string }> = {
  wrap: { title: 'Vehicle wraps', kicker: '01 / Full surface', body: 'A considered colour and finish change, mapped to the shape of your vehicle and installed with a clean, architectural edge.' },
  graphics: { title: 'Graphic systems', kicker: '02 / Identity', body: 'Stripes, numbers, lettering and campaign graphics built as one visual language across a single car or a whole fleet.' },
  finish: { title: 'Detail & finish', kicker: '03 / Final layer', body: 'The quiet details that make a build feel complete: badges, trims, accents and protective finishing with no visual noise.' },
}

export default function Page() {
  const [lang, setLang] = useState<Lang>('EN')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [active, setActive] = useState<ServiceKey | null>(null)
  const t = copy[lang]

  useEffect(() => { document.documentElement.lang = lang === 'TA' ? 'ta' : 'en'; document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [lang, dark])
  useEffect(() => { const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (setMenuOpen(false), setActive(null)); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [])

  return <main className="site-shell">
    <header className="site-header">
      <a className="brand" href="#top"><span>PW</span><small>PROJECT / WRAP</small></a>
      <nav className="desktop-nav" aria-label="Primary navigation">{t.nav.map((item, i) => <a key={item} href={['#about', '#services', '#work', '#contact'][i]}>{item}</a>)}</nav>
      <div className="header-tools"><button onClick={() => setLang(lang === 'EN' ? 'TA' : 'EN')} aria-label="Change language">{lang}</button><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Change colour theme">{dark ? <Sun /> : <Moon />}</button><button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label={t.menu}><Menu /><span>{t.menu}</span></button></div>
    </header>

    {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}><div className="menu-panel" onClick={e => e.stopPropagation()}><button className="menu-close" onClick={() => setMenuOpen(false)} aria-label={t.close}><X /></button><div className="menu-inner"><p className="eyebrow">PROJECT / WRAP — 2026</p><nav>{t.nav.map((item, i) => <a key={item} href={['#about', '#services', '#work', '#contact'][i]} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{item}<ChevronRight /></a>)}</nav><p className="menu-foot">Coimbatore / India<br />Appointments on request</p></div></div></div>}

    <ScrollTire />

    <motion.section className="hero" id="top" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}><motion.div className="hero-copy" variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="hero-intro">{t.intro}</p><div className="hero-actions"><a className="button button-fill" href="#contact">Start a project <ArrowUpRight /></a><a className="underlink" href="#work">Explore the work <ArrowUpRight /></a></div></motion.div><motion.div className="hero-image hero-scene" variants={{ hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}><AnimatedScene /><div className="image-label">01 <span>/</span> Surface study</div><div className="scene-note">Interactive 3D study<br />Move to inspect</div></motion.div><div className="hero-meta"><span>Scroll to explore</span><span>11° 00′ N / 76° 57′ E</span></div></motion.section>

    <section className="about section" id="about"><div className="section-index">01</div><div className="about-content"><p className="eyebrow">The studio</p><h2>We treat every vehicle as a <i>moving canvas.</i></h2><p className="body-copy">Project / Wrap is an independent automotive surface studio. We combine clear graphic thinking with exacting installation to create work that feels as good up close as it does at speed.</p></div><div className="about-note">No templates.<br />No unnecessary noise.<br /><strong>Just considered work.</strong></div></section>

    <section className="services section" id="services"><div className="section-index">02</div><div className="section-main"><div className="section-heading"><p className="eyebrow">{t.services}</p><h2>Shape the <i>surface.</i></h2></div><div className="service-list">{Object.entries(services).map(([key, item]) => <button className="service-item" key={key} onClick={() => setActive(key as ServiceKey)}><span>0{Object.keys(services).indexOf(key) + 1}</span><strong>{item.title}</strong><small>{item.kicker}</small><ChevronRight /></button>)}</div></div></section>

    <section className="work section" id="work"><div className="section-index">03</div><div className="section-main"><div className="section-heading"><p className="eyebrow">{t.work}</p><h2>Made for the <i>long look.</i></h2></div><div className="project-grid"><article className="project project-large"><img src="/images/wrap-detail.png" alt="Glossy vehicle wrap detail" /><div><span>01 / Surface study</span><strong>Quiet confidence</strong></div></article><article className="project project-dark"><div className="project-mark">P<span>/</span>W</div><div><span>02 / Graphic system</span><strong>Motion, held still</strong></div></article><article className="project project-paper"><div className="project-lines" /><div><span>03 / Detail language</span><strong>Every line considered</strong></div></article></div></div></section>

    <section className="contact section" id="contact"><div className="section-index">04</div><div className="contact-main"><p className="eyebrow">{t.contact}</p><h2>Bring us the<br /><i>blank canvas.</i></h2><div className="contact-links"><a className="button button-fill" href="#contact"><MessageCircle /> WhatsApp <ArrowUpRight /></a><a className="button button-line" href="#contact"><Camera /> Instagram <ArrowUpRight /></a></div><div className="contact-bottom"><span>Coimbatore, Tamil Nadu</span><span>Available by appointment</span></div></div><div className="location-card"><div className="location-heading"><div><p className="eyebrow">Find the studio</p><h3>Come by<br /><i>appointment.</i></h3></div><a className="underlink" href="https://www.google.com/maps/search/?api=1&query=Coimbatore%2C%20Tamil%20Nadu" target="_blank" rel="noreferrer">Get directions <ArrowUpRight /></a></div><div className="map-frame"><iframe title="Map showing Project Wrap in Coimbatore, Tamil Nadu" src="https://www.google.com/maps?q=Coimbatore%2C%20Tamil%20Nadu&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div></section>

    <footer><span className="brand"><span>PW</span><small>PROJECT / WRAP</small></span><span>© 2026 / All surfaces considered.</span><a href="#top">Back to top ↑</a></footer>

    {active && <div className="modal-backdrop" onClick={() => setActive(null)}><article className="service-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)} aria-label="Close details"><X /></button><img src="/images/wrap-detail.png" alt="Close detail of a premium vehicle wrap" /><div><p className="eyebrow">{services[active].kicker}</p><h2>{services[active].title}</h2><p className="body-copy">{services[active].body}</p><a className="button button-fill" href="#contact" onClick={() => setActive(null)}>Discuss a project <ArrowUpRight /></a></div></article></div>}
  </main>
}
