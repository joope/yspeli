/*

Simple 2D JavaScript Vec2 Class

Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js

https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
*/

function Vec2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

/* INSTANCE METHODS */

Vec2.prototype = {
  negative: function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  add: function(v) {
    if (v instanceof Vec2) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }
    return this;
  },
  subtract: function(v) {
    if (v instanceof Vec2) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }
    return this;
  },
  multiply: function(v) {
    if (v instanceof Vec2) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  },
  divide: function(v) {
    if (v instanceof Vec2) {
      if(v.x != 0) this.x /= v.x;
      if(v.y != 0) this.y /= v.y;
    } else {
      if(v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }
    return this;
  },
  equals: function(v) {
    return this.x == v.x && this.y == v.y;
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },
  cross: function(v) {
    return this.x * v.y - this.y * v.x
  },
  magnitude: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  },
  normalize: function() {
    return this.divide(this.magnitude());
  },
  min: function() {
    return Math.min(this.x, this.y);
  },
  max: function() {
    return Math.max(this.x, this.y);
  },
  toRadians: function() {
    return Math.atan2(this.y, this.x);
  },
  radiansTo: function(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function(n) {
    return [this.x, this.y].slice(0, n || 2);
  },
  clone: function() {
    return new Vec2(this.x, this.y);
  },
  copyTo: function(v) {
    v.x = this.x;
    v.y = this.y;
  },
  set: function(x, y) {
    this.x = x; this.y = y;
    return this;
  }
};

/* STATIC METHODS */
Vec2.negative = function(v) {
  return new Vec2(-v.x, -v.y);
};
Vec2.add = function(a, b) {
  if (b instanceof Vec2) return new Vec2(a.x + b.x, a.y + b.y);
  else return new Vec2(a.x + b, a.y + b);
};
Vec2.add_inplace = function(a, b, out) {
  if (b instanceof Vec2) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
  } else {
    throw new Error("Need vec2");
  }
};
Vec2.subtract = function(a, b) {
  if (b instanceof Vec2) return new Vec2(a.x - b.x, a.y - b.y);
  else return new Vec2(a.x - b, a.y - b);
};

Vec2.subtract_inplace = function(a, b, out) {
  if (b instanceof Vec2) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
  } else {
    throw new Error("Need vec2");
  }
};

Vec2.multiply = function(a, b) {
  if (b instanceof Vec2) return new Vec2(a.x * b.x, a.y * b.y);
  else return new Vec2(a.x * b, a.y * b);
};

Vec2.multiply_inplace = function(a, b, out) {
  if (b instanceof Vec2) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
  } else {
    out.x = a.x * b;
    out.y = a.y * b;
  }
};
Vec2.divide = function(a, b) {
  if (b instanceof Vec2) return new Vec2(a.x / b.x, a.y / b.y);
  else return new Vec2(a.x / b, a.y / b);
};
Vec2.equals = function(a, b) {
  return a.x == b.x && a.y == b.y;
};
Vec2.dot = function(a, b) {
  return a.x * b.x + a.y * b.y;
};
Vec2.cross = function(a, b) {
  return a.x * b.y - a.y * b.x;
};
Vec2.mix = function(a, b, blend) {
  return new Vec2(
    blend*a.x + (1.0 - blend)*b.x,
    blend*a.y + (1.0 - blend)*b.y);
}
