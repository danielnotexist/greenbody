# GreenBody exercise media — generation run book

This folder produces GreenBody's own exercise illustrations: one START frame and one END
frame for each of the 1,324 exercises, drawn with our own character (`character.png`), so the
app no longer depends on third-party exercise media. The two frames are shown as a looping
animation in the app.

**This file is written for Claude Code running on the owner's computer.** It drives Google
Flow in the owner's own Chrome, one prompt at a time, saves every result here, and hands the
results back for review. Work slowly and steadily; it is fine for a day's run to take hours.

## What is here

| Path | What it is |
|---|---|
| `character.png` | The GreenBody character reference sheet. Attach it to **every** prompt. |
| `prompts/day-1.json` … `day-5.json` | The prompts, one file per day (about 64–75 prompts each). Each entry: `code` (e.g. `B1-001`), `exercises` (the 4 exercises it draws, in row order), `prompt` (the exact text to paste). |
| `progress.json` | Your log of what is done (create it on first run). |
| `raw/` | Downloaded images, one per prompt, named `<code>.png`. **Never commit this folder.** |
| `tools/process.py` | Cuts the images into frames and builds review sheets. |
| `out/start/<id>.webp`, `out/end/<id>.webp` | The finished frames (committed). |
| `review/day-N-XX.jpg` | Review sheets (committed) — four prompt images per sheet with the expected exercises listed. |

## One-time setup

1. **Browser control.** Use Claude in Chrome (the browser extension) so you work in the owner's real Chrome, where they are already signed in to Google. If the extension is not available, stop and ask the owner to install and enable it. Never type a password or sign in for the owner — if Google asks for a sign-in, stop and ask them.
2. **Python.** `python3 -m pip install Pillow` (needed by `tools/process.py`).
3. **Google Flow.** Open https://labs.google/fx/tools/flow and open (or create) a project named `GreenBody media`. In the image-generation settings:
   - Model: **Nano Banana Pro**
   - Aspect ratio: **9:16** (portrait)
   - Number of outputs: **x1**
   - Approval before generating: **Never** (otherwise approve each generation yourself).
4. Upload `media-gen/character.png` into the project once, so you can attach it from the project's assets for every prompt instead of uploading it 300 times.

## The run (one day = one `prompts/day-N.json`)

The owner tells you which day to run. For each entry of `prompts/day-N.json`, in order, skipping codes that `progress.json` already marks `done`:

1. **New generation** in Flow. Attach the character image as the reference image.
2. **Paste the entry's `prompt` exactly** (do not edit, shorten or translate it) and start the generation.
3. **Wait** for it to finish (check every ~15 seconds, give up after 5 minutes and retry once).
4. **Check the result before saving:**
   - it is a grid of N rows × 2 columns, where N = number of `exercises` in the entry;
   - the small grey code under the grid matches the entry's `code`;
   - it is the same character (shirtless, grey skin, black shorts with green "GreenBody" waistband).
   If any of these fail, regenerate once. If it fails again, save it anyway and mark it `needs-review` in `progress.json`.
5. **Download the full-resolution image** and move it to `media-gen/raw/<code>.png` (use `.jpg`/`.webp` if that is what Flow gives you — keep the code as the file name).
6. **Log it** in `media-gen/progress.json`:
   ```json
   { "B1-001": { "status": "done", "file": "raw/B1-001.png", "attempts": 1, "at": "2026-10-31T09:12:00" } }
   ```
   Save `progress.json` after every prompt, so a crash or restart resumes where it stopped.
7. **Pause 20–40 seconds** before the next prompt. If Flow reports that credits or a daily limit ran out, stop, write it in `progress.json`, and tell the owner how many prompts were finished.

## When the day's images are all downloaded

```sh
python3 media-gen/tools/process.py N        # N = the day number
```

It prints how many exercises were written and which codes are still missing. Then commit and push **only** these (never `raw/`):

```sh
git checkout -b media/day-N
git add media-gen/out media-gen/review media-gen/progress.json
git commit -m "Exercise media: day N"
git push -u origin media/day-N
```

Open a pull request into `main` titled `Exercise media: day N` and tell the owner it is ready
for review. Do not merge it yourself — the review checks every drawing against its exercise
and lists any codes to regenerate. To regenerate a code: delete `raw/<code>.*`, set its
`progress.json` status to `redo`, run it again, re-run `process.py N`, and push to the same branch.

## Rules

- Change nothing outside `media-gen/` (and the branch/PR above).
- Keep prompts exactly as written.
- One generation at a time; never run several Flow tabs in parallel.
- If anything in Flow's interface looks different from this description, adapt carefully, and if you are unsure, stop and ask the owner rather than guessing.
