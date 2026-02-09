// Типы игр (Платформы)
export const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
  { id: 'voxelcore', label: 'VoxelCore', icon: '🏗️' },
];

// Типы проектов (которые мы будем выбирать уже в настройках, но константы храним тут)
export const PROJECT_TYPES = [
  { id: 'mods', label: 'Моды' },
  { id: 'plugins', label: 'Плагины' },
  { id: 'server-packs', label: 'Сборки серверов' },
  { id: 'modpacks', label: 'Сборки модов' },
  { id: 'translations', label: 'Переводы' },
  { id: 'configs', label: 'Конфигурации' },
  { id: 'shaders', label: 'Шейдеры' },
  { id: 'resourcepacks', label: 'Ресурспаки' },
  { id: 'maps', label: 'Карты' },
  { id: 'schematics', label: 'Схематики' },
  { id: 'datapacks', label: 'Датапаки' },
  { id: 'scripts', label: 'Скрипты (C#)' },
  { id: 'models', label: 'Модели и Ассеты' },
  { id: 'worlds', label: 'Миры и Карты' },
  { id: 'tools', label: 'Инструменты' },
  { id: 'libraries', label: 'Библиотеки' },
  { id: 'texture-packs', label: 'Текстурпаки' },
  { id: 'core', label: 'Ядро' },
];

// Вспомогательная функция для получения названия игры по ID
export const getGameLabel = (id: string) => {
  return GAME_PLATFORMS.find(game => game.id === id)?.label || id;
};

export const getProjectTypeLabel = (id: string) => {
  return PROJECT_TYPES.find(type => type.id === id)?.label || id;
};
