interface Tag {
  id: string;
  label: string;
}

// Определяем структуру объекта (Ключ игры -> Ключ типа -> Массив тегов)
interface ProjectTags {
  [game: string]: {
    [type: string]: Tag[];
  };
}

export const PROJECT_TAGS: ProjectTags = {
 minecraft: {
  mods: [
    { id: 'optimization', label: 'Оптимизация' },
    { id: 'game-mechanics', label: 'Игровая механика' },
    { id: 'world-gen', label: 'Генерация мира' },
    { id: 'technology', label: 'Технологии' },
    { id: 'magic', label: 'Магия' },
    { id: 'adventure', label: 'Приключения' },
    { id: 'mobs', label: 'Мобы' },
    { id: 'equipment', label: 'Снаряжение' },
    { id: 'food', label: 'Еда' },
    { id: 'decoration', label: 'Декорации' },
    { id: 'storage', label: 'Хранение' },
    { id: 'transportation', label: 'Транспорт' },
    { id: 'library', label: 'Библиотеки (API)' },
    { id: 'utility', label: 'Утилиты' },
    { id: 'ui', label: 'Интерфейс' },
    { id: 'quest', label: 'Квесты' },
  ],

  // ПЛАГИНЫ
  plugins: [
    { id: 'admin', label: 'Администрирование' },
    { id: 'management', label: 'Управление' },
    { id: 'economy', label: 'Экономика' },
    { id: 'chat', label: 'Чат' },
    { id: 'protection', label: 'Защита' },
    { id: 'minigame', label: 'Мини-игры' },
    { id: 'social', label: 'Социальное' },
    { id: 'utility', label: 'Утилиты' },
    { id: 'game-mechanics', label: 'Механики' },
    { id: 'permission', label: 'Права и Группы' },
    { id: 'teleport', label: 'Телепортация' },
    { id: 'shop', label: 'Магазины' },
  ],

  // СБОРКИ СЕРВЕРОВ И МОДОВ
  'server-packs': [
    { id: 'survival', label: 'Выживание' },
    { id: 'anarchy', label: 'Анархия' },
    { id: 'skyblock', label: 'SkyBlock' },
    { id: 'creative', label: 'Креатив' },
    { id: 'rpg', label: 'RPG' },
    { id: 'pve', label: 'PvE' },
    { id: 'pvp', label: 'PvP' },
    { id: 'lite', label: 'Легкая' },
    { id: 'industrial', label: 'Индустриальная' },
  ],

  // ПЕРЕВОДЫ
  translations: [
    { id: 'ru', label: 'Русский' },
    { id: 'ua', label: 'Українська' },
    { id: 'kz', label: 'Қазақ тілі' },
    { id: 'full', label: 'Полный перевод' },
    { id: 'interface', label: 'Только интерфейс' },
    { id: 'items', label: 'Предметы и мобы' },
  ],

  // КОНФИГУРАЦИИ
  configs: [
    { id: 'deluxemenus', label: 'Меню (DeluxeMenus)' },
    { id: 'itemsadder', label: 'Кастомные вещи (ItemsAdder)' },
    { id: 'tab', label: 'Оформление TAB' },
    { id: 'bossbar', label: 'BossBar' },
    { id: 'scoreboard', label: 'Scoreboard' },
    { id: 'papi', label: 'PlaceholderAPI' },
    { id: 'balanced', label: 'Балансировка' },
  ],

  // ШЕЙДЕРЫ
  shaders: [
    { id: 'realistic', label: 'Реалистичные' },
    { id: 'performance', label: 'Для слабых ПК' },
    { id: 'fancy', label: 'Красивые' },
    { id: 'stylized', label: 'Стилизованные' },
    { id: 'lighting', label: 'Освещение' },
    { id: 'rtx', label: 'Ray Tracing' },
  ],

  // КАРТЫ
  maps: [
    { id: 'schematic', label: 'Схематика' },
    { id: 'adventure', label: 'Приключения' },
    { id: 'survival', label: 'Выживание' },
    { id: 'parkour', label: 'Паркур' },
    { id: 'horror', label: 'Хоррор' },
    { id: 'minigame', label: 'Мини-игры' },
    { id: 'puzzle', label: 'Головоломка' },
    { id: 'city', label: 'Город' },
    { id: 'medieval', label: 'Средневековье' },
    { id: 'spawn', label: 'Спавн' },
    { id: 'server', label: 'Для сервера' },
    { id: 'lobby', label: 'Лобби' },
  ],
    schematics: [
    { id: 'world-edit', label: 'World-Edit' },
    { id: 'litematica', label: 'Litematica' },
    { id: 'blueprint', label: 'BluePrint' },
    { id: 'axiom', label: 'Axiom' },
  ],

  // РЕСУРСПАКИ
  resourcepacks: [
    { id: '3d', label: '3D Модели' },
    { id: 'pbr', label: 'PBR Текстуры' },
    { id: 'font', label: 'Шрифты' },
    { id: 'ui', label: 'Интерфейс' },
    { id: 'sounds', label: 'Звуки' },
    { id: 'x-ray', label: 'X-Ray' },
    { id: 'pvp', label: 'PvP' },
  ]
},

  hytale: {
    // В Hytale моды часто называют скриптами или расширениями
    mods: [
      { id: 'client-side', label: 'Клиентские' },
      { id: 'server-side', label: 'Серверные' },
      { id: 'gameplay', label: 'Геймплей' },
      { id: 'tools', label: 'Инструменты' },
      { id: 'ai', label: 'Искусственный интеллект' },
    ],
    // Специфично для Hytale: Модели из встроенного редактора
    models: [
      { id: 'mobs', label: 'Существа' },
      { id: 'items', label: 'Предметы' },
      { id: 'blocks', label: 'Блоки' },
      { id: 'animations', label: 'Анимации' },
      { id: 'furniture', label: 'Мебель' },
    ],
    maps: [
      { id: 'adventure', label: 'Приключения' },
      { id: 'minigame', label: 'Мини-игры' },
      { id: 'build', label: 'Постройки' },
      { id: 'zone1', label: 'Зона 1' },
      { id: 'zone2', label: 'Зона 2' },
      { id: 'zone3', label: 'Зона 3' },
    ],
    // Текстуры и звуки
    resourcepacks: [
      { id: 'textures', label: 'Текстуры' },
      { id: 'sounds', label: 'Звуки' },
      { id: 'music', label: 'Музыка' },
      { id: 'ui', label: 'Интерфейс' },
    ],
    'server-packs': [
      { id: 'community', label: 'Сообщество' },
      { id: 'hardcore', label: 'Хардкор' },
      { id: 'roleplay', label: 'Roleplay' },
    ],
    // Уникально для Hytale: Настройки персонажей
    avatars: [
      { id: 'clothing', label: 'Одежда' },
      { id: 'hair', label: 'Прически' },
      { id: 'accessories', label: 'Аксессуары' },
      { id: 'skins', label: 'Скины' },
    ],
    translations: [
      { id: 'ru', label: 'Русский' },
      { id: 'ua', label: 'Українська' },
    ],
  }

};