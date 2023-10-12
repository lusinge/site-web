#!/bin/sh
find public/news -name "index.html" -exec rename --all "index.html" "status.html" {} \;
find public/projects -name "index.html" -exec rename --all "index.html" "status.html" {} \;
find public/resource -name "index.html" -exec rename --all "index.html" "status.html" {} \;
