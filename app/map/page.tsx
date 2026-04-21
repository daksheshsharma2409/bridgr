"use client";

import { Map as MapIcon, DoorOpen } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMockData } from "@/lib/MockDataContext";

const themeClasses = {
  primary: { orb: "bg-primary", chip: "border-primary/30 text-primary", avatar: "border-primary/30" },
  quest: { orb: "bg-quest", chip: "border-quest/30 text-quest", avatar: "border-quest/30" },
  online: { orb: "bg-online", chip: "border-online/30 text-online", avatar: "border-online/30" },
  alert: { orb: "bg-alert", chip: "border-alert/30 text-alert", avatar: "border-alert/30" },
} as const;

export default function SpatialHub() {
  const container = useRef<HTMLDivElement>(null);
  const { rooms, enterRoom } = useMockData();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".spatial-anim",
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.45,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="space-y-4 md:space-y-6 max-w-5xl mx-auto pb-8">
      <section className="spatial-anim rounded-3xl border border-border-subtle bg-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-heading font-black text-text tracking-tight uppercase">Spatial Hub</h2>
          <p className="text-sm font-mono text-primary mt-2">Physical Campus Club Rooms & Real-time Occupancy.</p>
        </div>
        <div className="bg-card p-3 rounded-lg border border-border-subtle flex items-center gap-3">
           <MapIcon className="w-6 h-6 text-primary" />
           <span className="font-heading font-bold text-sm">Main Campus</span>
        </div>
      </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="spatial-anim bg-card rounded-3xl border border-border-subtle p-4 md:p-5 hover:shadow-[0_0_20px_var(--color-primary)] transition-all cursor-pointer group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-32 h-32 ${themeClasses[room.theme].orb} opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity`} />
             
             <div className="flex justify-between items-start mb-4 relative z-10">
               <div>
                 <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-background border ${themeClasses[room.theme].chip} mb-2 inline-block`}>{room.purpose}</span>
                 <h3 className="text-lg md:text-xl font-heading font-bold text-text leading-tight">{room.name}</h3>
               </div>
               <div className="flex flex-col items-end">
                 <span className={`text-2xl font-black font-heading ${room.occupancy > (room.capacity * 0.8) ? 'text-quest' : 'text-online'}`}>{room.occupancy}</span>
                 <span className="text-[10px] text-muted font-bold uppercase tracking-wider">/ {room.capacity} Nerds</span>
               </div>
             </div>

             <div className="relative z-10 pt-4 border-t border-border-subtle flex justify-between items-center">
               <div className="flex -space-x-2">
                 {[...Array(Math.min(room.occupancy, 4))].map((_, i) => (
                   <div key={`${room.id}-${i}`} className={`w-8 h-8 rounded-full bg-background border-2 border-card flex items-center justify-center text-[10px] font-bold ${themeClasses[room.theme].avatar} text-text`}>
                     {String.fromCharCode(65 + (i * 2))}
                   </div>
                 ))}
                 {room.occupancy > 4 && (
                   <div className="w-8 h-8 rounded-full bg-background border-2 border-card flex items-center justify-center text-[10px] font-bold text-muted">
                     +{room.occupancy - 4}
                   </div>
                 )}
               </div>
               {room.occupancy < room.capacity ? (
                 <button 
                   onClick={(e) => { e.stopPropagation(); enterRoom(room.id); }}
                   className="text-xs bg-primary text-black font-black uppercase px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-[0_0_10px_var(--primary)] active:scale-95"
                 >
                   Enter Room
                 </button>
               ) : (
                 <span className="text-xs text-muted font-black uppercase border border-border-subtle px-4 py-2 rounded-lg">
                   Room Full
                 </span>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
