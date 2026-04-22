"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xfdfbf7, 0.1);
        containerRef.current.appendChild(renderer.domElement);

        camera.position.z = 5;

        // Create floating geometric shapes with hand-drawn aesthetic
        const geometries = [
            new THREE.IcosahedronGeometry(0.5, 4),
            new THREE.TetrahedronGeometry(0.6),
            new THREE.OctahedronGeometry(0.4),
        ];

        const shapes: {
            mesh: THREE.Mesh;
            vx: number;
            vy: number;
            vz: number;
        }[] = [];

        for (let i = 0; i < 5; i++) {
            const geometry =
                geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhongMaterial({
                color: Math.random() > 0.5 ? 0xff4d4d : 0x2d5da1,
                emissive: Math.random() > 0.7 ? 0xff4d4d : 0x2d2d2d,
                emissiveIntensity: 0.2,
                wireframe: Math.random() > 0.5,
                opacity: 0.3,
                transparent: true,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 8,
            );

            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            );

            scene.add(mesh);

            shapes.push({
                mesh,
                vx: (Math.random() - 0.5) * 0.01,
                vy: (Math.random() - 0.5) * 0.01,
                vz: (Math.random() - 0.5) * 0.01,
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff4d4d, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Mouse tracking
        let mouseX = 0;
        let mouseY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", onMouseMove);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            shapes.forEach((shape) => {
                shape.mesh.position.x += shape.vx;
                shape.mesh.position.y += shape.vy;
                shape.mesh.position.z += shape.vz;

                // Bounce off walls
                if (shape.mesh.position.x > 8) shape.vx = -Math.abs(shape.vx);
                if (shape.mesh.position.x < -8) shape.vx = Math.abs(shape.vx);
                if (shape.mesh.position.y > 6) shape.vy = -Math.abs(shape.vy);
                if (shape.mesh.position.y < -6) shape.vy = Math.abs(shape.vy);
                if (shape.mesh.position.z > 4) shape.vz = -Math.abs(shape.vz);
                if (shape.mesh.position.z < -4) shape.vz = Math.abs(shape.vz);

                shape.mesh.rotation.x += 0.0005;
                shape.mesh.rotation.y += 0.0008;
            });

            // Camera follows mouse slightly
            camera.position.x = mouseX * 0.5;
            camera.position.y = mouseY * 0.5;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onWindowResize);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onWindowResize);
            containerRef.current?.removeChild(renderer.domElement);
            geometries.forEach((g) => g.dispose());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 top-0 left-0 w-full h-screen -z-10 pointer-events-none"
        />
    );
}
