ARG _WORKING_DIR="/opt/app"

FROM node:22-alpine AS base

ARG _WORKING_DIR

VOLUME ["${_WORKING_DIR}/node_modules", "${_WORKING_DIR}/logs"]

WORKDIR $_WORKING_DIR

COPY package.json .

RUN npm i --omit=optional

COPY . .

#CMD npm run start