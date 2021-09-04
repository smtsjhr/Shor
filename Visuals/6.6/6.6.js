
var step = 0;

var M = 16;
var N = 15;

var period = 5;
var shift = 0;

var qft_data = Array.from({length: period}, (v, i) => QFTdist(M, period, i));

var qft_list = qft_data[shift];
var max_prob = Math.max.apply(null,qft_list);
var qft_phase_list = QFTphase_list(M, period, shift);

var measurements1 = [];
var measurement1_counts = Array(M).fill(0);

var sample_timer = 0;
var sample_timer_1 = 0;
const sample_animation_time = 50;


var input_state = state(0);
var num_states_input = input_state.length;

var output_state = state(1);
var num_states_output = output_state.length;

var dottedline_pos = [205, 305, 335, 372, 455];

var period_slider = document.getElementById("period_slider");
var shift_slider = document.getElementById("shift_slider");

var kets_image = document.getElementById('basiskets32');
var input_state_label = document.getElementById('input_state_label');
var output_state_label = document.getElementById('output_state_label');

let x_origin;
let y_origin;
let x_scale;
let y_scale;

var t = 0;
var circuit_time = 0;
var circuit_animation_rate = 0.1;

var point_size = 10;
var point_animation = 0; // '1 = true, 0 = false'
var point_animation_rate = .075;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


// draw onto the canvas
draw();

function draw() {
  
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 3.5/10;
  x_origin_2 = canvas.width * 1/10;
  y_origin_2 = canvas.height * 7.5/10
  x_scale = canvas.width * 8/10;
  y_scale = canvas.height * 4/10;

 
  // reset Canvas background between frames
  //ctx.fillStyle = 'rgba(255,255,255,1)'
  //ctx.fillRect(0,0,500,500);
  ctx.fillStyle = 'rgba(255,255,255, 1)';
  ctx.fillRect(x_origin - 10, y_origin - y_scale, x_scale+15, y_scale + 30);

  ctx.clearRect(0,0,500,180);
  ctx.clearRect(0,0, x_origin - 10, canvas.height);
  ctx.clearRect(0, y_origin + 10, canvas.width, canvas.height - y_origin);
  
  // text for slider paramters: period (p) and shift (s)
  ctx.font = '18px Arial';
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.fillText('period :  p = ' + period.toString(), 150, 25);
  ctx.fillText('shift :  s = ' + shift.toString(), 150, 45);
  
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();
  
  // horizontal axis ticks
  ticks(ctx, x_origin, y_origin, x_scale, y_scale, 1, M, 10, 1);

  // horizontal axis 2
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin_2, y_origin_2);
  ctx.lineTo(x_origin_2 + x_scale, y_origin_2);
  ctx.stroke();

  // horizontal axis 2 ticks
  ticks(ctx, x_origin_2, y_origin_2, x_scale, y_scale, 1, M, 10, 1);
  
  // draw state label for input state
  ctx.drawImage(input_state_label, x_origin, 80, 0.4*input_state_label.width, 0.4*input_state_label.height);
  // draw state label for output state
  ctx.drawImage(output_state_label, x_origin, 280, 0.4*output_state_label.width, 0.4*output_state_label.height);


  
  // draw points for input states
   for(let x = 0; x < num_states_input; x++) {

      size_x = point_size;
      grow_x = 1;
      grow_point_size = point_animation*size_x/2;
      phase_x = 1;
      phase_y = 0;
      
      // draw points for states
      plot_point_anim(ctx, x_origin, y_origin, x_scale, y_scale, size_x, [phase_x, phase_y], grow_x, grow_point_size, 'rgba(30,144,255,1)', M, N, input_state[x][0], input_state[x][1],4, point_animation*(point_animation_rate*t - 2*Math.PI*x/(num_states_input*.1)));
    
   }

   // draw points for output state
   for(let x = 0; x < num_states_output; x++) {
    
      let amp_norm = Math.sqrt(qft_list[x]/max_prob );
      if (amp_norm > 0.000) 
      {
            
            var size_x = point_size*amp_norm;
            var grow_x = amp_norm;
            var grow_point_size = point_animation*size_x/2;
            var phase_x = qft_phase_list[x][0];
            var phase_y = qft_phase_list[x][1];
      } 
      else {
            var size_x = 0;
            var grow_x = 0;
      }
      
     // draw points for states
     plot_point_anim(ctx, x_origin_2, y_origin_2, x_scale, y_scale, size_x, [phase_x, phase_y], grow_x, grow_point_size, 'rgba(30,144,255,1)', M, N, output_state[x][0], output_state[x][1],4, point_animation*(point_animation_rate*t - 2*Math.PI*x/(num_states_output*.1)));
    
   }

  // draw ket labels for input state axis
   for (let x = 0; x < M; x++) {
      // draw ket labels for input state axis
      if (x%1 === 0) {
        draw_axis_ket(ctx, 0, x_scale, M, x_origin - 5 , y_origin + 15, 22, x); 
      }
   }
  
   // draw ket labels for output state axis
   for (let x = 0; x < M; x++) {
    // draw ket labels for output state axis
    if (x%1 === 0) {
      draw_axis_ket(ctx, 0, x_scale, M, x_origin_2 - 5 , y_origin_2 + 15, 22, x); 
    }
 }

  // draw probability distribution for input state
  input_distribution = periodic_state_dist(M,period,shift);
  ctx.save();
  ctx.translate(x_origin, y_origin + 40);
  ctx.scale(1,-1);
     histogram(ctx, input_distribution, measurement1_counts, measurements1, 0, sample_animation_time, .5, 0, 0, x_scale, 50, true, 5, 'DodgerBlue', false);
  ctx.restore();
  //increment time step for sample animation for register 1 (horizontal axis)
  sample_timer_1 += 1;

  // draw probability distribution for output state
  output_distribution = qft_list;
  ctx.save();
  ctx.translate(x_origin_2, y_origin_2 + 40);
  ctx.scale(1,-1);
     histogram(ctx, output_distribution, measurement1_counts, measurements1, 0, sample_animation_time, .5, 0, 0, x_scale, 50, true, 5, 'DodgerBlue', false);
  ctx.restore();
  //increment time step for sample animation for register 1 (horizontal axis)
  sample_timer_1 += 1;

  
  // increment time step for point animation
  t+=1;

  // for dynamic interactivity
  window.requestAnimationFrame(draw);
 
}


// plots a single point with dynamic animation
function plot_point_anim(ctx, x_origin, y_origin, x_scale, y_scale, size, phase, grow, grow_point_size, rgba_string, M, N, x, y,fold, t) {
  let x_pos = x_origin + x_scale * x / M;
  let y_pos = y_origin - y_scale * y / N;
 
  
  ctx.restore();
  ctx.fillStyle = rgba_string;
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x_pos, y_pos, size, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.save();
  
  for(let i = 0; i<fold; i++) {
    ctx.fillStyle = 'rgba(30,144,255,0.5)';
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.beginPath();
    ctx.arc(x_pos+grow*5*Math.sin(.3*t)*Math.cos(2*Math.PI*i/fold + t), y_pos+grow*5*Math.sin(.3*t)*Math.sin(2*Math.PI*i/fold + t), grow_point_size, 0, 2*Math.PI);
    ctx.fill();
    if (grow > .01) {
      ctx.stroke();
  }
  }
  ctx.save();
  ctx.strokeStyle = 'rgba(255,0,0,1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x_pos, y_pos);
  ctx.lineTo(x_pos + size*phase[0], y_pos - size*phase[1]);
  ctx.stroke();
  ctx.restore();
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
function ticks(ctx, x_origin, y_origin, x_scale, y_scale, vert, T, size, weight) {
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

function state(step) {

  if (step === 0) {
    return periodic_state(M, period, shift);
  }

  if (step === 1) {
    return Array.from({length: M}, (v, i) => i).map(j => [j, 0]);
  }
}


function periodic_state(M, p, s) {

  let num_states = Math.ceil(M/p) ;
  let periodic_states = [...Array(num_states)].map((x,j) => s + j*p).filter( x => x < M);
  return states = periodic_states.map((x,i) => [x,0]);
}

function periodic_state_dist(M, p, s) {
  
  let norm = 1/Math.sqrt(periodic_state(M, p, s).length);

  let dist = [];
  for (let i = 0; i < M; i++) {
    if (i%p === s) {
      dist.push(norm);
    } 
    else {
      dist.push(0);
    }
  }

  return dist;
}


function QFTamp_x(M, j, states) {
  return states.map(k => Math.cos(2*Math.PI*j*k/M)).reduce(function (a, b) {return a + b;}, 0)/Math.sqrt(M*states.length);
}

function QFTamp_y(M, j, states) {
return states.map(k => Math.sin(2*Math.PI*j*k/M)).reduce(function (a, b) {return a + b;}, 0)/Math.sqrt(M*states.length);
}

function QFTprob(M, j, states) {
  
var X = QFTamp_x(M, j, states);

var Y = QFTamp_y(M, j, states);

return (X*X + Y*Y); 
}


function QFTdist(M, period, shift) {

  let states = Array(Math.ceil(M/period)).fill().map((_, i) => shift + i*period ).filter(x => x < M);

  let indices = Array.from({length: M}, (v, i) => i);

  return indices.map(j => QFTprob(M,j,states));  
}

function QFTphase_list(M, period, shift) {

  let states = Array(Math.ceil(M/period)).fill().map((_, i) => shift + i*period ).filter(x => x < M);

  
  let list = [];
  for (let j = 0; j < M; j++) {
    let x = QFTamp_x(M, j, states);
    let y = QFTamp_y(M, j, states);
    let norm = Math.sqrt(x*x + y*y);
    list.push([x/norm, y/norm]);
  }
  return list;
}

function histogram(ctx, distribution, sample_counts, sample_order, timer, sample_animation_time, bar_width, x_pos, y_pos, x_scale, y_scale, normalize, tick_length, color, axes) {
  
  ctx.save();  

  // // number of bins
  let bins = distribution.length;
  let maxprob = Math.max(... distribution);

  if (normalize == false) {
    // total count for all bins
    norm = sample_counts.reduce((x, y) => x + y);
  } else if (normalize = true) {
    // count of bin with maximum counts
    norm = Math.max.apply(null,sample_counts);
  }

  // draw bars
  ctx.save();
  for(let i = 0; i < bins; i++) { 
    let prob = distribution[i];
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.beginPath();
    ctx.rect(x_pos + (i + (0 - bar_width)/2)*x_scale/bins,
                y_pos - y_scale*prob/maxprob,
                bar_width*x_scale/bins,
                y_scale*prob/maxprob);  
    ctx.closePath();          
    ctx.fill();
    //ctx.stroke();
  }
  ctx.restore();

  // draw bars
  ctx.save();
  for(let i = 0; i < bins; i++) { 
    ctx.fillStyle = color;
   
    ctx.fillRect(x_pos + (i + (0 - bar_width)/2)*x_scale/bins,
                y_pos - y_scale*sample_counts[i]/norm,
                bar_width*x_scale/bins,
                y_scale*sample_counts[i]/norm);
    //ctx.fill();

  }
  ctx.restore();

  // highlight border of last sampled bin
  
  if (timer < sample_animation_time) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgb(255,0,0,1)';
  let j = sample_order.slice(-1)[0];

  ctx.fillRect(x_pos + (j + (0 - bar_width)/2)*x_scale/bins,
                y_pos - y_scale*sample_counts[j]/norm,
                bar_width*x_scale/bins,
                y_scale*sample_counts[j]/norm);
  
  ctx.restore();
  }
  


  if (axes) {
  // base axis
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x_pos, y_pos);
  ctx.lineTo(x_pos + x_scale, y_pos);
  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.stroke();
  
  // ticks for axis
  for(let i = 0; i < bins; i++) {
    ctx.beginPath();
    ctx.moveTo(x_pos + (i + 0)*x_scale/bins, y_pos);
    ctx.lineTo(x_pos + (i + 0)*x_scale/bins, y_pos + tick_length);
    ctx.stroke(); 
  }
  }

  ctx.restore();
}






function period_update() {
   period = Math.min(period_slider.value, M);

   shift = Math.min(period -1, shift);
  
   // update the periodic state 
   input_state = state(0);
   num_states_input = input_state.length;

   output_state = state(1);
   num_states_output = output_state.length;

   qft_data = Array.from({length: period}, (v, i) => QFTdist(M, period, i));
   qft_list = qft_data[shift];
   max_prob = Math.max.apply(null,qft_list);

   qft_phase_list = QFTphase_list(M, period, shift);

   
}

function shift_update() {
  shift = Math.min(shift_slider.value, period - 1);
  
   // update the periodic state 
   input_state = state(0);
   num_states_input = input_state.length;

   output_state = state(1);
   num_states_output = output_state.length;

   qft_list = qft_data[shift];
   max_prob = Math.max.apply(null,qft_list);

   qft_phase_list = QFTphase_list(M, period, shift);

   
}
