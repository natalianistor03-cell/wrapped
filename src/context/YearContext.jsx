import { createContext, useContext, useState } from 'react'

const YearContext = createContext()

export function YearProvider({ children }) {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, years }}>
      {children}
    </YearContext.Provider>
  )
}

export function useYear() {
  return useContext(YearContext)
}