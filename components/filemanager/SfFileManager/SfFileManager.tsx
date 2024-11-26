import {
  FileManagerComponent,
  Inject,
  BreadCrumbBar,
  Virtualization,
  LargeIconsView,
  DetailsView,
  Toolbar,
  NavigationPane,
  ContextMenu
} from "@syncfusion/ej2-react-filemanager";
import * as React from "react";
import "./styles/theme.css";
import { ISfFileManager } from "./types";

/**
 * Renders SfFileManager component.
 *
 * @param {ISfFileManager} props - The props for the FileManager component.
 * @returns {JSX.Element} - The rendered FileManager component.
 */
export const SfFileManagerComponent: React.FC<ISfFileManager> = React.memo((props: ISfFileManager) => {

  const filemanagerRef = React.useRef<FileManagerComponent>(null);

  return (
    <>
      {props.fileSystemData.length > 0 && (
        <FileManagerComponent
          ref={filemanagerRef}
          width={props.width}
          height={props.height}
          enableRtl={props.enableRtl}
          fileSystemData={props.fileSystemData}
          contextMenuSettings={{
            file: props.fileManagerConfig?.contextMenuSettings?.file?.filter(option => ["Open", "|", "Details"].includes(option)) || ["Open", "|", "Details"],
            folder: props.fileManagerConfig?.contextMenuSettings?.folder?.filter(option => ["Open", "|", "Details"].includes(option)) || ["Open", "|", "Details"],
            layout: props.fileManagerConfig?.contextMenuSettings?.layout?.filter(option => ["SortBy", "View", "Refresh", "|", "Details", "|"].includes(option)) || ["SortBy", "View", "Refresh", "|", "Details", "|"],
            visible: props.fileManagerConfig?.contextMenuSettings?.visible ?? true
          }}
          detailsViewSettings={props.fileManagerConfig?.detailsViewSettings?.columns ? {
            columnResizing: props.fileManagerConfig?.detailsViewSettings?.columnResizing || true,
            columns: props.fileManagerConfig?.detailsViewSettings?.columns,
          } : undefined}
          navigationPaneSettings={{
            maxWidth: props.fileManagerConfig?.navigationPaneSettings?.maxWidth || "650px",
            minWidth: props.fileManagerConfig?.navigationPaneSettings?.minWidth || "240px",
            sortOrder: props.fileManagerConfig?.navigationPaneSettings?.sortOrder || "None",
            visible: props.fileManagerConfig?.navigationPaneSettings?.visible ?? true
          }}
          searchSettings={{
            allowSearchOnTyping: props.fileManagerConfig?.searchSettings?.allowSearchOnTyping ?? true,
            filterType: props.fileManagerConfig?.searchSettings?.filterType || "contains",
            ignoreCase: props.fileManagerConfig?.searchSettings?.ignoreCase ?? true,
            placeholder: props.fileManagerConfig?.searchSettings?.placeholder
          }}
          selectedItems={props.fileManagerConfig?.selectedItems}
          toolbarItems={props.fileManagerConfig?.toolbarItems}
          toolbarSettings={{
            items: props.fileManagerConfig?.toolbarSettings?.items?.filter((option => ['SortBy', 'Refresh', 'Selection', 'View', 'Details'].includes(option))) || ['SortBy', 'Refresh', 'Selection', 'View', 'Details'],
            visible: props.fileManagerConfig?.toolbarSettings?.visible ?? true
          }}
          cssClass={props.cssClass}
          path={props.path}
          rootAliasName={props.rootAliasName}
          sortBy={props.sortBy}
          sortOrder={props.sortOrder}
          view={props.view}
          allowMultiSelection={props.allowMultiSelection}
          enableVirtualization={props.enableVirtualization}
          showFileExtension={props.showFileExtension}
          showItemCheckBoxes={props.showItemCheckBoxes}
          showThumbnail={props.showThumbnail}
        >
          <Inject
            services={[
              BreadCrumbBar,
              Virtualization,
              Toolbar,
              LargeIconsView,
              DetailsView,
              NavigationPane,
              ContextMenu
            ]}
          />
        </FileManagerComponent>
      )}
      {props.fileSystemData.length === 0 && (props.renderNoDataSource())}
    </>
  );
}
);

SfFileManagerComponent.displayName = "SfFileManagerComponent";