import './App.css'
import { useState } from 'react'

function App() {
        // Show forbidden character message
        const [forbiddenCharMsg, setForbiddenCharMsg] = useState('');

        // Handler to prevent '.' input for km fields
        function handleDistanceInput(e: React.ChangeEvent<HTMLInputElement>) {
          if (unit === 'km' && e.target.value.includes('.')) {
            setForbiddenCharMsg("For 'km', use ',' as the decimal separator. '.' is not allowed.");
            e.target.value = e.target.value.replace(/\./g, '');
          } else if (unit === 'mile' && e.target.value.includes(',')) {
            setForbiddenCharMsg("For 'mile', use '.' as the decimal separator. ',' is not allowed.");
            e.target.value = e.target.value.replace(/,/g, '');
          } else {
            setForbiddenCharMsg('');
          }
          return e.target.value;
        }
      function handleConvertMinKmToKmh() {
        if (!minkm) {
          setKmhResult('')
          return
        }
        // Parse mm:ss to minutes
        const parts = minkm.split(':').map(Number)
        let min = 0
        if (parts.length === 2) {
          min = parts[0] + parts[1] / 60
        } else if (parts.length === 1) {
          min = parts[0]
        }
        if (min === 0) {
          setKmhResult('')
          return
        }
        const speed = 60 / min
        // Format with comma as decimal separator
        const formatted = speed.toFixed(2).replace('.', ',') + ` ${unit}/h`
        setKmhResult(formatted)
      }
    // Helper to parse mm:ss to seconds
    function parsePaceToSeconds(paceStr: string) {
      const parts = paceStr.split(':').map(Number)
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]
      }
      return 0
    }

    // Helper to format seconds to hh:mm:ss
    function formatSecondsToHHMMSS(seconds: number) {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = Math.round(seconds % 60)
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    function handleTimeCalc() {
      const distance = parseDistanceInput(distanceTime)
      const paceStr = paceTime
      if (!distance || !paceStr) {
        setTimeResult('')
        return
      }
      const paceSec = parsePaceToSeconds(paceStr)
      if (paceSec === 0) {
        setTimeResult('')
        return
      }
      const totalSec = paceSec * distance
      setTimeResult(formatSecondsToHHMMSS(totalSec))
    }

    function handleDistanceCalc() {
      const timeStr = timeDistance
      const paceStr = paceDistance
      if (!timeStr || !paceStr) {
        setDistanceResult('')
        return
      }
      const timeSec = parseTimeToSeconds(timeStr)
      const paceSec = parsePaceToSeconds(paceStr)
      if (paceSec === 0) {
        setDistanceResult('')
        return
      }
      const distance = timeSec / paceSec
      setDistanceResult(distance.toFixed(2))
    }
  const [unit, setUnit] = useState('km')
  // Default values for distance fields
  // Controlled state for distance fields
  const [distancePace, setDistancePace] = useState('')
  const [distanceTime, setDistanceTime] = useState('')
  // Controlled state for time and pace fields
  const [timePace, setTimePace] = useState('')
  const [paceTime, setPaceTime] = useState('')
  const [timeDistance, setTimeDistance] = useState('')
  const [paceDistance, setPaceDistance] = useState('')
  const [minkm, setMinkm] = useState('')
  const [kmh, setKmh] = useState('')
  const [mileh, setMileh] = useState('')

  // Clear all fields and results, and reset distance fields to default
  function clearFieldsAndResults() {
    [
      'distance-pace', 'distance-time'
    ].forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement | null
      if (el) el.value = formatDistance(defaultDistance)
    })
    ;[
      'time-pace', 'pace-time',
      'time-distance', 'pace-distance',
      'minkm', 'kmh'
    ].forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement | null
      if (el) el.value = ''
    })
    setPaceResult('')
    setTimeResult('')
    setDistanceResult('')
    setKmhResult('')
    setMinkmResult('')
  }

  // Update distance and other fields when unit changes
  function handleUnitChange(newUnit: string) {
    setUnit(newUnit)
    setDistancePace('')
    setDistanceTime('')
    setTimePace('')
    setPaceTime('')
    setTimeDistance('')
    setPaceDistance('')
    setMinkm('')
    setKmh('')
    setMileh('')
    clearFieldsAndResultsExceptControlled()
  }

  // Clear all fields and results except controlled fields
  function clearFieldsAndResultsExceptControlled() {
    setPaceResult('')
    setTimeResult('')
    setDistanceResult('')
    setKmhResult('')
    setMinkmResult('')
  }

  // Calculation results
  const [paceResult, setPaceResult] = useState('')
  const [timeResult, setTimeResult] = useState('')
  const [distanceResult, setDistanceResult] = useState('')
  const [kmhResult, setKmhResult] = useState('')
  const [minkmResult, setMinkmResult] = useState('')

  // Helper to parse hh:mm:ss to seconds
  function parseTimeToSeconds(timeStr: string) {
    const parts = timeStr.split(':').map(Number)
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1]
    } else if (parts.length === 1) {
      return parts[0]
    }
    return 0
  }

  // Helper to format seconds to mm:ss
  function formatSecondsToMMSS(seconds: number) {
    const min = Math.floor(seconds / 60)
    const sec = Math.round(seconds % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  // Helper to format distance with correct separator
  function formatDistance(val: number) {
    return unit === 'km' ? val.toFixed(1).replace('.', ',') : val.toFixed(1)
  }
  // Helper to parse input value to float
  function parseDistanceInput(val: string) {
    if (unit === 'km') {
      return parseFloat(val.replace(',', '.'))
    }
    return parseFloat(val)
  }

  function handlePaceCalc() {
    const distance = parseDistanceInput(distancePace)
    const timeStr = (document.getElementById('time-pace') as HTMLInputElement)?.value
    if (!distance || !timeStr) {
      setPaceResult('')
      return
    }
    const timeSec = parseTimeToSeconds(timeStr)
    if (timeSec === 0) {
      setPaceResult('')
      return
    }
    const paceSec = timeSec / distance
    setPaceResult(formatSecondsToMMSS(paceSec) + ` min/${unit}`)
  }

  return (
    <>
      <h1 id="header-title">Run Calculator</h1>
      <div className="app-container">
        <div className="content-greyscale">
          <div className="unit-toggle">
            <button
              type="button"
              className={unit === 'km' ? 'unit-btn selected' : 'unit-btn'}
              onClick={() => handleUnitChange('km')}
              id="unit-km"
            >
              km
            </button>
            <button
              type="button"
              className={unit === 'mile' ? 'unit-btn selected' : 'unit-btn'}
              onClick={() => handleUnitChange('mile')}
              id="unit-mile"
            >
              mile
            </button>
          </div>
      <div className="calc-section">
        <h2>1. Calculate Pace</h2>
        <form id="calc-pace-form" onSubmit={e => e.preventDefault()}>
          <label htmlFor="distance-pace">Distance ({unit})</label>
          <input id="distance-pace" type="text" min="0" step="0.1" value={distancePace} onChange={e => setDistancePace(handleDistanceInput(e))} pattern={unit === 'km' ? "[0-9]+([,][0-9]+)?" : "[0-9]+([.][0-9]+)?"} placeholder={unit === 'km' ? 'e.g. 5,0' : 'e.g. 3.1'} />
          <label htmlFor="time-pace">Time</label>
          <input id="time-pace" type="text" value={timePace} onChange={e => setTimePace(e.target.value)} placeholder="hh:mm:ss" />
          <button id="btn-calc-pace" type="button" onClick={handlePaceCalc}>Calculate Pace</button>
          {paceResult && <div className="result">Pace: {paceResult}</div>}
        </form>
        <h2>2. Calculate Time</h2>
        <form id="calc-time-form">
          <label htmlFor="distance-time">Distance ({unit})</label>
          <input id="distance-time" type="text" min="0" step="0.1" value={distanceTime} onChange={e => setDistanceTime(handleDistanceInput(e))} pattern={unit === 'km' ? "[0-9]+([,][0-9]+)?" : "[0-9]+([.][0-9]+)?"} placeholder={unit === 'km' ? 'e.g. 10,0' : 'e.g. 6.2'} />
          <label htmlFor="pace-time">Pace (mm:ss)</label>
          <input id="pace-time" type="text" placeholder="mm:ss" value={paceTime} onChange={e => setPaceTime(e.target.value)} placeholder="mm:ss" />
          <button id="btn-calc-time" type="button" onClick={handleTimeCalc}>Calculate Time</button>
          {timeResult && <div className="result">Time: {timeResult}</div>}
        </form>
        <h2>3. Calculate Distance</h2>
        <form id="calc-distance-form">
          <label htmlFor="time-distance">Time (hh:mm:ss)</label>
          <input id="time-distance" type="text" placeholder="hh:mm:ss" value={timeDistance} onChange={e => setTimeDistance(e.target.value)} placeholder="hh:mm:ss" />
          <label htmlFor="pace-distance">Pace (mm:ss)</label>
          <input id="pace-distance" type="text" placeholder="mm:ss" value={paceDistance} onChange={e => setPaceDistance(e.target.value)} placeholder="mm:ss" />
          <button id="btn-calc-distance" type="button" onClick={handleDistanceCalc}>Calculate Distance</button>
          {distanceResult && <div className="result">Distance: {distanceResult}</div>}
        </form>
        <h2>4. Convert min/{unit} to {unit}/h</h2>
        <form id="convert-minkm-kmh-form">
          <label htmlFor="minkm">min/{unit}</label>
          <input id="minkm" type="text" placeholder="mm:ss" value={minkm} onChange={e => setMinkm(e.target.value)} placeholder={`mm:ss`} />
          <button id="btn-convert-minkm-kmh" type="button" onClick={handleConvertMinKmToKmh}>Convert to {unit}/h</button>
          {kmhResult && <div className="result">{kmhResult}</div>}
        </form>
        <h2>5. Convert {unit}/h to min/{unit}</h2>
        <form id="convert-kmh-minkm-form">
          <label htmlFor="kmh">{unit}/h</label>
          <input id="kmh" type="text" min="0" step="0.01" value={unit === 'km' ? kmh : mileh} onChange={e => unit === 'km' ? setKmh(handleDistanceInput(e)) : setMileh(handleDistanceInput(e))} placeholder={unit === 'km' ? 'e.g. 12,5' : 'e.g. 7.8'} />
          <button id="btn-convert-kmh-minkm" type="button" onClick={() => {
            const val = unit === 'km' ? kmh : mileh;
            const speed = parseFloat(val.replace(',', '.'));
            if (!isNaN(speed) && speed > 0) {
              const minPerUnit = 60 / speed;
              const min = Math.floor(minPerUnit);
              const sec = Math.round((minPerUnit - min) * 60);
              const formatted = `${min}:${sec.toString().padStart(2, '0')} min/${unit}`;
              setMinkmResult(formatted);
            } else {
              setMinkmResult('');
            }
          }}>Convert to min/{unit}</button>
          {minkmResult && <div className="result">{minkmResult}</div>}
        {forbiddenCharMsg && <div className="error-msg">{forbiddenCharMsg}</div>}
        </form>
        </div>
        </div>
      </div>
    </>
  )
}

export default App
