import { acceptsDropOfType, getListAttribute } from './block-props.js'

export class SchematicContainer extends Heed.AbstractContentSection {
  constructor(section, slide, options = {}) {
    super(section, slide)
    this.containerType = options.containerType = 'basic-container'

    const { containerType } = this.section
    this.containerType = this.slide.getCustomType(
      'schematic:container-type',
      containerType
    )?.id
  }

  createContainerDiv() {
    const containerDiv = document.createElement('div')
    containerDiv.classList.add('heed-schematic-container')
    ;(this.section.contents ?? []).forEach((child) => {
      const childEl = Heed.ContentSectionFactory.buildSection({
        section: child,
        slide: this.slide,
      })

      containerDiv.appendChild(childEl)
    })

    this.addDropListener(containerDiv)

    return containerDiv
  }

  renderTo(el) {
    const containerDiv = this.createContainerDiv()

    const { title, height } = this.section

    if (title) {
      const titleEl = document.createElement('h2')
      titleEl.classList.add('heed-schematic-container-title')
      titleEl.innerText = title
      el.appendChild(titleEl)
    }

    if (height) {
      containerDiv.style.height = '100%'
      el.style.height = height
    }

    el.appendChild(containerDiv)
  }

  addDropListener(container) {
    container.addEventListener('drop', (e) => {
      e.preventDefault()

      const data = JSON.parse(e.dataTransfer.getData('application/x-schematic'))
      if (!data) return

      console.log(data)
      if (!acceptsDropOfType('container', this.containerType, data, this.slide))
        return

      // Create a new block element
      const blockEl = Heed.ContentSectionFactory.buildSection({
        section: {
          ...data,
          type: 'schematic:block',
        },
        slide: this.slide,
      })

      blockEl.style.position = 'absolute'
      blockEl.style.left = e.offsetX
      blockEl.style.top = e.offsetY

      // append it at the drop position
      container.appendChild(blockEl)
    })
  }
}

Heed.ContentSectionRegistry.register('schematic:container', SchematicContainer)
