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

type PreviewUntil = {
  kind: "until";
  untilIso: string;
  dates: string[];
};

type PreviewUntilMissing = {
  kind: "until_missing";
};

export type PreviewModel =
  | PreviewCount
  | PreviewUntil
  | PreviewUntilMissing;

/* ========================= */

function toLocalIso(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toISOString();
}

function addDays(base: string, days: number): string {
  const d = new Date(`${base}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString();
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
   * EndsAt
   * ========================= */

  const endsAt = useMemo<string | null>(() => {
    if (!startsAt) return null;

    const step = intervalInDays;

    if (mode === "COUNT") {
      return addDays(startsAt, (count - 1) * step);
    }

    return until ? toLocalIso(until) : null;
  }, [startsAt, mode, count, until, intervalInDays]);

  /* =========================
   * Preview
   * ========================= */

  const previewModel = useMemo<PreviewModel>(() => {
    if (!startsAt) {
      return { kind: "until_missing" };
    }

    const step = intervalInDays;

    if (mode === "COUNT") {
      const total = count;
      const first = Math.min(total, 3);

      const firstDates: string[] = Array.from(
        { length: first },
        (_, i) => addDays(startsAt, i * step)
      );

      const lastDate =
        total > 3 ? addDays(startsAt, (total - 1) * step) : null;

      return {
        kind: "count",
        total,
        firstDates,
        lastDate,
        endsAtIso: addDays(startsAt, (total - 1) * step),
      };
    }

    if (!until) {
      return { kind: "until_missing" };
    }

    const untilIso = toLocalIso(until);
    const result: string[] = [];

    let current = new Date(`${startsAt}T00:00:00`);
    const end = new Date(untilIso);

    while (result.length < 5 && current <= end) {
      result.push(current.toISOString());
      current.setDate(current.getDate() + step);
    }

    return {
      kind: "until",
      untilIso,
      dates: result,
    };
  }, [startsAt, mode, count, until, intervalInDays]);

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

    MAX_COUNT,
  };
}

export type TreatmentScheduleForm = ReturnType<
  typeof useTreatmentScheduleForm
>;