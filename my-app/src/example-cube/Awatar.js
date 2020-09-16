import * as THREE from 'three';
import { useEffect } from 'react';
import { useThree } from '../ThreeJSManager/';

const Awatar = props => {
  const { x= 0, z= 0, isYou=true, name="Who", h = 20, w = 20, d = 50, color = 0x00ff00 } = props;

  const setup = context => {
    const { scene } = context;
    const cubegeometry = new THREE.BoxGeometry(h, w, d);
    const cubematerial = new THREE.MeshPhongMaterial({ color });
    const cube = new THREE.Mesh(cubegeometry, cubematerial);
    cube.castShadow = true;
    cube.position.y = 50;
    cube.position.x = x;
    cube.position.z = z;
    scene.add(cube);

    return cube;
  };

  const { getEntity, timer } = useThree(setup);

  useEffect(
    () => {
      const cube = getEntity();
      cube.material.color.setHex(props.color);
    },
    [props.color],
  );

  useEffect(
    () => {
      const cube = getEntity();
      const oscillator = Math.sin(timer / 1000) * Math.PI - Math.PI;
      cube.rotation.y = oscillator;
      cube.rotation.z = -oscillator;
    },
    [timer],
  );

  return null;
};

export default Awatar;
