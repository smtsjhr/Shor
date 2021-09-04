
var M = 16
var N = 15;

var period = 4;
var shift = 0;

var current_state = periodic_state(M, period, shift);
var num_states = current_state.length;

//var period_slider = document.getElementById("period_slider");
var shift_slider = document.getElementById("shift_slider");

var kets_image = document.getElementById('basiskets32');
var state_label = document.getElementById('state_label');

let x_origin;
let y_origin;
let x_scale;
let y_scale;

var t = 0;
var circuit_time = 0;
var circuit_animation_rate = 0.1;
var point_animation = 1;
var point_animation_rate = 0.1;
var point_size = 3;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// draw onto the canvas
draw();

function draw() {
  
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 8.0/10;
  x_scale = canvas.width * 8/10;
  y_scale = canvas.width * 2/10;
 
  // reset Canvas background between frames
  //ctx.fillStyle = 'rgba(255,255,255,1)'
  //ctx.fillRect(0,0,500,500);
  ctx.fillStyle = 'rgba(255,255,255,.07)';
  ctx.fillRect(x_origin - 10, y_origin - y_scale, x_scale+15, y_scale + 10);

  ctx.clearRect(0,0,500,190);
  ctx.clearRect(0,0, x_origin - 10, canvas.height);
  ctx.clearRect(0, y_origin + 10, canvas.width, canvas.height - y_origin);
  
  // text for slider paramters: period (p) and shift (s)
  ctx.font = '18px Arial';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  // ctx.fillText('p = ' + period.toString(), 150, 25);
  ctx.fillText('s = ' + shift.toString(), 150, 45);
  
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();
  
  // horizontal axis ticks
  ticks(ctx, 1, M, 10, 1);
  
  // draw state label for periodic superposition state
  ctx.drawImage(state_label, canvas.width/2 - 0.75*state_label.width/2, 90, 0.75*state_label.width, 0.75*state_label.height);

 

  point_animation = 1;
  point_size = 3;
  
   for(let x = 0; x < num_states; x++) {
     
     size_x = point_size;
     grow_x = 1;
     
     // draw points for states
     plot_point_anim(ctx, size_x, grow_x, 'DodgerBlue', M, N, current_state[x][0], current_state[x][1],4, point_animation*(point_animation_rate*t - 2*Math.PI*x/(num_states*.1)));
     
     // draw ket labels for register 1
     draw_axis_ket(ctx, 0, x_scale, M, x_origin - 5 , y_origin + 15, 22, current_state[x][0]);   
   }

  
  // increment time step for point animation
  t+=1;

  // for dynamic interactivity
  window.requestAnimationFrame(draw);
 
}



// plots a single point without animation
function plot_point(ctx, size, rgba_string, M, N, x, y) {
  let x_pos = x_origin + x_scale * x / M;
  let y_pos = y_origin - y_scale * y / N;
  ctx.fillStyle = rgba_string;
  ctx.beginPath();
  ctx.arc(x_pos, y_pos, size, 0, 2*Math.PI);
  ctx.fill()
}

// plots a single point with dynamic animation
function plot_point_anim(ctx, size, grow, rgba_string, M, N, x, y,fold, t) {
  let x_pos = x_origin + x_scale * x / M;
  let y_pos = y_origin - y_scale * y / N;
 
  
  //ctx.restore();
  ctx.fillStyle = rgba_string;
  ctx.beginPath();
  ctx.arc(x_pos, y_pos, size, 0, 2*Math.PI);
  ctx.fill()
  //ctx.save();
  
  for(let i = 0; i<fold; i++) {
    ctx.fillStyle = 'rgba(30,144,255,0.5)';
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.beginPath();
    ctx.arc(x_pos+grow*5*Math.sin(.3*t)*Math.cos(2*Math.PI*i/fold + t), y_pos+grow*5*Math.sin(.3*t)*Math.sin(2*Math.PI*i/fold + t), size, 0, 2*Math.PI);
    ctx.fill();
    if (grow > .01) {
      ctx.stroke();
  }
  }
}


function draw_ket(ctx, x_pos, y_pos, size, number) {

  let imgWidth = kets_image.width;
  let imgHeight = kets_image.height;

  ctx.drawImage(kets_image, 0, number*imgHeight/32, imgWidth, imgHeight/32, x_pos, y_pos, size,size*imgWidth/(imgHeight/32));

}

function draw_axis_ket(ctx, orientation, scale, bins, x_origin, y_origin, size, number) {
  
  
  if (orientation === 0) {
     x_position = x_origin + number*scale/bins;
     y_position = y_origin;
  } 
  else if (orientation === 1) {
     x_position = x_origin;
     y_position = y_origin - number*scale/bins; 
  }
  
  draw_ket(ctx, x_position, y_position, size, number);
}

// draws tick marks on the plot axes.
// vert = 1 for vertical ticks
// vert = 0 for horizontal ticks
function ticks(ctx, vert, T, size, weight) {
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = weight;
  if (vert == 1) {
    
    for (let i = 0; i < T; i++) {
      ctx.beginPath();
      ctx.moveTo(x_origin + x_scale * i/T, y_origin + size/2);
      ctx.lineTo(x_origin + x_scale * i / T, y_origin - size / 2);
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < T  ; i++) {
      ctx.beginPath();
      ctx.moveTo(x_origin - size / 2, y_origin - y_scale * i / T);
      ctx.lineTo(x_origin + size / 2, y_origin - y_scale * i / T);
      ctx.stroke();
    }
  }
}


function periodic_state(M, p, s) {

  let num_states = Math.ceil(M/p) ;
  let periodic_states = [...Array(num_states)].map((x,j) => s + j*p).filter( x => x < M);
  return states = periodic_states.map((x,i) => [x,0]);
}


// function period_update() {
//   period = Math.min(period_slider.value, M);
  
//    // update the periodic state 
//    current_state = periodic_state(M, period, shift);
//    num_states = current_state.length;
// }

function shift_update() {
  shift = Math.min(shift_slider.value, period - 1);
  
   // update the periodic state 
   current_state = periodic_state(M, period, shift);
   num_states = current_state.length;
}
