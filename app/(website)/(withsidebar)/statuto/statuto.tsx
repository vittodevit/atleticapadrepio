"use client"
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


const PDFViewer = () => {

  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer
          fileUrl='/statuto.pdf'
          plugins={[
            // Register plugins
            defaultLayoutPluginInstance,
          ]}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
