import { applyBlockAttributes } from './block-props.js'

class SchematicComponent extends Heed.AbstractContentSection {
  constructor(section, slide) {
    super(section, slide)
  }

  renderTo(el) {
    el.classList.add('heed-schematic-item-container')

    const blockDiv = document.createElement('div')
    blockDiv.classList.add('heed-schematic-component')

    applyBlockAttributes(el, blockDiv, this.section, this.slide)

    blockDiv.addEventListener('dragstart', (e) => {
      // put the type and label into drag data
      e.dataTransfer.setData(
        'application/x-schematic',
        JSON.stringify({
          ...this.section,
        })
      )
      // optional: customize drag image
      e.dataTransfer.effectAllowed = 'copy'
    })

    el.appendChild(blockDiv)
  }
}

Heed.ContentSectionRegistry.register('schematic:component', SchematicComponent)
