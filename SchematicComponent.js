import { applyBlockAttributes } from './block-props.js'

class SchematicComponent extends Heed.AbstractContentSection {
  constructor(section, slide) {
    super(section, slide)
    this.model = {
      id: section.id,
      schematicType: 'component',
      type: section.customType,
      controller: this,
      section,
      ui: {},
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
    blockDiv.classList.add('heed-schematic-component')
    applyBlockAttributes(el, blockDiv, this.section, this.slide)

    //    this.addDragStartListener(blockDiv)
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

  deprecated_addDragStartListener(blockDiv) {
    blockDiv.addEventListener('dragstart', (e) => {
      const rect = blockDiv.getBoundingClientRect()
      e.dataTransfer.setData(
        'application/x-schematic',
        JSON.stringify({
          drag: {
            handle: {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            },
          },
          model: {
            ...this.section,
          },
        })
      )
      e.dataTransfer.effectAllowed = 'copy'
    })
  }
}

Heed.ContentSectionRegistry.register('schematic:component', SchematicComponent)
