export const LOADERS_BY_GAME: Record<string, any> = {
  'minecraft': {
    'mod': [
      { id: 'fabric', label: 'Fabric', color: '#f3d1b0' },
      { id: 'forge', label: 'Forge', color: '#dfa86a' },
      { id: 'quilt', label: 'Quilt', color: '#beadcf' },
      { id: 'neoforge', label: 'NeoForge', color: '#eec1ad' }
    ],
    'plugin': [
      { id: 'spigot', label: 'Spigot' },
      { id: 'paper', label: 'Paper' },
      { id: 'purpur', label: 'Purpur' },
      { id: 'velocity', label: 'Velocity' },
      { id: 'bungeecord', label: 'BungeeCord' }
    ],
    'shader': [
      { id: 'iris', label: 'Iris' },
      { id: 'optifine', label: 'Optifine' },
      { id: 'oculus', label: 'Oculus (Forge)' }
    ],
    'resourcepack': [
      { id: 'vanilla', label: 'Vanilla' },
      { id: 'optifine_rp', label: 'Optifine Required' }
    ],
    'datapack': [
      { id: 'vanilla_dp', label: 'Vanilla' },
      { id: 'forge_dp', label: 'Forge' },
      { id: 'fabric_dp', label: 'Fabric' }
    ],
    // Для карт и сборок часто лоадеры не важны, но добавим их для видимости вкладки
    'map': [
      { id: 'vanilla_map', label: 'Vanilla' }
    ],
    'modpack': [
      { id: 'fabric_mp', label: 'Fabric' },
      { id: 'forge_mp', label: 'Forge' },
      { id: 'quilt_mp', label: 'Quilt' }
    ]
  },
  'hytale': {
    'mod': [
      { id: 'hytale-core', label: 'Hytale Core' }
    ],
    'script': [
      { id: 'hytale-script', label: 'Hytale Scripting' }
    ]
  }
};