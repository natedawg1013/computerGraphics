
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var topLetterVertices = [
        vec2( -0.25, 0 ),
        vec2(  -0.25,  0.5 ),
        vec2( 0, 0.5 ),
        vec2( 0.25, 0.4 ),
        vec2( 0.25, 0.1 ),
        vec2( 0.0, 0.0 ),
    ];

    var bottomLetterVertices = [
        vec2( -0.25, 0.0 + .1 ),
        vec2(  -0.25,  -0.5 + .1 ),
        vec2( 0, -0.5 + .1 ),
        vec2( 0.25, -0.4 + .1 ),
        vec2( 0.25, -0.1 + .1 ),
        vec2( 0.0, 0.0 + .1 ),
    ];

    var topHoleVertices = [
        vec2( -0.125, 0.125 ),
        vec2(  -0.125,  0.375 ),
        vec2(  0.0,  0.375 ),
        vec2(  0.125,  0.325 ),
        vec2(  0.125,  0.175 ),
        vec2( 0.0, 0.125 ),
        vec2( 0.125, 0.125 ),
    ];

    var bottomHoleVertices = [
        vec2( -0.125, -0.125 + .1 ),
        vec2(  -0.125,  -0.375 + .1 ),
        vec2(  0.0,  -0.375 + .1 ),
        vec2(  0.125,  -0.325 + .1 ),
        vec2(  0.125,  -0.175 + .1 ),
        vec2( 0.0, -0.125 + .1 ),
        vec2( 0.125, -0.125 + .1 ),
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "letter-fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(topLetterVertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(bottomLetterVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 );

    
    var program = initShaders( gl, "vertex-shader", "hole-fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(topHoleVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 );
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(bottomHoleVertices), gl.STATIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 6 );


};