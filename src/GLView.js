function GLView(canvasId, vertexShaderId, fragmentShaderId) {
    // Get A WebGL context
    var canvas = document.getElementById(canvasId);
    var gl = canvas.getContext("experimental-webgl");

    // setup a GLSL program
    var vertexShader = createShaderFromScriptElement(gl, vertexShaderId);
    var fragmentShader = createShaderFromScriptElement(gl, fragmentShaderId);
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Colour variable
    var colorLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer and set it as the active buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // Use buffer for vertex positions
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    function getRectangleVertexArray(x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        return new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]);
    }

    var colourMap = {
        'S': new Float32Array([0.25, 1, 0.25, 1]),
        'L': new Float32Array([0.5, 0.5, 1, 1]),
        'D': new Float32Array([1, 0, 0, 1])
    };

    this.drawCell = function(cell) {
        gl.bufferData(gl.ARRAY_BUFFER, cell.vertexArray, gl.STATIC_DRAW);

        gl.uniform4fv(colorLocation, colourMap[cell.action]);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    this.initGrid = function(grid, gridWidth, gridHeight) {
        var cellWidth = canvas.width / gridWidth;
        var cellHeight = canvas.height / gridHeight;
        grid.callAll(function(cell) {
            cell.vertexArray = getRectangleVertexArray(
                cell.x * cellWidth,
                cell.y * cellHeight,
                cellWidth,
                cellHeight
            );
        });
    };
}
