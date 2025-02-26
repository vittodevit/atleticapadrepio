export default function Home() {

  return (
    <section>
      <header className="container mx-auto flex justify-center p-4 items-center w-full pt-6 pb-2">
        <div
          className="bg-cover bg-center w-full h-64 md:h-96 flex p-4 flex-row md:justify-start justify-center"
          style={{backgroundImage: 'url(https://staticgeopop.akamaized.net/wp-content/uploads/sites/32/2023/05/biomeccanica-100-metri.jpg)'}}
        >
          <div className="bg-gray-700 bg-opacity-70 p-4 shadow-md w-full md:w-96">
            <h2 className="text-lg font-bold text-white">Evento</h2>
            <p className="text-white">Evento in evidenza</p>
          </div>
        </div>
      </header>


      <section className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold">Zona Articoli</h2>
          <p className="text-gray-600">Fai finta ci sia un immagine.</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Vedi altri</button>
        </div>
        <div className="bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold">Zona sponsor</h2>
          <p className="text-gray-600">Fai finta ci sia una carrellata di immagini</p>
        </div>
        <div className="bg-white p-4 shadow-md">
          <h2 className="text-lg font-bold">Iscriviti</h2>
          <p className="text-gray-600">Zona di iscrizione all&#39;associazione</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white">Tasto che porta al form</button>
        </div>
      </section>
    </section>
)
  ;
}