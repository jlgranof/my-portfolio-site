import { useState, useEffect } from 'react'

// Small screens get the FIELD OPS UNIT shell instead of the CRT monitor.
const QUERY = '(max-width: 820px)'

export function useIsHandheld(): boolean {
  const [isHandheld, setIsHandheld] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = matchMedia(QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsHandheld(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isHandheld
}
