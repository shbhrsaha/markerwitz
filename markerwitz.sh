#!/usr/bin/env bash

python src/watch.py & 
websocketd --port=8080 src/server.py &
