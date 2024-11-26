import {
  BookmarkView,
  Inject,
  Magnification,
  Navigation,
  PdfViewerComponent,
  Print,
  TextSearch,
  TextSelection,
  ThumbnailView,
  Toolbar,
  ToolbarItem,
  LinkAnnotation,
} from "@syncfusion/ej2-react-pdfviewer";
import * as React from "react";
import { ISfPdfViewer } from "./types";

/**
 * SfPdfViewerComponent is a configurable PdfViewer component that displays PDF.
 *
 * @param {ISfPdfViewer} props - The props for the PdfViewer component.
 * @returns {JSX.Element} - The rendered PdfViewer component.
 */
export const SfPdfViewerComponent: React.FC<ISfPdfViewer> = React.memo(
  (props: ISfPdfViewer) => {
    const {
      documentPath,
      enableToolbar,
      enableNavigationToolbar,
      enableBookmark,
      enableDownload,
      enablePrint,
      enableTextSearch,
      enableTextSelection,
      enableNavigation,
      enableMagnification,
      openThumbnailPane,
      interactionMode,
      width,
      height
    } = props;
    let pdfViewerRef: PdfViewerComponent;
    const [isInitialRener, setIsInitialRener] = React.useState<boolean>(true);

    React.useEffect(() => {
      if (!isInitialRener) updatePdfViewer();
    }, [enableToolbar, enableBookmark, enableNavigationToolbar, enableDownload, enablePrint, enableTextSearch, enableTextSelection, enableNavigation, enableMagnification, openThumbnailPane, interactionMode, documentPath, width, height]);

    React.useEffect(() => {
      setIsInitialRener(false);
    }, []);

    const updateZoomDropdown = () => {
      let element = pdfViewerRef.viewerBase.getElement('_zoomDropDown') as HTMLInputElement;
      element.value = Math.round(pdfViewerRef.zoomPercentage).toString() + "%";
    }

    const updatePageNumber = () => {
      let element = pdfViewerRef.viewerBase.getElement('_currentPageInput') as HTMLInputElement;
      element.value = pdfViewerRef.currentPageNumber.toString();
    }

    const updatePdfViewer = () => {

      let toolBarItemsChanged = false;
      let toolBarItems = pdfViewerRef.toolbarSettings?.toolbarItems
        ? [...pdfViewerRef.toolbarSettings.toolbarItems]
        : [];

      const addItemIfNotExists = (item: ToolbarItem) => {
        if (!toolBarItems.includes(item)) {
          toolBarItems.push(item);
          toolBarItemsChanged = true;
        }
      }

      const removeItemIfExists = (item: ToolbarItem) => {
        if (toolBarItems.includes(item)) {
          toolBarItems = toolBarItems.filter(existingItem => existingItem !== item);
          toolBarItemsChanged = true;
        }
      }

      pdfViewerRef.toolbarModule.showToolbar(enableToolbar);
      pdfViewerRef.toolbarModule.showNavigationToolbar(enableToolbar ? enableNavigationToolbar : false);
      if (interactionMode !== pdfViewerRef.interactionMode)
        pdfViewerRef.interactionMode = interactionMode;

      if (enableTextSelection !== pdfViewerRef.enableTextSelection)
        pdfViewerRef.enableTextSelection = enableTextSelection;

      if (width !== null) {
        pdfViewerRef.width = width;
      }
      if (height !== null) {
        pdfViewerRef.height = height;
      }
      if (!enableBookmark || !enableToolbar || !enableNavigationToolbar) {
        pdfViewerRef.viewerBase.navigationPane.disableBookmarkButton();
      } else {
        pdfViewerRef.viewerBase.navigationPane.enableBookmarkButton();
      }

      if (pdfViewerRef.thumbnailViewModule.thumbnailView) {
        if (openThumbnailPane && enableToolbar && enableNavigationToolbar) {
          pdfViewerRef.thumbnailViewModule.openThumbnailPane();
        } else {
          pdfViewerRef.thumbnailViewModule.closeThumbnailPane();
        }
      }

      pdfViewerRef.magnificationModule.zoomTo(pdfViewerRef.zoomPercentage);
      pdfViewerRef.updateViewerContainer();

      if (!enableToolbar) return;

      const toolbarActions: Partial<{ [key in ToolbarItem]: () => void }> = {
        "PrintOption": () => enablePrint ? addItemIfNotExists("PrintOption") : removeItemIfExists("PrintOption"),
        "DownloadOption": () => enableDownload ? addItemIfNotExists("DownloadOption") : removeItemIfExists("DownloadOption"),
        "SearchOption": () => enableTextSearch ? addItemIfNotExists("SearchOption") : removeItemIfExists("SearchOption"),
        "MagnificationTool": () => enableMagnification ? addItemIfNotExists("MagnificationTool") : removeItemIfExists("MagnificationTool"),
        "PageNavigationTool": () => enableNavigation ? addItemIfNotExists("PageNavigationTool") : removeItemIfExists("PageNavigationTool")
      };

      Object.keys(toolbarActions).forEach((key: string) => toolbarActions[key as ToolbarItem]?.());
      if (toolBarItemsChanged) {
        pdfViewerRef.toolbarSettings = { toolbarItems: toolBarItems };
      }
    };

    return (
      <div style={{ width: width, height: height }}>
        <PdfViewerComponent style={{ width: width, height: height }}
          ref={(ref) => { if (ref) pdfViewerRef = ref; }}
          documentPath={documentPath}
          resourceUrl={"https://cdn.syncfusion.com/ej2/24.1.41/dist/ej2-pdfviewer-lib"}
          documentLoad={updatePdfViewer}
          zoomChange={updateZoomDropdown}
          pageChange={updatePageNumber}
          contextMenuOption="None"
          enableStickyNotesAnnotation={false}
          annotationSettings={{ isLock: true }}
          textFieldSettings={{ isReadOnly: true }}
          radioButtonFieldSettings={{ isReadOnly: true }}
          DropdownFieldSettings={{ isReadOnly: true }}
          checkBoxFieldSettings={{ isReadOnly: true }}
          signatureFieldSettings={{ isReadOnly: true }}
          listBoxFieldSettings={{ isReadOnly: true }}
          passwordFieldSettings={{ isReadOnly: true }}
          initialFieldSettings={{ isReadOnly: true }}
          toolbarSettings={{
            showTooltip: true,
            toolbarItems: ['PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'PrintOption', 'DownloadOption', 'SearchOption']
          }}
        >
          <Inject
            services={[
              Toolbar,
              Magnification,
              Navigation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
              LinkAnnotation
            ]}
          />
        </PdfViewerComponent>
      </div>
    );
  }
);

SfPdfViewerComponent.displayName = "SfPdfViewerComponent";
