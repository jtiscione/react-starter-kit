import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as three from 'three';
import s from './KochTetrahedron.css';

class KochTetrahedronGeometry extends three.Geometry {
  constructor(order, stellation) { // range 0.0 to 1.0, default 1.0
    super();
    this.order = order;
    this.stellation = stellation;
    this.faces = [];
    this.vertices = [
      new three.Vector3(1, 1, 1),
      new three.Vector3(-1, -1, 1),
      new three.Vector3(-1, 1, -1),
      new three.Vector3(1, -1, -1),
    ];
    this.recurse(2, 1, 0, 0, 1);
    this.recurse(0, 3, 2, 0, 1);
    this.recurse(1, 3, 0, 0, 1);
    this.recurse(2, 3, 1, 0, 1);
    this.computeFaceNormals();
    this.mergeVertices();
  }

  recurse(a, b, c, faceValue, depth) {
    if (depth > this.order) {
      this.faces.push(new three.Face3(a, b, c, null, null, faceValue));
      return;
    }

    // counter-clockwise:
    const A = this.vertices[a];
    const B = this.vertices[b];
    const C = this.vertices[c];

    // define new base vertices at edge midpoints
    const AB = A.clone().add(B).multiplyScalar(0.5);
    const BC = B.clone().add(C).multiplyScalar(0.5);
    const CA = C.clone().add(A).multiplyScalar(0.5);

    const ab = this.vertices.push(AB) - 1;
    const bc = this.vertices.push(BC) - 1;
    const ca = this.vertices.push(CA) - 1;

    // Calculate the top vertex
    const ab2 = A.clone().sub(B).lengthSq();
    const bc2 = B.clone().sub(C).lengthSq();
    const ca2 = C.clone().sub(A).lengthSq();
    let elevation = Math.sqrt(2 * (ab2 + bc2 + ca2)) / 6;
    if (depth === this.order) {
      elevation *= this.stellation;
    }
    const ABC = new three.Triangle(AB, BC, CA);
    const TOP = ABC.midpoint().add(ABC.normal().multiplyScalar(elevation));
    const top = this.vertices.push(TOP) - 1;

    // Outer 3 base faces retain their previous material indices
    this.recurse(a, ab, ca, faceValue, depth + 1);
    this.recurse(b, bc, ab, faceValue, depth + 1);
    this.recurse(c, ca, bc, faceValue, depth + 1);

    // Newer 3 faces assigned next color material index
    this.recurse(top, ca, ab, depth, depth + 1);
    this.recurse(top, ab, bc, depth, depth + 1);
    this.recurse(top, bc, ca, depth, depth + 1);
  }
}

class KochTetrahedron extends React.Component {

  static propTypes = {
  };

  constructor(...args) {
    super(...args);
    this.mesh_flag = false;
    this.order = 3;
    this.stellation = 1.0;
    // this.colors = [0x999999, 0xaaaaaa, 0xbbbbbb, 0xcccccc, 0xdddddd];
    this.colors = [
      '#444444',
      '#666666',
      '#888888',
      '#999999',
      '#aaaaaa',
    ];
    this.animationFlag = true;
  }

  componentDidMount() {
    const renderer = new three.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xFFFFFF, 1.0);
    renderer.setSize(640, 480);
    renderer.shadowMap.enabled = true;

    const scene = new three.Scene();
    const directionalLight = new three.DirectionalLight(0xffffff);
    directionalLight.position.set(-3, 3, 10); // behind camera at top left
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    const camera = new three.PerspectiveCamera(40, 640 / 480, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new three.Vector3(0, 0, 0));
    camera.castShadow = true;
    scene.add(camera);

    const createMesh = (order, stellation, priorRotation) => {
      const mats = this.colors.map(
        e => new three.MeshLambertMaterial({ color: e }),
      );
      const mesh = new three.Mesh(new KochTetrahedronGeometry(order, stellation), mats);
      if (priorRotation instanceof three.Euler) {
        mesh.rotation.x += priorRotation.x;
        mesh.rotation.y += priorRotation.y;
        mesh.rotation.z += priorRotation.z;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    let mesh = createMesh(this.order, this.stellation, this.colors);
    scene.add(mesh);

    renderer.domElement.style.margin = 'auto';
    document.getElementById('KochTetrahedron').appendChild(renderer.domElement);

    const onNextAnimationFrame = () => {
      const kochOrder = Math.floor(this.order);
      const stellationFactor = this.stellation;
      if (this.mesh_flag) {
        this.mesh_flag = false;
        scene.remove(mesh);
        mesh = createMesh(kochOrder, stellationFactor, this.colors, mesh.rotation);
        scene.add(mesh);
      }
      const fov = 40;
      if (camera !== null && camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      mesh.rotation.y += 0.001;
      mesh.rotation.x = window.scrollY / 50;
    };

    const animate = () => {
      if (this.animationFlag) {
        requestAnimationFrame(animate);
      }
      onNextAnimationFrame();
      renderer.render(scene, camera);
    };
    animate();
  }

  componentWillUnmount() {
    this.animationFlag = false;
  }

  render() {
    return <div id="KochTetrahedron" className={s.koch} />;
  }
}

export default withStyles(s)(KochTetrahedron);
