# The Expedition Shelf — Part 2

Submitted by: Beryl Ghany

**The Expedition Shelf** is a data dashboard of books catalogued under a
chosen subject heading (Adventure, Travel, Exploration, Sea Stories,
Mountaineering), pulled live from the Open Library API. Part 2 adds two
charts to the dashboard, a routed detail view per book with extra
information, and a shared sidebar across both views.

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] Clicking on an item in the list view displays more details about it
- [x] Clicking on an item in the dashboard list navigates to the detail view for that item
- [x] Detail view includes extra information not included in the dashboard view (full description, publishers on record, languages printed in, earliest edition found, complete theme list, link to Open Library)
- [x] The same sidebar is displayed in detail view as in dashboard view
- [x] Each detail view of an item has a direct, unique link to that item's page (`/book/:olid`)
- [x] The app includes at least two unique charts developed using the fetched data that tell an interesting story
  - [x] Chart 1: Volumes surfacing by decade (bar) / running total across decades (line)
  - [x] Chart 2: Leading themes on the shelf (horizontal bar of top tag frequency)
- [x] At least two charts are incorporated into the dashboard view of the site
- [x] Each chart describes a different aspect of the dataset (publication era vs. subject/theme distribution)

The following **optional** features are implemented:

- [x] The site's customized dashboard contains more content that explains what is interesting about the data (annotation line under each chart calling out the busiest decade / leading theme)
- [x] The site allows users to toggle between different data visualizations (decade chart toggles between a bar view and a cumulative line view)

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<!-- Replace this line with a GIF walkthrough of your app. Tools like Kap, ScreenToGif, or LiceCap can help you record one. -->

GIF created with ...

## Notes

Describe any challenges encountered while building the app, e.g.:

- The Open Library subject endpoint (used for the dashboard list) and the
  work endpoint (used for the detail view) return different shapes, so the
  detail page re-fetches from `/works/{id}.json` plus `/works/{id}/editions.json`
  rather than relying on the summary data already in the list.
- `description` on a work can come back as either a plain string or an
  object with a `value` field, so it's normalized before rendering.
- React Router's `useLocation().state` is used to pass along which subject
  heading a book was clicked from, so the back link returns to the right
  shelf.

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
