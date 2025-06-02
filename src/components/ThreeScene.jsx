import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function ThreeScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Espera o layout estabilizar (gambiarra confiável)
        setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(35, width / height, 0.5, 200);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(width, height);
            mount.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enablePan = false; // Desabilita o pan
            controls.enableZoom = true; // Habilita o zoom

            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // Responsivo
            const handleResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            };
            window.addEventListener('resize', handleResize);

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                controls.autoRotate = true; // Habilita a rotação automática
                renderer.render(scene, camera);
                console.log(requestAnimationFrame);
            };
            animate();

        }, 0); // ou use 50ms se precisar garantir ainda mais

    }, []);

    return <div ref={mountRef} style={{ width: innerWidth, height: innerHeight }} />;
}

export default ThreeScene;
