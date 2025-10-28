import { applyBlockAttributes } from './block-props.js'

class SchematicBlock extends Heed.AbstractContentSection {
  constructor(section, slide) {
    super(section, slide)
  }

  renderTo(el) {
    el.classList.add('heed-schematic-item-container')

    const blockDiv = document.createElement('div')
    blockDiv.classList.add('heed-schematic-block')

    applyBlockAttributes(el, blockDiv, this.section, this.slide)

    this.addDragStartListener(blockDiv)

    el.appendChild(blockDiv)
  }

  addDragStartListener(blockEl) {
    blockEl.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData(
        'application/x-schematic',
        JSON.stringify({
          ...this.section,
        })
      )
      e.dataTransfer.effectAllowed = 'move'
      setTimeout(() => {
        blockEl.style.opacity = '0%'
      }, 50)
    })
    blockEl.addEventListener('dragend', (e) => {
      blockEl.style.opacity = '100%'
    })
  }
}

Heed.ContentSectionRegistry.register('schematic:block', SchematicBlock)
