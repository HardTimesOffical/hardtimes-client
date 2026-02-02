// Типы игр (Платформы)
export const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
];

// Типы проектов (которые мы будем выбирать уже в настройках, но константы храним тут)
export const PROJECT_TYPES = [
  { id: 'mod', label: 'Моды' },
  { id: 'plugin', label: 'Плагины' },
  { id: 'shader', label: 'Шейдеры' },
  { id: 'resourcepack', label: 'Текстурпаки' },
  { id: 'map', label: 'Карты' },
  { id: 'modpack', label: 'Сборки' },
  { id: 'datapack', label: 'Датапаки' },
];

// Вспомогательная функция для получения названия игры по ID
export const getGameLabel = (id: string) => {
  return GAME_PLATFORMS.find(game => game.id === id)?.label || id;
};