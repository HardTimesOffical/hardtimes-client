// Импортируем твой компонент (убедись, что путь к файлу верный)
import Maintenance from '@/app/components/blocks/Maintenance';

export default async function ContentPage({ params }: { params: Promise<{ game?: string[] }> }) {
  // Ждем параметры
  const resolvedParams = await params;
  
  // Достаем массив сегментов
  const slugArray = resolvedParams.game || [];

  // Определяем текущие переменные (они понадобятся позже для логики)
  const currentGame = slugArray[0] || 'all';          
  const currentType = slugArray[1] || 'mods';         
  const currentCategory = slugArray[2] || 'all';      

  // Флаг готовности раздела
  const isReady = false; 

  if (!isReady) {
    // Пока раздел не готов, показываем только заглушку
    return <Maintenance />;
  }

  // Сюда код дойдет только когда isReady станет true
  return (
    <div className="p-6">
       <h1 className="text-3xl font-black italic uppercase">
         {currentType} для {currentGame}
       </h1>
    </div>
  );
}