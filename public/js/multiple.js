class Multiple {
  constructor(x, y, img) {
    this.targetX1 = x;
    this.targetY1 = y;
    this.x = x
    this.y = y
    this.img = img;
    this.easing = 0.01;
    this.angle1 = 0.0;
    this.segLength = 50;
  }

  update(x, y) {
    this.targetX1 = x;
    this.targetY1 = y;
    this.insect()
  }

  insect() {
    stroke(255,0,0 );
    fill(0,0,0);
    imageMode(CENTER);
    background(0);
    let targetX = this.targetX1;
    let targetY = this.targetY1;
    // var targetX = mouseX;
    // var targetY = mouseY;
    var dx = targetX - x;
    var dy = targetY - y;
    this.angle1 = atan2(dy, dx);
    this.x += dx * easing;
    this.y += dy * easing;
    this.x = targetX - (cos(this.angle1) * this.segLength);
    this.y = targetY - (sin(this.angle1) * this.segLength);
    segment(this.x, this.y, this.angle1 + radians(90), this.img);
    segment(this.x, this.y, this.angle1, this.img);

    function segment(varx, vary, vara, img) {
      push();
      translate(varx, vary);
      rotate(vara + radians(90));
      image(img, 0, 0,100,100);
      pop();
    }
  }
}
