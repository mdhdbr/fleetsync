import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type GlobalState = {
  filterWeatherImpacted: boolean
  setFilterWeatherImpacted: (v: boolean | ((prev: boolean) => boolean)) => void
  severityFilter: string
  setSeverityFilter: (v: string) => void
  incidents: any[]
  zones: any[]
  setBbox: (v: string) => void
}

const Ctx = createContext<GlobalState | null>(null)

export function GlobalProvider({ children }: { children: any }) {
  const [filterWeatherImpacted, setFilterWeatherImpacted] = useState(false)
  const [severityFilter, setSeverityFilter] = useState('')
  const [incidents, setIncidents] = useState<any[]>([])
  const [zones, setZones] = useState<any[]>([])
  const [bbox, setBbox] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const qs = new URLSearchParams()
        if (severityFilter) qs.set('severity', severityFilter)
        if (bbox) qs.set('bbox', bbox)
        const ir = await fetch('http://localhost:3001/api/road/incidents-db?' + qs.toString())
        const ij = await ir.json()
        const zr = await fetch('http://localhost:3001/api/weather/zones')
        const zj = await zr.json()
        if (!active) return
        setIncidents(ij.incidents || [])
        setZones(zj.zones || [])
      } catch { }
    }
    load()
    const t = setInterval(load, 20000)
    return () => { active = false; clearInterval(t) }
  }, [severityFilter, bbox])

  const value = useMemo(() => ({ filterWeatherImpacted, setFilterWeatherImpacted, severityFilter, setSeverityFilter, incidents, zones, setBbox }), [filterWeatherImpacted, severityFilter, incidents, zones])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useGlobal() {
  const v = useContext(Ctx)
  if (!v) throw new Error('missing provider')
  return v
}
