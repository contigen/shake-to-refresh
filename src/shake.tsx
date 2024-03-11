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
  const vibrate = () => navigator.vibrate(300)
  async function reload() {
    setLoading(true)
    vibrate()
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.reload()
  }
  window.addEventListener(
    `devicemotion`,
    ({ acceleration }: DeviceMotionEvent) => {
      if (!acceleration) return
      if (acceleration.x && -2 <= acceleration.x && acceleration.x >= 2) {
        reload()
      }
    }
  )

  return (
    <div>
      <h1>Shake!</h1>
      <div className='center'>
        {loading && Spinner}
        <br />
        {acceleration &&
          Object.values(acceleration).map(value => (
            <p key={value}>
              {value} m/s<sup>2</sup>
            </p>
          ))}
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
