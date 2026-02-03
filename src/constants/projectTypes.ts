export const PROJECT_TYPES_BY_GAME: Record<string, { label: string; value: string }[]> = {
  'minecraft': [
    { label: 'Моды', value: 'mods' },
    { label: 'Плагины', value: 'plugins' },
    { label: 'Сборки серверов', value: 'server-packs' }, // Готовые сборки плагинов/ядер
    { label: 'Переводы', value: 'translations' },       // Локализации плагинов/модов
    { label: 'Конфигурации', value: 'configs' },       // Настроенные файлы (DeluxeMenus, ItemsAdder и т.д.)
    { label: 'Сборки модов', value: 'modpacks' },
    { label: 'Шейдеры', value: 'shaders' },
    { label: 'Ресурспаки', value: 'resourcepacks' },
    { label: 'Карты', value: 'maps' },
    { label: 'Cхематики', value: 'schematics' },
    { label: 'Датапаки', value: 'datapacks' },
  ],
  'hytale': [
    { label: 'Моды', value: 'mods' },
    { label: 'Скрипты (C#)', value: 'scripts' },
    { label: 'Сборки серверов', value: 'server-packs' },
    { label: 'Конфигурации', value: 'configs' },
    { label: 'Переводы', value: 'translations' },
    { label: 'Модели и Ассеты', value: 'models' },
    { label: 'Миры и Карты', value: 'worlds' },
    { label: 'Инструменты', value: 'tools' },
  ]
};