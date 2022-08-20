$(function () {
  var anim_id;

  var container = $("#container");
  var ship = $("#ship");
  var restart_div = $("#restart_div");
  var restart_btn = $("#restart");
  var score = $("#score");
  var high_score = localStorage.getItem("high_score");
  if(high_score == null)
    high_score = 0;
  $("#high_score").text(high_score);

  var container_left = parseInt(container.css("left"));
  var container_width = parseInt(container.width());
  var container_height = parseInt(container.height());
  var ship_width = parseInt(ship.width());
  var ship_height = parseInt(ship.height());

  var game_over = false;

  var score_counter = 1;

  var speed = 4;
  var star_speed = 5;

  var move_right = false;
  var move_left = false;
  var move_up = false;
  var move_down = false;

  var stars = [];
  for (let i = 0; i < 100; i++) {
    var star = document.createElement("div");
    stars.push(star);
  }
  stars.forEach((star) => {
    star.classList.add("star");
    var randw = Math.random() * container_width;
    var randh = Math.random() * container_height;
    star.style.left = `${randw}px`;
    star.style.top = `${randh}px`;
    document.querySelector("#container").appendChild(star);
  });
  var astroids = [];
  for (let i = 0; i < 15; i++) {
    var astroid = $(`#astroid_${i + 1}`);
    astroids.push(astroid);
  }
  console.log(astroids);
  astroids.forEach((astroid) => {
    var randw = Math.random() * container_width;
    var randh = Math.random() * container_height;
    while (randh > container_height / 1.5) {
      randh = Math.random() * container_height;
    }
    astroid.css("left", parseInt(randw));
    astroid.css("top", parseInt(randh));
  });

  /* Move the ship */
  $(document).on("keydown", function (e) {
    if (game_over === false) {
      var key = e.keyCode;
      if (key === 37 && move_left === false) {
        move_left = requestAnimationFrame(left);
      } else if (key === 39 && move_right === false) {
        move_right = requestAnimationFrame(right);
      } else if (key === 38 && move_up === false) {
        move_up = requestAnimationFrame(up);
      } else if (key === 40 && move_down === false) {
        move_down = requestAnimationFrame(down);
      }
    }
  });

  $(document).on("keyup", function (e) {
    if (game_over === false) {
      var key = e.keyCode;
      if (key === 37) {
        cancelAnimationFrame(move_left);
        move_left = false;
      } else if (key === 39) {
        cancelAnimationFrame(move_right);
        move_right = false;
      } else if (key === 38) {
        cancelAnimationFrame(move_up);
        move_up = false;
      } else if (key === 40) {
        cancelAnimationFrame(move_down);
        move_down = false;
      }
    }
  });

  function left() {
    if (game_over === false && parseInt(ship.css("left")) > 0) {
      ship.css("left", parseInt(ship.css("left")) - 5);
      move_left = requestAnimationFrame(left);
    }
  }

  function right() {
    if (
      game_over === false &&
      parseInt(ship.css("left")) < container_width - ship_width
    ) {
      ship.css("left", parseInt(ship.css("left")) + 5);
      move_right = requestAnimationFrame(right);
    }
  }

  function up() {
    if (game_over === false && parseInt(ship.css("top")) > 0) {
      ship.css("top", parseInt(ship.css("top")) - 3);
      move_up = requestAnimationFrame(up);
    }
  }

  function down() {
    if (
      game_over === false &&
      parseInt(ship.css("top")) < container_height - ship_height
    ) {
      ship.css("top", parseInt(ship.css("top")) + 3);
      move_down = requestAnimationFrame(down);
    }
  }

  /* Move the astroids and stars */
  anim_id = requestAnimationFrame(repeat);

  function repeat() {
    if(game_over === false){
    astroids.forEach((astroid) => {
      if (collision(ship, astroid)) {
        stop_the_game();
        return;
      }
    });

    score_counter++;

    if (score_counter % 20 == 0) {
      score.text(parseInt(score.text()) + 1);
    }
    if (score_counter % 500 == 0) {
      speed++;
      star_speed++;
    }
    astroids.forEach((astroid) => {
      astroid_down(astroid);
    });

    stars.forEach((star) => {
      star_down(star);
    });

    anim_id = requestAnimationFrame(repeat);
    }
  }

  function astroid_down(astroid) {
    var astroid_current_top = parseInt(astroid.css("top"));

    if (astroid_current_top > container_height) {
      astroid_current_top = -200;
      var astroid_left = parseInt(Math.random() * container_width);
      astroid.css("left", astroid_left);
    }
    astroid.css("top", astroid_current_top + speed);
  }

  function star_down(star) {
    var star_current_top = parseInt(star.style.top);
    if (star_current_top > container_height) {
      star_current_top = 0;
    }
    star.style.top = `${star_current_top + star_speed}px`;
  }

  restart_btn.click(function () {
    location.reload();
  });

  function stop_the_game() {
    game_over = true;
    cancelAnimationFrame(anim_id);
    cancelAnimationFrame(move_right);
    cancelAnimationFrame(move_left);
    cancelAnimationFrame(move_up);
    cancelAnimationFrame(move_down);
    restart_div.slideDown();
    restart_btn.focus();
    setHighScore();
  }

  function setHighScore() {
    if (high_score < parseInt(score.text())) {
      high_score = parseInt(score.text());
      localStorage.setItem("high_score", parseInt(score.text()));
    }
    $("#high_score").text(high_score);
  }

  function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }
});
