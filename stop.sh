#!/bin/bash

docker stop `docker ps | awk '$2=="chess-server"{print $1}'`
