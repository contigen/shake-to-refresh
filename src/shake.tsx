import { useState } from 'react'
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

  async function reload() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    window.location.reload()
  }
  window.addEventListener('devicemotion', evt => {
    evt.acceleration && setAcceleration(evt.acceleration)
  })
  return (
    <div>
      <h1>Shake!</h1>
      <div className='center'>
        {loading && Spinner}
        <br />
        <button onClick={reload}>Reload</button>
        {acceleration && (
          <p>
            {acceleration?.x} m/s<sup>2</sup>
          </p>
        )}
      </div>
    </div>
  )
}
