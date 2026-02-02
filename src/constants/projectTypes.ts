export const PROJECT_TYPES_BY_GAME: Record<string, { label: string; value: string }[]> = {
  'minecraft': [
    { label: 'Моды', value: 'mods' },
    { label: 'Плагины', value: 'plugins' },
    { label: 'Шейдеры', value: 'shaders' },
    { label: 'Ресурспаки', value: 'resourcepacks' },
    { label: 'Карты', value: 'maps' },
  ],
  'hytale': [
    { label: 'Моды', value: 'mods' },
    { label: 'Скрипты', value: 'scripts' },
    { label: 'Модели', value: 'models' },
    { label: 'Миры', value: 'worlds' },
  ]
};