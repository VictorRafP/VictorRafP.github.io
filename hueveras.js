let canvas_w = 800;
let canvas_h = 450;

let config = {
  width: canvas_w,
  height: canvas_h,
  scene: {
    preload: precarga,
    create: crea,
    update: actualiza,
  },
};

let game = new Phaser.Game(config);

let field_center = canvas_w / 2 + canvas_w / 8;

let canvas_bg, eggcups_bg;

let huevos_max = 100;

let huevera_b, huevera_m, huevera_d;
let huevera_x = 128;

let huevo_shadow;
let sprite_scale = 0.6;

let countdown = 20;
let countdown_text;
let countdown_interval;

let score = 0;
let score_text;
let game_over_text;
let game_is_over = false;

let huevos = [];
let huevos_speed = 1;
let huevos_interval;
let huevos_interval_time = 3000;
let huevo_current = 0;

let music = {
  background: null,
  game_over: null,
};

let fx = {
  mouseclick: null,
  bad: null,
  good: null,
};

function precarga() {
  this.load.image("grass_bg", "imgs/grass_bg.png");
  this.load.image("straw_bg", "imgs/straw_bg.png");
  this.load.image("huevera", "imgs/huevera.png");
  this.load.image("huevo", "imgs/huevo.png");

  this.load.audio("background_music", "audio/apple_cider.mp3");
  this.load.audio("game_over_music", "audio/GameOver.mp3");

  this.load.audio("mouseclick_fx", "audio/mouseclick.mp3");
  this.load.audio("bad", "audio/bad.mp3");
  this.load.audio("correct", "audio/correct.mp3");
}

function crea() {
  let blanco = Phaser.Display.Color.GetColor(255, 255, 255);
  let marron = Phaser.Display.Color.GetColor(192, 128, 16);
  let dorado = Phaser.Display.Color.GetColor(255, 215, 0);

  canvas_bg = this.add.image(canvas_w / 2, canvas_h / 2, "grass_bg");

  eggcups_bg = this.add.image(huevera_x, canvas_h / 2, "straw_bg");
  eggcups_bg.setScale(0.5);
  eggcups_bg.angle = 90;

  huevera_d = this.add.image(huevera_x, canvas_h / 2 - 128, "huevera");
  huevera_d.setScale(sprite_scale);
  huevera_d.setTint(dorado);
  huevera_d.huevera_type = "d";

  huevera_m = this.add.image(huevera_x, canvas_h / 2, "huevera");
  huevera_m.setScale(sprite_scale);
  huevera_m.setTint(marron);
  huevera_m.huevera_type = "m";

  huevera_b = this.add.image(huevera_x, canvas_h / 2 + 128, "huevera");
  huevera_b.setScale(sprite_scale);
  huevera_b.huevera_type = "b";

  huevo_shadow = this.add.image(-10000, -1000, "huevo");
  huevo_shadow.setTint("#000000");
  huevo_shadow.alpha = 0.5;
  huevo_shadow.setScale(1.3);

  let offset_x_min = field_center - 224;
  let offset_x_max = field_center + 224;

  for (let i = 0; i < huevos_max; i++) {
    let huevo_tmp_x = Phaser.Math.Between(offset_x_min, offset_x_max);
    let huevo_tmp_y = -64;

    let huevo_tmp = this.add.image(huevo_tmp_x, huevo_tmp_y, "huevo");

    huevo_tmp.falling = i === 0 ? true : false;

    let color = blanco;
    let huevo_type = "b";

    let random_num = Phaser.Math.Between(1, 100);

    if (random_num % 4 === 0) {
      color = marron;
      huevo_type = "m";
    } else if (random_num % 9 === 0) {
      color = dorado;
      huevo_type = "d";
    }

    huevo_tmp.setTint(color);
    huevo_tmp.huevo_type = huevo_type;

    huevo_tmp.setInteractive({ draggable: true });

    huevo_tmp.on("pointerdown", function () {
      if (game_is_over) return;
      this.falling = false;
      huevo_shadow.x = this.x + 8;
      huevo_shadow.y = this.y + 8;
      fx.mouseclick.play();
      this.setScale(1.3);
    });

    huevos.push(huevo_tmp);
  }

  this.input.on("drag", function (pointer, object, x, y) {
    if (game_is_over) return;
    object.x = x;
    object.y = y;
    huevo_shadow.x = x + 8;
    huevo_shadow.y = y + 8;
  });

  this.input.on("dragend", function (pointer, object, x, y) {
    if (game_is_over) return;

    object.setScale(1);
    huevo_shadow.x = -10000;
    huevo_shadow.y = -10000;

    let correcto = false;

    if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_b.getBounds(), object.getBounds())) {
      if (object.huevo_type == "b") {
        countdown += 5;
        score += 10;
        fx.good.play();
        correcto = true;
      } else {
        countdown -= 5;
        score -= 5;
        fx.bad.play();
      }
    } else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds())) {
      if (object.huevo_type == "m") {
        countdown += 5;
        score += 10;
        fx.good.play();
        correcto = true;
      } else {
        countdown -= 5;
        score -= 5;
        fx.bad.play();
      }
    } else if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_d.getBounds(), object.getBounds())) {
      if (object.huevo_type == "d") {
        countdown += 5;
        score += 20;
        fx.good.play();
        correcto = true;
      } else {
        countdown -= 5;
        score -= 5;
        fx.bad.play();
      }
    } else {
      countdown -= 5;
      score -= 10;
      fx.bad.play();
    }

    countdown_text.text = countdown;
    score_text.text = "Puntuación: " + score;
  });
  
  countdown_text = this.add.text(field_center, 16, countdown, {
    fontSize: 48,
    fontStyle: "bold",
  });

  score_text = this.add.text(field_center, 70, "Puntuación: 0", {
    fontSize: 32,
    fontStyle: "bold",
  });

  music.background = this.sound.add("background_music", {
    loop: true,
    volume: 0.5,
  });

  music.background.play();
  music.game_over = this.sound.add("game_over_music");

  fx.mouseclick = this.sound.add("mouseclick_fx");
  fx.good = this.sound.add("correct");
  fx.bad = this.sound.add("bad");
}

function actualiza() {
  if (game_is_over) return;

  if (countdown <= 10) {
    countdown_text.setColor("#FF0000");
    music.background.rate = 1.25;
  }
  else {
    music.background.rate = 1;
  }

  for (let i = 0; i < huevos.length; i++) {
    if (huevos[i].falling) {
      huevos[i].y += huevos_speed;

      if (huevos[i].y > canvas_h + 64) {
        huevos[i].falling = false;
      }
    }
  }
}

function gameOver() {
  if (game_is_over) return;
  game_is_over = true;
  music.background.stop();
  music.game_over.play();
  clearInterval(countdown_interval);
  clearTimeout(huevos_interval);

  let rect = game.scene.scenes[0].add.rectangle(canvas_w / 2, canvas_h / 2, 400, 200, 0x000000, 0.7);

  game_over_text = game.scene.scenes[0].add.text(canvas_w / 2, canvas_h / 2 - 20, "GAME OVER", {
    fontSize: 48,
    color: "#FF0000",
  }).setOrigin(0.5);

  let score_display = game.scene.scenes[0].add.text(canvas_w / 2, canvas_h / 2 + 30, "Puntuación: " + score, {
    fontSize: 32,
    color: "#FFFFFF",
  }).setOrigin(0.5);

  for (let i = 0; i < huevos.length; i++) {
    huevos[i].disableInteractive();
  }
}

countdown_interval = setInterval(function () {
  if (game_is_over) return;
  countdown--;
  countdown_text.text = countdown;
  if (countdown <= 0) {
    gameOver();
  }
}, 1000);

function next_huevo() {
  huevo_current++;
  if (huevo_current >= huevos.length) {
    gameOver();
    return;
  }

  huevos[huevo_current].falling = true;

  huevos_interval_time -= 100;
  if (huevos_interval_time < 400) huevos_interval_time = 400;

  huevos_interval = setTimeout(next_huevo, huevos_interval_time);
}

huevos_interval = setTimeout(next_huevo, huevos_interval_time);
