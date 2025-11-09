import { acceptsDropOfType, applyBlockAttributes } from './block-props.js'

class SchematicBlock extends Heed.AbstractContentSection {
  constructor(section, slide) {
    super(section, slide)
    this.model = {
      id: section.id,
      section,
      schematicType: 'block',
      type: section.customType,
      parent: null,
      controller: this,
      ui: {},
      slots: [],
      children: [],
      sectionEl: null,
      el: null,
    }
  }

  renderTo(el) {
    el.classList.add('heed-schematic-item-container')

    const blockDiv = document.createElement('div')
    blockDiv.id = this.model.id

    blockDiv.classList.add('heed-schematic-element')
    blockDiv.classList.add('heed-schematic-block')
    applyBlockAttributes(el, blockDiv, this.section, this.slide)

    // this.addDragStartListener(blockDiv)
    // this.addDropListener(blockDiv)

    this.blockEl = blockDiv
    this.blockEl.model = this.model
    this.blockEl._controller = this
    el.appendChild(blockDiv)
    el._controller = this
    el.model = this.model
    this.model.el = blockDiv
    this.model.sectionEl = el
  }

  getDragHandle({ slideEl, x, y, width, height }) {
    const handle = this.model.sectionEl.cloneNode(true)
    slideEl.appendChild(handle)
    this.model.sectionEl.style.visibility = 'hidden'

    handle._controller = this

    handle.style.position = 'absolute'
    handle.style.left = x
    handle.style.top = y
    handle.style.width = `${width}px`
    handle.style.height = `${height}px`

    return handle
  }

  returnDragHandle(dragHandle) {
    this.model.sectionEl.style.visibility = 'visible'
    dragHandle.remove()
  }
}

Heed.ContentSectionRegistry.register('schematic:block', SchematicBlock)
