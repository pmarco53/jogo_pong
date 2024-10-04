let bola, raqueteEsquerda, raqueteDireita
let impactoSom, winSom
let imgBola, imgRaqueteEsquerda, imgRaqueteDireita, imgFundo
let pontosEsquerda = 0
let pontosDireita = 0

function preload() {
  impactoSom = loadSound('../audio/impacto.wav')
  winSom = loadSound('../audio/win.wav')
  imgBola = loadImage('../sprites/bola.png')
  imgRaqueteEsquerda = loadImage('../sprites/barra01.png')
  imgRaqueteDireita = loadImage('../sprites/barra02.png')
  imgFundo = loadImage('../sprites/fundo1.png')
}

class Bola {
  constructor() {
    this.r = 12
    this.reset()
    this.angle = 0 // Adiciona a propriedade de ângulo
  }

  reset() {
    this.x = width / 2
    this.y = height / 2
    this.vx = Math.random() * 10 - 2.5
    this.vy = Math.random() * 10 - 2.5
    // Não reseta o ângulo para manter a rotação
    this.angle = 0
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    //rotacionar a bola de acordo com a velocidade
    this.angle += this.vx + this.vy
    // Verifica colisão com as bordas laterais
    if (this.x < this.r) {
      pontosDireita++
      winSom.play()
      falaPontos()
      this.reset()
    } else if (this.x > width - this.r) {
      pontosEsquerda++
      winSom.play()
      falaPontos()
      this.reset()
    }

    // Verifica colisão com as bordas superior e inferior
    if (this.y < this.r || this.y > height - this.r) {
      this.vy *= -1
    }

    // Verifica colisão com a raquete esquerda
    if (
      this.x - this.r < raqueteEsquerda.x + raqueteEsquerda.w &&
      this.y > raqueteEsquerda.y &&
      this.y < raqueteEsquerda.y + raqueteEsquerda.h
    ) {
      this.vx *= -1
      this.vx *= 1.1
      this.vy *= 1.1
      this.angle += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 30 // Atualiza o ângulo
      impactoSom.play()
    }

    // Verifica colisão com a raquete direita
    if (
      this.x + this.r > raqueteDireita.x &&
      this.y > raqueteDireita.y &&
      this.y < raqueteDireita.y + raqueteDireita.h
    ) {
      this.vx *= -1
      this.vx *= 1.1
      this.vy *= 1.1
      this.angle += this.vx + this.vy // Atualiza o ângulo
      impactoSom.play()
    }
  }

  desenha() {
    push()
    translate(this.x, this.y)
    rotate(this.angle)
    imageMode(CENTER)
    image(imgBola, 0, 0, this.r * 2, this.r * 2)
    pop()
  }
}

class Raquete {
  constructor(x, img) {
    this.x = x
    this.y = height / 2
    this.w = 10
    this.h = 60
    this.vy = 5 // Velocidade da raquete direita
    this.img = img
  }

  update() {
    if (this.x < width / 2) {
      // Raquete esquerda segue o mouse
      this.y = mouseY
    } else {
      // Raquete direita segue a bola
      if (bola.y < this.y + this.h / 2) {
        this.y -= 3
      } else if (bola.y > this.y + this.h / 2) {
        this.y += 3
      }
    }
    this.y = constrain(this.y, 0, height - this.h)
  }

  desenha() {
    image(this.img, this.x, this.y, this.w, this.h)
  }
}

function setup() {
  createCanvas(800, 400)
  bola = new Bola()
  raqueteEsquerda = new Raquete(30, imgRaqueteEsquerda)
  raqueteDireita = new Raquete(width - 50, imgRaqueteDireita)
}

function draw() {
  background(imgFundo)
  bola.update()
  bola.desenha()
  raqueteEsquerda.update()
  raqueteEsquerda.desenha()
  raqueteDireita.update()
  raqueteDireita.desenha()
  desenhaPlacar()
}

function desenhaPlacar() {
  textSize(32)
  fill(30)
  textAlign(CENTER, TOP)
  text(pontosEsquerda, width / 4, 20)
  text(pontosDireita, (3 * width) / 4, 20)
}

function falaPontos() {
  let mensagem = `Placar: Jogador ${pontosEsquerda}, Computador ${pontosDireita}`
  let fala = new SpeechSynthesisUtterance(mensagem)
  fala.lang = 'pt-BR' // Define o idioma para português do Brasil
  //window.speechSynthesis.speak(fala)
}
