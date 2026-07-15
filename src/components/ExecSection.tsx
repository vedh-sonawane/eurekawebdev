import { Users } from 'lucide-react';

interface Exec {
  name: string;
  role: string;
}

const EXECS: Exec[] = [
  { name: 'Aanya Sharma', role: 'Co-Director' },
  { name: 'Ethan Whitfield', role: 'Co-Director' },
  { name: 'Wei Chen', role: 'Logistics Lead' },
  { name: 'Jasmine Brooks', role: 'Design Lead' },
  { name: 'Arjun Patel', role: 'Tech Lead' },
  { name: 'Mei Lin', role: 'Sponsorship Lead' },
  { name: 'Darnell Jackson', role: 'Hacker Experience' },
  { name: 'Sofia Rodriguez', role: 'Marketing Lead' },
  { name: 'Kabir Singh', role: 'Hardware Lead' },
  { name: 'Olivia Hayes', role: 'Volunteer Coordinator' },
  { name: 'Yuki Tanaka', role: 'Workshops Lead' },
  { name: 'Marcus Williams', role: 'Finance Lead' },
  { name: 'Priya Iyer', role: 'Community Lead' },
  { name: 'Liam O\'Connor', role: 'Mentorship Lead' },
  { name: 'Zara Ahmed', role: 'Operations Lead' },
  { name: 'Daniel Kim', role: 'Web Developer' },
  { name: 'Amara Okafor', role: 'Diversity & Inclusion' },
  { name: 'Ryan Foster', role: 'Events Coordinator' },
  { name: 'Ananya Gupta', role: 'Social Media' },
  { name: 'Tyler Nguyen', role: 'Mobile App Lead' },
  { name: 'Brianna Davis', role: 'Check-in Lead' },
  { name: 'Rohan Mehta', role: 'Judging Coordinator' },
  { name: 'Chloe Anderson', role: 'Prize Coordinator' },
  { name: 'Kenji Yamamoto', role: 'AV & Streaming' },
  { name: 'Maya Thompson', role: 'Food & Beverage' },
  { name: 'Aarav Reddy', role: 'Safety Officer' },
  { name: 'Grace Liu', role: 'Swag & Branding' },
  { name: 'Jordan Blake', role: 'Venue Coordinator' },
  { name: 'Fatima Khan', role: 'Accessibility Lead' },
  { name: 'Nathan Park', role: 'Post-Event Lead' },
];

export function ExecSection() {
  // Split into two columns for opposite scroll directions
  const col1 = EXECS.slice(0, 15);
  const col2 = EXECS.slice(15);

  return (
    <section id="team" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 text-moss-400 mb-4">
          <Users size={16} strokeWidth={2.2} />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">The Expedition Team</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-50 max-w-2xl text-balance">
          30 organizers. One trail.
        </h2>
        <p className="mt-6 font-body text-lg text-cream-100/70 max-w-2xl leading-relaxed">
          EurekaHACKS is put on by builders for builders. Our team of 30 organizers
          spans every discipline — engineering, design, logistics, community —
          united by one belief: that the best ideas emerge when you step into the unknown.
        </p>
      </div>

      {/* Scrolling columns */}
      <div className="mt-16 space-y-4">
        <ScrollColumn execs={col1} direction="left" />
        <ScrollColumn execs={col2} direction="right" />
      </div>

      <div className="max-w-6xl mx-auto mt-12">
        <div className="p-6 rounded-xl glass-cream text-center">
          <p className="font-display text-lg italic text-cream-50">
            "We're not just organizing a hackathon. We're building a community
            where every explorer feels they belong."
          </p>
          <p className="mt-3 font-sans text-xs text-stone-400">— Aanya &amp; Ethan, Co-Directors</p>
        </div>
      </div>
    </section>
  );
}

function ScrollColumn({ execs, direction }: { execs: Exec[]; direction: 'left' | 'right' }) {
  // Duplicate for seamless loop
  const doubled = [...execs, ...execs];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a160a, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a160a, transparent)' }} />

      <div
        className="flex gap-3 w-max"
        style={{
          animation: `${direction === 'left' ? 'scrollLeft' : 'scrollRight'} ${execs.length * 2.5}s linear infinite`,
        }}
      >
        {doubled.map((exec, i) => (
          <div
            key={`${exec.name}-${i}`}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-forest-900/40 border border-forest-700/40 hover:border-moss-400/30 transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-moss-500/15 border border-moss-400/20 flex items-center justify-center font-display text-sm font-semibold text-moss-200 shrink-0">
              {exec.name.charAt(0)}
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-cream-50 whitespace-nowrap">{exec.name}</p>
              <p className="font-body text-xs text-stone-400 whitespace-nowrap">{exec.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
