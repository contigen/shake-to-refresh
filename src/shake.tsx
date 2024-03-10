import { useState, useSyncExternalStore } from 'react'
import { RotatingLines } from 'react-loader-spinner'

const Spinner = (
  <RotatingLines
    strokeColor='black'
    strokeWidth='3'
    animationDuration='0.75'
    width='30'
  />
)
export function Shake() {
  const acceleration = useDeviceAcceleration()
  const [loading, setLoading] = useState(false)
  const [interval, updateInterval] = useState(0)
  const vibrate = () => navigator.vibrate(200)
  async function reload() {
    setLoading(true)
    vibrate()
    await new Promise(resolve => setTimeout(resolve, 2000))
    window.location.reload()
  }
  window.addEventListener(`devicemotion`, (evt: DeviceMotionEvent) => {
    updateInterval(evt?.interval)
  })
  return (
    <div>
      <h1>Shake!</h1>
      <div className='center'>
        {loading && Spinner}
        <br />
        <button onClick={reload}>Reload</button>
        {acceleration &&
          Object.values(acceleration).map(value => (
            <p key={value}>
              {value} m/s<sup>2</sup>
            </p>
          ))}
        <p>{interval}</p>
      </div>
    </div>
  )
}

function useDeviceAcceleration() {
  const [acceleration, setAcceleration] =
    useState<DeviceMotionEventAcceleration | null>(null)
  function subscribe() {
    const setMotionValues = (evt: DeviceMotionEvent) =>
      setAcceleration(evt.acceleration)
    window.addEventListener(`devicemotion`, setMotionValues)
    return () => window.removeEventListener(`devicemotion`, setMotionValues)
  }
  return useSyncExternalStore(subscribe, () => acceleration)
}
