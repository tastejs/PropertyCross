var _log = dust.log ? function(mssg) { dust.log(mssg, "INFO"); } : function() { };

dust.helpers["tap"] = function(input, chunk, context) {
    // return given input if there is no dust reference to resolve
    // dust compiles a string/reference such as {foo} to a function
    if(typeof input !== "function") {
        return input;
    }

    var dustBodyOutput = '',
        returnValue;

    //use chunk render to evaluate output. For simple functions result will be returned from render call,
    //for dust body functions result will be output via callback function
    returnValue = chunk.tap(function(data) {
        dustBodyOutput += data;
        return '';
    }).render(input, context);

    chunk.untap();

    //assume it's a simple function call if return result is not a chunk
    if(returnValue.constructor !== chunk.constructor) {
        //use returnValue as a result of tap
        return returnValue;
    } else if(dustBodyOutput === '') {
        return false;
    } else {
        return dustBodyOutput;
    }
}

dust.helpers["if"] = function (chunk, context, bodies, params) {
    var body = bodies.block,
        skip = bodies['else'];
    if (params && params.cond) {
        var cond = params.cond;
        cond = dust.helpers.tap(cond, chunk, context);
        // eval expressions with given dust references
        if (eval(cond)) {
            if (body) {
                return chunk.render(bodies.block, context);
            }
            else {
                _log("Missing body block in the if helper!");
                return chunk;
            }
        }
        if (skip) {
            return chunk.render(bodies['else'], context);
        }
    }
        // no condition
    else {
        _log("No condition given in the if helper!");
    }
    return chunk;
}
