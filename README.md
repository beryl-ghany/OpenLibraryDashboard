# Web Development Project 5 - The Expedition Shelf

Submitted by: **Beryl Ghany**

**The Expedition Shelf** is a React dashboard that explores books from the Open Library API. The application presents a curated "expedition shelf" of books under subjects such as Adventure, Travel, Exploration, Sea Stories, and Mountaineering. Users can explore the collection through interactive summary statistics, live search, and multiple filters to discover interesting patterns within the catalog.

Time spent: **2.5** hours spent in total

---

## Required Features

The following **required** functionality is completed:

- [x] **The site has a dashboard displaying a list of data fetched using an API call**
  - [x] The dashboard displays over 100 unique books, one per row
  - [x] Each row includes multiple attributes such as title, author, publication year, edition count, and subject tags
- [x] **`useEffect` React hook and `async`/`await` are used**
- [x] **The app dashboard includes at least three summary statistics about the data**
  - [x] Total Volumes Catalogued
  - [x] Average Publication Year
  - [x] Best-Represented Decade
  - [x] Combined Editions in Print (Bonus)
- [x] **A search bar allows the user to search for an item in the fetched data**
  - [x] Results update dynamically while typing
  - [x] Only matching titles are displayed
- [x] **An additional filter allows the user to restrict displayed items by specified categories**
  - [x] Filter by publication era
  - [x] Filter by book themes
  - [x] Filter by minimum editions in print
  - [x] Results update instantly whenever filters change

---

## Optional Features

The following **optional** features are implemented:

- [x] Multiple filters can be applied simultaneously
- [x] Multiple filter input types
  - Dropdown menus
  - Range slider
  - Text search
- [x] Users can specify minimum edition counts using a slider

---

## Additional Features

The following **additional** features are implemented:

- [x] Subject switcher that reloads the dashboard using different Open Library subject collections
- [x] Automatically generated theme filter based on the current API response
- [x] Custom explorer-inspired interface with responsive layout
- [x] Dynamic summary statistics that recalculate whenever the subject changes

---

## Video Walkthrough

Here's a walkthrough of the implemented user stories:

<p align="center">
<a href="https://imgur.com/a/EG5rg0u">
<img src="https://i.imgur.com/EG5rg0u.gif" alt="Video Walkthrough" width="900">
</a>
</p>

**GIF Walkthrough:** https://imgur.com/a/EG5rg0u

GIF created with **ScreenToGif**

---

## Notes

Some challenges encountered while building this project included:

- The Open Library API does not always provide complete metadata. Some books are missing publication years, subjects, or edition counts, so the dashboard gracefully ignores missing values when calculating statistics.
- The theme filter is generated dynamically from the subjects returned by the API, ensuring users only see relevant filter options.
- Computing statistics such as the average publication year and most common decade required processing the fetched data before rendering the dashboard.
- Combining multiple filters while maintaining responsive performance required careful ordering of the filtering logic.

---

## Setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite in your browser.

---

## License

Copyright 2026 Beryl Ghany

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
