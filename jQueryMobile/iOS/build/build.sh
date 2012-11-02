#!/bin/bash
# run iOS folder
cat build/source.files | xargs java -jar ../build/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --js_output_file=build/source.min.js --process_common_js_modules --transform_amd_modules --common_js_entry_module=app.js --output_wrapper '(function() {%output%})();'
(cat build/lib.files ; echo build/source.min.js) | xargs java -jar ../build/compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --warning_level=QUIET --js_output_file=app.min.js
