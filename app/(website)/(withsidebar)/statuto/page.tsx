import PDFViewer from "./statuto";

export default function Home() {
  return (
    <div className="p-4 pl-0 pr-0 mx-4 md:mx-0">
      <h1 className="text-2xl font-medium">Statuto dell&#39;associazione</h1>
      <div className="p-5 bg-white shadow-md mt-4">
        <PDFViewer />
      </div>
    </div>
  );
}