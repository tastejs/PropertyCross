#!/bin/bash

set -e

###
# Build package
###

rm -rf build/package/*

cp -r assets lib style build/package
cp config.xml build/package/config.xml
cp index.html build/package/index.html

find lib/jquery.js lib/knockout.js model viewModel app.js -name \*.js | xargs \
  java -jar build/compiler.jar \
    --compilation_level=SIMPLE_OPTIMIZATIONS \
    --js_output_file=build/package/source.min.js \
    --process_common_js_modules \
    --transform_amd_modules \
    --common_js_entry_module=app.js \
    --output_wrapper='(function(){%output%})();'

java -jar build/compiler.jar \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  --js_output_file=build/package/app.min.js \
  --warning_level=QUIET \
  build/package/source.min.js

rm build/package/source.min.js

###
# Build package-windowsphone
###

rm -rf build/package-windowsphone/*

cp -r assets lib style-windowsphone build/package-windowsphone
cp config-windowsphone.xml build/package-windowsphone/config.xml
cp index-windowsphone.html build/package-windowsphone/index.html

find lib/jquery.js lib/knockout.js model viewModel app-windowsphone.js -name \*.js | xargs \
  java -jar build/compiler.jar \
    --compilation_level=SIMPLE_OPTIMIZATIONS \
    --js_output_file=build/package-windowsphone/source.min.js \
    --process_common_js_modules \
    --transform_amd_modules \
    --common_js_entry_module=app-windowsphone.js \
    --output_wrapper='(function(){%output%})();'

java -jar build/compiler.jar \
  --compilation_level=SIMPLE_OPTIMIZATIONS \
  --js_output_file=build/package-windowsphone/app.min.js \
  --warning_level=QUIET \
  build/package-windowsphone/source.min.js

rm build/package-windowsphone/source.min.js