import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll("[data-scroll]");

        elements.forEach((element) => {
            const animationType =
                (element as HTMLElement).getAttribute("data-scroll") ||
                "fade-up";

            let fromVars: any = {};
            let toVars: any = {};

            switch (animationType) {
                case "fade-up":
                    fromVars = { y: 60, opacity: 0 };
                    toVars = { y: 0, opacity: 1 };
                    break;
                case "fade-down":
                    fromVars = { y: -60, opacity: 0 };
                    toVars = { y: 0, opacity: 1 };
                    break;
                case "fade-left":
                    fromVars = { x: 60, opacity: 0 };
                    toVars = { x: 0, opacity: 1 };
                    break;
                case "fade-right":
                    fromVars = { x: -60, opacity: 0 };
                    toVars = { x: 0, opacity: 1 };
                    break;
                case "scale":
                    fromVars = { scale: 0.8, opacity: 0 };
                    toVars = { scale: 1, opacity: 1 };
                    break;
                case "rotate":
                    fromVars = { rotation: -10, opacity: 0 };
                    toVars = { rotation: 0, opacity: 1 };
                    break;
                default:
                    fromVars = { opacity: 0 };
                    toVars = { opacity: 1 };
            }

            gsap.fromTo(element, fromVars, {
                ...toVars,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1,
                    markers: false,
                },
                duration: 1,
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return containerRef;
}

export function useParallaxScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const elements =
            containerRef.current.querySelectorAll("[data-parallax]");

        elements.forEach((element) => {
            const speed = parseFloat(
                (element as HTMLElement).getAttribute("data-parallax") || "0.5",
            );

            gsap.to(element, {
                y: () => (window.innerHeight * (1 - speed)) / 2,
                scrollTrigger: {
                    trigger: element,
                    scrub: 0.5,
                    markers: false,
                },
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return containerRef;
}

export function usePinScroll() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const pinnedElements =
            containerRef.current.querySelectorAll("[data-pin]");

        pinnedElements.forEach((element) => {
            const duration = parseFloat(
                (element as HTMLElement).getAttribute("data-pin") || "3",
            );

            ScrollTrigger.create({
                trigger: element,
                pin: true,
                pinSpacing: true,
                duration,
                markers: false,
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return containerRef;
}
