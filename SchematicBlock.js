import { SchematicElement } from './SchematicElement.js'

class SchematicBlock extends SchematicElement {
  constructor(section, slide) {
    super(section, slide, {
      schematicType: 'block',
      typeClass: 'heed-schematic-block',
    })
  }

  getDragHandle({ slideEl, x, y, width, height }) {
    const clone = this.clone()
    const handle = clone.model.sectionEl
    slideEl.appendChild(handle)
    this.model.sectionEl.style.visibility = 'hidden'

    handle.style.position = 'absolute'
    handle.style.left = x
    handle.style.top = y
    handle.style.width = `${width}px`
    handle.style.height = `${height}px`

    return handle
  }

  returnDragHandle(dragHandle) {
    this.model.sectionEl.style.visibility = 'inherit'
    dragHandle.remove()
  }
}

Heed.ContentSectionRegistry.register('schematic:block', SchematicBlock)
