# Spoony

## Running

In order to run this project [`docker`](https://www.docker.com/) must be installed and running on your machine along with [`docker-compose`](https://docs.docker.com/compose/).

All you need to do is clone the repository and run `docker-compose up` in the root of the project. This will initialize a [PostgreSQL](https://www.postgresql.org/) database, start an [NGINX](https://www.nginx.com/) server, and build/launch both the frontend and backend.

### macOS & Windows

```sh
$ git clone https://github.com/scott-rc/spoony.git
$ cd spoony
$ docker-compose up -d
...
```

### Linux

```sh
$ git clone https://github.com/scott-rc/spoony.git
$ cd spoony
$ docker-compose -f docker-compose.linux.yml up -d
...
```

Then visit <http://localhost:8080> to view the website!

You can see what the app is doing by using your browser's developer tools. To see what the backend is doing, you can access the container's logs via the command line.

```sh
$ docker logs -f backend
[debug] 2019-09-29 11:24:22:2422 PM /api/v1/self:
[debug] 2019-09-29 11:24:22:2422 PM   - retreiving jwt...
[debug] 2019-09-29 11:24:22:2422 PM   - verifying jwt...
[debug] 2019-09-29 11:24:22:2422 PM   - decoding jwt...
[debug] 2019-09-29 11:24:22:2422 PM   - retreiving self...
```

## Developing

To build this project manually you will need [`node`](https://nodejs.org) installed and preferrably [`yarn`](https://yarnpkg.com) as well so you can benefit from the yarn.lock files.

Development requires [NGINX](https://www.nginx.com/) and [PostgreSQL](https://www.postgresql.org/) running so we'll use [`docker-compose`](https://docs.docker.com/compose/) to create our local database.

### macOS & Windows

```sh
$ docker-compose -f docker-compose.dev.yml up -d
...
```

### Linux

```sh
$ docker-compose -f docker-compose.linux.dev.yml up -d
...
```

Then begin by `cd`'ing into both the backend and frontend folders and running `yarn` to install the project's dependancies.

Once the dependancies are installed run `yarn dev` in both the backend and frontend folders and you'll be up and running.

```sh
$ cd backend
$ yarn
... installing dependancies
$ yarn dev
... backend running

# another terminal

$ cd frontend
$ yarn
... installing dependancies
$ yarn dev
... frontend running
```

The backend can be accessed at <http://localhost:8080/api> via nginx or <http://localhost:3001> directly

The frontend can be accessed at <http://localhost:8080> via nginx or <http://localhost:3000> directly

**In order to properly use the website you will need to use the nginx links**. The backend purposely does not support [`CORS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) so your browser will not send requests to the backend unless the domain is the same (which the nginx links provide).

Happy coding!
