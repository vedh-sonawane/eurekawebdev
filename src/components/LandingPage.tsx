import { useEffect, useState, useRef } from 'react';
import { ArrowRight, MapPin, Calendar, Users, Compass, Code2, Sparkles, TreePine, Waves, Mail, ChevronDown, Star, Heart, Zap, Trophy, Tent } from 'lucide-react';
import { Button } from './ui/Button';
import { ForestScene } from './ForestScene';
import { WaterfallScene } from './ForestEnvironment';
import { MentorsSection } from './MentorsSection';
import { ExecSection } from './ExecSection';

interface LandingPageProps {
  onApply: () => void;
  onAdminAccess: () => void;
}

/** Cycles the hand-inked box variants so no two adjacent cards match. */
const inkVariant = (i: number) => ['', 'ink-2', 'ink-3'][i % 3];

export function LandingPage({ onApply, onAdminAccess }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const compassClicks = useRef(0);
  const compassTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCompassClick = () => {
    compassClicks.current += 1;
    if (compassTimer.current) clearTimeout(compassTimer.current);
    compassTimer.current = setTimeout(() => {
      compassClicks.current = 0;
    }, 800);
    if (compassClicks.current >= 3) {
      compassClicks.current = 0;
      onAdminAccess();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass-forest py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Compass className="text-moss-400" size={24} strokeWidth={2.2} />
            <span className="font-display text-lg font-semibold tracking-tight text-cream-50">
              Eureka<span className="text-moss-400">HACKS</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-cream-100/80">
            <a href="#journey" className="hover:text-cream-50 transition-colors">The Journey</a>
            <a href="#expeditions" className="hover:text-cream-50 transition-colors">Expedition</a>
            <a href="#mentors" className="hover:text-cream-50 transition-colors">Mentors</a>
            <a href="#team" className="hover:text-cream-50 transition-colors">Team</a>
            <a href="#faq" className="hover:text-cream-50 transition-colors">FAQ</a>
          </div>
          <Button size="sm" onClick={onApply} iconRight={<ArrowRight size={16} />}>
            Start Your Journey
          </Button>
        </div>
      </nav>

      {/* Hero — the waterfall lives here and ONLY here.
          overflow-hidden clips it to this section; the content sits above it on z-10. */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <WaterfallScene waterline={0.64} reach={0.72} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block mb-8 animate-fade-in">
            <span
              className="font-sans text-xs tracking-wide px-4 py-2"
              style={{
                background: 'linear-gradient(180deg, #8B5E3C 0%, #6B4423 30%, #7a5333 50%, #5C3A1E 51%, #6B4423 70%, #7a5333 100%)',
                borderRadius: '4px',
                border: '1px solid #4a2e10',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3), 2px 3px 8px rgba(0,0,0,0.4), -1px -1px 4px rgba(0,0,0,0.2)',
                color: '#faf4e8',
                display: 'inline-block',
                backgroundImage: `
                  linear-gradient(180deg, #8B5E3C 0%, #6B4423 30%, #7a5333 50%, #5C3A1E 51%, #6B4423 70%, #7a5333 100%),
                  repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px),
                  repeating-linear-gradient(180deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 8px)
                `,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                letterSpacing: '0.08em',
                position: 'relative',
              }}
            >
              Applications open · Closes August 15 at 11:59 PM PT
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-cream-50 leading-[1.05] text-balance text-shadow-forest animate-fade-up">
            A journey through
            <br />
            <span className="italic text-moss-300">code</span> &amp; <span className="italic text-river-300">discovery</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto font-body text-lg md:text-xl text-cream-100/75 leading-relaxed text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
            This October, join 500+ explorers at the edge of the forest. Build through 36 hours of
            wilderness-inspired hacking, mentorship from trailblazers, and a community that thinks
            differently. Your expedition begins here.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" onClick={onApply} icon={<Compass size={20} />} iconRight={<ArrowRight size={18} />}>
              Begin Your Expedition
            </Button>
            <a href="#journey">
              <Button size="lg" variant="outline">
                Explore the Trail
              </Button>
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Users, value: '500+', label: 'Explorers' },
              { icon: Calendar, value: '36 hrs', label: 'Of building' },
              { icon: TreePine, value: '12', label: 'Mentors' },
              { icon: Code2, value: '$30K', label: 'In prizes' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <s.icon className="text-moss-400/70 mb-1" size={20} />
                <span className="font-display text-2xl font-semibold text-cream-50">{s.value}</span>
                <span className="font-sans text-xs text-stone-400 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-pulse-soft">
          <ChevronDown className="text-cream-100/40" size={28} />
        </div>
      </section>

      {/* The Journey — story with animated river scene */}
      <section id="journey" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionLabel icon={Compass} text="The Journey" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 max-w-2xl text-balance">
            Every great discovery starts with a single step into the unknown
          </h2>
          <p className="mt-6 font-body text-lg text-cream-100/70 max-w-2xl leading-relaxed">
            EurekaHACKS isn't just a hackathon — it's an expedition. We've designed every stage
            to feel like a journey through the wilderness, from your first application to the
            final showcase beneath the canopy.
          </p>

          {/* River scene with story text */}
          <div className="relative overflow-hidden border border-forest-700/40 mt-12">
            <ForestScene variant="river" />
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="max-w-md ml-8 md:ml-16 p-6">
                <p className="font-display text-2xl md:text-3xl font-semibold text-cream-50 leading-tight text-shadow-forest">
                  The river carries you forward.
                </p>
                <p className="mt-3 font-body text-cream-100/80 leading-relaxed">
                  From the moment you apply, you're following a current — one that leads
                  through workshops, mentorship, and 36 hours of building toward something
                  you've never made before.
                </p>
              </div>
            </div>
          </div>

          {/* Journey steps — hand-inked boxes. The numbering earns its keep here:
              this is an actual sequence, trailhead → expedition → showcase. */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Trailhead', desc: 'Your application is the trailhead. Tell us who you are, what you\'ve built, and why you\'re ready to explore.', step: '01' },
              { icon: Sparkles, title: 'The Expedition', desc: '36 hours of building alongside 500 explorers. Workshops, mentors, hardware, and a forest full of surprises await.', step: '02' },
              { icon: Waves, title: 'Eureka', desc: 'The showcase. Present your project to judges, sponsors, and the community. Every project leaves a mark on the trail.', step: '03' },
            ].map((card, i) => (
              <div key={card.step} className={`group relative p-8 ink ${inkVariant(i)}`}>
                <span className="absolute top-6 right-7 font-display text-5xl font-semibold text-forest-700/40 group-hover:text-moss-500/40 transition-colors">
                  {card.step}
                </span>
                <card.icon className="text-moss-300 mb-5" size={24} strokeWidth={1.8} />
                <h3 className="font-display text-2xl font-semibold text-cream-50 mb-3">{card.title}</h3>
                <p className="font-body text-cream-100/65 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expedition — canopy scene with story */}
      <section id="expeditions" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Canopy scene with story text */}
          <div className="relative overflow-hidden border border-forest-700/40 mb-16">
            <ForestScene variant="canopy" />
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="max-w-md mr-8 md:mr-16 p-6">
                <p className="font-display text-2xl md:text-3xl font-semibold text-cream-50 leading-tight text-shadow-forest">
                  Light breaks through the canopy.
                </p>
                <p className="mt-3 font-body text-cream-100/80 leading-relaxed">
                  We believe the best ideas emerge when you step outside your comfort zone.
                  EurekaHACKS is designed to lower barriers and raise ambitions — whether
                  it's your first hackathon or your fifteenth.
                </p>
              </div>
            </div>
          </div>

          <SectionLabel icon={TreePine} text="The Expedition" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 text-balance">
            Built for those who think differently
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-12">
            {/* Packing list — hairline rules, no boxes */}
            <div className="border-y border-forest-700/30 divide-y divide-forest-700/30">
              {[
                { icon: Tent, text: 'Travel reimbursements and lodging for explorers coming from afar' },
                { icon: Code2, text: 'A hardware lab stocked with microcontrollers, sensors, and trail gear' },
                { icon: Zap, text: 'Workshops led by industry trailblazers — from AI to embedded systems' },
                { icon: TreePine, text: 'Quiet forest zones for deep work, loud clearings for collaboration' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-4 py-5">
                  <item.icon className="text-moss-300 shrink-0 mt-1" size={18} strokeWidth={1.8} />
                  <span className="font-body text-cream-100/75 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden border border-forest-700/50 shadow-2xl shadow-forest-950/50">
                <img
                  src="https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Forest river expedition"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* The one playful moment on the page: an actual speech bubble,
                  ink outline + hand-drawn tail. It's opaque because it sits on
                  a photograph and the type has to stay readable. */}
              <div className="absolute -bottom-8 -left-6 max-w-[240px] p-5 ink ink-bubble bg-forest-950/85 backdrop-blur-sm">
                <p className="font-display text-sm text-cream-50 italic leading-relaxed">
                  "The forest teaches you to see what was always there."
                </p>
                <p className="mt-2 font-sans text-xs text-stone-400">— Expedition field notes</p>
                <svg
                  className="absolute -bottom-[17px] left-10"
                  width="32"
                  height="20"
                  viewBox="0 0 32 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 1C4.5 8 9 14 22 18.5C15 13 10 7.5 7.5 1"
                    stroke="#faf4e8"
                    strokeOpacity="0.65"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community — clearing scene with story */}
      <section id="community" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Clearing scene with campfire */}
          <div className="relative overflow-hidden border border-forest-700/40 mb-16">
            <ForestScene variant="clearing" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-lg text-center p-6">
                <p className="font-display text-2xl md:text-3xl font-semibold text-cream-50 leading-tight text-shadow-forest">
                  You won't walk this trail alone.
                </p>
                <p className="mt-3 font-body text-cream-100/80 leading-relaxed">
                  Step into a vibrant community of curious, creative builders from across
                  the continent. Gather around the fire, share ideas, and find your crew.
                </p>
              </div>
            </div>
          </div>

          <SectionLabel icon={Users} text="Community" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 max-w-3xl text-balance">
            Find your crew. Make lasting memories.
          </h2>

          {/* Columns divided by hairlines — no cards */}
          <div className="mt-16 grid md:grid-cols-3 border-t border-forest-700/40 md:divide-x md:divide-forest-700/40">
            {[
              { icon: Users, title: 'Find your crew', desc: 'Teams of up to 4. Pair with hackers from any school, any background, any experience level. Solo? We\'ll help you find your trail mates.' },
              { icon: Heart, title: 'Make lasting memories', desc: 'Trail mix cooking challenges, stargazing breaks, and a midnight canoe relay. Because the best ideas come when you\'re recharged.' },
              { icon: Trophy, title: 'Win prizes', desc: '$30K in prizes across categories including Best in Forest, Most Adventurous Hardware, and the Eureka Award for boldest idea.' },
            ].map((c) => (
              <div key={c.title} className="py-8 border-b border-forest-700/40 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <c.icon className="text-moss-300 mb-4" size={20} strokeWidth={1.8} />
                <h3 className="font-display text-xl font-semibold text-cream-50 mb-3">{c.title}</h3>
                <p className="font-body text-cream-100/65 leading-relaxed text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past projects */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionLabel icon={Code2} text="Past Expeditions" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 max-w-2xl text-balance">
            Ideas that grew from the forest floor
          </h2>
          <p className="mt-6 font-body text-lg text-cream-100/70 max-w-2xl leading-relaxed">
            Every year, explorers bring bold ideas to life. Here are a few projects from past
            EurekaHACKS expeditions — and the stories behind them.
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {[
              { name: 'Canopy', team: 'Team Mossback', desc: 'A real-time forest canopy analysis tool using drone imagery and satellite data to track biodiversity health across protected woodlands.', tag: 'AI · Computer Vision', img: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { name: 'Riverline', team: 'Team Current', desc: 'A decentralized water-quality monitoring network built on low-cost ESP32 sensors, streaming live data to a public dashboard.', tag: 'IoT · Hardware', img: 'https://images.pexels.com/photos/2406735/pexels-photo-2406735.jpeg?auto=compress&cs=tinysrgb&w=600' },
            ].map((p) => (
              <div key={p.name} className="group">
                <div className="aspect-[16/9] overflow-hidden border border-forest-700/40 group-hover:border-moss-400/40 transition-colors">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="pt-5">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-display text-2xl font-semibold text-cream-50">{p.name}</h3>
                    <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-river-300 shrink-0">{p.tag}</span>
                  </div>
                  <p className="font-sans text-sm text-stone-400 mb-3">{p.team}</p>
                  <p className="font-body text-cream-100/65 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors section with pixelating images */}
      <MentorsSection />

      {/* Exec section with scrolling names */}
      <ExecSection />

      {/* Dusk scene — closing story moment */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden border border-forest-700/40">
            <ForestScene variant="dusk" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-lg text-center p-6">
                <Star className="mx-auto text-gold-400 mb-4" size={24} />
                <p className="font-display text-2xl md:text-3xl font-semibold text-cream-50 leading-tight text-shadow-forest">
                  As the sun sets, the real work begins.
                </p>
                <p className="mt-3 font-body text-cream-100/80 leading-relaxed">
                  36 hours. One forest. A community waiting to see what you'll build.
                  The trail is waiting — are you ready?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — a list, not a stack of cards */}
      <section id="faq" className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel icon={Sparkles} text="Questions" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 text-balance">
            Frequently asked questions
          </h2>

          <div className="mt-12 border-t border-forest-800/60">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Compass className="mx-auto text-moss-400 mb-6" size={40} />
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-cream-50 text-balance">
            The trail is waiting.
            <br />
            <span className="italic text-moss-300">Are you ready?</span>
          </h2>
          <p className="mt-6 font-body text-lg text-cream-100/70 max-w-xl mx-auto">
            Applications close August 15. Don't miss your chance to join the expedition.
          </p>
          <div className="mt-10">
            <Button size="lg" onClick={onApply} icon={<Compass size={20} />} iconRight={<ArrowRight size={18} />}>
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-forest-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCompassClick}
              className="cursor-default select-none"
              aria-label="EurekaHACKS"
              title=""
            >
              <Compass className="text-moss-400" size={20} />
            </button>
            <span className="font-display text-sm font-semibold text-cream-50">
              Eureka<span className="text-moss-400">HACKS</span>
            </span>
          </div>
          <p className="font-body text-sm text-stone-400">
            For questions, reach us at <a href="mailto:hello@eurekahacks.com" className="text-moss-300 hover:text-moss-200 inline-flex items-center gap-1"><Mail size={13} />hello@eurekahacks.com</a>
          </p>
          <p className="font-body text-xs text-stone-500">Made with care in the Pacific Northwest.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-moss-400">
      <Icon size={16} strokeWidth={2.2} />
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">{text}</span>
    </div>
  );
}

const FAQS = [
  { q: 'What is EurekaHACKS?', a: 'EurekaHACKS is a 36-hour hackathon where 500+ students of all skill levels come together to experiment, build, and create unique software or hardware projects from scratch. We provide mentors, workshops, sponsors, hardware, and a forest full of inspiration.' },
  { q: 'Who can participate?', a: 'Any student or recent graduate (within 12 months of graduation) is welcome. Whether it\'s your first hackathon or your tenth — we\'ve had everyone from first-time coders to seasoned builders ship incredible projects.' },
  { q: 'How much does it cost?', a: 'Nothing. EurekaHACKS is completely free to attend. We cover meals, lodging, and provide travel reimbursements so you can focus on building.' },
  { q: 'What if I\'ve never been to a hackathon?', a: 'Perfect. Most of our explorers are first-timers. We have beginner-friendly workshops, a team-matching session, and mentors who love helping people ship their first project.' },
  { q: 'How many people can be on a team?', a: 'Teams of up to 4. You can team up with anyone — any school, any country, any experience level. Teams can be formed before or during the event.' },
  { q: 'When do applications close?', a: 'Applications close August 15 at 11:59 PM PT. We review on a rolling basis, so applying early improves your chances.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-forest-800/60">
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center justify-between gap-6 py-5 text-left"
      >
        <span className="font-sans text-base font-medium text-cream-50 group-hover:text-moss-200 transition-colors">{q}</span>
        <ChevronDown size={18} className={`text-stone-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 font-body text-cream-100/65 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}