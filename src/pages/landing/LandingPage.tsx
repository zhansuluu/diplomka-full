import { Link } from "react-router-dom";
import {
  Briefcase,
  Sparkles,
  CheckCircle,
  Brain,
  FileCheck,
  MoveRight
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="bg-[#F8F7FF] text-black font-sans">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* The Grid Background with Blinking Squares */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#9810FA 1.5px, transparent 1.5px), linear-gradient(90deg, #9810FA 1.5px, transparent 1.5px)`,
            backgroundSize: "40px 40px",
            opacity: 0.1
          }}
        />
        
        {/* Blinking Squares Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
           {/* Chaotic blinking squares spread across the entire grid */}
           {[...Array(80)].map((_, i) => {
              const col = ((i * 7 + 3) * 37 + (i % 5) * 11) % 48;
              const row = ((i * 11 + 5) * 23 + (i % 3) * 7) % 25;
              const delay = ((i * 0.9 + 0.2) % 6).toFixed(1);
              const duration = (1.2 + ((i * 1.7) % 3)).toFixed(1);
              const colors = ['#9810FA', '#8609e0', '#7B2FBE', '#6A0DAD', '#C480FD', '#903ae1'];
              const color = colors[i % colors.length];
              
              return (
                <div 
                  key={i}
                  style={{
                    position: 'absolute',
                    top: row * 40,
                    left: col * 40,
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    opacity: 0,
                    animation: `blink${i % 3} ${duration}s infinite ${delay}s ease-in-out`,
                    animationFillMode: 'backwards'
                  }}
                />
              );
           })}
           
           <style>{`
             @keyframes blink0 {
               0%, 100% { opacity: 0; }
               35%, 65% { opacity: 0.2; }
             }
             @keyframes blink1 {
               0%, 100% { opacity: 0; }
               35%, 65% { opacity: 0.3; }
             }
             @keyframes blink2 {
               0%, 100% { opacity: 0; }
               35%, 65% { opacity: 0.4; }
             }
           `}</style>
        </div>

        <div className="relative z-10">
          <div className="border-2 border-black bg-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-8 shadow-[2px_2px_0px_black]">
            CaseUp
          </div>

          <h1 className="text-5xl md:text-7xl font-[900] leading-[1.1] max-w-4xl tracking-tight">
            Build real <span className="text-[#9810FA]">IT experience.</span> Not simulations.
          </h1>

          <p className="mt-8 max-w-xl mx-auto text-gray-700 font-medium text-lg">
            CaseUp connects students with companies through structured,
            real-world internship programs powered by AI guidance.
          </p>
        <div className="mt-4 flex flex-col gap-2 text-xl font-bold">
            <span>No fake tasks.</span>
            <span>No generic courses.</span>
            <span className="text-[#9810FA]">Only practical, role-based experience.</span>
        </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/signup"
              className="bg-[#9810FA] text-white px-10 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold text-lg flex items-center gap-2"
            >
              Start Your Internship <MoveRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* REAL INTERNSHIPS */}
      <section className="py-24 px-6 text-center bg-white">
        <div className="flex justify-center mb-4">
          <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> What is CaseUp
          </div>
        </div>
        <h2 className="leading-tight flex flex-col justify-center items-center text-center">
          <span className="text-4xl md:text-5xl font-[900]">Real internships. </span>
          <span className="text-[#9810FA] text-4xl md:text-5xl font-[900]">Structured like real jobs.</span>
          <span className="text-lg mt-6 font-medium max-w-2xl text-gray-600">CaseUp connects students with companies through modular, project-based internship programs.</span>
        </h2>

        <div className="mt-12 max-w-3xl mx-auto bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_black] flex flex-col gap-3 text-left">
          <span className="flex justify-center text-xl font-bold">Each internship includes:</span>
          <Feature text="Divided into clear modules" />
          <Feature text="Structured with objectives and requirements" />
          <Feature text="Evaluated by defined acceptance criteria" />
          <Feature text="Supported by AI guidance" />
        </div>

        <p className="mt-8 text-xl font-bold flex flex-col text-center">
          <span>Students don’t just learn.</span> 
          <span className="text-[#9810FA]">They execute.</span>
        </p>
      </section>

{/* 5 STEPS */}
<section className="py-24 bg-[#F8F7FF] px-6 text-center">

  <div className="flex justify-center mb-4">
    <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> How it works
    </div>
  </div>

  <h2 className="text-4xl md:text-5xl font-[900] tracking-tight">
    5 Simple Steps
  </h2>

  <div className="mt-12 max-w-3xl mx-auto flex flex-col gap-5">

    <StepCard
      number="1"
      title="Apply"
      desc="Students apply to internships created by companies."
      icon={<FileCheck size={18} />}
    />

    <StepCard
      number="2"
      title="Get Accepted"
      desc="Once approved, they unlock structured modules."
      icon={<CheckCircle size={18} />}
    />

    <StepCard
      number="3"
      title="Complete Tasks"
      desc="Each module contains real-world tasks: development, design, analytics, product, project management."
      icon={<Briefcase size={18} />}
    />

    <StepCard
      number="4"
      title="AI Guidance"
      desc="AI Mentor explains requirements, clarifies tasks, and gives structured feedback — without giving answers."
      icon={<Brain size={18} />}
      highlight
    />

    <StepCard
      number="5"
      title="Submit Final Work"
      desc="Companies review only final submissions."
      icon={<MoveRight size={18} />}
    />

  </div>
</section>

{/* AI SECTION */}
<section className="py-24 px-6 text-center bg-white">

  {/* Badge */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> AI Mentor
    </div>
  </div>

  {/* Title */}
  <h2 className="text-4xl md:text-5xl font-[900] leading-tight">
    Built-in AI <span className="text-[#9810FA]">Guidance System</span>
  </h2>

  <p className="mt-6 text-lg font-semibold text-gray-700">
    Every task includes AI assistance.
  </p>

  {/* Main AI Card */}
  <div className="mt-12 relative max-w-3xl mx-auto">

    {/* Purple back shadow */}
    <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#CFA6FF] rounded-2xl border-2 border-black"></div>

    <div className="relative bg-white border-[3px] border-black rounded-2xl p-10 text-left">
      <h3 className="text-xl font-black text-center mb-8">The AI:</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <AIPill text="Explains the objective" />
        <AIPill text="Breaks down requirements" />
        <AIPill text="Suggests structure" />
        <AIPill text="Checks completeness" />
        <AIPill text="Reviews alignment with criteria" />
      </div>
    </div>
  </div>

  {/* Black Statement Card */}
  <div className="mt-12 relative inline-block">

    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#9810FA] rounded-xl"></div>

    <div className="relative bg-black text-white px-10 py-6 rounded-xl font-bold text-lg">
      It does not generate solutions.
      <br />
      <span className="text-[#C480FD]">It guides thinking.</span>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="mt-12 relative max-w-3xl mx-auto">

    <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black rounded-2xl"></div>

    <div className="relative bg-white border-[3px] border-black rounded-2xl p-10 text-center">
      <h3 className="font-black text-xl mb-8">This ensures:</h3>

      <div className="flex flex-wrap justify-center gap-6">
        <PurpleButton text="Independent work" />
        <PurpleButton text="Skill development" />
        <PurpleButton text="Structured learning" />
      </div>
    </div>
  </div>

</section>

{/* STUDENTS */}
<section className="py-24 px-6 text-center bg-[#F8F7FF]">

  {/* Badge */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> For Students
    </div>
  </div>

  <h2 className="text-4xl md:text-5xl font-[900] leading-tight mb-12">
    InternHub is for students
    <br />
    who want:
  </h2>

  <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">

    <BrutalCard icon={<FileCheck size={22} />} text="Real portfolio projects" />
    <BrutalCard icon={<Sparkles size={22} />} text="Clear task structure" />
    <BrutalCard icon={<CheckCircle size={22} />} text="Industry-level expectations" />
    <BrutalCard icon={<Briefcase size={22} />} text="Practical IT experience" />

  </div>

  <div className="mt-12 text-2xl font-black">
    Not theory.
    <br />
    <span className="text-[#9810FA]">Execution.</span>
  </div>

</section>

{/* COMPANIES */}
<section className="py-24 px-6 text-center bg-white">

  {/* Badge */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> For Companies
    </div>
  </div>

  <h2 className="text-4xl md:text-5xl font-[900] mb-12">
    Companies can:
  </h2>

  <div className="max-w-2xl mx-auto flex flex-col gap-5">

    <BrutalWideCard icon={<Sparkles size={20} />} text="Create structured internship programs" />
    <BrutalWideCard icon={<FileCheck size={20} />} text="Define modules and tasks" />
    <BrutalWideCard icon={<CheckCircle size={20} />} text="Set objectives and acceptance criteria" />
    <BrutalWideCard icon={<Briefcase size={20} />} text="Review final submissions only" />

  </div>

  {/* Purple CTA */}
  <div className="mt-12 relative max-w-2xl mx-auto">

    <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black rounded-2xl"></div>

    <div className="relative bg-gradient-to-r from-[#7B2FBE] to-[#9810FA] text-white border-[3px] border-black rounded-2xl py-10 px-6 font-bold text-2xl">
      AI handles the guidance layer.
      <br />
      Companies focus on evaluation.
    </div>

  </div>

</section>

{/* WHY US */}
<section className="py-24 px-6 text-center bg-[#F8F7FF]">

  {/* Badge */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#9810FA] text-white px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-[2px_2px_0px_black] border border-black">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> The Difference
    </div>
  </div>

  <h2 className="text-4xl md:text-5xl font-[900] mb-12">
    Why <span className="text-[#9810FA]">CaseUp?</span>
  </h2>

  <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

    {/* LEFT CARD */}
    <div className="bg-white border-[3px] border-black rounded-2xl p-8 shadow-[8px_8px_0px_black] text-left">
      <h3 className="font-black text-2xl mb-8 text-gray-700">
        Most platforms offer:
      </h3>

      <div className="space-y-4">
        <WhyItem negative text="Courses" />
        <WhyItem negative text="Unstructured internships" />
        <WhyItem negative text="Generic assignments" />
      </div>
    </div>

    {/* RIGHT CARD */}
    <div className="bg-gradient-to-br from-[#7B2FBE] to-[#9810FA] border-[3px] border-black rounded-2xl p-8 shadow-[8px_8px_0px_black] text-left text-white">
      <h3 className="font-black text-2xl mb-8">
        CaseUp offers:
      </h3>

      <div className="space-y-4">
        <WhyItem text="Guided modular system" />
        <WhyItem text="Mirrors real IT workflows" />
        <WhyItem text="Structured & measured" />
      </div>
    </div>

  </div>

  {/* Bottom mini brutal card */}
  <div className="mt-12 flex justify-center">
    <div className="bg-white border-[3px] border-black rounded-2xl px-8 py-6 shadow-[6px_6px_0px_black] font-black text-xl">
      Structured.
      <br />
      Measured.
      <br />
      <span className="text-[#9810FA]">Practical.</span>
    </div>
  </div>

</section>

{/* FINAL CTA */}
<section className="py-24 text-center bg-white px-6">

  <h2 className="text-4xl md:text-5xl font-[900] leading-tight mb-12">
    Start building
    <br />
    <span className="text-[#9810FA]">real IT experience</span>
    <br />
    today.
  </h2>

  <div className="flex flex-col sm:flex-row justify-center gap-8">

<div className="flex flex-col sm:flex-row justify-center gap-8">

  {/* Purple Button */}
  <div className="relative">
    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black rounded-xl"></div>

    <Link
      to="/signup"
      className="relative flex items-center justify-center gap-3
                 bg-gradient-to-r from-[#7B2FBE] to-[#9810FA]
                 text-white px-10 py-5 rounded-xl
                 border-[3px] border-black
                 font-black text-lg"
    >
      Explore Internships
      <span className="text-xl">→</span>
    </Link>
  </div>

  {/* White Button */}
  <div className="relative">
    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#CFA6FF] rounded-xl"></div>

    <Link
      to="/signup"
      className="relative flex items-center justify-center gap-3
                 bg-white
                 px-10 py-5 rounded-xl
                 border-[3px] border-black
                 font-black text-lg"
    >
      Create Internship
      <span className="text-xl">+</span>
    </Link>
  </div>

</div>

  </div>

  {/* Divider */}
  <div className="mt-24 border-t border-gray-400 max-w-5xl mx-auto"></div>

  {/* Footer Row */}
  <div className="mt-10 max-w-5xl mx-auto flex justify-between text-sm font-semibold text-gray-600">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 bg-[#9810FA] rounded-full"></div>
      CaseUP
    </div>
    <div>© 2026 CaseUp</div>
  </div>

</section>
    </div>
  );
};

/* UPDATED COMPONENTS WITH EXACT STYLING */

const Feature = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 border-2 border-black p-4 rounded-xl bg-[#F8F7FF] shadow-[2px_2px_0px_black]">
    <CheckCircle size={20} strokeWidth={3} className="text-[#9810FA] shrink-0" />
    <span className="font-bold">{text}</span>
  </div>
);

const StepCard = ({
  number,
  title,
  desc,
  icon,
  highlight
}: {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) => (
  <div
    className={`flex items-center gap-5 text-left px-6 py-6 rounded-xl border-[3px] border-black transition-all
      ${
        highlight
          ? "bg-[#9810FA] text-white"
          : "bg-white"
      }
    `}
    style={{ boxShadow: "6px 6px 0px black" }}
  >
    {/* Number Circle */}
    <div
      className={`w-12 h-12 flex items-center shadow-[4px_4px_0px_black] justify-center rounded-full border-[3px] border-black font-black text-base shrink-0
        ${
          highlight
            ? "bg-white text-[#9810FA]"
            : "bg-[#9810FA] text-white"
        }
      `}
    >
      {number}
    </div>

    {/* Content */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <div>{icon}</div>
        <div className="font-[900] text-lg">{title}</div>
      </div>

      <p
        className={`text-sm font-medium ${
          highlight ? "text-purple-100" : "text-gray-600"
        }`}
      >
        {desc}
      </p>
    </div>
  </div>
);


const AIPill = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 border-2 border-black bg-[#F4F0F8] px-4 py-3 rounded-xl font-semibold shadow-[2px_2px_0px_black]">
    <span className="w-2 h-2 bg-[#9810FA] rounded-full"></span>
    {text}
  </div>
);

const PurpleButton = ({ text }: { text: string }) => (
  <div className="bg-[#9810FA] text-white px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_black] font-bold">
    {text}
  </div>
);

const BrutalCard = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="bg-white border-2 border-black rounded-xl px-4 py-4 flex items-center gap-4 shadow-[4px_4px_0px_black] text-left">
    
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#7B2FBE] to-[#9810FA] border-2 border-black text-white shadow-[2px_2px_0px_black]">
      {icon}
    </div>

    <div className="font-black text-base">{text}</div>
  </div>
);


const BrutalWideCard = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="bg-white border-2 border-black rounded-xl px-4 py-4 flex items-center gap-4 shadow-[4px_4px_0px_black] text-left">
    
    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-black text-[#9810FA] border-2 border-black">
      {icon}
    </div>

    <div className="font-black text-base">{text}</div>
  </div>
);

const WhyItem = ({ text, negative }: { text: string; negative?: boolean }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 ${
    negative
      ? "bg-gray-100 border-gray-300 text-gray-700"
      : "bg-white/10 border-white/30 text-white"
  }`}>
    <span className={`font-black text-lg ${negative ? "text-red-500" : "text-white"}`}>
      {negative ? "✕" : "✓"}
    </span>
    <span className="font-semibold">{text}</span>
  </div>
);

