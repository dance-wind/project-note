class Snake{
  constructor (select){
    this.map = document.querySelector(select)
    //蛇的运动方向
    this.direction = "right"
    //蛇的数组(把蛇的头和身体都会存储到数组当中，头从数组的第0位开始)
    this.snakelist = []
    //调用创建蛇方法
    this.createSnake()
    
  }
  // 创建蛇头的函数
  createHead(){
    // 蛇头
    const head = this.snakelist[0]
    //定义坐标
    const pos = {x:0,y:0}
    if (head) {
      //  新蛇头坐标方向
      switch (this.direction) {
        case "left":
          pos.x= head.offsetLeft-20
          pos.y= head.offsetTop
          break;
        case "right":
          pos.x= head.offsetLeft+20
          pos.y= head.offsetTop
          break;
        case "top":
          pos.x= head.offsetLeft
          pos.y= head.offsetTop-20
          break;
        case "bottom":
          pos.x= head.offsetLeft
          pos.y= head.offsetTop+20
          break;
      
        default:
          break;
      }
      //需要把原先的蛇头变成身体
      head.className = "body"
    }

    // 创建蛇头
    const div = document.createElement("div")
    //定义 样式
    div.className = "head"
    //把蛇头存入数组
    this.snakelist.unshift(div)
    //给蛇头定义 坐标
    div.style.left = pos.x+"px"
    div.style.top = pos.y+"px"

    //放到地图当中
    this.map.appendChild(div)
  }
  createSnake(){
    for(let i=0;i<4;i++){
      this.createHead()
    }
  }
  move(){
    //身体末尾从数组删除
    const body = this.snakelist.pop()
    //从页面删除
    body.remove()
    //新增蛇头
    this.createHead()
  }
  // 判断蛇有没有吃到食物
  isEat(foodX,foodY){
    //判断头跟坐标是否重合
    const head = this.snakelist[0]
    const headX = head.offsetLeft
    const headY = head.offsetTop

    if (foodX === headX && foodY === headY) {
      return true
    }
    return false
  }
  // 是否撞墙
  isDie(){
    //判断蛇头有没有到边界
    const head = this.snakelist[0]
    const headX = head.offsetLeft
    const headY = head.offsetTop
    if(headX < 0 || headY < 0|| headX >= this.map.clientWidth || headY >= this.map.clientHeight){
      return true
    }
    return false
  }
}