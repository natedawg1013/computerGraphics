
var gl;
var points;
var canvas;

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
            drawTriangles(xhr.responseText);
        }
    };
    xhr.open("GET","ncc1701b.data"); 
    xhr.send();

};

function drawTriangles(data){

    //alert(data);

    triangleVertices = data.split("\n")
                            .join(" ")
                            .split(" ")
                            .map(function(val, index, arr){
                                return parseFloat(val);
                            });
    triangleVertices.pop();
    triangleVertices = normalize(triangleVertices);

    var vertices = [];

    for(i=0; i<triangleVertices.length; i+=3){
        vertices.push(vec3(triangleVertices[i],
                           triangleVertices[i+1],
                           triangleVertices[i+2]));
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