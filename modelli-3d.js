// Three.js praticamente bisogna fixare tutto
let scene, camera, renderer, controls, currentMolecule;
let sceneAtoms = [];
let moleculeRotation = {x:0, y:0};
let moleculeGroup = null; // Group containing atoms and bonds for current molecule

const moleculeData = {
  glucosio: {
    title: 'Glucosio (C₆H₁₂O₆)',
    description: 'Il glucosio è un monosaccaride e il principale carburante cellulare.',
    details: 'Struttura: anello esosano con 6 atomi di carbonio, 12 atomi di idrogeno e 6 di ossigeno.',
    atoms: [
      // Atomi di carbonio (anello)
      {pos:[0,0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.2,0.4,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.8,1.8,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.2,3.2,0], color:0x222222, size:0.4, label:'C'},
      {pos:[0,3.6,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.6,2.2,0], color:0x222222, size:0.4, label:'C'},
      // Ossigeno nell'anello
      {pos:[0.6,1.6,0], color:0xdd0000, size:0.5, label:'O'},
      // Idrogeni vari (semplificato)
      {pos:[-0.5,-0.8,0], color:0xcccccc, size:0.2},
      {pos:[2.2,-0.2,0], color:0xcccccc, size:0.2},
      {pos:[2.6,2.2,0], color:0xcccccc, size:0.2},
      {pos:[2.0,4.2,0], color:0xcccccc, size:0.2},
      {pos:[-0.8,4.8,0], color:0xcccccc, size:0.2},
      {pos:[-1.8,1.8,0], color:0xcccccc, size:0.2},
      // Gruppi OH
      {pos:[-1.2,0.6,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[1.8,-0.6,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[2.8,2.0,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[0.2,4.4,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[-1.4,3.2,0], color:0xdd0000, size:0.35, label:'O'},
    ],
    bonds: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6]
    ]
  },
  fruttosio: {
    title: 'Fruttosio (C₆H₁₂O₆)',
    description: 'Il fruttosio è un monosaccaride isomero del glucosio, presente in frutta e miele.',
    details: 'Stesso numero di atomi del glucosio ma con una diversa disposizione spaziale.',
    atoms: [
      // Anello a 5 membri (furanoso)
      {pos:[0.5,0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.5,0.8,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.2,2.2,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.2,2.4,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.8,1.0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[0.3,1.2,0], color:0xdd0000, size:0.5, label:'O'},
      // Idrogeni
      {pos:[0.6,-1.0,0], color:0xcccccc, size:0.2},
      {pos:[2.5,0.6,0], color:0xcccccc, size:0.2},
      {pos:[1.8,3.2,0], color:0xcccccc, size:0.2},
      {pos:[-1.2,3.4,0], color:0xcccccc, size:0.2},
      {pos:[-1.8,0.8,0], color:0xcccccc, size:0.2},
      // Gruppi ossidrilici
      {pos:[2.0,-0.4,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[2.2,3.0,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[-1.0,3.8,0], color:0xdd0000, size:0.35, label:'O'},
      {pos:[-1.6,-0.2,0], color:0xdd0000, size:0.35, label:'O'},
    ],
    bonds: [
      [0,1],[1,2],[2,3],[3,4],[4,0],[0,5]
    ]
  },
  saccarosio: {
    title: 'Saccarosio (C₁₂H₂₂O₁₁)',
    description: 'Zucchero da tavola, disaccaride formato da glucosio + fruttosio.',
    details: 'Legame glicosidico tra due monosaccaridi. Simmetrico e dolce.',
    atoms: [
      // Glucosio (sinistra)
      {pos:[-1.5,0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.3,0.6,0], color:0x222222, size:0.4, label:'C'},
      {pos:[0.3,2.0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.9,2.6,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-2.1,2.0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[-0.6,1.2,0], color:0xdd0000, size:0.5, label:'O'},
      // Fruttosio (destra)
      {pos:[1.5,0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[2.7,0.6,0], color:0x222222, size:0.4, label:'C'},
      {pos:[3.3,2.0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[2.1,2.6,0], color:0x222222, size:0.4, label:'C'},
      {pos:[0.9,2.0,0], color:0x222222, size:0.4, label:'C'},
      {pos:[1.8,1.2,0], color:0xdd0000, size:0.5, label:'O'},
      // Ossigeno legame glicosidico
      {pos:[0,1.2,0], color:0xdd0000, size:0.35, label:'O'},
      // Atomi aggiuntivi
      {pos:[-2.2,0.8,0], color:0xcccccc, size:0.2},
      {pos:[2.8,0.8,0], color:0xcccccc, size:0.2},
    ],
    bonds: [
      [0,1],[1,2],[2,3],[3,4],[4,0],[0,5],
      [6,7],[7,8],[8,9],[9,10],[10,6],[6,11],
      [5,12],[11,12]
    ]
  }
};

function initScene() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Canvas
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }

  // Camera
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / 600, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setSize(canvas.clientWidth, 600);
  renderer.pixelRatio = window.devicePixelRatio;

  // Lights
  const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light2);

  // Simple orbit-like controls
  setupControls();

  // Load initial molecule
  loadMolecule('glucosio');

  // Event listeners
  document.querySelectorAll('.mol-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      document.querySelectorAll('.mol-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      loadMolecule(this.dataset.molecule);
    });
  });

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Animation loop
  animate();
}

function setupControls() {
  let isDragging = false;
  let previousMousePosition = {x:0, y:0};

  document.getElementById('canvas').addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = {x: e.clientX, y: e.clientY};
  });

  document.addEventListener('mousemove', (e) => {
    if(isDragging){
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      // Update global moleculeRotation so the animation loop reads the values
      moleculeRotation.y += deltaX * 0.005;
      moleculeRotation.x += deltaY * 0.005;
      previousMousePosition = {x: e.clientX, y: e.clientY};
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.getElementById('canvas').addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.005;
    camera.position.z = Math.max(2, Math.min(15, camera.position.z));
  });

  // Ensure we use the existing global moleculeRotation instead of creating a
  // temporary rotation object. It's already initialized above.
}

function loadMolecule(name) {
  currentMolecule = name;
  const data = moleculeData[name];

  // Update info
  document.getElementById('mol-title').textContent = data.title;
  document.getElementById('mol-description').textContent = data.description;
  document.getElementById('mol-details').textContent = data.details;

  // Remove previous molecule group if present (keep lights and UI helpers)
  if (moleculeGroup) {
    // Dispose children geometries/materials and remove group
    moleculeGroup.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
    scene.remove(moleculeGroup);
    moleculeGroup = null;
  } else {
    // Fallback: no group found, remove standalone mesh/line objects (older code paths)
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const obj = scene.children[i];
      if (obj.isLight) continue;
      if (obj.isMesh || obj.type === 'Line' || obj.type === 'LineSegments') {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
        scene.remove(obj);
      }
    }
  }

  // Create a group for the molecule so atoms and bonds can be transformed together
  moleculeGroup = new THREE.Group();
  // Reset rotations so a new molecule loads with no leftover rotation
  moleculeGroup.rotation.set(0, 0, 0);
  moleculeRotation.x = 0;
  moleculeRotation.y = 0;
  const atoms = [];
  data.atoms.forEach(atom => {
    const geom = new THREE.SphereGeometry(atom.size, 16, 16);
    const mat = new THREE.MeshPhongMaterial({color: atom.color});
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(...atom.pos);
    moleculeGroup.add(mesh);
    atoms.push(mesh);
  });

  // Create bonds (lines)
  data.bonds.forEach(bond => {
    const points = [
      new THREE.Vector3(...data.atoms[bond[0]].pos),
      new THREE.Vector3(...data.atoms[bond[1]].pos)
    ];
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({color: 0x666666, linewidth: 2});
    const line = new THREE.LineSegments(geom, mat);
    moleculeGroup.add(line);
  });

  // Store atoms for rotation (optional — not required if rotating group)
  sceneAtoms = atoms;

  // Add molecule group to scene
  scene.add(moleculeGroup);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate molecule group (atoms and bonds together)
  if (moleculeGroup) {
    moleculeGroup.rotation.x += moleculeRotation.x * 0.02;
    moleculeGroup.rotation.y += moleculeRotation.y * 0.02;
    moleculeRotation.x *= 0.98;
    moleculeRotation.y *= 0.98;
  } else if (sceneAtoms && sceneAtoms.length > 0) {
    // Fallback: rotate individual atoms if group wasn't created yet
    sceneAtoms.forEach(atom => {
      atom.position.applyMatrix4(new THREE.Matrix4().makeRotationX(moleculeRotation.x * 0.02));
      atom.position.applyMatrix4(new THREE.Matrix4().makeRotationY(moleculeRotation.y * 0.02));
    });
    moleculeRotation.x *= 0.98;
    moleculeRotation.y *= 0.98;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const canvas = document.getElementById('canvas');
  if(!canvas) return;
  const width = canvas.clientWidth;
  const height = 600;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScene);
} else {
  initScene();
}
