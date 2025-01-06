# Changelog

## v28.1.33 (January 06, 2025)

We are excited to announce the addition of three new components in this release, bringing enhanced functionality and versatility to PowerApps. This release also includes improvements to existing components and updated documentation to streamline your integration processes.

### Added Components

- [RichTextEditor](components/richtexteditor) `Preview`: A rich text editor component that allows users to format text, insert images, and create lists, enhancing the text input experience. It supports rich text formatting options, making it ideal for applications that require enhanced text input capabilities.
- [TreeGrid](components/treegrid) `Preview`: A versatile tree grid component that allows for hierarchical data representation, enabling users to display and interact with complex data structures in a tree format.
- [Accordion](components/accordion) `Preview`: A Accordion component designed to organize and display content within collapsible panels. The Accordion is ideal for creating a clean and structured UI, allowing users to navigate through sections of content efficiently.

### Improvements

- **FileManager SharePoint Integration in Model-Driven Apps**: Introduced support for loading SharePoint documents into the FileManager component within Model-Driven applications, enhancing document management capabilities.
- **Auto Type for Chart Primary X-Axis**: Added support for automatically determining the default Primary X-Axis type based on the `xName` property of the chart series when the "Auto" type is selected for the `PrimaryXAxisType` property.
- **Updated PCF Projects Dependency Versions**: Updated dependency versions across all PCF project `package.json` files to ensure compatibility, improve stability, and streamline integration.
- **Performance Improvement**: Introduced workspace support in the PowerApps repository, consolidating multiple PCF code components. This reduced npm installation size and time by 75%, streamlining the build process.

### Documentation Updates

- **FileManager Guide**: Added comprehensive instructions for loading SharePoint documents into the FileManager component in Model-Driven applications. [Link](./docs/filemanager/how-to-load-sharepoint-document-in-filemanager.md)
- Moved code component markdown files to respective PCF README files, formatted documentation, and resolved linting issues.

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
