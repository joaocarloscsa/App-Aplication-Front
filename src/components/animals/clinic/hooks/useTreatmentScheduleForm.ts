import { useMemo, useState } from "react";

export type Mode = "COUNT" | "UNTIL";

const MAX_COUNT = 365;
const MAX_TIMES_PER_DAY = 4;

/* =========================
 * Preview Types
 * ========================= */

type PreviewCount = {
  kind: "count";
  total: number;
  firstDates: string[];
  lastDate: string | null;
  endsAtIso: string;
};

type PreviewUntilMissing = {
  kind: "until_missing";
};

export type PreviewModel =
  | PreviewCount
  | PreviewUntilMissing;

/* ========================= */

function toLocalIso(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toISOString();
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function todayStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function nowDate(): Date {
  return new Date();
}

function combineDateAndTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export function useTreatmentScheduleForm() {
  const [startsAt, setStartsAt] = useState("");
  const [intervalInDays, setIntervalInDays] = useState(1);

  const [timesPerDay, setTimesPerDay] = useState(1);
  const [times, setTimes] = useState<string[]>(["08:00"]);

  const [mode, setMode] = useState<Mode>("COUNT");
  const [count, setCount] = useState(7);
  const [until, setUntil] = useState("");

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const [dosageAmount, setDosageAmount] = useState<number | "">("");
  const [strengthValue, setStrengthValue] = useState<number | "">("");
  const [strengthUnitPublicId, setStrengthUnitPublicId] = useState("");

  const [medicationName, setMedicationName] = useState("");
  const [notes, setNotes] = useState("");

  /* =========================
   * Datas base
   * ========================= */

  const startDateObj = useMemo(() => {
    if (!startsAt) return null;
    return new Date(`${startsAt}T00:00:00`);
  }, [startsAt]);

  const isRetroactive = useMemo(() => {
    if (!startDateObj) return false;
    return startDateObj < todayStart();
  }, [startDateObj]);

  const effectiveStartDate = useMemo(() => {
    if (!startDateObj) return null;

    const today = todayStart();
    return startDateObj > today ? startDateObj : today;
  }, [startDateObj]);

  /* =========================
   * Horário já passou?
   * ========================= */

  const hasFirstTimeAlreadyPassed = useMemo(() => {
    if (!effectiveStartDate) return false;

    const now = nowDate();

    // só importa se for hoje
    const isToday =
      effectiveStartDate.getFullYear() === now.getFullYear() &&
      effectiveStartDate.getMonth() === now.getMonth() &&
      effectiveStartDate.getDate() === now.getDate();

    if (!isToday) return false;

    const firstTime = times[0] ?? "08:00";
    const occurrence = combineDateAndTime(effectiveStartDate, firstTime);

    return occurrence < now;
  }, [effectiveStartDate, times]);

  /* =========================
   * Normalização de horários
   * ========================= */

  const safeTimesPerDay = Math.min(
    Math.max(timesPerDay, 1),
    MAX_TIMES_PER_DAY
  );

  const normalizedTimes = Array.from(
    { length: safeTimesPerDay },
    (_, i) => times[i] ?? "08:00"
  );

  /* =========================
   * Geração unificada de ocorrências
   * ========================= */

  const generateOccurrences = (): Date[] => {
    if (!effectiveStartDate) return [];

    const step = intervalInDays;
    const occurrences: Date[] = [];

    if (mode === "COUNT") {
      for (let i = 0; i < count; i++) {
        occurrences.push(addDays(effectiveStartDate, i * step));
      }
      return occurrences;
    }

    if (!until) return [];

    const untilDate = new Date(`${until}T00:00:00`);
    let current = new Date(effectiveStartDate);

    while (current <= untilDate) {
      occurrences.push(new Date(current));
      current = addDays(current, step);
    }

    return occurrences;
  };

  /* =========================
   * EndsAt
   * ========================= */

  const endsAt = useMemo<string | null>(() => {
    const occurrences = generateOccurrences();
    if (occurrences.length === 0) return null;
    return occurrences[occurrences.length - 1].toISOString();
  }, [effectiveStartDate, mode, count, until, intervalInDays]);

  /* =========================
   * Preview
   * ========================= */

  const previewModel = useMemo<PreviewModel>(() => {
    if (!effectiveStartDate) {
      return { kind: "until_missing" };
    }

    const occurrences = generateOccurrences();
    const total = occurrences.length;

    const firstDates = occurrences
      .slice(0, 3)
      .map((d) => d.toISOString());

    const lastDate =
      total > 3
        ? occurrences[total - 1].toISOString()
        : null;

    return {
      kind: "count",
      total,
      firstDates,
      lastDate,
      endsAtIso:
        total > 0
          ? occurrences[total - 1].toISOString()
          : effectiveStartDate.toISOString(),
    };
  }, [effectiveStartDate, mode, count, until, intervalInDays]);

  return {
    startsAt,
    setStartsAt,

    intervalInDays,
    setIntervalInDays,

    timesPerDay: safeTimesPerDay,
    setTimesPerDay,
    times: normalizedTimes,
    setTimes,

    mode,
    setMode,
    count,
    setCount,
    until,
    setUntil,

    selectedRoute,
    setSelectedRoute,
    selectedUnit,
    setSelectedUnit,

    dosageAmount,
    setDosageAmount,

    strengthValue,
    setStrengthValue,
    strengthUnitPublicId,
    setStrengthUnitPublicId,

    medicationName,
    setMedicationName,
    notes,
    setNotes,

    endsAt,
    previewModel,
    isRetroactive,
    hasFirstTimeAlreadyPassed,

    MAX_COUNT,
  };
}

export type TreatmentScheduleForm = ReturnType<
  typeof useTreatmentScheduleForm
>;