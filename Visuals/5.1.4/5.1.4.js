
var num_qubits = 4;
var M = 2**num_qubits;
var N = 15;


var H_1 = 0;
var H_2 = 0;
var H_3 = 0;
var H_4 = 0;
var H_circuit = [H_1, H_2, H_3, H_4];

var kets_image = document.getElementById('basiskets32');

var circuit_image = document.getElementById('circuit');



var Hgate_image = document.getElementById('Hgate');

var measurement_label_pos = [[0,0],[0,0]];

var dottedline_pos = [135, 208, 275, 345, 420, 480];

var max_circuit_steps = 2;

const state_labels = ['circuit_state_label_0', 'circuit_state_label_1', 'circuit_state_label_2', 'circuit_state_label_3', 'circuit_state_label_4', 'circuit_state_label_5',];



var circuit_step = 1;
var current_step = 1;
var previous_step = 1;

var current_state = states(M, circuit_step);
var num_states = current_state.length;


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

var measured_state = true;
var measured_state_1 = false;
var measured_state_2 = false;
var run_circuit_animation = false;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// draw onto the canvas
draw();

function draw() {
  
  // define HTML IDs for state label images that dynamically update
  var display_state_label = state_labels[parseInt(circuit_step)];
  var state_label = document.getElementById(display_state_label);
  
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 8.5/10;
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
  
  
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();
  
  // horizontal axis ticks
  ticks(ctx, 1, M, 10, 1);
  

   
 // logic for animating circuit steps when "Run" is pressed
 //
 // end animation when max circuit step is reached
  if (circuit_step === max_circuit_steps ) {
      run_circuit_animation = false;
  }  
 // if circuit step is not max step, then increment with time  
  if (run_circuit_animation) {
    
    current_step = Math.min(parseInt(Math.floor(circuit_animation_rate*circuit_time)), max_circuit_steps + 1);
    
    if ((current_step - previous_step) > 1) {
        
        stepup();
        previous_step += 1;
        
    }
    //increment timestep for running circuit animation
    circuit_time += 1;
       
  }

  // draw image of circuit    
  ctx.drawImage(circuit_image, canvas.width/2 - circuit_image.width/2, 50, circuit_image.width*.75, circuit_image.height*.75);

  for (let i = 0; i < num_qubits; i++) {
      if (H_circuit[i] === 1) {
        ctx.drawImage(Hgate_image, 225, 42 + i*38, Hgate.width*.75, Hgate.height*.75);
      }
  }
  // draw dotted line marker for circuit step 
  dottedline(ctx, dottedline_pos[circuit_step],50,135,10);

  // // draw state label for circuit step
  // ctx.drawImage(state_label, dottedline_pos[circuit_step] - 10, 7, state_label.width*.4, state_label.height*.4);
 
 
  

  // disable point animation when full quantum state is measured
  if (!measured_state) {
    point_animation = 1;
    point_size = 3;
  } else {
    point_animation = 0;
    point_size = 5;
  }
  
 

   for(let x = 0; x < num_states; x++) {
     
     size_x = point_size;
     grow_x = 1;
     
     // draw points for states
     plot_point_anim(ctx, size_x, grow_x, 'DodgerBlue', M, N, current_state[x][0], current_state[x][1],4, point_animation*(point_animation_rate*t - 2*Math.PI*x/(num_states*.1)));
     
     // draw ket labels for register 1
     if (!run_circuit_animation || (circuit_step === 0 ||circuit_step === max_circuit_steps)) {
        draw_axis_ket(ctx, 0, x_scale, M, x_origin - 5 , y_origin + 15, 22, current_state[x][0]);
      }
     
   }

  
  // increment time step for point animation
  t+=1;

  // for dynamic interactivity
  window.requestAnimationFrame(draw);
 
}



function superposition_state_check() {
  if (circuit_step === 2 && (H_circuit.reduce((a, b) => a + b, 0) != 0) ) {
    measured_state = false;
  }
  else {
    measured_state = true;
  }
}

function stepup() {
  
  if (circuit_step < max_circuit_steps) {
    circuit_step += 1;
    
    if (circuit_step === 2 && (H_circuit.reduce((a, b) => a + b, 0) != 0) ) {
        measured_state = false;    
    }

  current_state = states(M, circuit_step);
  num_states = current_state.length;
   
  }
    
}

function stepdown() {
  
  if (circuit_step > 1) {
    circuit_step -= 1;
    measured_state = true;
  }
 
  current_state = states(M, circuit_step);
  num_states = current_state.length;
}


// states for circuit steps
function states(M, step) {
    

  
  
  if (step === 1) {
    let states0 = [[0,0]];
    return states0;
  }
  else if (step === 2) {
    let states1 = HadamardStates(H_circuit).map(j => [j, 0]);
    return states1;
  }
  
}

function HadamardStates(H_circuit) {
  let num_qubits = H_circuit.length;
  let output_states = [new Array(num_qubits).fill(0)];

  for (q = 0; q < num_qubits; q++) {
    let num_states = output_states.length;
    if (H_circuit[q] === 1) {
      for (let i = 0; i < num_states; i++) {
        let new_state = output_states[i].slice();
        new_state[q] = 1;
        output_states.push(new_state);
      }
    }
  }
  let basis_states = [];
  for (let s = 0; s < output_states.length; s++) {
    let bitstring = output_states[s];
    let integer = 0;
    for (let i = 0; i < bitstring.length; i++) {
      integer += bitstring[i]*2**(i);  
    }
    basis_states.push(integer);
  }
  
  return basis_states;
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


function dottedline(ctx, x, y, length, dots) {
  ctx.save();
  ctx.strokeStyle = 'rgba(30,144,255,1)';
  ctx.lineWidth = 3;  
  for (let i = 0; i < length/dots; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + dots*i);
      ctx.lineTo(x, y + dots*i + dots/2);
      ctx.stroke();  
  }
  ctx.restore()
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


function add_H1() {
  H_circuit[0] = (H_circuit[0] + 1)%2;
  current_state = states(M, circuit_step);
  num_states = current_state.length;
  superposition_state_check();
}

function add_H2() {
  H_circuit[1] = (H_circuit[1] + 1)%2;
  current_state = states(M, circuit_step);
  num_states = current_state.length;
  superposition_state_check();
}

function add_H3() {
  H_circuit[2] = (H_circuit[2] + 1)%2;
  current_state = states(M, circuit_step);
  num_states = current_state.length;
  superposition_state_check();
}

function add_H4() {
  H_circuit[3] = (H_circuit[3] + 1)%2;
  current_state = states(M, circuit_step);
  num_states = current_state.length;
  superposition_state_check();
}

function inout_state() {
  if (circuit_step === 1) {
    stepup();
  }
  else {
    stepdown();
  }
}