// paramters for modular exponentiation function:
// f(x) = a^x (mod N)
// N is the modulus
// a is the base
var N = 299;
var M = N;
var a = 2;

var period = period_finder(N,a);



// canvas coordinates of axis
let x_origin;
let y_origin;
let x_scale;
let y_scale;


var showplot_state = false;

var run_animation = false;

var current_step = 0;

var time = 1;
var rate = 50;





function draw() {
 
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  
  var function_image = document.getElementById('function_label');
  
  // reset Canvas background between frames
  ctx.clearRect(0,0, canvas.width, canvas.height);
 
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 8.5/10;
  x_scale = canvas.width * 8/10;
  y_scale = canvas.width * 8/10;
  

  
  // draw function label
   ctx.drawImage(function_image, canvas.width/2 - function_image.width/4, 10, 0.6*function_image.width, 0.6*function_image.height);
  

    
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();
  

  
  // vertical axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin, y_origin - y_scale);
  ctx.stroke();
 
  
  // horizontal axis ticks
  single_tick(ctx, 0, 10, 1, 0);
  single_tick(ctx, 0, 10, 1, N-1);
  //tick_text(ctx, 0, 0, 12, 'Black');
  tick_text(ctx, 0, N-1, 12, 'Black');

  
  // vertical axis ticks
  single_tick(ctx, 1, 10, 1, 0);
  single_tick(ctx, 1, 10, 1, N-1);
  //tick_text(ctx, 1, 0, 12, 'Black');
  tick_text(ctx, 1, N-1, 12, 'Black');


  // plot points for modular exponentiation
  if (showplot_state === true) {
    for(let x = 0; x < M; x++) {
      if (f(N,a,x) == 1 && x != 0) {
        // red if f(x)=1
        color = 'Tomato';
      } else {
        color = 'rgba(30,144,255,0.5)';
      }
      plot_point(ctx, 3, color, M, N, x, f(N,a,x));
    }
  }

    // draw axis ticks and text for full plot
    if (showplot_state) {
      for (let i = 132; i < N; i += 132) {
       
          tick_text(ctx, 0, i, 12, 'Tomato');
          single_tick(ctx, 0, 10, 1, i);
         
      } 
    }

 
  if (run_animation === true) {
    time += 1;
  }
  if ((time/rate)%1 === 0 && current_step < period) {
    current_step += 1;
  }
  for(let x = 0; x <= current_step; x++) {
    if (x === period ) {
      // red if f(x)=1
      point_color = 'Tomato';
      text_color = 'Tomato';
    } else {
      point_color = 'DodgerBlue';
      text_color = 'Black';
    }
    plot_point(ctx, 3, point_color, M, N, x, f(N,a,x)); 
  }
  single_tick(ctx, 0, 10, 1, current_step);
  tick_text(ctx, 0, current_step, 12, text_color);
  single_tick(ctx, 1, 10, 1, f(N,a,current_step));
  tick_text(ctx, 1, f(N,a,current_step), 12, 'Black');
  

  // for dynamic interactivity
  window.requestAnimationFrame(draw);

}

// draw onto the canvas
draw();


// plots a single point
function plot_point(ctx, size, rgba_string, M, N, x, y) {
  let x_pos = x_origin + x_scale * x / M;
  let y_pos = y_origin - y_scale * y / N;
  ctx.fillStyle = rgba_string;
  ctx.beginPath();
  ctx.arc(x_pos, y_pos, size, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}


// draws tick marks on the plot axes.
// vert = 1 for vertical ticks
// vert = 0 for horizontal ticks
function ticks(ctx, vert, T, size, weight) {
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = weight;
  if (vert === 0) {
    
    for (let i = 0; i < T; i++) {
      ctx.beginPath();
      ctx.moveTo(x_origin + x_scale * i/T, y_origin + size/2);
      ctx.lineTo(x_origin + x_scale * i / T, y_origin - size / 2);
      ctx.stroke();
    }
  } 
  else if (vert === 1) {
    for (let i = 0; i < T  ; i++) {
      ctx.beginPath();
      ctx.moveTo(x_origin - size / 2, y_origin - y_scale * i / T);
      ctx.lineTo(x_origin + size / 2, y_origin - y_scale * i / T);
      ctx.stroke();
    }
  }
}

// draws a single tick mark on the plot axes.
// vert = 1 for vertical ticks
// vert = 0 for horizontal ticks
function single_tick(ctx, vert, size, weight, x) {
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = weight;
  if (vert == 0) {
    ctx.beginPath();
    ctx.moveTo(x_origin + x_scale * x/N, y_origin + size/2);
    ctx.lineTo(x_origin + x_scale * x/N, y_origin - size / 2);
    ctx.stroke();
  } 
  else {
    ctx.beginPath();
    ctx.moveTo(x_origin - size / 2, y_origin - y_scale * x/N);
    ctx.lineTo(x_origin + size / 2, y_origin - y_scale * x/N);
    ctx.stroke();  
  }
}

function tick_text(ctx, vert, number, size, color_string) {
  
  ctx.save();
  if (vert === 0) {
    x_pos = x_origin + x_scale*number/N ;
    y_pos = y_origin + 15;
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
  } 
  else {
    x_pos = x_origin - 15;
    y_pos = y_origin - y_scale*number/N;
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    
  }
  ctx.font = size.toString()+'px Arial';
  ctx.fillStyle = color_string;
  ctx.fillText(number.toString(), x_pos, y_pos);
  ctx.restore();
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

// modular exponenetiation function: f(x) = a^x (mod N)
function f(N, a, x) {
  let bits = DtoB(x);
  let f = 1;
  for (i = 0; i < bits.length; i++) {
    f = (f * Math.pow(repeated_squaring(a, Math.pow(2,i), N), bits[i]))%N;
  }
  return f%N;
}

// calculates the period of modular exponetation if it exists;
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


// toggles whether or not to show the full plot
function showplot() {
  showplot_state = !showplot_state;
}


function run() {
  run_animation = !run_animation;

}

function reset() {
  run_animation = false;
  time = 1;
  current_step = 0;
}
