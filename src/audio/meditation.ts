export type MeditationGraph = {
  master: GainNode
  input: GainNode
  nodes: Set<AudioNode>
  sources: Set<AudioScheduledSourceNode>
  bowlTimer: number | null
  motifTimer: number | null
  suspendTimer: number | null
  cleanupTimer: number | null
  disposed: boolean
  volume: 0.5 | 1
}

function volumeTarget(volume: 0.5 | 1) {
  return volume === 1 ? .094 : .049
}

function holdAtCurrentValue(parameter: AudioParam, time: number) {
  if (typeof parameter.cancelAndHoldAtTime === 'function') {
    parameter.cancelAndHoldAtTime(time)
    return
  }
  const value = parameter.value
  parameter.cancelScheduledValues(time)
  parameter.setValueAtTime(value, time)
}

function fadeMaster(graph: MeditationGraph, context: AudioContext, target: number, seconds: number) {
  const now = context.currentTime
  holdAtCurrentValue(graph.master.gain, now)
  graph.master.gain.linearRampToValueAtTime(target, now + seconds)
}

function createRoomImpulse(context: AudioContext) {
  const seconds = 2.2
  const length = Math.floor(context.sampleRate * seconds)
  const impulse = context.createBuffer(2, length, context.sampleRate)

  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel)
    let smoothed = 0
    for (let index = 0; index < data.length; index += 1) {
      smoothed = smoothed * .84 + (Math.random() * 2 - 1) * .16
      const decay = Math.pow(1 - index / data.length, 2.8)
      data[index] = smoothed * decay * .72
    }
  }

  return impulse
}

function clearBowlTimer(graph: MeditationGraph) {
  if (graph.bowlTimer !== null) window.clearTimeout(graph.bowlTimer)
  graph.bowlTimer = null
}

function playBowl(context: AudioContext, graph: MeditationGraph) {
  if (graph.disposed || context.state !== 'running') return

  const now = context.currentTime + .02
  const base = Math.random() > .48 ? 220 : 293.66
  const ratios = [1, 2.01, 2.98, 4.16, 5.43]
  const levels = [.052, .021, .011, .005, .0025]
  const decays = [7, 5.5, 4.2, 3, 2.2]
  const bowlBus = context.createGain()
  bowlBus.gain.value = .24
  bowlBus.connect(graph.input)
  graph.nodes.add(bowlBus)
  let remaining = ratios.length

  ratios.forEach((ratio, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = base * ratio
    oscillator.detune.value = (Math.random() - .5) * 3.2
    gain.gain.setValueAtTime(.0001, now)
    gain.gain.linearRampToValueAtTime(levels[index], now + .024 + index * .003)
    gain.gain.exponentialRampToValueAtTime(.0001, now + decays[index])
    oscillator.connect(gain).connect(bowlBus)
    graph.nodes.add(gain)
    graph.sources.add(oscillator)
    oscillator.onended = () => {
      graph.sources.delete(oscillator)
      graph.nodes.delete(gain)
      oscillator.disconnect()
      gain.disconnect()
      remaining -= 1
      if (remaining === 0) {
        graph.nodes.delete(bowlBus)
        bowlBus.disconnect()
      }
    }
    oscillator.start(now)
    oscillator.stop(now + decays[index] + .12)
  })
}

function scheduleBowl(context: AudioContext, graph: MeditationGraph, first = false) {
  clearBowlTimer(graph)
  if (graph.disposed) return
  const delay = first ? 9000 + Math.random() * 4000 : 26000 + Math.random() * 18000
  graph.bowlTimer = window.setTimeout(() => {
    graph.bowlTimer = null
    if (graph.disposed || context.state !== 'running') return
    playBowl(context, graph)
    scheduleBowl(context, graph)
  }, delay)
}

function clearMotifTimer(graph: MeditationGraph) {
  if (graph.motifTimer !== null) window.clearTimeout(graph.motifTimer)
  graph.motifTimer = null
}

function playPentatonicMotif(context: AudioContext, graph: MeditationGraph) {
  if (graph.disposed || context.state !== 'running') return
  const scale = [196, 220, 261.63, 293.66, 329.63]
  const notes = 2 + Math.floor(Math.random() * 3)
  const start = context.currentTime + .03
  for (let index = 0; index < notes; index += 1) {
    const oscillator = context.createOscillator()
    const overtone = context.createOscillator()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    const frequency = scale[Math.floor(Math.random() * scale.length)] / (Math.random() > .82 ? 2 : 1)
    const at = start + index * (.48 + Math.random() * .24)
    oscillator.type = 'triangle'
    overtone.type = 'sine'
    oscillator.frequency.value = frequency
    overtone.frequency.value = frequency * 2.01
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1800, at)
    filter.frequency.exponentialRampToValueAtTime(520, at + 1.6)
    gain.gain.setValueAtTime(.0001, at)
    gain.gain.exponentialRampToValueAtTime(.018, at + .012)
    gain.gain.exponentialRampToValueAtTime(.0001, at + 1.85)
    oscillator.connect(gain)
    overtone.connect(gain)
    gain.connect(filter).connect(graph.input)
    graph.sources.add(oscillator); graph.sources.add(overtone)
    graph.nodes.add(gain); graph.nodes.add(filter)
    let remaining = 2
    const remove = () => {
      remaining -= 1
      if (remaining) return
      graph.sources.delete(oscillator); graph.sources.delete(overtone)
      graph.nodes.delete(gain); graph.nodes.delete(filter)
      oscillator.disconnect(); overtone.disconnect(); gain.disconnect(); filter.disconnect()
    }
    oscillator.onended = remove
    overtone.onended = remove
    oscillator.start(at); overtone.start(at)
    oscillator.stop(at + 1.9); overtone.stop(at + 1.9)
  }
}

function scheduleMotif(context: AudioContext, graph: MeditationGraph, first = false) {
  clearMotifTimer(graph)
  if (graph.disposed) return
  const delay = first ? 2200 : 6200 + Math.random() * 4200
  graph.motifTimer = window.setTimeout(() => {
    graph.motifTimer = null
    if (graph.disposed || context.state !== 'running') return
    playPentatonicMotif(context, graph)
    scheduleMotif(context, graph)
  }, delay)
}

export function createMeditationGraph(context: AudioContext, volume: 0.5 | 1 = 0.5): MeditationGraph {
  const master = context.createGain()
  const compressor = context.createDynamicsCompressor()
  const input = context.createGain()
  const padMix = context.createGain()
  const filter = context.createBiquadFilter()
  const dry = context.createGain()
  const wet = context.createGain()
  const room = context.createConvolver()
  const amplitudeLfo = context.createOscillator()
  const amplitudeDepth = context.createGain()
  const filterLfo = context.createOscillator()
  const filterDepth = context.createGain()

  master.gain.value = .0001
  compressor.threshold.value = -8
  compressor.knee.value = 6
  compressor.ratio.value = 12
  compressor.attack.value = .003
  compressor.release.value = .25
  filter.type = 'lowpass'
  filter.frequency.value = 920
  filter.Q.value = .35
  padMix.gain.value = .62
  dry.gain.value = .82
  wet.gain.value = .12
  room.buffer = createRoomImpulse(context)

  input.connect(filter)
  filter.connect(dry).connect(master)
  filter.connect(room).connect(wet).connect(master)
  master.connect(compressor).connect(context.destination)

  amplitudeLfo.type = 'sine'
  amplitudeLfo.frequency.value = .027
  amplitudeDepth.gain.value = .018
  amplitudeLfo.connect(amplitudeDepth).connect(padMix.gain)
  filterLfo.type = 'sine'
  filterLfo.frequency.value = .019
  filterDepth.gain.value = 95
  filterLfo.connect(filterDepth).connect(filter.frequency)

  const nodes = new Set<AudioNode>([
    master, compressor, input, padMix, filter, dry, wet, room,
    amplitudeDepth, filterDepth,
  ])
  const sources = new Set<AudioScheduledSourceNode>([amplitudeLfo, filterLfo])
  const voices = [
    { type: 'triangle' as OscillatorType, frequency: 146.83, detune: -2, gain: .025, pan: -.18 },
    { type: 'triangle' as OscillatorType, frequency: 146.83, detune: 2, gain: .019, pan: .18 },
    { type: 'sine' as OscillatorType, frequency: 220, detune: 1, gain: .014, pan: .08 },
  ]

  voices.forEach((voice) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const panner = context.createStereoPanner()
    oscillator.type = voice.type
    oscillator.frequency.value = voice.frequency
    oscillator.detune.value = voice.detune
    gain.gain.value = voice.gain
    panner.pan.value = voice.pan
    oscillator.connect(gain).connect(panner).connect(padMix)
    nodes.add(gain)
    nodes.add(panner)
    sources.add(oscillator)
  })

  padMix.connect(input)
  const graph: MeditationGraph = {
    master,
    input,
    nodes,
    sources,
    bowlTimer: null,
    motifTimer: null,
    suspendTimer: null,
    cleanupTimer: null,
    disposed: false,
    volume,
  }

  sources.forEach((source) => source.start())
  fadeMaster(graph, context, volumeTarget(volume), 3.2)
  scheduleBowl(context, graph, true)
  scheduleMotif(context, graph, true)
  return graph
}

export function setMeditationVolume(context: AudioContext, graph: MeditationGraph, volume: 0.5 | 1) {
  if (graph.disposed) return
  graph.volume = volume
  fadeMaster(graph, context, volumeTarget(volume), .5)
}

export function pauseMeditation(context: AudioContext, graph: MeditationGraph) {
  if (graph.disposed) return
  clearBowlTimer(graph)
  clearMotifTimer(graph)
  if (graph.suspendTimer !== null) window.clearTimeout(graph.suspendTimer)
  fadeMaster(graph, context, .0001, .2)
  graph.suspendTimer = window.setTimeout(() => {
    graph.suspendTimer = null
    if (!graph.disposed && document.hidden && context.state === 'running') {
      void context.suspend().catch(() => undefined)
    }
  }, 230)
}

export async function resumeMeditation(context: AudioContext, graph: MeditationGraph) {
  if (graph.disposed) return false
  if (graph.suspendTimer !== null) window.clearTimeout(graph.suspendTimer)
  graph.suspendTimer = null
  if (context.state !== 'running') await context.resume()
  if (graph.disposed) return false
  fadeMaster(graph, context, volumeTarget(graph.volume), 1.1)
  scheduleBowl(context, graph, true)
  scheduleMotif(context, graph, true)
  return true
}

export function disposeMeditation(context: AudioContext, graph: MeditationGraph, immediate = false) {
  if (graph.disposed) return
  graph.disposed = true
  clearBowlTimer(graph)
  clearMotifTimer(graph)
  if (graph.suspendTimer !== null) window.clearTimeout(graph.suspendTimer)
  if (graph.cleanupTimer !== null) window.clearTimeout(graph.cleanupTimer)
  const fadeSeconds = immediate ? .01 : 1.05
  fadeMaster(graph, context, .0001, fadeSeconds)
  const stopAt = context.currentTime + fadeSeconds + .04
  graph.sources.forEach((source) => {
    try { source.stop(stopAt) } catch { /* A completed one-shot needs no second stop. */ }
  })
  graph.cleanupTimer = window.setTimeout(() => {
    graph.sources.forEach((source) => source.disconnect())
    graph.nodes.forEach((node) => node.disconnect())
    graph.sources.clear()
    graph.nodes.clear()
    graph.cleanupTimer = null
  }, fadeSeconds * 1000 + 100)
}
