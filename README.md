# Chess

This is a chess game I made in JavaScript.  It's still in development.

## To run in the browser

```
$ python -m SimpleHTTPServer
```

..and then connect your browser to:  [http://localhost:8000]

## To run on the command line:

```
$ node ./driver.js
    a   b   c   d   e   f   g   h
  +---+---+---+---+---+---+---+---+
8 |*R*|*N*|*B*|*Q*|*K*|*B*|*N*|*R*|
  +---+---+---+---+---+---+---+---+
7 |*P*|*P*|*P*|*P*|*P*|*P*|*P*|*P*|
  +---+---+---+---+---+---+---+---+
6 |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+
5 |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+
4 |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+
3 |   |   |   |   |   |   |   |   |
  +---+---+---+---+---+---+---+---+
2 | P | P | P | P | P | P | P | P |
  +---+---+---+---+---+---+---+---+
1 | R | N | B | Q | K | B | N | R |
  +---+---+---+---+---+---+---+---+
move: e2e4
...
```


## Docker setup (incomplete, mostly for my own reference...)

Eventually remote play will work... This is the beginnings of a
communications server.

```
brew install docker
brew install docker-machine
brew install Caskroom/cask/virtualbox
docker-machine create --driver virtualbox default
docker build -t chess-server .
```
