FROM node:alpine AS build
WORKDIR /build
COPY . ./
RUN apk --update --no-cache --virtual .build-deps add g++ make python \
  && yarn --frozen-lockfile \
  && yarn build \
  && apk del .build-deps \
  && npm prune --production

FROM node:alpine
WORKDIR /app
COPY --from=build /build/build .
COPY --from=build /build/node_modules node_modules
EXPOSE 3001
CMD node ./index.js