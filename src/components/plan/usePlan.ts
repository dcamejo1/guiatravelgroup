"use client";

import { useEffect, useReducer } from "react";
import {
  DEFAULT_NIGHTS,
  MAX_TRAVELERS,
  addSelection,
  emptyDraft,
  removeSelection,
} from "@/lib/pricing/engine";
import type { CatalogItem, Locale, QuoteDraft } from "@/lib/types";

export const STEPS = [
  "group",
  "where",
  "what",
  "transport",
  "extras",
  "review",
] as const;
export type StepId = (typeof STEPS)[number];

const STORAGE_KEY = "gtg.plan.v1";
const MAX_NIGHTS = 30;

export interface PlanState {
  draft: QuoteDraft;
  step: number;
  /** Furthest step reached, so earlier and visited steps stay clickable. */
  maxStep: number;
  /** False until the saved draft and URL have been read on the client. */
  ready: boolean;
}

/** What a link such as `/plan?destination=los-roques&package=…` asks to add. */
export interface Prefill {
  destinationId?: string;
  items: CatalogItem[];
}

type Action =
  | {
      type: "hydrate";
      saved: Partial<PlanState> | null;
      prefill: Prefill;
      locale: Locale;
      catalog: CatalogItem[];
    }
  | { type: "patch"; draft: Partial<QuoteDraft> }
  | { type: "toggleDestination"; id: string }
  | { type: "nights"; id: string; nights: number }
  | {
      type: "add";
      item: CatalogItem;
      destinationId?: string;
      catalog: CatalogItem[];
    }
  | { type: "remove"; itemId: string; destinationId?: string }
  | {
      type: "update";
      itemId: string;
      destinationId?: string;
      change: { quantity?: number; participants?: number };
    }
  | { type: "step"; step: number }
  | { type: "reset"; locale: Locale };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value) || min));

function withDestination(draft: QuoteDraft, id: string): QuoteDraft {
  if (draft.destinationIds.includes(id)) return draft;
  return {
    ...draft,
    destinationIds: [...draft.destinationIds, id],
    nightsByDestination: {
      ...draft.nightsByDestination,
      [id]: draft.nightsByDestination[id] ?? DEFAULT_NIGHTS,
    },
  };
}

/** Keeps the group within 1–MAX_TRAVELERS with at least one adult. */
function normalizeTravelers(t: QuoteDraft["travelers"]) {
  const adults = clamp(t.adults, 1, MAX_TRAVELERS);
  const children = clamp(t.children, 0, MAX_TRAVELERS - adults);
  return { adults, children };
}

function reducer(state: PlanState, action: Action): PlanState {
  const { draft } = state;
  switch (action.type) {
    case "hydrate": {
      const saved = action.saved;
      let next: QuoteDraft = {
        ...emptyDraft(action.locale),
        ...(saved?.draft ?? {}),
        locale: action.locale,
      };
      // URL parameters are merged into the saved draft; they never wipe it.
      const { destinationId, items } = action.prefill;
      if (destinationId) next = withDestination(next, destinationId);
      for (const item of items) {
        const under = item.destinationIds.length ? destinationId : undefined;
        if (item.destinationIds.length && !under) continue;
        next = addSelection(next, item, under, action.catalog);
      }
      const maxStep = clamp(saved?.maxStep ?? 0, 0, STEPS.length - 1);
      const returning = maxStep > 0;
      const step =
        items.length && returning
          ? STEPS.indexOf("what")
          : clamp(saved?.step ?? 0, 0, maxStep);
      return {
        draft: next,
        step,
        maxStep: Math.max(maxStep, step),
        ready: true,
      };
    }
    case "patch": {
      const merged = { ...draft, ...action.draft };
      return {
        ...state,
        draft: { ...merged, travelers: normalizeTravelers(merged.travelers) },
      };
    }
    case "toggleDestination": {
      if (!draft.destinationIds.includes(action.id)) {
        return { ...state, draft: withDestination(draft, action.id) };
      }
      return {
        ...state,
        draft: {
          ...draft,
          destinationIds: draft.destinationIds.filter((id) => id !== action.id),
          selections: draft.selections.filter(
            (s) => s.destinationId !== action.id,
          ),
        },
      };
    }
    case "nights":
      return {
        ...state,
        draft: {
          ...draft,
          nightsByDestination: {
            ...draft.nightsByDestination,
            [action.id]: clamp(action.nights, 1, MAX_NIGHTS),
          },
        },
      };
    case "add":
      return {
        ...state,
        draft: addSelection(
          draft,
          action.item,
          action.destinationId,
          action.catalog,
        ),
      };
    case "remove":
      return {
        ...state,
        draft: removeSelection(draft, action.itemId, action.destinationId),
      };
    case "update":
      return {
        ...state,
        draft: {
          ...draft,
          selections: draft.selections.map((s) =>
            s.itemId === action.itemId &&
            s.destinationId === action.destinationId
              ? { ...s, ...action.change }
              : s,
          ),
        },
      };
    case "step": {
      const step = clamp(action.step, 0, STEPS.length - 1);
      return { ...state, step, maxStep: Math.max(state.maxStep, step) };
    }
    case "reset":
      return {
        draft: emptyDraft(action.locale),
        step: 0,
        maxStep: 0,
        ready: true,
      };
  }
}

function readSaved(): Partial<PlanState> | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { draft, step, maxStep } = parsed as Partial<PlanState>;
    if (
      !draft ||
      !Array.isArray(draft.selections) ||
      !Array.isArray(draft.destinationIds)
    )
      return null;
    return { draft, step, maxStep };
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): start fresh.
    return null;
  }
}

/**
 * The builder's state: the draft trip and the current step. The draft is kept
 * in sessionStorage so a refresh or a visit to another page does not lose it.
 */
export function usePlan(opts: {
  locale: Locale;
  catalog: CatalogItem[];
  /** Read once, on mount. */
  getPrefill: () => Prefill;
  onPrefillApplied: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, {
    draft: emptyDraft(opts.locale),
    step: 0,
    maxStep: 0,
    ready: false,
  });

  useEffect(() => {
    dispatch({
      type: "hydrate",
      saved: readSaved(),
      prefill: opts.getPrefill(),
      locale: opts.locale,
      catalog: opts.catalog,
    });
    opts.onPrefillApplied();
    // Runs once: the draft is loaded a single time per visit to the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          draft: state.draft,
          step: state.step,
          maxStep: state.maxStep,
        }),
      );
    } catch {
      /* Not being able to save is not worth interrupting the visitor for. */
    }
  }, [state]);

  return [state, dispatch] as const;
}

export type PlanDispatch = ReturnType<typeof usePlan>[1];
