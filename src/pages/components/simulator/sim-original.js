/* eslint-disable */
function Sim() {
  this.simTime = 0
  this.entities = []
  this.queue = new Sim.PQueue()
  this.endTime = 0
  this.entityId = 1
}
Sim.prototype.time = function () {
  return this.simTime
}
Sim.prototype.sendMessage = function () {
  var a = this.source,
    b = this.msg,
    c = this.data,
    d = a.sim
  if (c)
    if (c instanceof Array)
      for (f = c.length - 1; f >= 0; f--)
        (e = c[f]), e !== a && e.onMessage && e.onMessage.call(e, a, b)
    else c.onMessage && c.onMessage.call(c, a, b)
  else
    for (var f = d.entities.length - 1; f >= 0; f--) {
      var e = d.entities[f]
      e !== a && e.onMessage && e.onMessage.call(e, a, b)
    }
}
Sim.prototype.addEntity = function (a) {
  if (!a.start)
    throw Error('Entity prototype must have start() function defined')
  if (!a.time)
    (a.time = function () {
      return this.sim.time()
    }),
      (a.setTimer = function (a) {
        a = new Sim.Request(this, this.sim.time(), this.sim.time() + a)
        this.sim.queue.insert(a)
        return a
      }),
      (a.waitEvent = function (a) {
        var b = new Sim.Request(this, this.sim.time(), 0)
        b.source = a
        a.addWaitList(b)
        return b
      }),
      (a.queueEvent = function (a) {
        var b = new Sim.Request(this, this.sim.time(), 0)
        b.source = a
        a.addQueue(b)
        return b
      }),
      (a.useFacility = function (a, b) {
        var c = new Sim.Request(this, this.sim.time(), 0)
        c.source = a
        a.use(b, c)
        return c
      }),
      (a.putBuffer = function (a, b) {
        var c = new Sim.Request(this, this.sim.time(), 0)
        c.source = a
        a.put(b, c)
        return c
      }),
      (a.getBuffer = function (a, b) {
        var c = new Sim.Request(this, this.sim.time(), 0)
        c.source = a
        a.get(b, c)
        return c
      }),
      (a.putStore = function (a, b) {
        var c = new Sim.Request(this, this.sim.time(), 0)
        c.source = a
        a.put(b, c)
        return c
      }),
      (a.getStore = function (a, b) {
        var c = new Sim.Request(this, this.sim.time(), 0)
        c.source = a
        a.get(b, c)
        return c
      }),
      (a.send = function (a, b, c) {
        b = new Sim.Request(this.sim, this.time(), this.time() + b)
        b.source = this
        b.msg = a
        b.data = c
        b.deliver = this.sim.sendMessage
        this.sim.queue.insert(b)
      }),
      (a.log = function (a) {
        this.sim.log(a, this)
      })
  var b = (function (a) {
    function b() {}
    if (a == null) throw TypeError()
    if (Object.create) return Object.create(a)
    var c = typeof a
    if (c !== 'object' && c !== 'function') throw TypeError()
    b.prototype = a
    return new b()
  })(a)
  b.sim = this
  b.id = this.entityId++
  this.entities.push(b)
  if (arguments.length > 1) {
    for (var c = [], d = 1; d < arguments.length; d++) c.push(arguments[d])
    b.start.apply(b, c)
  } else b.start()
  return b
}
Sim.prototype.simulate = function (a, b) {
  if (!b) b = Math.Infinity
  for (var c = 0; ; ) {
    c++
    if (c > b) return !1
    var d = this.queue.remove()
    if (d == void 0) break
    if (d.deliverAt > a) break
    this.simTime = d.deliverAt
    d.cancelled || d.deliver()
  }
  this.finalize()
  return !0
}
Sim.prototype.step = function () {
  for (;;) {
    var a = this.queue.remove()
    if (!a) return !1
    this.simTime = a.deliverAt
    if (!a.cancelled) {
      a.deliver()
      break
    }
  }
  return !0
}
Sim.prototype.finalize = function () {
  for (var a = 0; a < this.entities.length; a++)
    this.entities[a].finalize && this.entities[a].finalize()
}
Sim.prototype.setLogger = function (a) {
  this.logger = a
}
Sim.prototype.log = function (a, b) {
  if (this.logger) {
    var c = ''
    b !== void 0 && (c = b.name ? ' [' + b.name + ']' : ' [' + b.id + '] ')
    this.logger(this.simTime.toFixed(6) + c + '   ' + a)
  }
}
Sim.Facility = function (a, b, c, d) {
  this.free = c ? c : 1
  this.servers = c ? c : 1
  this.maxqlen = d === void 0 ? -1 : 1 * d
  switch (b) {
    case Sim.Facility.LCFS:
      this.use = this.useLCFS
      this.queue = new Sim.Queue()
      break
    case Sim.Facility.PS:
      this.use = this.useProcessorSharing
      this.queue = []
      break
    default:
      this.use = this.useFCFS
      this.freeServers = Array(this.servers)
      this.queue = new Sim.Queue()
      for (a = 0; a < this.freeServers.length; a++) this.freeServers[a] = !0
  }
  this.stats = new Sim.Population()
  this.busyDuration = 0
}
Sim.Facility.FCFS = 1
Sim.Facility.LCFS = 2
Sim.Facility.PS = 3
Sim.Facility.NumDisciplines = 4
Sim.Facility.prototype.reset = function () {
  this.queue.reset()
  this.stats.reset()
  this.busyDuration = 0
}
Sim.Facility.prototype.systemStats = function () {
  return this.stats
}
Sim.Facility.prototype.queueStats = function () {
  return this.queue.stats
}
Sim.Facility.prototype.usage = function () {
  return this.busyDuration
}
Sim.Facility.prototype.finalize = function (a) {
  this.stats.finalize(a)
  this.queue.stats.finalize(a)
}
Sim.Facility.prototype.useFCFS = function (a, b) {
  if (
    (this.maxqlen === 0 && !this.free) ||
    (this.maxqlen > 0 && this.queue.size() >= this.maxqlen)
  )
    (b.msg = -1), (b.deliverAt = b.entity.time()), b.entity.sim.queue.insert(b)
  else {
    b.duration = a
    var c = b.entity.time()
    this.stats.enter(c)
    this.queue.push(b, c)
    this.useFCFSSchedule(c)
  }
}
Sim.Facility.prototype.useFCFSSchedule = function (a) {
  for (; this.free > 0 && !this.queue.empty(); ) {
    var b = this.queue.shift(a)
    if (!b.cancelled) {
      for (var c = 0; c < this.freeServers.length; c++)
        if (this.freeServers[c]) {
          this.freeServers[c] = !1
          b.msg = c
          break
        }
      this.free--
      this.busyDuration += b.duration
      b.cancelRenegeClauses()
      c = new Sim.Request(this, a, a + b.duration)
      c.done(this.useFCFSCallback, this, b)
      b.entity.sim.queue.insert(c)
    }
  }
}
Sim.Facility.prototype.useFCFSCallback = function (a) {
  this.free++
  this.freeServers[a.msg] = !0
  this.stats.leave(a.scheduledAt, a.entity.time())
  this.useFCFSSchedule(a.entity.time())
  a.deliver()
}
Sim.Facility.prototype.useLCFS = function (a, b) {
  if (this.currentRO)
    (this.busyDuration +=
      this.currentRO.entity.time() - this.currentRO.lastIssued),
      (this.currentRO.remaining =
        this.currentRO.deliverAt - this.currentRO.entity.time()),
      this.queue.push(this.currentRO, b.entity.time())
  this.currentRO = b
  if (!b.saved_deliver)
    b.cancelRenegeClauses(),
      (b.remaining = a),
      (b.saved_deliver = b.deliver),
      (b.deliver = this.useLCFSCallback),
      this.stats.enter(b.entity.time())
  b.lastIssued = b.entity.time()
  b.deliverAt = b.entity.time() + a
  b.entity.sim.queue.insert(b)
}
Sim.Facility.prototype.useLCFSCallback = function () {
  var a = this.source
  if (
    this == a.currentRO &&
    ((a.currentRO = null),
    (a.busyDuration += this.entity.time() - this.lastIssued),
    a.stats.leave(this.scheduledAt, this.entity.time()),
    (this.deliver = this.saved_deliver),
    delete this.saved_deliver,
    this.deliver(),
    !a.queue.empty())
  ) {
    var b = a.queue.pop(this.entity.time())
    a.useLCFS(b.remaining, b)
  }
}
Sim.Facility.prototype.useProcessorSharing = function (a, b) {
  b.duration = a
  b.cancelRenegeClauses()
  this.stats.enter(b.entity.time())
  this.useProcessorSharingSchedule(b, !0)
}
Sim.Facility.prototype.useProcessorSharingSchedule = function (a, b) {
  var c = a.entity.time(),
    d = this.queue.length,
    f = b ? (d + 1) / d : (d - 1) / d,
    e = []
  if (this.queue.length === 0) this.lastIssued = c
  for (var h = 0; h < d; h++) {
    var i = this.queue[h]
    if (i.ro !== a) {
      var g = new Sim.Request(this, c, c + (i.deliverAt - c) * f)
      g.ro = i.ro
      g.source = this
      g.deliver = this.useProcessorSharingCallback
      e.push(g)
      i.cancel()
      a.entity.sim.queue.insert(g)
    }
  }
  if (b)
    (g = new Sim.Request(this, c, c + a.duration * (d + 1))),
      (g.ro = a),
      (g.source = this),
      (g.deliver = this.useProcessorSharingCallback),
      e.push(g),
      a.entity.sim.queue.insert(g)
  this.queue = e
  this.queue.length == 0 && (this.busyDuration += c - this.lastIssued)
}
Sim.Facility.prototype.useProcessorSharingCallback = function () {
  var a = this.source
  this.cancelled ||
    (a.stats.leave(this.ro.scheduledAt, this.ro.entity.time()),
    a.useProcessorSharingSchedule(this.ro, !1),
    this.ro.deliver())
}
Sim.Buffer = function (a, b, c) {
  this.name = a
  this.capacity = b
  this.available = c === void 0 ? 0 : c
  this.putQueue = new Sim.Queue()
  this.getQueue = new Sim.Queue()
}
Sim.Buffer.prototype.current = function () {
  return this.available
}
Sim.Buffer.prototype.size = function () {
  return this.capacity
}
Sim.Buffer.prototype.get = function (a, b) {
  this.getQueue.empty() && a <= this.available
    ? ((this.available -= a),
      (b.deliverAt = b.entity.time()),
      b.entity.sim.queue.insert(b),
      this.getQueue.passby(b.deliverAt),
      this.progressPutQueue())
    : ((b.amount = a), this.getQueue.push(b, b.entity.time()))
}
Sim.Buffer.prototype.put = function (a, b) {
  this.putQueue.empty() && a + this.available <= this.capacity
    ? ((this.available += a),
      (b.deliverAt = b.entity.time()),
      b.entity.sim.queue.insert(b),
      this.putQueue.passby(b.deliverAt),
      this.progressGetQueue())
    : ((b.amount = a), this.putQueue.push(b, b.entity.time()))
}
Sim.Buffer.prototype.progressGetQueue = function () {
  for (var a; (a = this.getQueue.top()); )
    if (a.cancelled) this.getQueue.shift(a.entity.time())
    else if (a.amount <= this.available)
      this.getQueue.shift(a.entity.time()),
        (this.available -= a.amount),
        (a.deliverAt = a.entity.time()),
        a.entity.sim.queue.insert(a)
    else break
}
Sim.Buffer.prototype.progressPutQueue = function () {
  for (var a; (a = this.putQueue.top()); )
    if (a.cancelled) this.putQueue.shift(a.entity.time())
    else if (a.amount + this.available <= this.capacity)
      this.putQueue.shift(a.entity.time()),
        (this.available += a.amount),
        (a.deliverAt = a.entity.time()),
        a.entity.sim.queue.insert(a)
    else break
}
Sim.Buffer.prototype.putStats = function () {
  return this.putQueue.stats
}
Sim.Buffer.prototype.getStats = function () {
  return this.getQueue.stats
}
Sim.Store = function (a, b) {
  this.name = a
  this.capacity = b
  this.objects = []
  this.putQueue = new Sim.Queue()
  this.getQueue = new Sim.Queue()
}
Sim.Store.prototype.current = function () {
  return this.objects.length
}
Sim.Store.prototype.size = function () {
  return this.capacity
}
Sim.Store.prototype.get = function (a, b) {
  if (this.getQueue.empty() && this.current() > 0) {
    var c = !1,
      d
    if (a)
      for (var f = 0; f < this.objects.length; f++) {
        if (((d = this.objects[f]), a(d))) {
          c = !0
          this.objects.splice(f, 1)
          break
        }
      }
    else (d = this.objects.shift()), (c = !0)
    if (c) {
      this.available--
      b.msg = d
      b.deliverAt = b.entity.time()
      b.entity.sim.queue.insert(b)
      this.getQueue.passby(b.deliverAt)
      this.progressPutQueue()
      return
    }
  }
  b.filter = a
  this.getQueue.push(b, b.entity.time())
}
Sim.Store.prototype.put = function (a, b) {
  this.putQueue.empty() && this.current() < this.capacity
    ? (this.available++,
      (b.deliverAt = b.entity.time()),
      b.entity.sim.queue.insert(b),
      this.putQueue.passby(b.deliverAt),
      this.objects.push(a),
      this.progressGetQueue())
    : ((b.obj = a), this.putQueue.push(b, b.entity.time()))
}
Sim.Store.prototype.progressGetQueue = function () {
  for (var a; (a = this.getQueue.top()); )
    if (a.cancelled) this.getQueue.shift(a.entity.time())
    else if (this.current() > 0) {
      var b = a.filter,
        c = !1,
        d
      if (b)
        for (var f = 0; f < this.objects.length; f++) {
          if (((d = this.objects[f]), b(d))) {
            c = !0
            this.objects.splice(f, 1)
            break
          }
        }
      else (d = this.objects.shift()), (c = !0)
      if (c)
        this.getQueue.shift(a.entity.time()),
          this.available--,
          (a.msg = d),
          (a.deliverAt = a.entity.time()),
          a.entity.sim.queue.insert(a)
      else break
    } else break
}
Sim.Store.prototype.progressPutQueue = function () {
  for (var a; (a = this.putQueue.top()); )
    if (a.cancelled) this.putQueue.shift(a.entity.time())
    else if (this.current() < this.capacity)
      this.putQueue.shift(a.entity.time()),
        this.available++,
        this.objects.push(a.obj),
        (a.deliverAt = a.entity.time()),
        a.entity.sim.queue.insert(a)
    else break
}
Sim.Store.prototype.putStats = function () {
  return this.putQueue.stats
}
Sim.Store.prototype.getStats = function () {
  return this.getQueue.stats
}
Sim.Event = function (a) {
  this.name = a
  this.waitList = []
  this.queue = []
  this.isFired = !1
}
Sim.Event.prototype.addWaitList = function (a) {
  this.isFired
    ? ((a.deliverAt = a.entity.time()), a.entity.sim.queue.insert(a))
    : this.waitList.push(a)
}
Sim.Event.prototype.addQueue = function (a) {
  this.isFired
    ? ((a.deliverAt = a.entity.time()), a.entity.sim.queue.insert(a))
    : this.queue.push(a)
}
Sim.Event.prototype.fire = function (a) {
  if (a) this.isFired = !0
  a = this.waitList
  this.waitList = []
  for (var b = 0; b < a.length; b++) a[b].deliver()
  ;(a = this.queue.shift()) && a.deliver()
}
Sim.Event.prototype.clear = function () {
  this.isFired = !1
}
Sim.Request = function (a, b, c) {
  this.entity = a
  this.scheduledAt = b
  this.deliverAt = c
  this.callbacks = []
  this.cancelled = !1
  this.group = null
}
Sim.Request.prototype.cancel = function () {
  if (this.group && this.group[0] != this) return this.group[0].cancel()
  if (this.noRenege) return this
  if (!this.cancelled) {
    this.cancelled = !0
    if (this.deliverAt == 0) this.deliverAt = this.entity.time()
    if (
      this.source &&
      (this.source instanceof Sim.Buffer || this.source instanceof Sim.Store)
    )
      this.source.progressPutQueue.call(this.source),
        this.source.progressGetQueue.call(this.source)
    if (this.group)
      for (var a = 1; a < this.group.length; a++)
        if (((this.group[a].cancelled = !0), this.group[a].deliverAt == 0))
          this.group[a].deliverAt = this.entity.time()
  }
}
Sim.Request.prototype.done = function (a, b, c) {
  this.callbacks.push([a, b, c])
  return this
}
Sim.Request.prototype.waitUntil = function (a, b, c, d) {
  if (this.noRenege) return this
  this.entity.sim.queue.insert(this._addRequest(this.scheduledAt + a, b, c, d))
  return this
}
Sim.Request.prototype.unlessEvent = function (a, b, c, d) {
  if (this.noRenege) return this
  if (a instanceof Sim.Event) {
    var f = this._addRequest(0, b, c, d)
    f.msg = a
    a.addWaitList(f)
  } else if (a instanceof Array)
    for (var e = 0; e < a.length; e++)
      (f = this._addRequest(0, b, c, d)), (f.msg = a[e]), a[e].addWaitList(f)
  return this
}
Sim.Request.prototype.setData = function (a) {
  this.data = a
  return this
}
Sim.Request.prototype.deliver = function () {
  this.cancelled ||
    (this.cancel(),
    this.callbacks &&
      (this.group && this.group.length > 0
        ? this._doCallback(this.group[0].source, this.msg, this.group[0].data)
        : this._doCallback(this.source, this.msg, this.data)))
}
Sim.Request.prototype.cancelRenegeClauses = function () {
  this.noRenege = !0
  if (this.group && this.group[0] == this)
    for (var a = 1; a < this.group.length; a++)
      if (((this.group[a].cancelled = !0), this.group[a].deliverAt == 0))
        this.group[a].deliverAt = this.entity.time()
}
Sim.Request.prototype.Null = function () {
  return this
}
Sim.Request.prototype._addRequest = function (a, b, c, d) {
  a = new Sim.Request(this.entity, this.scheduledAt, a)
  a.callbacks.push([b, c, d])
  if (this.group === null) this.group = [this]
  this.group.push(a)
  a.group = this.group
  return a
}
Sim.Request.prototype._doCallback = function (a, b, c) {
  for (var d = 0; d < this.callbacks.length; d++) {
    var f = this.callbacks[d][0]
    if (f) {
      var e = this.callbacks[d][1]
      if (!e) e = this.entity
      var h = this.callbacks[d][2]
      e.callbackSource = a
      e.callbackMessage = b
      e.callbackData = c
      h ? (h instanceof Array ? f.apply(e, h) : f.call(e, h)) : f.call(e)
      e.callbackSource = null
      e.callbackMessage = null
      e.callbackData = null
    }
  }
}
Sim.Queue = function (a) {
  this.name = a
  this.data = []
  this.timestamp = []
  this.stats = new Sim.Population()
}
Sim.Queue.prototype.top = function () {
  return this.data[0]
}
Sim.Queue.prototype.back = function () {
  return this.data.length ? this.data[this.data.length - 1] : void 0
}
Sim.Queue.prototype.push = function (a, b) {
  this.data.push(a)
  this.timestamp.push(b)
  this.stats.enter(b)
}
Sim.Queue.prototype.unshift = function (a, b) {
  this.data.unshift(a)
  this.timestamp.unshift(b)
  this.stats.enter(b)
}
Sim.Queue.prototype.shift = function (a) {
  var b = this.data.shift()
  this.stats.leave(this.timestamp.shift(), a)
  return b
}
Sim.Queue.prototype.pop = function (a) {
  var b = this.data.pop()
  this.stats.leave(this.timestamp.pop(), a)
  return b
}
Sim.Queue.prototype.passby = function (a) {
  this.stats.enter(a)
  this.stats.leave(a, a)
}
Sim.Queue.prototype.finalize = function (a) {
  this.stats.finalize(a)
}
Sim.Queue.prototype.reset = function () {
  this.stats.reset()
}
Sim.Queue.prototype.clear = function () {
  this.reset()
  this.data = []
  this.timestamp = []
}
Sim.Queue.prototype.report = function () {
  return [this.stats.sizeSeries.average(), this.stats.durationSeries.average()]
}
Sim.Queue.prototype.empty = function () {
  return this.data.length == 0
}
Sim.Queue.prototype.size = function () {
  return this.data.length
}
Sim.PQueue = function () {
  this.data = []
  this.order = 0
}
Sim.PQueue.prototype.greater = function (a, b) {
  return a.deliverAt > b.deliverAt
    ? !0
    : a.deliverAt == b.deliverAt
    ? a.order > b.order
    : !1
}
Sim.PQueue.prototype.insert = function (a) {
  a.order = this.order++
  var b = this.data.length
  this.data.push(a)
  for (var c = this.data, d = c[b]; b > 0; ) {
    var f = Math.floor((b - 1) / 2)
    if (this.greater(c[f], a)) (c[b] = c[f]), (b = f)
    else break
  }
  c[b] = d
}
Sim.PQueue.prototype.remove = function () {
  var a = this.data,
    b = a.length
  if (!(b <= 0)) {
    if (b == 1) return this.data.pop()
    var c = a[0]
    a[0] = a.pop()
    b--
    for (var d = 0, f = a[d]; d < Math.floor(b / 2); ) {
      var e = 2 * d + 1,
        h = 2 * d + 2,
        e = h < b && !this.greater(a[h], a[e]) ? h : e
      if (this.greater(a[e], f)) break
      a[d] = a[e]
      d = e
    }
    a[d] = f
    return c
  }
}
Sim.DataSeries = function (a) {
  this.name = a
  this.reset()
}
Sim.DataSeries.prototype.reset = function () {
  this.Q = this.A = this.W = this.Count = 0
  this.Max = -Infinity
  this.Min = Infinity
  this.Sum = 0
  if (this.histogram)
    for (var a = 0; a < this.histogram.length; a++) this.histogram[a] = 0
}
Sim.DataSeries.prototype.setHistogram = function (a, b, c) {
  this.hLower = a
  this.hUpper = b
  this.hBucketSize = (b - a) / c
  this.histogram = Array(c + 2)
  for (a = 0; a < this.histogram.length; a++) this.histogram[a] = 0
}
Sim.DataSeries.prototype.getHistogram = function () {
  return this.histogram
}
Sim.DataSeries.prototype.record = function (a, b) {
  var c = b === void 0 ? 1 : b
  if (a > this.Max) this.Max = a
  if (a < this.Min) this.Min = a
  this.Sum += a
  this.Count++
  this.histogram &&
    (a < this.hLower
      ? (this.histogram[0] += c)
      : a > this.hUpper
      ? (this.histogram[this.histogram.length - 1] += c)
      : (this.histogram[
          Math.floor((a - this.hLower) / this.hBucketSize) + 1
        ] += c))
  this.W += c
  if (this.W !== 0) {
    var d = this.A
    this.A = d + (c / this.W) * (a - d)
    this.Q += c * (a - d) * (a - this.A)
  }
}
Sim.DataSeries.prototype.count = function () {
  return this.Count
}
Sim.DataSeries.prototype.min = function () {
  return this.Min
}
Sim.DataSeries.prototype.max = function () {
  return this.Max
}
Sim.DataSeries.prototype.range = function () {
  return this.Max - this.Min
}
Sim.DataSeries.prototype.sum = function () {
  return this.Sum
}
Sim.DataSeries.prototype.sumWeighted = function () {
  return this.A * this.W
}
Sim.DataSeries.prototype.average = function () {
  return this.A
}
Sim.DataSeries.prototype.variance = function () {
  return this.Q / this.W
}
Sim.DataSeries.prototype.deviation = function () {
  return Math.sqrt(this.variance())
}
Sim.TimeSeries = function (a) {
  this.dataSeries = new Sim.DataSeries(a)
}
Sim.TimeSeries.prototype.reset = function () {
  this.dataSeries.reset()
  this.lastTimestamp = this.lastValue = NaN
}
Sim.TimeSeries.prototype.setHistogram = function (a, b, c) {
  this.dataSeries.setHistogram(a, b, c)
}
Sim.TimeSeries.prototype.getHistogram = function () {
  return this.dataSeries.getHistogram()
}
Sim.TimeSeries.prototype.record = function (a, b) {
  isNaN(this.lastTimestamp) ||
    this.dataSeries.record(this.lastValue, b - this.lastTimestamp)
  this.lastValue = a
  this.lastTimestamp = b
}
Sim.TimeSeries.prototype.finalize = function (a) {
  this.record(NaN, a)
}
Sim.TimeSeries.prototype.count = function () {
  return this.dataSeries.count()
}
Sim.TimeSeries.prototype.min = function () {
  return this.dataSeries.min()
}
Sim.TimeSeries.prototype.max = function () {
  return this.dataSeries.max()
}
Sim.TimeSeries.prototype.range = function () {
  return this.dataSeries.range()
}
Sim.TimeSeries.prototype.sum = function () {
  return this.dataSeries.sum()
}
Sim.TimeSeries.prototype.average = function () {
  return this.dataSeries.average()
}
Sim.TimeSeries.prototype.deviation = function () {
  return this.dataSeries.deviation()
}
Sim.TimeSeries.prototype.variance = function () {
  return this.dataSeries.variance()
}
Sim.Population = function (a) {
  this.name = a
  this.population = 0
  this.sizeSeries = new Sim.TimeSeries()
  this.durationSeries = new Sim.DataSeries()
}
Sim.Population.prototype.reset = function () {
  this.sizeSeries.reset()
  this.durationSeries.reset()
  this.population = 0
}
Sim.Population.prototype.enter = function (a) {
  this.population++
  this.sizeSeries.record(this.population, a)
}
Sim.Population.prototype.leave = function (a, b) {
  this.population--
  this.sizeSeries.record(this.population, b)
  this.durationSeries.record(b - a)
}
Sim.Population.prototype.current = function () {
  return this.population
}
Sim.Population.prototype.finalize = function (a) {
  this.sizeSeries.finalize(a)
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
exports.Sim = Sim
exports.Random = Random
