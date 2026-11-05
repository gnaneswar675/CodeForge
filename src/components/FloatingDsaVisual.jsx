// src/components/FloatingDsaVisual.jsx

export default function FloatingDsaVisual() {
  return (
    <div
      className="hidden lg:flex items-center justify-end flex-shrink-0 relative w-80 xl:w-96 h-28 select-none pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      {/* Soft Ambient Glow Background */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-52 h-20 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-2xl animate-dsa-pulse" />

      {/* Connected Algorithm Graph Nodes & Connecting Lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full text-slate-300/80 dark:text-slate-700/60 overflow-visible"
        viewBox="0 0 360 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Graph Connecting Edges (Dashed Lines) */}
        <line x1="60" y1="42" x2="135" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="135" y1="24" x2="230" y2="35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="230" y1="35" x2="310" y2="78" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="135" y1="24" x2="175" y2="82" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="175" y1="82" x2="270" y2="86" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Highlighted Traversal Path */}
        <path
          d="M 135 24 L 230 35 L 310 78"
          className="stroke-orange-500/40 dark:stroke-orange-400/40"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Connected Node Dots */}
        <circle cx="60" cy="42" r="3" className="fill-slate-300 dark:fill-slate-700" />
        <circle cx="175" cy="82" r="3.5" className="fill-slate-300 dark:fill-slate-600" />
        <circle cx="270" cy="86" r="3" className="fill-orange-400/60" />
        <circle cx="310" cy="78" r="4" className="fill-orange-500/80 dark:fill-orange-400/90" />
      </svg>

      {/* Floating Card 1: Code Syntax & Binary Badge (Top Left) */}
      <div className="absolute left-2 top-1.5 animate-dsa-float flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#131926]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs shadow-slate-900/5 dark:shadow-black/20 backdrop-blur-xs">
        <span className="text-orange-500 font-mono font-bold text-xs tracking-tight">&lt;/&gt;</span>
        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
          0101
        </span>
      </div>

      {/* Floating Card 2: Algorithm Complexity & Active Node (Center Bottom) */}
      <div className="absolute left-24 xl:left-28 bottom-1 animate-dsa-float-delayed flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#131926]/95 border border-orange-500/25 dark:border-orange-500/20 shadow-xs shadow-orange-500/10 backdrop-blur-xs">
        <div className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute w-2 h-2 rounded-full bg-orange-500 animate-ping opacity-75" />
          <span className="relative w-2 h-2 rounded-full bg-orange-500" />
        </div>
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          O(log N)
        </span>
        <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider pl-0.5 border-l border-slate-200 dark:border-slate-800">
          Tree
        </span>
      </div>

      {/* Floating Card 3: Data Structure Pointer / Curly Brackets (Top Right) */}
      <div className="absolute right-2 xl:right-4 top-1 animate-dsa-float-reverse flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#131926]/90 border border-slate-200/90 dark:border-slate-800 shadow-xs shadow-slate-900/5 dark:shadow-black/20 backdrop-blur-xs">
        <span className="font-mono text-xs font-bold text-orange-500">&#123; &#125;</span>
        <span className="font-mono text-[11px] font-medium text-slate-600 dark:text-slate-300">
          node.next
        </span>
      </div>

      {/* Micro Floating Ambient DSA Tokens */}
      <span className="absolute left-20 top-0 animate-dsa-float-reverse font-mono text-[10px] text-slate-400/50 dark:text-slate-500/40 select-none">
        10
      </span>
      <span className="absolute right-36 bottom-2.5 animate-dsa-float font-mono text-[10px] text-orange-500/40 dark:text-orange-400/30 select-none">
        &lt;/&gt;
      </span>
      <span className="absolute right-0 top-11 w-1.5 h-1.5 rounded-full bg-orange-400/60 animate-ping" />
    </div>
  )
}

