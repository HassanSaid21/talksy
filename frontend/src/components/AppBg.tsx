import type { ReactNode } from "react";

export default function AppBg({ children }: { children: ReactNode }) {
  return (
    
     <div className="  min-h-screen bg-linear-to-tr from-black  via-sky-950 to-gray-950  relative overflow-hidden flex items-center justify-center p-4">
      {/* Grid background (no glows) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none ">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            
            <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(203,213,225,0.12)" strokeWidth="0.8" shapeRendering="crispEdges" />
            </pattern>

         
            <pattern id="largeGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M200 0H0V200" fill="none" stroke="rgba(203,213,225,0.20)" strokeWidth="1.2" shapeRendering="crispEdges" />
            </pattern>
          </defs>

      
          <rect width="100%" height="100%" fill="url(#smallGrid)" opacity="0.85" />
          <rect width="100%" height="100%" fill="url(#largeGrid)" opacity="0.9" />

         
          <rect width="100%" height="100%" fill="black" opacity="0.02" />
        </svg>
      </div>

      {children}
    </div>
  )
}
