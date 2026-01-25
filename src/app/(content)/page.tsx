

export default async function Home({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  return (
    /* Внешний контейнер, который объединяет меню и контент */
    <div className="flex min-h-screen bg-[#f8f9fa] main-layout-root">
        <div className="w-full max-w-[1000px] px-4 md:px-6 pt-6 pb-20">
          
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic" translate="no">
                Топ <span translate="no" className="text-orange-500">Серверов</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Лучшие сервера, выбранные сообществом
              </p>
            </header>
          </div>
          
        </div>
    </div>
  );
}