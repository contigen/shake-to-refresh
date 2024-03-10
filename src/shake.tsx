import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [acceleration, setAcceleration] =
    useState<DeviceMotionEventAcceleration | null>(null)

  const vibrate = () => navigator.vibrate(200)
  async function reload() {
    setLoading(true)
    vibrate()
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.reload()
  }

  useEffect(() => {
    function setMotionValues(evt: DeviceMotionEvent) {
      if (evt.acceleration) {
        setAcceleration(evt.acceleration)
        console.log(Object.values(evt.acceleration))
      }
    }
    window.addEventListener(`devicemotion`, setMotionValues)
    return () => {
      window.removeEventListener(`devicemotion`, setMotionValues)
    }
  }, [acceleration])

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
      </div>
    </div>
  )
}
