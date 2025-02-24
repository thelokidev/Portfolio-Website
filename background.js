import * as THREE from 'three';

export class Background {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;

        this.init();
    }

    init() {
        // Setup renderer with enhanced settings
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.getElementById('hero-background').appendChild(this.renderer.domElement);

        // Camera position with enhanced depth
        this.camera.position.z = 50;
        this.camera.position.y = 5;

        // Enhanced lighting setup with more color variety
        const ambientLight = new THREE.AmbientLight(0x8b5cf6, 0.4); // Purple ambient light
        const directionalLight = new THREE.DirectionalLight(0x60a5fa, 1.0); // Blue directional light
        const pointLight1 = new THREE.PointLight(0xf472b6, 0.8); // Pink point light
        const pointLight2 = new THREE.PointLight(0x34d399, 0.6); // Green point light
        const pointLight3 = new THREE.PointLight(0xfbbf24, 0.4); // Warm accent light

        pointLight1.position.set(-10, 5, -5);
        pointLight2.position.set(10, -5, 5);
        pointLight3.position.set(0, 10, 0);
        directionalLight.position.set(5, 5, 5);

        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(pointLight1);
        this.scene.add(pointLight2);
        this.scene.add(pointLight3);

        // Create particles with enhanced visuals
        const particleCount = 150;
        const geometries = [
            new THREE.TetrahedronGeometry(0.6),
            new THREE.OctahedronGeometry(0.8),
            new THREE.DodecahedronGeometry(1.0),
            new THREE.IcosahedronGeometry(0.7),
            new THREE.SphereGeometry(0.7, 16, 16)
        ];

        for (let i = 0; i < particleCount; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhysicalMaterial({
                color: this.getGradientColor(i / particleCount),
                transparent: true,
                opacity: 0.8,
                metalness: 0.3,
                roughness: 0.2,
                clearcoat: 0.5,
                clearcoatRoughness: 0.1,
                flatShading: true,
                emissive: this.getGradientColor(i / particleCount),
                emissiveIntensity: 0.2
            });

            const particle = new THREE.Mesh(geometry, material);
            const scale = Math.random() * 0.5 + 0.8;
            particle.scale.set(scale, scale, scale);

            // Enhanced random positioning with layered orbits
            const orbitLayer = Math.floor(i / 30);
            const baseRadius = 20 + orbitLayer * 8;
            const radius = baseRadius + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
            particle.position.z = radius * Math.cos(phi);

            // Random rotation
            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;
            particle.rotation.z = Math.random() * Math.PI;

            // Enhanced movement parameters
            particle.userData = {
                speed: Math.random() * 0.015 + 0.005,
                rotationSpeed: Math.random() * 0.015 - 0.0075,
                radius: radius,
                theta: theta,
                phi: phi,
                pulseSpeed: Math.random() * 0.015 + 0.008,
                pulseAmplitude: Math.random() * 0.15 + 0.05,
                orbitOffset: Math.random() * Math.PI * 2,
                verticalOffset: Math.random() * Math.PI * 2
            };

            this.particles.push(particle);
            this.scene.add(particle);
        }

        // Add event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start animation
        this.animate();
    }

    getGradientColor(t) {
        const colors = [
            new THREE.Color(0x8b5cf6), // Purple
            new THREE.Color(0x60a5fa), // Blue
            new THREE.Color(0x34d399), // Green
            new THREE.Color(0xf472b6)  // Pink
        ];
        
        const segment = Math.floor(t * (colors.length - 1));
        const segmentT = (t * (colors.length - 1)) % 1;
        
        return new THREE.Color().lerpColors(
            colors[segment],
            colors[Math.min(segment + 1, colors.length - 1)],
            segmentT
        );
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX - window.innerWidth / 2) / 80;
        this.mouseY = (event.clientY - window.innerHeight / 2) / 80;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.time += 0.001;

        // Enhanced smooth camera movement
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.03;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.03;
        this.camera.lookAt(this.scene.position);

        // Animate particles with enhanced effects
        this.particles.forEach((particle, index) => {
            const data = particle.userData;
            
            // Update position with smooth orbital movement
            data.theta += data.speed;
            data.phi += data.speed * 0.3;

            // Add vertical wave motion
            const verticalWave = Math.sin(this.time * 2 + data.verticalOffset) * 2;
            const horizontalWave = Math.cos(this.time * 2 + data.orbitOffset) * 2;

            particle.position.x = (data.radius + horizontalWave) * Math.sin(data.phi) * Math.cos(data.theta);
            particle.position.y = (data.radius + verticalWave) * Math.sin(data.phi) * Math.sin(data.theta);
            particle.position.z = data.radius * Math.cos(data.phi);

            // Rotate particle with varying speed
            particle.rotation.x += data.rotationSpeed;
            particle.rotation.y += data.rotationSpeed * 1.1;

            // Enhanced pulsing effect with color transition
            const pulse = Math.sin(this.time * 1000 * data.pulseSpeed) * data.pulseAmplitude;
            particle.scale.set(1 + pulse, 1 + pulse, 1 + pulse);

            // Dynamic color and opacity transition
            const colorT = (Math.sin(this.time + index) + 1) * 0.5;
            particle.material.color.copy(this.getGradientColor(colorT));
            particle.material.emissive.copy(this.getGradientColor(colorT));
            particle.material.opacity = 0.8 + pulse * 0.2;
        });

        this.renderer.render(this.scene, this.camera);
    }
}