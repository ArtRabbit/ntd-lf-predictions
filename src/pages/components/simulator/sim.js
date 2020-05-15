/* eslint-disable */
function Sim() {
  this.simTime = 0
  this.entities = []
  this.queue = new Sim.PQueue()
  this.endTime = 0
  this.entityId = 1
}

var Random = function (a) {
  a = a === void 0 ? new Date().getTime() : a
  this.N = 624
  this.M = 397
  this.MATRIX_A = 2567483615
  this.UPPER_MASK = 2147483648
  this.LOWER_MASK = 2147483647
  this.mt = Array(this.N)
  this.mti = this.N + 1
  this.init_by_array([a], 1)
}
Random.prototype.init_genrand = function (a) {
  this.mt[0] = a >>> 0
  for (this.mti = 1; this.mti < this.N; this.mti++)
    (a = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)),
      (this.mt[this.mti] =
        ((((a & 4294901760) >>> 16) * 1812433253) << 16) +
        (a & 65535) * 1812433253 +
        this.mti),
      (this.mt[this.mti] >>>= 0)
}
Random.prototype.init_by_array = function (a, b) {
  var c, d, f
  this.init_genrand(19650218)
  c = 1
  d = 0
  for (f = this.N > b ? this.N : b; f; f--) {
    var e = this.mt[c - 1] ^ (this.mt[c - 1] >>> 30)
    this.mt[c] =
      (this.mt[c] ^
        (((((e & 4294901760) >>> 16) * 1664525) << 16) +
          (e & 65535) * 1664525)) +
      a[d] +
      d
    this.mt[c] >>>= 0
    c++
    d++
    c >= this.N && ((this.mt[0] = this.mt[this.N - 1]), (c = 1))
    d >= b && (d = 0)
  }
  for (f = this.N - 1; f; f--)
    (e = this.mt[c - 1] ^ (this.mt[c - 1] >>> 30)),
      (this.mt[c] =
        (this.mt[c] ^
          (((((e & 4294901760) >>> 16) * 1566083941) << 16) +
            (e & 65535) * 1566083941)) -
        c),
      (this.mt[c] >>>= 0),
      c++,
      c >= this.N && ((this.mt[0] = this.mt[this.N - 1]), (c = 1))
  this.mt[0] = 2147483648
}
Random.prototype.genrand_int32 = function () {
  var a,
    b = [0, this.MATRIX_A]
  if (this.mti >= this.N) {
    var c
    this.mti == this.N + 1 && this.init_genrand(5489)
    for (c = 0; c < this.N - this.M; c++)
      (a = (this.mt[c] & this.UPPER_MASK) | (this.mt[c + 1] & this.LOWER_MASK)),
        (this.mt[c] = this.mt[c + this.M] ^ (a >>> 1) ^ b[a & 1])
    for (; c < this.N - 1; c++)
      (a = (this.mt[c] & this.UPPER_MASK) | (this.mt[c + 1] & this.LOWER_MASK)),
        (this.mt[c] = this.mt[c + (this.M - this.N)] ^ (a >>> 1) ^ b[a & 1])
    a = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK)
    this.mt[this.N - 1] = this.mt[this.M - 1] ^ (a >>> 1) ^ b[a & 1]
    this.mti = 0
  }
  a = this.mt[this.mti++]
  a ^= a >>> 11
  a ^= (a << 7) & 2636928640
  a ^= (a << 15) & 4022730752
  a ^= a >>> 18
  return a >>> 0
}
Random.prototype.genrand_int31 = function () {
  return this.genrand_int32() >>> 1
}
Random.prototype.genrand_real1 = function () {
  return this.genrand_int32() * (1 / 4294967295)
}
Random.prototype.random = function () {
  if (this.pythonCompatibility)
    this.skip && this.genrand_int32(), (this.skip = !0)
  return this.genrand_int32() * (1 / 4294967296)
}
Random.prototype.genrand_real3 = function () {
  return (this.genrand_int32() + 0.5) * (1 / 4294967296)
}
Random.prototype.genrand_res53 = function () {
  var a = this.genrand_int32() >>> 5,
    b = this.genrand_int32() >>> 6
  return (a * 67108864 + b) * 1.1102230246251565e-16
}
Random.prototype.LOG4 = Math.log(4)
Random.prototype.SG_MAGICCONST = 1 + Math.log(4.5)
Random.prototype.exponential = function (a) {
  var b = this.random()
  return -Math.log(b) / a
}
Random.prototype.gamma = function (a, b) {
  if (a > 1)
    for (var c = Math.sqrt(2 * a - 1), d = a - this.LOG4, f = a + c; ; ) {
      var e = this.random()
      if (!(e < 1.0e-7 || j > 0.9999999)) {
        var h = 1 - this.random(),
          i = Math.log(e / (1 - e)) / c,
          g = a * Math.exp(i),
          e = e * e * h,
          i = d + f * i - g
        if (i + this.SG_MAGICCONST - 4.5 * e >= 0 || i >= Math.log(e))
          return g * b
      }
    }
  else if (a == 1) {
    for (var j = this.random(); j <= 1.0e-7; ) j = this.random()
    return -Math.log(j) * b
  } else {
    for (;;)
      if (
        ((j = this.random()),
        (g = (Math.E + a) / Math.E),
        (j *= g),
        (g = j <= 1 ? Math.pow(j, 1 / a) : -Math.log((g - j) / a)),
        (e = this.random()),
        j > 1)
      ) {
        if (e <= Math.pow(g, a - 1)) break
      } else if (e <= Math.exp(-g)) break
    return g * b
  }
}
Random.prototype.normal = function (a, b) {
  var c = this.lastNormal
  this.lastNormal = NaN
  if (!c) {
    var d = this.random() * 2 * Math.PI,
      f = Math.sqrt(-2 * Math.log(1 - this.random())),
      c = Math.cos(d) * f
    this.lastNormal = Math.sin(d) * f
  }
  return a + c * b
}
Random.prototype.pareto = function (a) {
  var b = this.random()
  return 1 / Math.pow(1 - b, 1 / a)
}
Random.prototype.triangular = function (a, b, c) {
  var d = (c - a) / (b - a),
    f = this.random()
  return f <= d
    ? a + Math.sqrt(f * (b - a) * (c - a))
    : b - Math.sqrt((1 - f) * (b - a) * (b - c))
}
Random.prototype.uniform = function (a, b) {
  return a + this.random() * (b - a)
}
Random.prototype.weibull = function (a, b) {
  var c = 1 - this.random()
  return a * Math.pow(-Math.log(c), 1 / b)
}
exports.Random = Random
