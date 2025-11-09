class SchematicPostRenderHook {
  constructor(cfg, slide) {
    this.cfg = cfg
    this.slide = slide
    Object.assign(this, Heed.plugins.schematic)
  }

  applyHook(slideEl) {
    console.log('PostRenderHook')
    //    this.initSchematicDragAndDrop()
    slideEl.schematicController.initializeView()
  }

  initSchematicDragAndDrop() {
    document
      .querySelectorAll('.heed-schematic-container')
      .forEach((container) => {
        container.addEventListener('dragover', (e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        })
        console.log(container._controller.objectGraph)
        // container
        //   .querySelectorAll('.heed-schematic-component')
        //   .forEach((cmpEl) => {
        //     console.log(cmpEl.controller)
        //     updateBlockAttributes(
        //       container,
        //       cmpEl,
        //       cmpEl.controller.section,
        //       this.slide
        //     )
        //   })
      })
  }
}

Heed.HookRegistry.register('schematic:postRender', SchematicPostRenderHook, [
  'postRender',
])
