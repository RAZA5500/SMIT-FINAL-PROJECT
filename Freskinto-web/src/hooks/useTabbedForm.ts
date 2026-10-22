"use client";

import { useCallback, useState } from "react";
import { get, type FieldErrors, type FieldPath, type FieldValues, type UseFormTrigger } from "react-hook-form";

interface UseTabbedFormOptions<TTab extends string, TValues extends FieldValues> {
  tabs: readonly TTab[];
  /** Har tab ke fields — aage jaane se pehle `trigger(TAB_FIELDS[tab])` (FLOW-MD 07 §6) */
  tabFields: Record<TTab, readonly FieldPath<TValues>[]>;
  trigger: UseFormTrigger<TValues>;
}

/**
 * Multi-step / tabbed forms ka validation guard. Tab header click ya "Next" — peeche
 * jana free hai, aage jane se pehle har beech wala tab validate hota hai. Header click
 * kabhi active tab ki validation bypass nahi kar sakta.
 */
export function useTabbedForm<TTab extends string, TValues extends FieldValues>({
  tabs,
  tabFields,
  trigger,
}: UseTabbedFormOptions<TTab, TValues>) {
  const [tab, setTab] = useState<TTab>(tabs[0]);
  const index = tabs.indexOf(tab);

  const goTo = useCallback(
    async (target: TTab): Promise<boolean> => {
      const targetIndex = tabs.indexOf(target);
      const currentIndex = tabs.indexOf(tab);
      if (targetIndex <= currentIndex) {
        setTab(target);
        return true;
      }
      for (let i = currentIndex; i < targetIndex; i += 1) {
        const key = tabs[i];
        const fields = tabFields[key];
        if (fields.length === 0) continue;
        const valid = await trigger(fields as FieldPath<TValues>[], { shouldFocus: true });
        if (!valid) {
          setTab(key);
          return false;
        }
      }
      setTab(target);
      return true;
    },
    [tab, tabs, tabFields, trigger],
  );

  /** Final submit invalid ho to pehla ghalat tab khol do (scrollToFirstError uske baad) */
  const showFirstInvalidTab = useCallback(
    (errors: FieldErrors<TValues>): TTab | undefined => {
      const invalid = tabs.find((key) => tabFields[key].some((field) => Boolean(get(errors, field))));
      if (invalid) setTab(invalid);
      return invalid;
    },
    [tabs, tabFields],
  );

  return {
    tab,
    index,
    tabs,
    isFirst: index === 0,
    isLast: index === tabs.length - 1,
    goTo,
    next: () => goTo(tabs[Math.min(index + 1, tabs.length - 1)]),
    previous: () => goTo(tabs[Math.max(index - 1, 0)]),
    showFirstInvalidTab,
  };
}
