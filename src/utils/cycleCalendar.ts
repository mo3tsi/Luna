import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

export interface CalendarCycle {
  start_date: string
  end_date?: string | null
}

export interface CalendarLog {
  log_date: string
  flow_intensity: string | null
  mood: string[] | null
  symptoms: string[] | null
  note: string | null
  sexual_activity: string | null
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  actualPeriod: boolean
  predictedPeriod: boolean
  fertile: boolean
  ovulation: boolean
  log: CalendarLog | null
}

interface DateRange {
  start: Date
  end: Date
}

const toDate = (value: string) => new Date(`${value}T00:00:00`)

const containsDate = (range: DateRange, date: Date) => date >= range.start && date <= range.end

const cycleRanges = (
  start: Date,
  end: Date,
  averageCycleLength: number,
  averagePeriodLength: number,
  predicted: boolean
) => {
  const periodEnd = addDays(start, averagePeriodLength - 1)
  const ovulation = addDays(start, averageCycleLength - 14)

  return {
    period: { start, end: periodEnd, predicted },
    fertile: { start: addDays(ovulation, -5), end: addDays(ovulation, 1) },
    ovulation,
    visible: start <= end,
  }
}

export function getCalendarDays(
  month: Date,
  cycles: CalendarCycle[],
  logs: CalendarLog[],
  averageCycleLength: number,
  averagePeriodLength: number
): CalendarDay[] {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const dates = Array.from({ length: Math.round((gridEnd.getTime() - gridStart.getTime()) / 86400000) + 1 }, (_, index) =>
    addDays(gridStart, index)
  )

  const actualPeriodDates = new Set<string>()
  const cycleStarts = cycles.map((cycle) => toDate(cycle.start_date)).sort((a, b) => a.getTime() - b.getTime())
  const ranges = cycles.map((cycle) => {
    const start = toDate(cycle.start_date)
    const end = cycle.end_date ? toDate(cycle.end_date) : start
    return { start, end }
  })

  ranges.forEach((range) => {
    for (let date = range.start; date <= range.end; date = addDays(date, 1)) {
      actualPeriodDates.add(format(date, 'yyyy-MM-dd'))
    }
  })

  logs.forEach((log) => {
    if (log.flow_intensity) actualPeriodDates.add(log.log_date)
  })

  const lastCycleStart = cycleStarts.at(-1)
  const predictedPeriods: DateRange[] = []
  const fertileRanges: DateRange[] = []
  const ovulationDates = new Set<string>()

  const addCycleMarkers = (start: Date, predicted: boolean) => {
    const markers = cycleRanges(start, monthEnd, averageCycleLength, averagePeriodLength, predicted)
    if (predicted) predictedPeriods.push(markers.period)
    fertileRanges.push(markers.fertile)
    ovulationDates.add(format(markers.ovulation, 'yyyy-MM-dd'))
  }

  cycles.forEach((cycle) => {
    addCycleMarkers(toDate(cycle.start_date), false)
  })

  if (lastCycleStart) {
    for (
      let predictedStart = addDays(lastCycleStart, averageCycleLength);
      predictedStart <= monthEnd;
      predictedStart = addDays(predictedStart, averageCycleLength)
    ) {
      addCycleMarkers(predictedStart, true)
    }
  }

  const logsByDate = new Map(logs.map((log) => [log.log_date, log]))

  return dates.map((date) => {
    const key = format(date, 'yyyy-MM-dd')
    return {
      date,
      isCurrentMonth: date >= monthStart && date <= monthEnd,
      isToday: isSameDay(date, new Date()),
      actualPeriod: actualPeriodDates.has(key),
      predictedPeriod: predictedPeriods.some((range) => containsDate(range, date)) && !actualPeriodDates.has(key),
      fertile: fertileRanges.some((range) => containsDate(range, date)) && !ovulationDates.has(key),
      ovulation: ovulationDates.has(key),
      log: logsByDate.get(key) ?? null,
    }
  })
}
