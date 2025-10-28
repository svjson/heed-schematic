class SchematicPostRenderHook {
  constructor(cfg, slide) {
    this.cfg = cfg
    this.slide = slide
    Object.assign(this, Heed.plugins.schematic)
  }

  applyHook() {
    this.initSchematicDragAndDrop()
  }

  initSchematicDragAndDrop() {
    // 2. make containers droppable
    document
      .querySelectorAll('.heed-schematic-container')
      .forEach((container) => {
        container.addEventListener('dragover', (e) => {
          e.preventDefault() // allow drop
          e.dataTransfer.dropEffect = 'copy'
        })
      })
  }
}

Heed.HookRegistry.register('schematic:postRender', SchematicPostRenderHook, [
  'postRender',
])
