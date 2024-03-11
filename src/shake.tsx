import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { RotatingLines } from 'react-loader-spinner'

const Spinner = (
  <RotatingLines
    strokeColor='black'
    strokeWidth='3'
    animationDuration='0.75'
    width='30'
  />
)

declare global {
  interface DeviceMotionEvent {
    requestPermission?: () => Promise<PermissionState>
  }
}

export function Shake() {
  const acceleration = useDeviceAcceleration()
  const [loading, setLoading] = useState(false)
  const { x = null, y = null, z = null } = acceleration ?? {}
  const accelerationMagnitude = useMemo(() => {
    if (x === null || y === null || z === null) return null
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  }, [x, y, z])

  const vibrate = () => {
    if (!navigator.vibrate) return
    navigator.vibrate(300)
  }
  const reload = useCallback(async () => {
    setLoading(true)
    vibrate()
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.reload()
  }, [])
  useEffect(() => {
    if (!accelerationMagnitude) return
    if (accelerationMagnitude >= 25) reload()
  }, [accelerationMagnitude, reload])
  return (
    <div>
      <h1>Shake!</h1>
      <h2>
        {navigator.userActivation.isActive ||
        navigator.userActivation.hasBeenActive
          ? `User Interaction confirmed`
          : `Interact with the page to allow
        vibration, just touch the screen or whatever.`}
      </h2>
      <div className='center'>{loading && Spinner}</div>
      {accelerationMagnitude && (
        <p>Acceleration Magnitude :{accelerationMagnitude}</p>
      )}
    </div>
  )
}

function useDeviceAcceleration() {
  const [acceleration, setAcceleration] =
    useState<DeviceMotionEventAcceleration | null>(null)
  function subscribe() {
    const setMotionValues = (evt: DeviceMotionEvent) =>
      setAcceleration(evt.acceleration)
    function deviceMotionPermissionRequest() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (typeof DeviceMotionEvent.requestPermission === `function`) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        DeviceMotionEvent.requestPermission()
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .then(permissionState => {
            if (permissionState === `granted`) {
              window.addEventListener(`devicemotion`, setMotionValues)
            }
          })
          .catch(console.error)
      } else {
        window.addEventListener(`devicemotion`, setMotionValues)
      }
    }
    deviceMotionPermissionRequest()
    window.addEventListener(`devicemotion`, setMotionValues)
    return () => window.removeEventListener(`devicemotion`, setMotionValues)
  }
  return useSyncExternalStore(subscribe, () => acceleration)
}
