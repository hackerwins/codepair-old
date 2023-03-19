import React, { useEffect } from 'react';

export default function WhiteBoardEditor() {
  useEffect(() => {
    const { Konva } = window as any;

    const el = document.getElementById('container');

    // first we need to create a stage
    const stage = new Konva.Stage({
      container: 'container', // id of container <div>
      width: el?.clientWidth || 0,
      height: el?.clientHeight || 0,
      draggable: true,
    });

    // then create layer
    const layer = new Konva.Layer();

    // create our shape
    const circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });

    const tr1 = new Konva.Transformer({
      nodes: [circle],
      centeredScaling: true,
    });
    layer.add(tr1);

    // add the shape to the layer
    layer.add(circle);

    // add the layer to the stage
    stage.add(layer);

    // draw the image
    layer.draw();
  }, []);

  return (
    <div
      id="container"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
      }}
    />
  );
}
