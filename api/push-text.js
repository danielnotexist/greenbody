/* Push-notification wording. The server sends these while no browser is open, so they can't
   go through the app's i18n — each profile's language comes from its synced state instead.
   English is the fallback for any language without an entry here. */

const TEXT = {
  en: {
    restTitle: 'Rest over 💪',
    restBody: 'Time for your next set.',
    testBody: 'Test notification ✅ — this is what alerts look like.',
    dayTitle: name => `${name} today`,
    dayTitlePlain: 'Workout planned today',
    dayBody: "It's on your plan — let's go 💪",
    coachTitle: 'Your Coach has been reading',
    coachBody: n => n === 1 ? '1 suggestion after this week' : `${n} suggestions after this week`
  },
  he: {
    restTitle: 'המנוחה נגמרה 💪',
    restBody: 'הגיע הזמן לסט הבא.',
    testBody: 'התראת בדיקה ✅ — ככה נראות ההתראות.',
    dayTitle: name => `${name} היום`,
    dayTitlePlain: 'יש אימון מתוכנן היום',
    dayBody: 'זה בתוכנית שלך — יאללה 💪',
    coachTitle: 'המאמן עבר על האימונים שלך',
    coachBody: n => n === 1 ? 'הצעה אחת אחרי השבוע הזה' : `${n} הצעות אחרי השבוע הזה`
  }
};

export const APP_NAME = 'GreenBody';

/** The wording for a profile, by the language saved in its state (null state → Hebrew). */
export function pushText(state) {
  const lang = state ? state.lang : 'he';
  return TEXT[lang] || TEXT.en;
}
