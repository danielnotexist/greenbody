# העלאת GreenBody ל-App Store — מדריך צעד-אחר-צעד

המדריך הזה לוקח את הקוד שבריפו ומביא אותו עד "Submit for Review". הכול כבר מוכן בפרויקט:
מזהה האפליקציה, השם, האייקונים, מסך הפתיחה, העברית, קובץ הפרטיות, הגדרת ההצפנה וצילומי
המסך. נשאר לבנות על ה-Mac ולמלא את הטפסים ב-App Store Connect.

הטקסטים להדבקה (תיאור, מילות חיפוש, הערות לבודקים וכו׳) נמצאים ב-[`store/listing.md`](../store/listing.md),
וצילומי המסך ב-`store/screenshots/`.

---

## שלב 0 — לפני הכול: הריפו חייב להיות ציבורי

GreenBody בנוי על openGym, שמופץ ברישיון AGPL. היוצר נתן אישור מפורש להפיץ את האפליקציה
בחנויות ([NOTICE.md](../NOTICE.md)), **בתנאי שקוד המקור זמין לכולם**. לכן:

GitHub ← הריפו `nircohen` ← **Settings** ← למטה **Danger Zone** ← **Change visibility** ← **Public**.

זה גם מה שהופך את קישור מדיניות הפרטיות לנגיש — Apple בודקת שהוא נפתח.

## שלב 1 — התקנות על ה-Mac (פעם אחת)

1. **Xcode** מה-App Store (גרסה 16 ומעלה), ואז לפתוח אותו פעם אחת ולאשר את ההתקנות הנוספות.
2. **Node.js 22** מ-https://nodejs.org (הגרסה ה-LTS).
3. **CocoaPods** — בטרמינל:
   ```sh
   brew install cocoapods
   ```
   (אם אין Homebrew: https://brew.sh)
4. **התחברות לחשבון המפתחים ב-Xcode:** Xcode ← Settings ← Accounts ← `+` ← Apple ID.

## שלב 2 — להוריד את הקוד ולבנות

בטרמינל:

```sh
git clone https://github.com/danielnotexist404/nircohen.git greenbody
cd greenbody/frontend
npm ci
npm run build:mobile
npx cap open ios
```

`build:mobile` בונה את האפליקציה בגרסת הטלפון (בלי שרת — הכול נשמר במכשיר) ומעתיק אותה
לפרויקט ה-iPhone. **אחרי כל שינוי בקוד מריצים אותו שוב** לפני שבונים ב-Xcode.

הפקודה האחרונה פותחת את Xcode.

## שלב 3 — להגדיר חתימה ב-Xcode

1. בעמודה השמאלית לוחצים על **App** (האייקון הכחול למעלה), ואז על ה-target **App**.
2. לשונית **Signing & Capabilities**:
   - לסמן **Automatically manage signing**.
   - **Team:** לבחור את חשבון המפתחים שלך.
   - **Bundle Identifier:** `com.nircohen.greenbody` (כבר מוגדר). אם תרצה מזהה אחר — זה
     המקום היחיד לשנות, ואז לעדכן גם ב-`frontend/capacitor.config.json` וב-`store/listing.md`.
3. אם Xcode מציג שגיאה אדומה על ה-Bundle ID — לחכות כמה שניות; עם חתימה אוטומטית הוא רושם
   אותו בעצמו בחשבון.

**לבדוק על הטלפון (מומלץ):** לחבר את ה-iPhone בכבל, לבחור אותו למעלה ברשימת המכשירים,
וללחוץ ▶. בפעם הראשונה צריך באייפון: הגדרות ← פרטיות ואבטחה ← מצב מפתח (Developer Mode).

## שלב 4 — ליצור את האפליקציה ב-App Store Connect

1. https://appstoreconnect.apple.com ← **Apps** ← `+` ← **New App**.
2. ממלאים:
   - **Platforms:** iOS
   - **Name:** `GreenBody - אימונים`
   - **Primary Language:** Hebrew
   - **Bundle ID:** `com.nircohen.greenbody` (מופיע ברשימה אחרי שלב 3)
   - **SKU:** `greenbody` (מזהה פנימי, לא מוצג לאף אחד)
   - **User Access:** Full Access

## שלב 5 — לבנות ולשלוח את הגרסה

ב-Xcode:

1. למעלה, ברשימת המכשירים, לבחור **Any iOS Device (arm64)**.
2. תפריט **Product ← Archive**. לוקח כמה דקות.
3. בחלון **Organizer** שנפתח: **Distribute App ← App Store Connect ← Distribute**.
4. אחרי 10–30 דקות הגרסה מופיעה ב-App Store Connect בלשונית **TestFlight**.
   אפשר להתקין אותה מאפליקציית TestFlight על הטלפון ולבדוק לפני שמגישים.

**כל עדכון עתידי:** להעלות את המספר ב-Xcode ← target App ← General ← **Version** (למשל 1.0.1)
או לפחות את **Build** (2, 3…), ואז שוב Archive.

## שלב 6 — דף החנות

ב-App Store Connect ← האפליקציה ← גרסה **1.0 Prepare for Submission**. מעתיקים מ-[`store/listing.md`](../store/listing.md):

- **Screenshots** ← iPhone 6.9" Display: גוררים את 6 הקבצים מ-`store/screenshots/` לפי הסדר.
- **Promotional Text, Description, Keywords, Support URL**.
- **Build:** לבחור את הגרסה שהועלתה בשלב 5.
- **App Review Information:** לבטל את הסימון של Sign-in required, ולהדביק את ה-Notes.

בלשונית **App Information:** Subtitle, Category (Health & Fitness), Privacy Policy URL.

בלשונית **App Privacy:** Get Started ← **No, we do not collect data from this app**.

בלשונית **Pricing and Availability:** Free, ולבחור מדינות (או את כולן).

**Age Rating:** למלא את השאלון — כל התשובות "None"/"No" ← 4+.

## שלב 7 — הגשה

**Add for Review ← Submit to App Review.** בדרך כלל התשובה מגיעה תוך יום-יומיים.
אם Apple מחזירה הערות, הן מופיעות ב-App Store Connect ← **App Review** — תעביר לי ונתקן.

---

## מה כבר הוגדר בפרויקט (לידיעה)

| מה | איפה |
|---|---|
| שם על מסך הבית: GreenBody | `frontend/ios/App/App/Info.plist` |
| מזהה: `com.nircohen.greenbody` | `frontend/ios/App/App.xcodeproj/project.pbxproj`, `frontend/capacitor.config.json` |
| שפת פיתוח: עברית, ורשימת 13 השפות | `Info.plist`, `project.pbxproj` |
| "לא משתמשת בהצפנה" (חוסך שאלה בכל העלאה) | `Info.plist` ← `ITSAppUsesNonExemptEncryption` |
| קובץ הפרטיות ש-Apple דורשת | `frontend/ios/App/App/PrivacyInfo.xcprivacy` |
| iPhone בלבד, לאורך בלבד (לא צריך צילומי מסך לאייפד) | `project.pbxproj`, `Info.plist` |
| אייקונים ומסך פתיחה ירוקים | `frontend/ios/App/App/Assets.xcassets` |
| גרסה 1.0, build 1 | `project.pbxproj` |

## כשמשהו לא עובד

- **`pod install` נכשל / Xcode מתלונן על Pods:** בטרמינל, מתוך `frontend/ios/App`, להריץ `pod install`, ואז לפתוח את `App.xcworkspace` (לא `App.xcodeproj`).
- **"No accounts with App Store Connect access":** שלב 1.4 — להתחבר לחשבון ב-Xcode.
- **"Bundle ID already in use":** המזהה תפוס בחשבון אחר — לבחור מזהה אחר (שלב 3).
- **התמונות של התרגילים לא נטענות:** הן נטענות מהאינטרנט (cdn.jsdelivr.net) — לבדוק חיבור.
