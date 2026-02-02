// Типы игр (Платформы)
export const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
];

// Типы проектов (которые мы будем выбирать уже в настройках, но константы храним тут)
export const PROJECT_TYPES = [
  { id: 'mod', label: 'Мод' },
  { id: 'plugin', label: 'Плагин' },
  { id: 'shader', label: 'Шейдер' },
  { id: 'resourcepack', label: 'Текстурпак' },
  { id: 'map', label: 'Карта' },
  { id: 'modpack', label: 'Сборка' },
  { id: 'datapack', label: 'Датапак' },
];

// Вспомогательная функция для получения названия игры по ID
export const getGameLabel = (id: string) => {
  return GAME_PLATFORMS.find(game => game.id === id)?.label || id;
};