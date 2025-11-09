import { SchematicSlideController } from './SchematicSlideController.js'

class SchematicPreRenderHook {
  constructor(cfg, slide) {
    this.cfg = cfg
    this.slide = slide
    Object.assign(this, Heed.plugins.schematic)
  }

  applyHook(slideEl) {
    slideEl.schematicController = new SchematicSlideController(
      this.cfg,
      this.slide,
      slideEl
    )
  }
}

Heed.HookRegistry.register('schematic:preRender', SchematicPreRenderHook, [
  'postRender',
])
