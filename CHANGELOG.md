# Changelog

## v27.2.2 (November 28, 2024)

We are excited to announce the addition of four new components in this release, enhancing the capabilities of PowerApps with even more flexibility and functionality.

### Added Components

- [Gantt](components/gantt) `Preview`: A Gantt component for visualizing project timelines and tasks in a Gantt chart format.
- [FileManager](components/filemanager) `Preview`: A FileManager component for navigating and managing files and folders in a hierarchical view, supporting features like file and folder viewing, searching, and organizing etc.
- [Spreadsheet](components/spreadsheet) `Preview`: A spreadsheet component for viewing spreadsheet data, allowing users to navigate and analyze data in a grid format.
- [Kanban](components/kanban) `Preview`: A kanban component for visualizing and organizing work in progress through customizable boards, columns, and cards.

### Improvements

- **Dark Mode Support**: Dark mode support across all components to improve accessibility and user experience.
- **Adaptive UI**: Components now automatically adjust layouts based on device type (`formfactor`) for optimized display across devices for supported code components.
- **Enhanced Automation**: Organized automation scripts into a structured `gulp-tasks` folder, introducing new options for creating managed/unmanaged solutions, selective component packaging, and an `npm run clean` command for clearing the cache.

### Documentation Updates

- **PDF Viewer Guide**: Added instructions on loading PDFs from Dataverse into the pdfviewer using PowerAutomate within Canvas applications. [Link](./docs/pdfviewer/how-to-load-dataverse-file-in-pdfviewer.md)

## v27.1.48 (October 21, 2024)

We are excited to announce the initial release of the **Syncfusion PowerApps Code Components** library. This version includes the following components:

### Added Components

- [Grid](components/grids) `Preview`:  A powerful data grid component for displaying and manipulating tabular data.
- [Chart](components/charts) `Preview`: An interactive charting component for visualizing data through various chart types.
- [Schedule](components/schedule) `Preview`: A scheduling component for managing appointments and events.
- [PdfViewer](components/pdfviewer) `Preview`: A component for viewing and interacting with PDF documents within your applications.
- [PivotView](components/pivotview) `Preview`: A pivot table component for summarizing and analyzing data dynamically.

### What's Changed

- Initial release of the Syncfusion PowerApps Code Components library in <https://github.com/syncfusion/ej2-powerapps-components/pull/1>
