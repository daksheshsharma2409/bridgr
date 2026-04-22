"use client";

import { Map as MapIcon, DoorOpen } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMockData } from "@/lib/MockDataContext";

const themeClasses = {
    primary: {
        orb: "bg-primary",
        chip: "border-primary/30 text-primary",
        avatar: "border-primary/30",
    },
    quest: {
        orb: "bg-quest",
        chip: "border-quest/30 text-quest",
        avatar: "border-quest/30",
    },
    online: {
        orb: "bg-online",
        chip: "border-online/30 text-online",
        avatar: "border-online/30",
    },
    alert: {
        orb: "bg-alert",
        chip: "border-alert/30 text-alert",
        avatar: "border-alert/30",
    },
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
                },
            );
        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={container}
            className="space-y-4 md:space-y-6 max-w-5xl mx-auto pb-8"
        >
            <section
                className="spatial-anim bg-card border-[3px] border-border p-5 md:p-6"
                style={{
                    borderRadius:
                        "200px 30px 210px 20px / 20px 210px 30px 200px",
                    boxShadow: "4px 4px 0px 0px #2d2d2d",
                }}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-text tracking-tight uppercase">
                            Spatial Hub
                        </h2>
                        <p className="text-sm font-sans text-text/70 mt-2">
                            Physical Campus Club Rooms & Real-time Occupancy.
                        </p>
                    </div>
                    <div
                        className="bg-muted/20 p-3 border-[2px] border-border flex items-center gap-3"
                        style={{
                            borderRadius:
                                "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                    >
                        <MapIcon className="w-6 h-6 text-primary" />
                        <span className="font-heading font-bold text-sm text-text">
                            Main Campus
                        </span>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="spatial-anim bg-card border-[3px] border-border p-5 md:p-6 hover:translate-x-1 hover:translate-y-1 transition-all duration-100 cursor-pointer group relative overflow-hidden"
                        style={{
                            borderRadius:
                                "200px 30px 210px 20px / 20px 210px 30px 200px",
                            boxShadow: "4px 4px 0px 0px #2d2d2d",
                        }}
                    >
                        <div
                            className={`absolute top-0 right-0 w-32 h-32 ${themeClasses[room.theme].orb} opacity-20 rounded-full blur-[40px] group-hover:opacity-40 transition-opacity`}
                        />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <span
                                    className={`text-[10px] uppercase font-heading font-black tracking-widest px-3 py-1.5 border-[1.5px] border-border text-text mb-2 inline-block ${themeClasses[room.theme].chip}`}
                                    style={{
                                        borderRadius:
                                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                                    }}
                                >
                                    {room.purpose}
                                </span>
                                <h3 className="text-lg md:text-xl font-heading font-bold text-text leading-tight">
                                    {room.name}
                                </h3>
                            </div>
                            <div className="flex flex-col items-end">
                                <span
                                    className={`text-2xl font-heading font-black ${room.occupancy > room.capacity * 0.8 ? "text-primary" : "text-text"}`}
                                >
                                    {room.occupancy}
                                </span>
                                <span className="text-[10px] text-text/70 font-heading font-bold uppercase tracking-wider">
                                    / {room.capacity} Nerds
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 pt-4 border-t-2 border-dashed border-border/50 flex justify-between items-center">
                            <div className="flex -space-x-3">
                                {[...Array(Math.min(room.occupancy, 4))].map(
                                    (_, i) => (
                                        <div
                                            key={`${room.id}-${i}`}
                                            className={`w-8 h-8 border-[2px] border-border bg-primary/20 flex items-center justify-center text-[10px] font-heading font-bold text-text`}
                                            style={{ borderRadius: "50%" }}
                                        >
                                            {String.fromCharCode(65 + i * 2)}
                                        </div>
                                    ),
                                )}
                                {room.occupancy > 4 && (
                                    <div
                                        className="w-8 h-8 border-[2px] border-border bg-muted/30 flex items-center justify-center text-[10px] font-heading font-bold text-text"
                                        style={{ borderRadius: "50%" }}
                                    >
                                        +{room.occupancy - 4}
                                    </div>
                                )}
                            </div>
                            {room.occupancy < room.capacity ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        enterRoom(room.id);
                                    }}
                                    className="text-xs bg-primary text-text font-heading font-bold uppercase px-5 py-2 border-[2px] border-border transition-all duration-75 active:translate-x-1 active:translate-y-1 hover:translate-x-0.5 hover:translate-y-0.5"
                                    style={{
                                        borderRadius:
                                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                                        boxShadow: "2px 2px 0px 0px #2d2d2d",
                                    }}
                                >
                                    Enter Room
                                </button>
                            ) : (
                                <span
                                    className="text-xs text-text font-heading font-bold uppercase border-[2px] border-border px-5 py-2"
                                    style={{
                                        borderRadius:
                                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                                    }}
                                >
                                    Room Full
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
