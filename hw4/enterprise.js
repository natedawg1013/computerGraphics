
var gl;
var vertices = [];
var rotQuat;
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
                var q1 = vec3(triangleVertices[i],
                                   triangleVertices[i+1],
                                   triangleVertices[i+2]);
                vertices.push(q1);
                
            }
            addVertices();
            updateRotation();
        }
    };
    xhr.open("GET","ncc1701b.data"); 
    xhr.send();
};

function addVertices(){
    
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

    rotQuat = gl.getUniformLocation( program, "rotQuat" );
}

function render(){
    gl.uniform4fv(rotQuat, rotation);

    gl.enable(gl.DEPTH_TEST);
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length);
}

function normalize(data){
    var mag=0.00;
    var finalScale = 0.8;
    for(i=0; i<data.length; i++){
        if(data[i]>mag)
            mag=data[i];
        if((-data[i])>mag)
            mag=-data[i];
    }
    var out = [];
    for(i=0; i<data.length; i++){
        out.push(data[i]/mag*finalScale);
    }
    return out;
}

function updateRotation(){
    var p = document.getElementById("pitch").value,
        r = document.getElementById("roll").value,
        y = document.getElementById("yaw").value;
    
    p *= Math.PI / 180;
    r *= Math.PI / 180;
    y *= Math.PI / 180;
    
    rotation[3] = (Math.cos(p/2)) * (Math.cos(r/2)) * (Math.cos(y/2)) + (Math.sin(p/2)) * (Math.sin(r/2)) * (Math.sin(y/2));
    rotation[0] = (Math.sin(p/2)) * (Math.cos(r/2)) * (Math.cos(y/2)) - (Math.cos(p/2)) * (Math.sin(r/2)) * (Math.sin(y/2));
    rotation[1] = (Math.cos(p/2)) * (Math.sin(r/2)) * (Math.cos(y/2)) + (Math.sin(p/2)) * (Math.cos(r/2)) * (Math.sin(y/2));
    rotation[2] = (Math.cos(p/2)) * (Math.cos(r/2)) * (Math.sin(y/2)) - (Math.sin(p/2)) * (Math.sin(r/2)) * (Math.cos(y/2));
    addVertices();
    render();
}
