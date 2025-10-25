class SchematicBlock extends Heed.AbstractContentSection {
  constructor(section, slide) {
    super(section, slide)
  }

  renderTo(el) {
    const blockDiv = document.createElement('div')
    blockDiv.classList.add('heed-schematic-block')

    const { color, draggable } = this.section
    if (color) {
      blockDiv.style.backgroundColor = color
    }
    if (draggable === true || draggable === 'true') {
      blockDiv.classList.add('hs-draggable')
      blockDiv.setAttribute('draggable', true)
    }

    blockDiv.innerText = this.section.content ?? ''
    el.appendChild(blockDiv)
    console.log(this.section)
  }
}

Heed.ContentSectionRegistry.register('schematic:block', SchematicBlock)
