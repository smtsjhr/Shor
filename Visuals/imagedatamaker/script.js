

var image_ids = ['circuit_state_label_4'];
// [ 'circuit_state_label_0', 'circuit_state_label_1', 'circuit_state_label_2', 'circuit_state_label_3', 'circuit_state_label_4', 'circuit_state_label_5', 'circuit_state_label_6'];

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

for (let i = 0; i < image_ids.length; i++) {
    let id = image_ids[i];
    var image = document.getElementById(id);

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);

    var dataURL = canvas.toDataURL("image/png");
    console.log(id, dataURL);
}