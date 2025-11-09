import {
  acceptsDropOfType,
  getAttributes,
  updateBlockAttributes,
} from './block-props.js'
import { addDomObserver } from './Dom.js'

export class SchematicContainer extends Heed.AbstractContentSection {
  constructor(section, slide, options = {}) {
    super(section, slide)
    this.containerType = options.containerType = 'basic-container'

    this.objectGraph = []

    this.model = {
      id: section.id,
      schematicType: options?.schematicType ?? 'container',
      type: section.customType,
      section,
      sectionEl: null,
      el: null,
    }

    const { containerType } = this.section
    this.containerType = this.slide.getCustomType(
      'schematic:container-type',
      containerType
    )?.id
  }

  createContainerDiv() {
    const containerDiv = document.createElement('div')
    containerDiv.id = this.section.id
    addDomObserver({
      el: containerDiv,
      onChildAdded: this.onChildAdded.bind(this),
      onChildRemoved: this.onChildRemoved.bind(this),
    })

    containerDiv.classList.add('heed-schematic-element')
    containerDiv.classList.add('heed-schematic-container')

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

  onChildAdded(parent, child) {
    const sectionDef = child.controller.section
    const childEl = child.controller.blockEl
    updateBlockAttributes(parent, childEl, sectionDef, this.slide)

    this.objectGraph.push(child.controller.object)
  }

  onChildRemoved(parent, child) {
    console.log('Block removed from container', parent, child)
  }

  renderTo(el) {
    const containerDiv = this.createContainerDiv()

    //    this.addDropListener(containerDiv)

    containerDiv._controller = this
    el._controller = this

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

  addDropListener(container) {
    const onDrop = (e) => {
      e.preventDefault()

      const data = JSON.parse(
        e.dataTransfer.getData('application/x-schematic') ||
          container.getAttribute('data-drag')
      )
      if (!data) return
      const { object, drag } = data
      if (!object || !data) return

      if (
        !acceptsDropOfType('container', this.containerType, object, this.slide)
      ) {
        return
      }

      const rect = container.getBoundingClientRect()

      if (object.type === 'schematic:component') {
        const blockEl = Heed.ContentSectionFactory.buildSection({
          section: {
            ...object,
            type: 'schematic:block',
          },
          slide: this.slide,
        })

        blockEl.style.position = 'absolute'
        blockEl.style.left = e.offsetX - drag.handle.x
        blockEl.style.top = e.offsetY - drag.handle.y

        container.appendChild(blockEl)
      } else if (object.type === 'schematic:block') {
        const blockEl = e.srcElement.parentElement
        blockEl.style.left = e.clientX - rect.x - drag.handle.x
        blockEl.style.top = e.clientY - rect.y - drag.handle.y
      }
    }

    container.addEventListener('dragend', onDrop)

    container.addEventListener('drop', onDrop)
  }
}

Heed.ContentSectionRegistry.register('schematic:container', SchematicContainer)
