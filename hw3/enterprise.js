
var gl;
var vertices = [];
var quats = [];
var canvas;
var rotation = vec4(0,0,0,1);
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
            data = xhr.responseText;
            
            triangleVertices = data.split("\n")
                                    .join(" ")
                                    .split(" ")
                                    .map(function(val, index, arr){
                                        return parseFloat(val);
                                    });
            triangleVertices.pop();
            triangleVertices = normalize(triangleVertices);
            
            for(i=0; i<triangleVertices.length; i+=3){
                var q1 = vec4(triangleVertices[i],
                                   triangleVertices[i+1],
                                   triangleVertices[i+2],
                                   00);
                quats.push(q1);
                
            }
            updateRotation();
            drawTriangles();
        }
    };
    xhr.open("GET","ncc1701b.data"); 
    xhr.send();
};

function drawTriangles(){
    
    vertices = []; 
    for (var i = 0; i < quats.length; i++){
        var cr = conjugate(rotation);
        var res = vec3(quatMultiply(quatMultiply(rotation, quats[i]),cr));
        vertices.push(res)
    }


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length);
}

function normalize(data){
    var mag=0.00;
    for(i=0; i<data.length; i++){
        if(data[i]>mag)
            mag=data[i];
        if((-data[i])>mag)
            mag=-data[i];
    }
    var out = [];
    for(i=0; i<data.length; i++){
        out.push(data[i]/mag);
    }
    return out;
}
function matToQuat(m){
    var trace = m[0] + m[4] + m[8];
    var root;
    var result = [];
    if (trace > 0.0){
        root = Math.sqrt(trace + 1.0);
        result[3] = 0.5 * root;
        root = 0.5/root;
        result[0] = (m[5] - m[7]) * root;
        result[1] = (m[6] - m[2]) * root;
        result[2] = (m[1] - m[3]) * root;

    } else {
        var i = 0;
        if ( m[4] > m[0] ) i = 1;
        if ( m[8] > m[i * 3 + i]) i = 2;
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        
        root = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        result[i] = 0.5 * root;
        root = 0.5 / root;
        
        result[3] = (m[j*3+k] - m[k*3+j]) * root;
        result[j] = (m[j*3+i] - m[k*3+j]) * root;
        result[k] = (m[j*3+i] - m[k*3+k]) * root;
        
    }
    return result;
}
/*function quatRotateX(quat, degrees){
    var result = [];
    var radians = degrees * (Math.PI / 180);
    var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];
    var bw = Math.sin(radians), bx = Math.cos(radians);
    
    result[0] = qx * bw + qw * bx;
    result[1] = qy * bw + qz * bx;
    result[2] = qz * bw - qy * bx;
    result[3] = qw * bw - qx * bx;
    return result;
}*/

function updateRotation(){
    var r = document.getElementById("x").value,
        p = document.getElementById("y").value,
        y = document.getElementById("z").value;
    
    r *= Math.PI / 180;
    p *= Math.PI / 180;
    y *= Math.PI / 180;
    
    rotation[3] = (Math.cos(r/2)) * (Math.cos(p/2)) * (Math.cos(y/2)) + (Math.sin(r/2)) * (Math.sin(p/2)) * (Math.sin(y/2));
    rotation[0] = (Math.sin(r/2)) * (Math.cos(p/2)) * (Math.cos(y/2)) - (Math.cos(r/2)) * (Math.sin(p/2)) * (Math.sin(y/2));
    rotation[1] = (Math.cos(r/2)) * (Math.sin(p/2)) * (Math.cos(y/2)) + (Math.sin(r/2)) * (Math.cos(p/2)) * (Math.sin(y/2));
    rotation[2] = (Math.cos(r/2)) * (Math.cos(p/2)) * (Math.sin(y/2)) - (Math.sin(r/2)) * (Math.sin(p/2)) * (Math.cos(y/2));
    drawTriangles();
    console.log(rotation);
    console.log(conjugate(rotation));
    console.log(rotation[0]**2 + rotation[1]**2 + rotation[2]**2 + rotation[3]**2);
}
function hamiltonProduct(a, b){
    var res = vec4();
    res[0] = ((a[3] * b[0]) + (a[0] * b[3]) + (a[1] * b[2]) - (a[2] * b[1]));
    res[1] = ((a[3] * b[1]) - (a[0] * b[2]) + (a[1] * b[3]) + (a[2] * b[0]));
    res[2] = ((a[3] * b[2]) + (a[0] * b[1]) - (a[1] * b[0]) + (a[2] * b[3]));
    res[3] = ((a[3] * b[3]) + (a[0] * b[0]) - (a[1] * b[1]) + (a[2] * b[2]));
    return res;
}

function quatMultiply(a,b){
    var res = vec4();
    var w=3,x=0,y=1,z=2;
    res[w] = ((b[w] * a[w]) - (b[x] * a[x]) - (b[y] * a[y]) - (b[z] * a[z]));
    res[x] = ((b[w] * a[x]) + (b[x] * a[w]) - (b[y] * a[z]) + (b[z] * a[y]));
    res[y] = ((b[w] * a[y]) + (b[x] * a[z]) + (b[y] * a[w]) - (b[z] * a[x]));
    res[z] = ((b[w] * a[z]) - (b[x] * a[y]) + (b[y] * a[x]) + (b[z] * a[w]));
    return res;
}

function conjugate(quat){
    var out = vec4(quat);
    out[0]*=-1;
    out[1]*=-1;
    out[2]*=-1;
    return out;
}