# Sewadal on Duty

A small phone-friendly board that answers one question: how many sewadal of each
trade are with us on a given date, and what are their phone numbers.

The Google Sheet stays the only place data is entered. Nothing is copied or
stored anywhere else.

    index.html     the whole board (no build step)
    api/sheet.js   reads the published sheet on the server, returns CSV

## How the data flows

    browser -> /api/sheet -> the published Google Sheet -> counted in the browser

Someone counts as with us on a date when DOA is on or before that date and DOD
is blank or on or after it. A blank DOD means still with us.

## Keeping it working

- The sheet must stay published (File -> Share -> Publish to web). Sharing
  permissions are a separate setting; publishing must stay on.
- Google's published copy lags edits by about a minute.
- Column headings are matched automatically (Name, Unit, Mobile No., Trade,
  DOA, DOD), so adding columns to the sheet is safe. Renaming those six is not.

## Pointing it at a different sheet or tab

Set SHEET_PUBLISH_ID and SHEET_GID in Vercel -> Settings -> Environment
Variables. Otherwise the defaults in api/sheet.js are used.
