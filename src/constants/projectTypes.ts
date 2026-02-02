export const PROJECT_TYPES_BY_GAME: Record<string, { label: string; value: string }[]> = {
  'minecraft': [
    { label: 'Мод', value: 'mod' },
    { label: 'Плагин', value: 'plugin' },
    { label: 'Шейдер', value: 'shader' },
    { label: 'Ресурспак', value: 'resourcepack' },
    { label: 'Карта', value: 'map' },
  ],
  'hytale': [
    { label: 'Мод', value: 'mod' },
    { label: 'Скрипт', value: 'script' },
    { label: 'Модель', value: 'model' },
    { label: 'Мир', value: 'world' },
  ],
  'default': [
    { label: 'Проект', value: 'project' },
    { label: 'Дополнение', value: 'addon' },
  ]
};