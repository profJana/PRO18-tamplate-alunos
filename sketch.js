//Variáveis
var trex, trexCorrendo, trexColidindo;
var chao, chaoImg, chaoInvisivel;
var canvas;
var gravidade = 1.3; //y positivo é para baixo
var forcaPulo = -17; //y é para cima
var nuvem, nuvemImg;
var ob1, ob2, ob3, ob4, ob5, ob6;

var grupoObstaculos;
var grupoNuvens;

var play = 1;
var end = 0;
var gameState = play;

var gameOver, gameOverImg;
var restart , restartImg;

//carregar animações
function preload() {
  trexCorrendo = loadAnimation("t1.png", "t3.png", "t4.png");
  trexColidindo = loadAnimation('trex_collided.png');

  chaoImg = loadImage('ground2.png');
  nuvemImg = loadImage('cloud.png');

  ob1 = loadImage('obstacle1.png');
  ob2 = loadImage('obstacle2.png');
  ob3 = loadImage('obstacle3.png');
  ob4 = loadImage('obstacle4.png');
  ob5 = loadImage('obstacle5.png');
  ob6 = loadImage('obstacle6.png');

  restartImg = loadImage('restart.png');
  gameOverImg = loadImage('gameOver.png');

}

function setup() {
  canvas = createCanvas(600, 200); //larg, alt
  canvas.center();

  //crie um sprite de trex
  trex = createSprite(50, 150, 20, 50);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("morreu", trexColidindo);
  trex.scale = 0.5;

  //crie um sprite ground (solo)
  chao = createSprite(300, 170, 600, 20); //x, y,larg, alt
  chao.addImage("chao", chaoImg);

  chaoInvisivel = createSprite(60, 230)
  chaoInvisivel.visible = false

  gameOver = createSprite(300,100) // x,y
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.5

  restart = createSprite(300,140) // x,y
  restart.addImage(restartImg)
  restart.scale = 0.5

  grupoObstaculos = createGroup()
  grupoNuvens = createGroup()
  
  score = 0;
  // console.log(score)

  trex.setCollider("circle",0,0);
  //trex.debug = true;
  
}

function draw() {// desenhar
  background(180); //fundo
  text("Score: " + score, 500, 50);
  //text.depth = 1000
  //console.log(text.depth)

  if (gameState === play) {
    chao.velocityX = -6;
    restart.visible = false;
    gameOver.visible = false;
    score = score + 1
    //score += 1

    if (chao.x < 0) { //verifica se saiu da tela esquerda
      chao.x = chao.width / 2;
    }

    var noChao = trex.collide(chaoInvisivel)

    if (keyDown("space") && noChao) { // E
      trex.velocityY = forcaPulo;
    }
    trex.velocityY += gravidade;

    gerarNuvens();
    gerarObstaculos();
    

    if(grupoObstaculos.isTouching(trex)){
        gameState = end
    }

  }
  else if(gameState === end){
    chao.velocityX = 0;
    trex.velocityY = 0;
    restart.visible = true
    gameOver.visible = true
    trex.changeAnimation('morreu')
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);

    grupoNuvens.setLifetimeEach(-1);
    grupoObstaculos.setLifetimeEach(-1);
  }
 
  //impedir que o trex caia (por conta da gravidade)
  trex.collide(chaoInvisivel);

  drawSprites(); //desenha os sprite

}

//criando a função
function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(650, 50, 40, 10);
    nuvem.addImage('nuvem', nuvemImg)
    nuvem.velocityX = -3;
    nuvem.y = Math.round(random(30, 100))

    nuvem.lifetime = 250
    //formula: tempo = distancia/velocidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //console.log(nuvem.depth, trex.depth)
    grupoNuvens.add(nuvem)
  
  }

}

function gerarObstaculos() {
  if (frameCount % 60 === 0) { //gere obstaculos de 1 em 1 segundo
    var obstaculo = createSprite(random(620, 700), 160, 10, 40);
    //console.log(obstaculo.x)
    obstaculo.velocityX = -6;
    var rand = Math.round(random(1, 6));
    //console.log(rand);

    switch (rand) {
      case 1: obstaculo.addImage(ob1);
        obstaculo.scale = 0.8
        break;
      case 2: obstaculo.addImage(ob2);
        break;
      case 3: obstaculo.addImage(ob3);
        break;
      case 4: obstaculo.addImage(ob4);
        break;
      case 5: obstaculo.addImage(ob5);
        break;
      case 6: obstaculo.addImage(ob6);
        break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    //quando o break é executado pula pra ca
    grupoObstaculos.add(obstaculo);
 
  }
}

