'use client'
import { basePath } from '@/helpers'

const AudioAlert = () => {
  const playSound = (folder: string, file: string) => {
    const audioPath = `/${folder}${file}`
    const audio = new Audio(audioPath)
    audio.play().catch((err) => console.error('Audio playback failed:', err))
  }
  return (
    <>
      <div className="alert alert-warning">
        Truly a Game-Changer in Admin Dashboards.
        <button
          type="button"
          className="ms-2 btn btn-outline-secondary btn-icon rounded-circle waves-effect waves-themed"
          onClick={() => playSound('media/sound/', 'appintel.mp3')}
          aria-label="Play Introduction">
          <svg className="sa-icon">
            <use href={`${basePath}/icons/sprite.svg#volume-2`} />
          </svg>
        </button>
      </div>
    </>
  )
}

export default AudioAlert
