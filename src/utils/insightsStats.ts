export interface InsightCycle {
  start_date: string
  end_date: string | null
}

export interface InsightLog {
  mood: string[] | null
  symptoms: string[] | null
}

export interface FrequencyItem {
  label: string
  count: number
}

const toDate = (value: string) => new Date(`${value}T00:00:00`)

const round = (value: number) => Math.round(value * 10) / 10

export function getCycleLengths(cycles: InsightCycle[]): number[] {
  const starts = cycles
    .map((cycle) => toDate(cycle.start_date))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime())

  return starts.slice(1).map((start, index) => Math.round((start.getTime() - starts[index].getTime()) / 86400000))
}

export function getPeriodLengths(cycles: InsightCycle[]): number[] {
  return cycles
    .filter((cycle) => cycle.end_date)
    .map((cycle) => {
      const start = toDate(cycle.start_date)
      const end = toDate(cycle.end_date as string)
      return Math.round((end.getTime() - start.getTime()) / 86400000) + 1
    })
    .filter((length) => length > 0)
}

export function getAverage(values: number[]): number | null {
  if (!values.length) return null
  return round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

export function getFrequency(items: (string[] | null)[]): FrequencyItem[] {
  const counts = new Map<string, number>()
  items.flatMap((item) => item ?? []).forEach((value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  })

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function getRegularityNote(cycleLengths: number[]): string {
  if (cycleLengths.length < 2) return 'Log at least three period starts to see how regular your cycle is.'

  const range = Math.max(...cycleLengths) - Math.min(...cycleLengths)
  if (range <= 2) return 'Your cycle has been very consistent.'
  if (range <= 5) return 'Your cycle has had a small amount of variation.'
  if (range <= 8) return 'Your cycle has had some variation.'
  return 'Your cycle has had a wider range of variation.'
}
