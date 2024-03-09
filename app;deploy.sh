#!/bin/bash
cd /home/chitraup/Projects/smartdash/smartdash-compose
ls -la

docker pull docker.cicd-jfrog.telkomsel.co.id/smartdash/app:latest

if [ "$(docker ps -a -q -f name='smartdash-app')" ]; then
  docker stop smartdash-app
  docker rm smartdash-app
fi
docker-compose up -d app
docker ps