#!/bin/bash

set -e

cargo +nightly web build --target wasm32-unknown-unknown

rm -rf webtest
mkdir webtest

cp index.html webtest
cp target/wasm32-unknown-unknown/release/meloweb.* webtest

(cd webtest && python3 -m http.server)
