"use strict";

function draw() {
  const f = document.getElementById("funcion").value;
  const dX = document.getElementById("dX").value;
  const dY = document.getElementById("dY").value;

  try {
    functionPlot({
      target: '#plot',
      width: 450,
      height: 420,
      disableZoom: false,
      yAxis: {
        label: 'Y',
        domain: [-5, 5]
      },
      xAxis: {
        label: 'X',
        domain: [-6, 6]
      },
      grid: true,
      data: [{
        fn: f,
        fnType: 'implicit'
      }]
    });
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

draw();