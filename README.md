# Web Development Project 6 - *The Expedition Shelf*

Submitted by: **Beryl Ghany**

This web app: **a data dashboard of adventure, travel, and exploration books pulled live from the Open Library API.** Users browse volumes under a chosen subject heading, explore two charts about publication era and leading themes, and open a routed detail page for each book with extra bibliographic info.

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view (full description, publishers, languages, earliest edition year, full theme list, and a link to Open Library)
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [x] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  - Each book uses a unique route: `/book/:olid`
  - *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [x] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset
  - Chart 1: Volumes surfacing by decade (bar) / running total across decades (line)
  - Chart 2: Leading themes on the shelf (horizontal bar of top tag frequency)

The following **optional** features are implemented:

- [x] The site’s customized dashboard contains more content that explains what is interesting about the data
  - Stats row (volumes, average year, busiest decade, total editions) plus annotation lines under each chart calling out the busiest decade and leading theme
- [x] The site allows users to toggle between different data visualizations
  - Decade chart toggles between a bar view (“By decade”) and a cumulative line view (“Running total”)

The following **additional** features are implemented:

* [x] Switch subject headings from the sidebar (Adventure, Travel, Exploration, Sea Stories, Mountaineering) to refetch and rescope the shelf
* [x] Search / filter controls on the dashboard list to narrow the visible volumes
* [x] Detail page re-fetches work + editions data from Open Library for richer fields than the list summary

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace the img src above with your hosted GIF URL after you record it! -->
GIF created with ScreenToGif
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

- The Open Library subject endpoint (used for the dashboard list) and the work endpoint (used for the detail view) return different shapes, so the detail page re-fetches from `/works/{id}.json` plus `/works/{id}/editions.json` rather than relying on the summary data already in the list.
- `description` on a work can come back as either a plain string or an object with a `value` field, so it's normalized before rendering.
- React Router's `useLocation().state` is used to pass along which subject heading a book was clicked from, so the back link returns to the right shelf.

## License

    Copyright 2026 Beryl Ghany

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
