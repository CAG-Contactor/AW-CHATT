import React, {Component} from "react";
import * as THREE from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {TransformControls} from "three/examples/jsm/controls/TransformControls.js";
import {PositionalAudioHelper} from "three/examples/jsm/helpers/PositionalAudioHelper.js";


class App extends Component {
    componentDidMount() {
        // === THREE.JS CODE START ===
        var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer({antialias: true});
        var control = new TransformControls(camera, renderer.domElement);

        var myself : THREE.Object3D;
        var guest_1 : THREE.Object3D;
        var guest_2 : THREE.Object3D;

        // create an AudioListener
        var omniListener = new THREE.AudioListener();
        // create the PositionalAudio object (passing in the listener)
        var omniSound = new THREE.PositionalAudio(omniListener);

        var moving = false;
        var movingGuest_1 = false;
        var fadingOldGuest_1 = true;
        var movingGuest_2 = false;
        var fadingOldGuest_2 = true;
        var removingGuest_1 = false;
        var removingGuest_2 = false;

        var create_button_1 = document.getElementById('addGuest_1');
        // @ts-ignore
        create_button_1.addEventListener('click', createGuest_1);

        var create_button_2 = document.getElementById('addGuest_2');
        // @ts-ignore
        create_button_2.addEventListener('click', createGuest_2);

        var move_button_1 = document.getElementById('mvGuest_1');
        // @ts-ignore
        move_button_1.addEventListener('click', moveGuest_1);
        // @ts-ignore
        move_button_1.disabled = true;

        var move_button_2 = document.getElementById('mvGuest_2');
        // @ts-ignore
        move_button_2.addEventListener('click', moveGuest_2);
        // @ts-ignore
        move_button_2.disabled = true;

        var remove_button_1 = document.getElementById('rmGuest_1');
        // @ts-ignore
        remove_button_1.addEventListener('click', removeGuest_1);
        // @ts-ignore
        remove_button_1.disabled = true;

        var remove_button_2 = document.getElementById('rmGuest_2');
        // @ts-ignore
        remove_button_2.addEventListener('click', removeGuest_2);
        // @ts-ignore
        remove_button_2.disabled = true;

        const bodyRadiusTop = 30;
        const bodyRadiusBottom = 15;
        const bodyHeight = 150;
        const bodyRadialSegments = 16;
        const bodyGeometry = new THREE.CylinderBufferGeometry(
            bodyRadiusTop, bodyRadiusBottom, bodyHeight, bodyRadialSegments);

        const headRadius = bodyRadiusTop * 0.8;
        const headLonSegments = 12;
        const headLatSegments = 5;
        const headGeometry = new THREE.SphereBufferGeometry(
            headRadius, headLonSegments, headLatSegments);

        const noseGeometry = new THREE.ConeGeometry(15, 50, 16);

        const meConeGeometry = new THREE.ConeGeometry(10, 30, 16);
        const meConeMaterial = new THREE.MeshBasicMaterial({color: "yellow"});
        const meConeUpper = new THREE.Mesh(meConeGeometry, meConeMaterial);
        const meConeLower = new THREE.Mesh(meConeGeometry, meConeMaterial);

        init();
        render();

        function init() {
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            camera.position.set(1000, 500, 1000);
            camera.lookAt(0, 200, 0);

            // add the (omni-directional) sound to the camera
            camera.add(omniSound);

            control.addEventListener('change', render);

            scene.add(new THREE.GridHelper(1000, 20, 0x888888, 0x444444));

            var light = new THREE.DirectionalLight(0xffffff, 2);
            light.position.set(1, 1, 1);
            scene.add(light);

            myself = makePerson("Red Menace", "red", true);
            scene.add(myself);
            var listener = new THREE.AudioListener();
            myself.add(listener);

            control.attach(myself);
            scene.add(control);

            // Add orbitControls (possibility to "fly around")
            var orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.minDistance = 50;
            orbitControls.maxDistance = 2000;
            orbitControls.enabled = true;
            control.showX = false;
            control.showY = false;
            control.showZ = false;
            animate();

            // Initially let the transformControl (possibility to "move your avatar") be disabled.
            control.enabled = false;

            window.addEventListener('resize', onWindowResize, false);

            window.addEventListener('mousedown', onMoveStarted, false);

            window.addEventListener('mouseup', onMoveReady, false);

            window.addEventListener('keydown', function (event) {

                switch (event.keyCode) {

                    case 77: // M
                        orbitControls.enabled = false;
                        control.enabled = true;
                        control.showX = true;
                        control.showY = true;
                        control.showZ = true;
                        control.setMode("translate");
                        break;

                    case 69: // E
                        control.enabled = false;
                        control.showX = false;
                        control.showY = false;
                        control.showZ = false;
                        orbitControls.enabled = true;
                        break;

                    case 82: // R
                        if (control.enabled === true) {
                            myself.rotation.y += Math.PI / 8;
                        } else {
                            control.enabled = true;
                            myself.rotation.y += Math.PI / 8;
                            control.enabled = false;
                        }
                        break;
                }
            });

            window.addEventListener('keyup', function (event) {

                switch (event.keyCode) {

                    case 17: // Ctrl
                        control.setTranslationSnap(null);
                        control.setRotationSnap(null);
                        break;

                }

            });

        }

        function makeLabelCanvas(baseWidth: number, size: number, name: string) {
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

        function makePerson(personName: string, personColor: string, isMyself: boolean) {
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
                meConeUpper.position.y = bodyHeight + headRadius * 4 + 30;
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


        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

            render();
        }


        function onMoveStarted() {
            moving = true;
        }

        function onMoveReady() {
            moving = false;
        }


        function render() {
            renderer.render(scene, camera);
        }


        function animate() {
            falldown();

            requestAnimationFrame(animate);
            render();
        }


        function falldown() {
            // @ts-ignore
            if ((!moving) && (myself.position.y !== 0)) {
                requestAnimationFrame(falldown);

                // @ts-ignore
                if (myself.position.y > 100) {
                    // @ts-ignore
                    myself.position.y *= 0.995;
                    // @ts-ignore
                } else if (myself.position.y > 10) {
                    // @ts-ignore
                    myself.position.y *= 0.95;
                    // @ts-ignore
                } else if (myself.position.y > 1) {
                    // @ts-ignore
                    myself.position.y *= 0.90;
                } else {
                    // @ts-ignore
                    myself.position.y *= 0.8;
                }
                // @ts-ignore
                if (myself.position.y < 0.2) {
                    // @ts-ignore
                    myself.position.y = 0;
                }
            }

            if (movingGuest_1) {
                requestAnimationFrame(falldown);
                var audioElement = document.getElementById('music1');
                // @ts-ignore
                let parts = guest_1.children;

                if (fadingOldGuest_1) {
                    // @ts-ignore
                    audioElement.volume = audioElement.volume - 0.0001;

                    // @ts-ignore
                    if (audioElement.volume <= 0.0001) {
                        fadingOldGuest_1 = false;
                        // @ts-ignore
                        guest_1.position.x = -150;
                        // @ts-ignore
                        guest_1.position.z = 150;
                    }
                    for (var j = 0; j < parts.length; j++) {
                        // @ts-ignore
                        if (parts[j].material !== undefined && parts[j].material.opacity > 0) {
                            // @ts-ignore
                            parts[j].material.opacity = parts[j].material.opacity - 0.0001;
                        }
                    }
                } else {
                    // @ts-ignore
                    audioElement.volume = audioElement.volume + 0.0001;

                    for (var j = 0; j < parts.length; j++) {
                        // @ts-ignore
                        if (parts[j].material !== undefined && parts[j].material.opacity < 1) {
                            // @ts-ignore
                            parts[j].material.opacity = parts[j].material.opacity + 0.0001;
                        }
                    }

                    // @ts-ignore
                    if (audioElement.volume >= 1) {
                        movingGuest_1 = false;
                        for (var j = 0; j < parts.length; j++) {
                            // @ts-ignore
                            if (parts[j].material !== undefined) {
                                // @ts-ignore
                                parts[j].material.opacity = 1;
                            }
                        }
                    }
                }
            }
            if (movingGuest_2) {
                requestAnimationFrame(falldown);
                let audioElement = document.getElementById('music2');
                // @ts-ignore
                let parts = guest_2.children;

                if (fadingOldGuest_2) {
                    // @ts-ignore
                    audioElement.volume = audioElement.volume - 0.0001;
                    // @ts-ignore
                    if (audioElement.volume <= 0.0001) {
                        fadingOldGuest_2 = false;
                        // @ts-ignore
                        guest_2.position.x = -150;
                        // @ts-ignore
                        guest_2.position.z = -150;
                    }
                    for (var j = 0; j < parts.length; j++) {
                        // @ts-ignore
                        if (parts[j].material !== undefined && parts[j].material.opacity > 0) {
                            // @ts-ignore
                            parts[j].material.opacity = parts[j].material.opacity - 0.0001;
                        }
                    }

                } else {
                    // @ts-ignore
                    audioElement.volume = audioElement.volume + 0.0001;

                    for (var j = 0; j < parts.length; j++) {
                        // @ts-ignore
                        if (parts[j].material !== undefined && parts[j].material.opacity < 1) {
                            // @ts-ignore
                            parts[j].material.opacity = parts[j].material.opacity + 0.0001;
                        }
                    }

                    // @ts-ignore
                    if (audioElement.volume >= 1) {
                        movingGuest_2 = false;
                        for (var j = 0; j < parts.length; j++) {
                            // @ts-ignore
                            if (parts[j].material !== undefined) {
                                // @ts-ignore
                                parts[j].material.opacity = 1;
                            }
                        }
                    }
                }
            }
            if (removingGuest_1) {
                requestAnimationFrame(falldown);

                // @ts-ignore
                let parts = guest_1.children;
                let opacityVal = 1;

                for (var j = 0; j < parts.length; j++) {
                    // @ts-ignore
                    if (parts[j].material !== undefined && parts[j].material.opacity > 0) {
                        // @ts-ignore
                        parts[j].material.opacity = parts[j].material.opacity - 0.0001;
                        if (j === 0) {
                            // @ts-ignore
                            opacityVal = parts[j].material.opacity;
                        }
                    }
                }

                if (opacityVal < 0.0002) {
                    removingGuest_1 = false;
                    let audioElement = document.getElementById('music1');
                    // @ts-ignore
                    audioElement.volume = 0;

                    scene.remove(guest_1);
                }
            }

            if (removingGuest_2) {
                requestAnimationFrame(falldown);

                // @ts-ignore
                let parts = guest_2.children;
                let opacityVal = 1;

                for (var j = 0; j < parts.length; j++) {
                    // @ts-ignore
                    if (parts[j].material !== undefined && parts[j].material.opacity > 0) {
                        // @ts-ignore
                        parts[j].material.opacity = parts[j].material.opacity - 0.0001;
                        if (j === 0) {
                            // @ts-ignore
                            opacityVal = parts[j].material.opacity;
                        }
                    }
                }

                if (opacityVal < 0.0002) {
                    removingGuest_2 = false;
                    let audioElement = document.getElementById('music2');
                    // @ts-ignore
                    audioElement.volume = 0;

                    scene.remove(guest_2);
                }
            }
        }

        // Test functions to create and move guests
        function createGuest_1() {
            // @ts-ignore
            create_button_1.disabled = true;
            // @ts-ignore
            move_button_1.disabled = false;
            // @ts-ignore
            remove_button_1.disabled = false;

            var listener = new THREE.AudioListener();
            myself.add(listener);

            guest_1 = makePerson("Joel", "blue", false);
            guest_1.position.x = -300;
            guest_1.position.z = 300;

            // Make sure the avatar is placed in our direction meaning the sound
            // will also go in that direction
            guest_1.rotation.y = Math.PI / 2;

            // audio from guest 1
            var audioElement = document.getElementById('music1');
            // @ts-ignore
            audioElement.play();

            var positionalAudio = new THREE.PositionalAudio(listener);
            // @ts-ignore
            positionalAudio.setMediaElementSource(audioElement);
            positionalAudio.setRefDistance(20);
            positionalAudio.setDirectionalCone(90, 150, 0.1);

            var helper = new PositionalAudioHelper(positionalAudio, 0.1);
            positionalAudio.add(helper);

            // finally add the sound to the 3D object
            guest_1.add(positionalAudio);

            scene.add(guest_1);

            playDoorBellSound();
        }

        function createGuest_2() {
            // @ts-ignore
            create_button_2.disabled = true;
            // @ts-ignore
            move_button_2.disabled = false;
            // @ts-ignore
            remove_button_2.disabled = false;

            var listener = new THREE.AudioListener();
            myself.add(listener);

            guest_2 = makePerson("FredrikDa", "green", false);
            guest_2.position.x = -300;
            guest_2.position.z = -300;

            // Make sure the avatar is placed in our direction meaning the sound
            // will also go in that direction
            guest_2.rotation.y = Math.PI / 2;

            // audio from guest 1
            var audioElement = document.getElementById('music2');
            // @ts-ignore
            audioElement.play();
            console.log("audio : " + audioElement);

            var positionalAudio = new THREE.PositionalAudio(listener);
            // @ts-ignore
            positionalAudio.setMediaElementSource(audioElement);
            positionalAudio.setRefDistance(20);
            positionalAudio.setDirectionalCone(90, 150, 0.1);

            var helper = new PositionalAudioHelper(positionalAudio, 0.1);
            positionalAudio.add(helper);

            // finally add the sound to the 3D object
            guest_2.add(positionalAudio);

            scene.add(guest_2);

            playDoorBellSound();
        }

        function moveGuest_1() {
            // @ts-ignore
            move_button_1.disabled = true;
            movingGuest_1 = true;
            fadingOldGuest_1 = true;
        }

        function moveGuest_2() {
            // @ts-ignore
            move_button_2.disabled = true;
            movingGuest_2 = true;
            fadingOldGuest_2 = true;
        }

        function removeGuest_1() {
            // @ts-ignore
            move_button_1.disabled = true;
            // @ts-ignore
            remove_button_1.disabled = true;
            // @ts-ignore
            create_button_1.disabled = true;
            removingGuest_1 = true;
            console.log("removeGuest_1 called.");

            playClosingDoorSound();
        }

        function removeGuest_2() {
            // @ts-ignore
            move_button_2.disabled = true;
            // @ts-ignore
            remove_button_2.disabled = true;
            // @ts-ignore
            create_button_2.disabled = true;
            removingGuest_2 = true;
            console.log("removeGuest_2 called.");

            playClosingDoorSound();
        }


        function playDoorBellSound() {
            console.log("playDoorBellSound called.");

            let audioLoader = new THREE.AudioLoader();
            audioLoader.setCrossOrigin("anonymous");
            audioLoader.load("/sounds/two_tone_doorbell.mp3", function (buffer) {
                omniSound.setBuffer(buffer);
                omniSound.setRefDistance(20);
                omniSound.setVolume(0.8);
                omniSound.play();
            });
        }

        function playClosingDoorSound() {
            var audioLoader = new THREE.AudioLoader();
            audioLoader.load("/sounds/door_close.mp3", function (buffer) {
                omniSound.setBuffer(buffer);
                omniSound.setRefDistance(20);
                omniSound.setVolume(0.8);
                omniSound.play();
            });
        }

        // === THREE.JS EXAMPLE CODE END ===
    }

  render() {
    return (
        <div>
          <div id="info">
            "M" start move | "E" end move | "R" rotate
          </div>
          <div id="add_guests">
            <button id="addGuest_1">Add Guest 1</button>
            <button id="addGuest_2">Add Guest 2</button>
          </div>
          <div id="move_guests">
            <button id="mvGuest_1">Move Guest 1</button>
            <button id="mvGuest_2">Move Guest 2</button>
          </div>
          <div id="remove_guests">
            <button id="rmGuest_1">Remove Guest 1</button>
            <button id="rmGuest_2">Remove Guest 2</button>
          </div>
        </div>
    )
  }
}

export default App;
