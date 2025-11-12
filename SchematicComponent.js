import { SchematicElement } from './SchematicElement.js'

/**
 * Schematic Component block. Virtually identical to a Schematic Block,
 * apart from being a "blueprint".
 */
class SchematicComponent extends SchematicElement {
  constructor(section, slide) {
    super(section, slide, {
      schematicType: 'component',
      typeClass: 'heed-schematic-component',
    })
  }

  getDragHandle({ slideEl, x, y, width, height }) {
    const blockEl = Heed.ContentSectionFactory.buildSection({
      section: {
        ...this.section,
        type: 'schematic:block',
      },
      slide: this.slide,
    })

    blockEl.style.position = 'absolute'
    blockEl.style.left = x
    blockEl.style.top = y
    blockEl.style.width = `${width}px`
    blockEl.style.height = `${height}px`
    slideEl.appendChild(blockEl)
    blockEl._controller.model.transient = true
    return blockEl
  }

  returnDragHandle(dragHandle) {
    dragHandle.remove()
  }
}

Heed.ContentSectionRegistry.register('schematic:component', SchematicComponent)
