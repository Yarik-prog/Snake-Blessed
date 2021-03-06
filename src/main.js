const blessed = require('blessed');
const contrib = require('blessed-contrib');

const snake = [{x:10, y:0}, {x:9, y:0}, {x:8, y:0}, {x:6, y:0},  {x:5, y:0}, {x:4, y:0},  {x:3, y:0} ] 
let direction = "right"
let fruites = []
let score = 0
let timer

  const screen = blessed.screen()

  screen.key(['escape', 'q'], function(ch, key) {
    return process.exit(0);
  })
  screen.key(['up', 'down', 'left', 'right'], function(ch, key) {
    if (key.name === 'up' ){
      direction = "up"
    }
    if (key.name === 'down' ){
      direction = "down"
    }
    if (key.name === 'left' ){
      direction = "left"
    }
    if (key.name === 'right' ){
      direction = "right"
    }
  })

  let scoreBox = contrib.markdown()
  screen.append(scoreBox)
  scoreBox.setMarkdown(`Score: ${score}`)

  function updateScore(){
    scoreBox.setMarkdown(`Score: ${++score}`)
  }

  function createGameBox (){
   return blessed.box({
      parent: screen,
      top: 1,
      left: 0,
      width: '100%',
      height: '100%-1',
      border: {
        type: 'line'
      },
      style: {
        fg: 'black',
        bg: 'black',
        border: {
          fg: 'yellow',
        }
      },
    })
  }

  function createGameOverBox (){
    return blessed.box({
       parent: screen,
       top: "center",
       left: "center",
       width: '20%',
       height: '20%',
       valign:'middle',
       align: 'center',
      content: `Game Over!\n Press q to exit`,
       border: {
         type: 'line'
       },
       style: {
         fg: 'black',
         bg: 'yellow',
       
       },
     })
   } 
  
let gameBox = createGameBox()

function clearScreen(){
  gameBox = createGameBox()
} 

 function drawSnake() {
   snake.forEach(({x,y})=>{
      blessed.box({
      parent: gameBox,
      top: y,
      left: x,
      height:1,
      width:1,
      style:{ bg: 'red'}
    })
  })
 }

 function newHead({x,y}){
  switch(direction){
    case "up": 
      return {x, y:y-1}
    case "down":
      return {x, y:y+1}
    case "left":
      return {x:x-1, y}
    case "right":
      return {x:x+1, y}
    default: 
      return {x,y}
  }
 }

 function move(){
  let isEated = false
  snake.unshift(newHead(snake[0]))
  fruites.forEach(fruite => {
     if (snake[0].x === fruite.x && snake[0].y === fruite.y) {
      updateScore()
      //generateFruite()
      fruites = fruites.filter(obj => obj.x != fruite.x && obj.y != fruite.y)
      if (!fruites.length) generateFruite()
      snake.unshift(newHead(snake[0]))
      isEated = true
      } 
  })
  if(!isEated) snake.pop()

 }

 function isGameOver(){

   const collision = snake.filter((_, i) => i > 0).some(obj => obj.x === snake[0].x && obj.y === snake[0].y)

  return (
    collision ||
    snake[0].x >= gameBox.width - 1||
    snake[0].x <= -1 ||
    snake[0].y >= gameBox.height - 1 ||
    snake[0].y <= -1
  )
 }

 function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}
 function generateFruiteCords(){
   let coords = {}
   while(true){
    let unique = true
   coords.x = getRandomArbitrary(1, gameBox.width - 2),
   coords.y = getRandomArbitrary(2, gameBox.height - 2)
  for(let i = 0; i<snake.length; i++){
    if(snake[i].x === coords.x && snake[i].y === coords.y ) {
      unique = false
      break
    }
  }
  if(unique) return coords

   }
 }
 function generateFruite() {
   let countFruites = getRandomArbitrary(2, 7)
   for(let i = 0; i<countFruites; i++){
    fruites[i] = generateFruiteCords()  
   }
}

function drawFruite(){
  fruites.forEach(fruite => {
    blessed.box({
      parent: gameBox,
      top: fruite.y,
      left: fruite.x,
      height:1,
      width:1,
      style:{ bg: 'green'}
    })
  })
}


function tick(){ 
  if(isGameOver()){
  
    createGameOverBox()
    screen.render()
      
    clearInterval(timer)
    
      return
  }
    clearScreen()
    drawFruite()
    move()
    drawSnake()
    screen.render()
}
function start() {
    timer = setInterval(tick, 50)
}
generateFruite()
start()

