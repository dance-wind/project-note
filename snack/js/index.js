const game = new Game(".map",".score span", "#start")
const start = document.querySelector("#start")
const pause = document.querySelector("#pause")
const restart = document.querySelector("#restart")

start.onclick = function () {
  game.start()
}
pause.onclick = function () {
  game.pause()
}
restart.onclick = function () {
  game.restart()
}

//键盘监听  左 37 上 38 右 39 下 40
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
    game.change("left")
      break;
    case 38:
    game.change("top")
      break;
    case 39:
    game.change("right")
      break;
    case 40:
    game.change("bottom")
      break;
  }
}