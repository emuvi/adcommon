#!/bin/bash 
bash -v clean.sh
npm install
py src/all.py
tsc -p tsconfig.json
