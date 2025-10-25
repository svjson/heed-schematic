
class SchematicInitHook {

  constructor(cfg) {
    this.cfg = cfg
    Object.assign(this, Heed.plugins.schematic)
  }

  applyHook() {
  }

};

Heed.HookRegistry.register('schematic:init', SchematicInitHook, ['init']);
