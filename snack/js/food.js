class Food{
  constructor(select){
    this.map = document.querySelector(select)
    // 创建食物
    this.food = document.createElement("div")
    // 定义样式
    this.food.className = "food"
    //放到地图当中
    this.map.appendChild(this.food)
    //定义坐标
    this.x = 0
    this.y = 0
    // 调用生成食物的方法
    this.foodPos()
  }
  // 随机坐标点
  foodPos(){
    const w_nub = this.map.clientWidth/20
    const h_nub = this.map.clientHeight/20
    let n1 = Math.floor(Math.random() * w_nub) 
    let n2 = Math.floor(Math.random() * h_nub) 
    // 由随机数进行坐标位置的计算
    this.x = n1*20
    this.y = n2*20
    this.food.style.left = this.x + "px"
    this.food.style.top = this.y + "px"
  }
}