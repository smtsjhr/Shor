

var state_x = 0;

var M = 16;
var N = 15;
var a = 2;

var kets_image = document.getElementById('basiskets32');

var circuit_image = document.getElementById('circuit');

var measurement_label_pos = [[155,60], [155,110]];

var dottedline_pos = [135, 208, 335, 345, 420, 480];

var max_circuit_steps = 2;

const state_labels = ['circuit_state_label_0', 'circuit_state_label_1', 'circuit_state_label_2', 'circuit_state_label_3', 'circuit_state_label_4', 'circuit_state_label_5',];



var circuit_step = 1;
var current_step = 1;
var previous_step = 1;

var current_state = states(M,N,a,circuit_step);
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


var period = period_finder(N,a);

var shift;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');



function draw() {

  
  // ctx.font = '14px Arial';
  // ctx.fillStyle = 'rgba(0,0,0,1)';
  // ctx.fillText('a = ' + a.toString(), 150, 485);
  
  // define HTML IDs for state label images that dynamically update
  var display_state_label = state_labels[parseInt(circuit_step)];
  var state_label = document.getElementById(display_state_label);
  
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 9.5/10;
  x_scale = canvas.width * 8/10;
  y_scale = canvas.width * 8/10;
 
   // reset Canvas background between frames
  //ctx.fillStyle = 'rgba(255,255,255,1)'
  //ctx.fillRect(0,0,500,500);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fillRect(x_origin - 10, y_origin - y_scale, x_scale+15, y_scale + 10);

  ctx.clearRect(0,0,500,150);
  ctx.clearRect(0,0, x_origin - 10, canvas.height);
  ctx.clearRect(0, y_origin + 10, canvas.width, canvas.height - y_origin);
  
  
  
  // ctx.font = '14px Arial';
  // ctx.fillStyle = 'rgba(0,0,0,1)';
  // ctx.fillText('Step: ' + circuit_step.toString(), 15, 75);
  
  
  
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();
  
  // horizontal axis ticks
  ticks(ctx, 1, M, 10, 1);
  
  // vertical axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin, y_origin - y_scale);
  ctx.stroke();
  
  // vertical axis ticks
  ticks(ctx, 0, N, 10, 1);

   
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
  ctx.drawImage(circuit_image, 0.5*canvas.width - 0.25*circuit_image.width, 30, circuit_image.width*0.6, circuit_image.height*0.6);
 
  // draw dotted line marker for circuit step 
  dottedline(ctx, dottedline_pos[circuit_step],25,120,10);

  // draw state label for circuit step
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
    draw_axis_ket(ctx, 0, x_scale, M, x_origin - 5 , y_origin + 9, 20, current_state[x][0]);
     
  }

   // draw ket labels for register 2
  let register2_states = [... new Set(current_state.map(point => point[1]))]

  for (y = 0; y < register2_states.length; y++) {
    draw_axis_ket(ctx, 1, x_scale, N, x_origin - 24 , y_origin - 8 , 20, register2_states[y]);
  }
  
  
  draw_ket(ctx, 145 - 3, 65 - 15, 25, state_x);    
  draw_ket(ctx, 145 - 3, 125 - 15, 25, 0);

  if (circuit_step === 2) {
    draw_ket(ctx, 370 - 3, 65 - 15, 25, state_x);    
    draw_ket(ctx, 370 - 3, 125 - 15, 25, f(N,a,state_x));
  }
    
  
  
  // increment time step for point animation
  t+=1;

  // for dynamic interactivity
  window.requestAnimationFrame(draw);
 
}

if (gcd(a,N) != 1) {
  //  ERROR for "undefined" circuit parameters 'a' and 'N'
  console.log('circuit undefined gcd(a,N) != 1')
} else {
  // draw onto the canvas
  draw();
}


function run_circuit() {
    
  circuit_step = 1;
  current_state = states(M,N,a,circuit_step);
  num_states = current_state.length;
  current_step = 1;
  previous_step = 1;
  run_circuit_animation = true;
  // measured_state = true;
  // measured_state_1 = false;
  // measured_state_2 = false;
  t = 0;
  circuit_time = 0;
  
}

function stepup() {
  
  if (circuit_step < max_circuit_steps) {
    circuit_step += 1;
    
    if (circuit_step === 1) {
        measured_state = false;    
    }

  current_state = states(M,N,a,circuit_step);
  num_states = current_state.length;
   
  }
    
}

function stepdown() {
  
  if (circuit_step > 1) {
    circuit_step -= 1;
  }
 
  current_state = states(M,N,a,circuit_step);
  num_states = current_state.length;
}


// states for circuit steps
function states(M,N,a,step) {
    
  let M_indices = Array.from({length: M}, (v, i) => i);
  
  
  if (step === 1) {
    let states1 = [[state_x,0]];
    return states1;
  }
  else if (step === 2) {
    let states2 = [[state_x, f(N,a,state_x)]];
    return states2;
  }
  
}


// plots a single point
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

function axis_text(ctx, orientation, scale, bins, x_origin, y_origin,  color, number) {
  let number_string = number.toString();
  
  if (orientation === 0) {
     x_position = x_origin + number*scale/bins;
     y_position = y_origin;
  } 
  else if (orientation === 1) {
     x_position = x_origin;
     y_position = y_origin - number*scale/bins; 
  }
   
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(number_string, x_position, y_position)
  ctx.restore();  
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


// converts decimal number to binary string
function DtoB(n) {
  let bitstring = [];
  if (n === 0) {
    bitstring.push(0);
    return bitstring;
  }
  while (n > 0) {
    let b = n % 2;
    bitstring.push(b);
    n = Math.floor(n / 2);
  }
  return bitstring;
}


// calculates a^k(mod N) via repeated squaring
function repeated_squaring(a, k, N) {
  if (k === 0) {
    return 1; 
  }
  else if (k === 1) {
    return a;  
  }
  else if (k%2 === 1) {
    return (a*repeated_squaring((a*a)%N, (k-1)/2, N))%N;  
  }
  else if (k%2 === 0) {
    return (repeated_squaring((a*a)%N, k/2, N))%N;  
  }
}

// modular exponentiation function: f(x) = a^x (mod N)
function f(N, a, x) {
  let bits = DtoB(x);
  let f = 1;
  for (i = 0; i < bits.length; i++) {
    f = (f * Math.pow(repeated_squaring(a, Math.pow(2,i), N), bits[i]))%N;
  }
  return f%N;
}

// calculates the period of modular exponentiation if it exists;
// if not, returns 'undefined' as text.
function period_finder(N, a) {
  if (gcd(a, N) === 1) {
    for (x = 1; x < N; x++) {
      let input = x;
      let output = f(N, a, input);
      if (output === 1) {
        return input;
      }
    }
  } else {
    return 'undefined';
  }
}

// calculates the greatest common divisor of two integers
function gcd(x, y) {
  var a = Math.max(x, y);
  var b = Math.min(x, y);
  if (b == 0) {
    return a;
  } else {
    return gcd(b, a%b);
  }
}


function state_update() {
  state_x = state_slider.value;
  stepdown();
}
