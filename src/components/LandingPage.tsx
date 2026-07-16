import { useEffect, useState, useRef } from 'react';
import { ArrowRight, MapPin, Calendar, Users, Compass, Code2, Sparkles, TreePine, Waves, Mail, ChevronDown, Star, Heart, Zap, Trophy, Tent } from 'lucide-react';
import { Button } from './ui/Button';
import { ForestScene } from './ForestScene';
import { MentorsSection } from './MentorsSection';
import { ExecSection } from './ExecSection';

interface LandingPageProps {
  onApply: () => void;
  onAdminAccess: () => void;
}

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

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
       <div className="max-w-5xl mx-auto text-center">
  <div className="inline-block mb-8 animate-fade-in">
    <span
      className="font-sans text-xs tracking-wide text-forest-950 px-3 py-1"
      style={{
        background: 'linear-gradient(104deg, transparent 0%, #86a36a 2%, #a8bf90 6%, #86a36a 95%, transparent 98%)',
        borderRadius: '2px',
        boxShadow: '2px 2px 0px rgba(107,138,79,0.15), -1px -1px 0px rgba(107,138,79,0.1)',
        WebkitBoxDecorationBreak: 'clone',
        position: 'relative',
        display: 'inline',
        lineHeight: '1.8',
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
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

          {/* Animated river scene with story overlay */}
          <div className="mt-16 relative rounded-2xl overflow-hidden border border-forest-700/40">
            <ForestScene variant="river" />
            <div className="absolute inset-0 flex items-center">
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

          {/* Journey steps */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Trailhead', desc: 'Your application is the trailhead. Tell us who you are, what you\'ve built, and why you\'re ready to explore.', step: '01' },
              { icon: Sparkles, title: 'The Expedition', desc: '36 hours of building alongside 500 explorers. Workshops, mentors, hardware, and a forest full of surprises await.', step: '02' },
              { icon: Waves, title: 'Eureka', desc: 'The showcase. Present your project to judges, sponsors, and the community. Every project leaves a mark on the trail.', step: '03' },
            ].map((card) => (
              <div key={card.step} className="group relative p-8 rounded-2xl glass-cream hover:border-moss-400/30 transition-all duration-300">
                <span className="absolute top-6 right-6 font-display text-5xl font-semibold text-forest-700/40 group-hover:text-moss-500/30 transition-colors">
                  {card.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-moss-500/15 border border-moss-400/20 flex items-center justify-center mb-5">
                  <card.icon className="text-moss-300" size={22} />
                </div>
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
          <div className="relative rounded-2xl overflow-hidden border border-forest-700/40 mb-16">
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

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { icon: Tent, text: 'Travel reimbursements and lodging for explorers coming from afar' },
                { icon: Code2, text: 'A hardware lab stocked with microcontrollers, sensors, and trail gear' },
                { icon: Zap, text: 'Workshops led by industry trailblazers — from AI to embedded systems' },
                { icon: TreePine, text: 'Quiet forest zones for deep work, loud clearings for collaboration' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 p-4 rounded-xl bg-forest-900/30 border border-forest-700/30">
                  <div className="w-9 h-9 rounded-lg bg-moss-500/15 border border-moss-400/20 flex items-center justify-center shrink-0">
                    <item.icon className="text-moss-300" size={16} />
                  </div>
                  <span className="font-body text-cream-100/75 leading-relaxed pt-1.5">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-forest-700/50 shadow-2xl shadow-forest-950/50">
                <img
                  src="https://images.pexels.com/photos/12716193/pexels-photo-12716193.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Forest river expedition"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-5 rounded-xl glass-forest max-w-[220px]">
                <p className="font-display text-sm text-cream-50 italic leading-relaxed">
                  "The forest teaches you to see what was always there."
                </p>
                <p className="mt-2 font-sans text-xs text-stone-400">— Expedition field notes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community — clearing scene with story */}
      <section id="community" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Clearing scene with campfire */}
          <div className="relative rounded-2xl overflow-hidden border border-forest-700/40 mb-16">
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

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Find your crew', desc: 'Teams of up to 4. Pair with hackers from any school, any background, any experience level. Solo? We\'ll help you find your trail mates.' },
              { icon: Heart, title: 'Make lasting memories', desc: 'Trail mix cooking challenges, stargazing breaks, and a midnight canoe relay. Because the best ideas come when you\'re recharged.' },
              { icon: Trophy, title: 'Win prizes', desc: '$30K in prizes across categories including Best in Forest, Most Adventurous Hardware, and the Eureka Award for boldest idea.' },
            ].map((c) => (
              <div key={c.title} className="p-7 rounded-xl border border-forest-700/40 bg-forest-900/30 hover:bg-forest-900/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-moss-500/15 border border-moss-400/20 flex items-center justify-center mb-4">
                  <c.icon className="text-moss-300" size={18} />
                </div>
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

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {[
              { name: 'Canopy', team: 'Team Mossback', desc: 'A real-time forest canopy analysis tool using drone imagery and satellite data to track biodiversity health across protected woodlands.', tag: 'AI · Computer Vision', img: 'https://images.pexels.com/photos/1671324/pexels-photo-1671324.jpeg?auto=compress&cs=tinysrgb&w=600' },
              { name: 'Riverline', team: 'Team Current', desc: 'A decentralized water-quality monitoring network built on low-cost ESP32 sensors, streaming live data to a public dashboard.', tag: 'IoT · Hardware', img: 'https://images.pexels.com/photos/2406735/pexels-photo-2406735.jpeg?auto=compress&cs=tinysrgb&w=600' },
            ].map((p) => (
              <div key={p.name} className="group rounded-2xl overflow-hidden border border-forest-700/40 bg-forest-900/30 hover:border-moss-400/30 transition-all">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-2xl font-semibold text-cream-50">{p.name}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-river-500/15 text-river-300 text-xs font-sans border border-river-500/20">{p.tag}</span>
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
          <div className="relative rounded-2xl overflow-hidden border border-forest-700/40">
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

      {/* FAQ */}
      <section id="faq" className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionLabel icon={Sparkles} text="Questions" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 mt-4 text-balance">
            Frequently asked questions
          </h2>

          <div className="mt-12 space-y-3">
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
    <div className="rounded-xl border border-forest-700/40 bg-forest-900/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-sans text-base font-medium text-cream-50">{q}</span>
        <ChevronDown size={18} className={`text-stone-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 font-body text-cream-100/65 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}
