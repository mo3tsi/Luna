import { addDays, differenceInCalendarDays } from 'date-fns'

export interface CyclePrediction {
  cycleDay: number
  phase: 'period' | 'fertile' | 'ovulation' | 'follicular' | 'luteal'
  nextPeriodStart: Date
  fertileWindowStart: Date
  fertileWindowEnd: Date
  ovulationDate: Date
  daysUntilNextPeriod: number
}

/**
 * Predicts cycle phase and key dates from the most recent logged period start
 * date and the user's average cycle/period length. This is a simple, transparent
 * calendar-based estimate (the same method Flo and most trackers start from) —
 * it is NOT a medical diagnostic tool, and predictions naturally get less
 * accurate the more irregular a cycle is.
 */
export function predictCycle(
  lastPeriodStart: Date,
  averageCycleLength: number,
  averagePeriodLength: number,
  today: Date = new Date()
): CyclePrediction {
  const daySinceStart = differenceInCalendarDays(today, lastPeriodStart)
  const cycleDay = (daySinceStart % averageCycleLength) + 1

  const nextPeriodStart = addDays(lastPeriodStart, averageCycleLength)
  const ovulationDate = addDays(lastPeriodStart, averageCycleLength - 14)
  const fertileWindowStart = addDays(ovulationDate, -5)
  const fertileWindowEnd = addDays(ovulationDate, 1)

  let phase: CyclePrediction['phase'] = 'follicular'
  if (cycleDay <= averagePeriodLength) {
    phase = 'period'
  } else if (
    today >= fertileWindowStart &&
    today <= fertileWindowEnd &&
    differenceInCalendarDays(today, ovulationDate) !== 0
  ) {
    phase = 'fertile'
  } else if (differenceInCalendarDays(today, ovulationDate) === 0) {
    phase = 'ovulation'
  } else if (today > ovulationDate) {
    phase = 'luteal'
  }

  return {
    cycleDay,
    phase,
    nextPeriodStart,
    fertileWindowStart,
    fertileWindowEnd,
    ovulationDate,
    daysUntilNextPeriod: differenceInCalendarDays(nextPeriodStart, today),
  }
}

export const PHASE_LABELS: Record<CyclePrediction['phase'], string> = {
  period: 'Period',
  fertile: 'Fertile window',
  ovulation: 'Ovulation day',
  follicular: 'Follicular phase',
  luteal: 'Luteal phase',
}

export const PHASE_COLORS: Record<CyclePrediction['phase'], string> = {
  period: 'bg-rose-500',
  fertile: 'bg-sage-500',
  ovulation: 'bg-gold-500',
  follicular: 'bg-plum-700',
  luteal: 'bg-plum-800',
}
