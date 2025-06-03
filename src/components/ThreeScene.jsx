import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


function ThreeScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        // initialize the scene
        const scene = new THREE.Scene();

        let luckyBlockGroup = new THREE.Group();

        const loader = new GLTFLoader();
        loader.load('/lucky_block.glb', (gltf) => {
            const model = gltf.scene;

            // Corrigir flipY das texturas
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material && child.material.map) {
                        child.material.map.flipY = false;
                        child.material.map.needsUpdate = true;
                    }
                }
            });

            // Centralizar o modelo no ponto (0,0,0)
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); // move o modelo para que o centro fique em (0,0,0)

            // Adicionar ao grupo e à cena
            luckyBlockGroup.add(model);
            scene.add(luckyBlockGroup);
        });
        //initialize the light
        const light = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(light);

        // Luz direcional para realçar ainda mais os detalhes
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
        directionalLight.position.set(2, 0, 5); // atrás da câmera e levemente à direita
        directionalLight.target.position.set(0, 0, 0); // apontando direto pro cubo
        directionalLight.castShadow = true;

        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.bias = -0.001;

        scene.add(directionalLight);
        scene.add(directionalLight.target); // necessário pro target funcionar

        // initialize the camera
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.5, 200);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false; // Desabilita o pan
        controls.enableZoom = true; // Habilita o zoom

        // Responsivo
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        const clock = new THREE.Clock();
        let previousTime = 0;

        const animate = () => {
            requestAnimationFrame(animate);
            // controls.enableDamping = true; // Habilita o damping
            // controls.autoRotate = true; // Habilita a rotação automática
            renderer.render(scene, camera);
            const currentTime = clock.getElapsedTime();
            const deltaTime = currentTime - previousTime;
            previousTime = currentTime;

            if (luckyBlockGroup) {
                luckyBlockGroup.rotation.y += THREE.MathUtils.degToRad(1) * deltaTime * 20; // Rotação suave
            }
            controls.update();
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            while (mount.firstChild) {
                mount.removeChild(mount.firstChild);

            }
        };
    }, []);

    return <div ref={mountRef} style={{ width: innerWidth, height: innerHeight }} />;
}

export default ThreeScene;
