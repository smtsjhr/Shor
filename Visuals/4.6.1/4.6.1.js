// set the modulus N
var N = 1000;
var M = N;

// set the base a
var a = 2;

// set the multiple
var multiple = 40;


// create arrays for sampled pairs
var random_pairs = [[null, null]];

var algo_counts = [0,0];
var algo_order = [];
var sample_timer = 0;
var sample_animation_time = 50;




// coordinates for x and y axis
let x_origin;
let y_origin;
let x_scale;
let y_scale;


// draw onto the canvas
draw();


function draw() {
 
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');


  
  // reset Canvas background between frames
  ctx.clearRect(0,0,canvas.width,canvas.height);

 
  // set graph axes origin and scale
  x_origin = canvas.width * 1/10;
  y_origin = canvas.height * 7.5/10;
  x_scale = canvas.width * 8/10;
  y_scale = canvas.width * 8/10;
  

  
  
  // horizontal axis
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  ctx.lineTo(x_origin + x_scale, y_origin);
  ctx.stroke();

  
  // get most recent sampled pair of multiples
  let new_pair = random_pairs[random_pairs.length - 1];

  // horizontal axis ticks for 0 and N - 1
  if ( new_pair[0] === 0 || new_pair[1] === 0 ) {
      text_size = 12;
  } 
  else {
      text_size = 12;
  } 
  single_tick(ctx, 0, 10, 1, 0);
  tick_text(ctx, 0, 0, text_size, 'Black'); 

  if ( new_pair[0] === N || new_pair[1] === N ) {
      text_size = 12;
  } 
  else {
      text_size = 12;
  } 
  single_tick(ctx, 0, 10, 1, N);
  tick_text(ctx, 0, N, text_size, 'Black'); 
  
  // draw axis ticks and text for sampled points
  // horizontal axis ticks
  if (random_pairs.length > 1) {
    for (let i = 0; i <=1; i++) {
            let m = new_pair[i]; 
            tick_text(ctx, 0, m, 12, 'Tomato');
            single_tick(ctx, 0, 10, 1, m);   
    }
  }   
  ctx.save();
  // text for dispalying the greatest common divisor of a and N
  ctx.font = '16px Arial';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'left';
  if (random_pairs.length === 1) {
      m_1 = ' __ ';
      m_2 = ' __ ';
      ctx.fillText('gcd(' + m_1.toString()+',' + m_2.toString() + ')' , canvas.width/2, canvas.height*0.65);    
  } else {
      m_1 = new_pair[0];
      m_2 = new_pair[1];
      ctx.fillText('gcd(' + m_1.toString()+',' + m_2.toString() + ') = ' + gcd(m_1,m_2).toString(), canvas.width/2, canvas.height*0.65);
  }

    ctx.font = '16pf Arial';
    ctx.fillStyle = 'Black';
    ctx.textAlign = 'right';
    ctx.fillText( 'Test:    ' + multiple.toString() + ' =  ',canvas.width/2, canvas.height*0.65 );
    ctx.fillText( '?  ' ,canvas.width/2, canvas.height*0.6
     );
    ctx.restore();


    if (random_pairs.length > 1) {
        let success_rate = Math.round(100*algo_counts[0]/(algo_counts[0] + algo_counts[1]));
        let failure_rate = Math.round(100*algo_counts[1]/(algo_counts[0] + algo_counts[1]));
        
        ctx.font = '14px Arial';
        ctx.fontStyle = 'Black';
        ctx.fillText(success_rate.toString() + ' %', canvas.width/2 - 50, 15);
        ctx.fillText(failure_rate.toString() + ' %', canvas.width/2 + 25 , 15);
    }


    histogram(ctx, algo_counts, algo_order, sample_timer, sample_animation_time, 0.5, canvas.width/2 - 150/4 , canvas.height/2.5, 150, 100, true, 10, 'DodgerBlue', true)

    sample_timer += 1;

    ctx.font = '16px Arial';
    ctx.fillStyle = 'Black';
    ctx.fillText('success', canvas.width/2 - 60, canvas.height/2.5 + 25);
    ctx.fillText('failure', canvas.width/2 + 20, canvas.height/2.5 + 25);

  


  // for dynamic interactivityx
  window.requestAnimationFrame(draw);

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

// draws number text for ticks
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
  if (vert === 1) {
    ctx.fillText(number.toString(), x_pos, y_pos);
  } 
  else {
    ctx.fillText(number.toString(), x_pos, y_pos); 
  }
  ctx.restore();
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

function histogram(ctx, sample_counts, sample_order, timer, sample_animation_time, bar_width, x_pos, y_pos, x_scale, y_scale, normalize, tick_length, color, axes) {
  
    ctx.save();  
  
    // number of bins
    let bins = sample_counts.length;
  
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
      ctx.fillStyle = color;
      ctx.fillRect(x_pos + (i + (0 - bar_width)/2)*x_scale/bins,
                  y_pos - y_scale*sample_counts[i]/norm,
                  bar_width*x_scale/bins,
                  y_scale*sample_counts[i]/norm);
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
        ctx.moveTo(x_pos - x_scale/bins, y_pos);
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



// sample a random  pair ofinteger in the range 0 to N 
function random_pair() {
    random_pairs.push([multiple*Math.floor(Math.floor(N/multiple)*Math.random()), multiple*Math.floor(Math.floor(N/multiple)*Math.random())]);
    
    let new_pair = random_pairs[random_pairs.length - 1];
    let g = gcd(new_pair[0], new_pair[1]);
    if (g === multiple) {
        algo_counts[0] += 1;
        algo_order.push(0);
    }
    else {
        algo_counts[1] += 1;
        algo_order.push(1);
    }
    sample_timer = 0;
}

// clears samples
function clearsamples() {
    random_pairs = [[null, null]];
    algo_counts = [0,0];
    algo_order = [];
}

