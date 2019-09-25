FROM node:alpine AS build
WORKDIR /build
COPY . ./
ENV REACT_APP_DEBUG=spoony:*
RUN yarn --frozen-lockfile && yarn build
RUN yarn global add serve

FROM node:alpine
WORKDIR /app
COPY --from=build /build/build .
RUN yarn global add serve
EXPOSE 3000
CMD serve -s -l 3000