import React, { useState, useContext } from 'react';
import SceneManager from '../ThreeJSManager';
import Cube from './Cube';
import Grid from './Grid';
import CameraControls from './CameraControls';
import { getCamera, getRenderer, getScene } from './threeSetup';
import {CubeContext} from "../Firstpage";
import Awatar from "./Awatar";

const CubeExample = () => {

    const {color} = useContext(CubeContext);
    const {showGrid} = useContext(CubeContext);
    const {showCube} = useContext(CubeContext);
    const {awatarList} = useContext(CubeContext);


    const listItems = awatarList.map((awatarInfo) =>
        <Awatar x={awatarInfo.x} z={awatarInfo.z} color={Number(`0x${awatarInfo.color}`)} name={awatarInfo.name} isYou={awatarInfo.isYou} />
    );

    return (
    <SceneManager
      getCamera={getCamera}
      getRenderer={getRenderer}
      getScene={getScene}
      canvasStyle={{
        height: '1000px',
        width: '100%',
        zIndex: -1,
      }}
    >
      <CameraControls />
      {showGrid && <Grid />}
      {showCube && <Cube color={Number(`0x${color}`)} h={Number (10)} />}

      {listItems}
      <div
        style={{
          width: '100px',
          padding: '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >

        </div>
      </div>
    </SceneManager>
  );
};

export default CubeExample;
