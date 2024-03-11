import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
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

  const handleDeviceMotion = useCallback(
    () =>
      async ({ acceleration }: DeviceMotionEvent) => {
        async function reload() {
          setLoading(true)
          vibrate()
          await new Promise(resolve => setTimeout(resolve, 1500))
          window.location.reload()
        }
        if (
          !acceleration ||
          acceleration.x === null ||
          acceleration.y === null ||
          acceleration.z === null
        ) {
          return
        }

        const { x, y, z } = acceleration
        const accelerationMagnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2)

        if (accelerationMagnitude >= 5) {
          await reload()
        }
      },
    []
  )
  useEffect(() => {
    window.addEventListener(`devicemotion`, handleDeviceMotion)
    return () => {
      window.removeEventListener(`devicemotion`, handleDeviceMotion)
    }
  }, [handleDeviceMotion])

  return (
    <div>
      <h1>Shake!</h1>
      <div className='center'>
        {loading && Spinner}
        <br />
        {acceleration && (
          <p>
            Acceleration: {acceleration.x}, {acceleration.y}, {acceleration.z}{' '}
            m/s<sup>2</sup>
          </p>
        )}
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
