rem browserify kunludi3.js --standalone MyApprem -o kunludi3-bundle.js

browserify kunludi3.js --standalone K3 > kunludi3-bundle.js

rem browserify -t require-globify kunludi3.js --standalone K3  > kunludi3-bundle.js
