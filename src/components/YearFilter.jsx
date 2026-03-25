import { useYear } from '../context/YearContext'

function YearFilter() {
  const { selectedYear, setSelectedYear, years } = useYear()

  return (
    <div className="year-filter">
      <span className="year-label">📅</span>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

export default YearFilter