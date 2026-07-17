const PAD_TARGET = 0.14

export type MeditationGraph = {
  master: GainNode
  input: GainNode
  nodes: Set<AudioNode>
  sources: Set<AudioScheduledSourceNode>
  bowlTimer: number | null
  suspendTimer: number | null
  cleanupTimer: number | null
  disposed: boolean
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
  const levels = [.08, .035, .018, .009, .005]
  const decays = [7, 5.5, 4.2, 3, 2.2]
  const bowlBus = context.createGain()
  bowlBus.gain.value = .48
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
  const delay = first ? 6500 + Math.random() * 3000 : 20000 + Math.random() * 16000
  graph.bowlTimer = window.setTimeout(() => {
    graph.bowlTimer = null
    if (graph.disposed || context.state !== 'running') return
    playBowl(context, graph)
    scheduleBowl(context, graph)
  }, delay)
}

export function createMeditationGraph(context: AudioContext): MeditationGraph {
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
  compressor.threshold.value = -22
  compressor.knee.value = 12
  compressor.ratio.value = 3
  compressor.attack.value = .02
  compressor.release.value = .35
  filter.type = 'lowpass'
  filter.frequency.value = 920
  filter.Q.value = .35
  padMix.gain.value = .9
  dry.gain.value = .9
  wet.gain.value = .1
  room.buffer = createRoomImpulse(context)

  input.connect(filter)
  filter.connect(dry).connect(master)
  filter.connect(room).connect(wet).connect(master)
  master.connect(compressor).connect(context.destination)

  amplitudeLfo.type = 'sine'
  amplitudeLfo.frequency.value = .027
  amplitudeDepth.gain.value = .036
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
    { type: 'triangle' as OscillatorType, frequency: 146.83, detune: -2, gain: .08, pan: -.18 },
    { type: 'triangle' as OscillatorType, frequency: 146.83, detune: 2, gain: .06, pan: .18 },
    { type: 'sine' as OscillatorType, frequency: 220, detune: 1, gain: .045, pan: .08 },
    { type: 'sine' as OscillatorType, frequency: 293.66, detune: -1, gain: .02, pan: -.06 },
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
    suspendTimer: null,
    cleanupTimer: null,
    disposed: false,
  }

  sources.forEach((source) => source.start())
  fadeMaster(graph, context, PAD_TARGET, 3.2)
  scheduleBowl(context, graph, true)
  return graph
}

export function pauseMeditation(context: AudioContext, graph: MeditationGraph) {
  if (graph.disposed) return
  clearBowlTimer(graph)
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
  fadeMaster(graph, context, PAD_TARGET, 1.1)
  scheduleBowl(context, graph, true)
  return true
}

export function disposeMeditation(context: AudioContext, graph: MeditationGraph, immediate = false) {
  if (graph.disposed) return
  graph.disposed = true
  clearBowlTimer(graph)
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
