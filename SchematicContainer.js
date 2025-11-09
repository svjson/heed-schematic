import { getAttributes, updateBlockAttributes } from './block-props.js'
import { addDomObserver } from './Dom.js'
import { SchematicElement } from './SchematicElement.js'

export class SchematicContainer extends SchematicElement {
  constructor(section, slide, options = {}) {
    super(section, slide, {
      schematicType: 'container',
      typeClass: 'heed-schematic-container',
      ...options,
    })
    this.containerType = options.containerType = 'basic-container'

    this.objectGraph = []

    const { containerType } = this.section
    this.containerType = this.slide.getCustomType(
      'schematic:container-type',
      containerType
    )?.id
  }

  _createElement() {
    const containerDiv = super._createElement()

    const { color } = getAttributes(this.section, this.section)
    containerDiv.style.setProperty('--elm-bg', color)
    ;(this.section.contents ?? []).forEach((child) => {
      const childEl = Heed.ContentSectionFactory.buildSection({
        section: child,
        slide: this.slide,
      })
      containerDiv.appendChild(childEl)
    })

    return containerDiv
  }

  renderTo(el) {
    const containerDiv = this._createElement()

    containerDiv._controller = this
    el._controller = this
    2
    this.model.sectionEl = el
    this.model.el = containerDiv

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
}

Heed.ContentSectionRegistry.register('schematic:container', SchematicContainer)
