# The Expedition Shelf

Submitted by: Beryl Ghany

**The Expedition Shelf** is an app that displays a data dashboard of books
catalogued under a chosen subject heading (Adventure, Travel, Exploration,
Sea Stories, Mountaineering) pulled live from the Open Library API. It
surfaces summary statistics about the shelf and lets the user search and
filter down to individual titles.

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] The site has a dashboard displaying a list of data fetched using an API call
- [x] The dashboard should display at least 10 unique items, one per row
- [x] The dashboard includes at least two features in each row (author, publish year/decade, edition count, theme tags)
- [x] The `useEffect()` React hook and async/await syntax are used
- [x] The app dashboard includes at least three summary statistics about the data
  - [x] Total volumes catalogued (count)
  - [x] Average publication year (mean of `first_publish_year`)
  - [x] Best-represented decade (mode of publication decade)
  - [x] (bonus 4th) Combined editions in print (sum of `edition_count`)
- [x] A search bar allows the user to search for an item in the fetched data
- [x] The search bar correctly filters items in the list, only displaying items matching the search query
- [x] The list of results dynamically updates as the user types into the search bar
- [x] An additional filter allows the user to restrict displayed items by specified categories (era / decade)
- [x] The filter restricts items in the list using a different attribute than the search bar
- [x] The filter correctly filters items in the list, only displaying items matching the filter attribute in the dashboard
- [x] The dashboard list dynamically updates as the user adjusts the filter

The following **optional** features are implemented:

- [x] Multiple filters can be applied simultaneously (era + theme + min. editions, all combine)
- [x] Filters use different input types (dropdown for era, dropdown for theme, range slider for min. editions)
- [x] User can enter specific bounds for filter values (editions-in-print slider)

The following **additional** features are implemented:

- [x] A subject switcher lets the user re-run the whole dashboard against a different Open Library subject heading without leaving the page

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<!-- Replace this line with a GIF walkthrough of your app. Tools like Kap, ScreenToGif, or LiceCap can help you record one. -->

GIF created with ...

## Notes

Describe any challenges encountered while building the app, e.g.:

- Some `first_publish_year` and `subject` values are missing on individual
  Open Library works, so stats and filters were written to gracefully skip
  or bucket around nulls rather than break.
- The theme dropdown is generated dynamically from the top tags actually
  present in the current subject's results, so it never shows an empty
  or irrelevant option.

## License

    Copyright [yyyy] [name of copyright owner]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

## Setup

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in your terminal.
