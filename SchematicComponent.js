import { applyBlockAttributes } from './block-props.js'
import { SchematicElement } from './SchematicElement.js'

class SchematicComponent extends SchematicElement {
  constructor(section, slide) {
    super(section, slide, {
      schematicType: 'component',
      typeClass: 'heed-schematic-component',
    })
  }

  // renderTo(el) {
  //   el.classList.add('heed-schematic-item-container')

  //   const blockDiv = document.createElement('div')
  //   blockDiv.id = this.model.id
  //   blockDiv.classList.add('heed-schematic-element')
  //   blockDiv.classList.add('heed-schematic-component')
  //   applyBlockAttributes(el, blockDiv, this.section, this.slide)

  //   //    this.addDragStartListener(blockDiv)
  //   this.blockEl = blockDiv
  //   this.blockEl.model = this.model
  //   this.blockEl._controller = this
  //   el.appendChild(blockDiv)
  //   el._controller = this
  //   el.model = this.model
  //   this.model.el = blockDiv
  //   this.model.sectionEl = el
  // }

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
