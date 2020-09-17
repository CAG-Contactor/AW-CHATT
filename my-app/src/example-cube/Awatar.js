import * as THREE from 'three';
import { useEffect } from 'react';
import { useThree } from '../ThreeJSManager/';

const Awatar = props => {
  const { x= 0, z= 0, isYou=true, name="Who", h = 20, w = 20, d = 50, color = 0x00ff00 } = props;

    const bodyRadiusTop = 6;
    const bodyRadiusBottom = 3;
    const bodyHeight = 30;
    const bodyRadialSegments = 16;
    const bodyGeometry = new THREE.CylinderBufferGeometry(
        bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);

    const headRadius = bodyRadiusTop * 0.8;
    const headLonSegments = 12;
    const headLatSegments = 5;
    const headGeometry = new THREE.SphereBufferGeometry(
        headRadius, headLonSegments, headLatSegments);

    const noseGeometry = new THREE.ConeGeometry(3, 10, 16);

    const meConeGeometry = new THREE.ConeGeometry(2, 6, 16);
    const meConeMaterial = new THREE.MeshBasicMaterial({color: "yellow"});
    const meConeUpper = new THREE.Mesh(meConeGeometry, meConeMaterial);
    const meConeLower = new THREE.Mesh(meConeGeometry, meConeMaterial);


  const setup = context => {
    const { scene } = context;
    const cubegeometry = new THREE.BoxGeometry(h, w, d);
    const cubematerial = new THREE.MeshPhongMaterial({ color });
  //  const cube = new THREE.Mesh(cubegeometry, cubematerial);

    const cube = makePerson(name, color, isYou)

      cube.castShadow = true;
    cube.position.y = 50;
    cube.position.x = x;
    cube.position.z = z;
    scene.add(cube);

    return cube;
  };

    function makeLabelCanvas(baseWidth, size, name) {
        const borderSize = 2;
        const ctx = document.createElement('canvas').getContext('2d');
        const font = `${size}px bold sans-serif`;
        // @ts-ignore
        ctx.font = font;
        // measure how long the name will be
        // @ts-ignore
        const textWidth = ctx.measureText(name).width;

        const doubleBorderSize = borderSize * 2;
        const width = baseWidth + doubleBorderSize;
        const height = size + doubleBorderSize;
        // @ts-ignore
        ctx.canvas.width = width;
        // @ts-ignore
        ctx.canvas.height = height;

        // need to set font again after resizing canvas
        // @ts-ignore
        ctx.font = font;
        // @ts-ignore
        ctx.textBaseline = 'middle';
        // @ts-ignore
        ctx.textAlign = 'center';

        // @ts-ignore
        ctx.fillStyle = 'blue';
        // @ts-ignore
        ctx.fillRect(0, 0, width, height);

        // scale to fit but don't stretch
        const scaleFactor = Math.min(1, baseWidth / textWidth);
        // @ts-ignore
        ctx.translate(width / 2, height / 2);
        // @ts-ignore
        ctx.scale(scaleFactor, 1);
        // @ts-ignore
        ctx.fillStyle = 'white';
        // @ts-ignore
        ctx.fillText(name, 0, 0);

        // @ts-ignore
        return ctx.canvas;
    }

    function makePerson(personName, personColor, isMyself) {
        let calcLabelwidth = personName.length * 100;
        let fontSize = 200;
        const canvas = makeLabelCanvas(calcLabelwidth, fontSize, personName);
        const texture = new THREE.CanvasTexture(canvas);
        // because our canvas is likely not a power of 2
        // in both dimensions set the filtering appropriately.
        texture.minFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const labelMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: personColor,
            flatShading: true,
            transparent: true
        });

        const root = new THREE.Object3D();
        root.position.x = 0;
        root.position.z = 0;
        root.name = personName;

        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        root.add(body);
        body.position.y = bodyHeight / 2;

        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        root.add(head);
        head.position.y = bodyHeight + headRadius * 1.1;

        const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
        root.add(nose);
        nose.position.y = bodyHeight + headRadius * 1.1;
        nose.position.z = headRadius;
        nose.rotation.x = Math.PI / 2;

        if (isMyself) {
            // This is needed with my headphones to get audio Left/Right correct. I really dont understand why.
            nose.position.y = bodyHeight + headRadius * 1.1;
            nose.position.z = -headRadius;
            nose.rotation.x = Math.PI * 3 / 2;

            // Add yellow saphire over your own avatar
            root.add(meConeUpper);
            root.add(meConeLower);
            meConeLower.rotation.x = Math.PI;
            meConeLower.position.y = bodyHeight + headRadius * 4;
            meConeUpper.position.y = bodyHeight + headRadius * 4 + 6;
        } else {
            const label = new THREE.Sprite(labelMaterial);
            root.add(label);
            label.position.x = 0;
            label.position.y = bodyHeight + headRadius * 4;
            label.position.z = 0;

            // if units are meters then 0.01 here makes size
            // of the label into centimeters.
            const labelBaseScale = 0.1;
            label.scale.x = canvas.width * labelBaseScale;
            label.scale.y = canvas.height * labelBaseScale;
        }

        return root;
    }


  const { getEntity, timer } = useThree(setup);

/*
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
  */


  return null;
};

export default Awatar;
