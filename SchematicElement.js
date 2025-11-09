import {
  acceptsDropOfType,
  applyBlockAttributes,
  getAttribute,
  updateBlockAttributes,
} from './block-props.js'
import { parseConnectionTypes } from './Connection.js'
import { addDomObserver, rectCenter } from './Dom.js'

export class SchematicElement extends Heed.AbstractContentSection {
  constructor(section, slide, typeOpts) {
    super(section, slide)
    this.model = {
      id: section.id,
      schematicType: typeOpts.schematicType,
      type: section.customType,
      controller: this,
      section,
      ui: {},
      children: [],
      parent: null,
      sectionEl: null,
      el: null,
    }
    this.typeClass = typeOpts.typeClass
    this.customType = slide.getCustomType(
      `schematic:${this.model.schematicType}-type`,
      this.model.type
    )
    this.model.connectionTypes = parseConnectionTypes(this)
  }

  acceptsChildType(childModel) {
    return (
      this.isDirectParent(childModel) ||
      acceptsDropOfType(this.slide, this.model, childModel)
    )
  }

  getSlotFor(childModel) {
    const slotDef = getAttribute(
      this.customType,
      this.model.section,
      `slots.${childModel.type}`
    )

    if (!slotDef) return null

    const slotParts = slotDef.split(',').map((p) => p.trim())

    const parentRect = this.model.el.getBoundingClientRect()
    const childRect = childModel.el.getBoundingClientRect()

    if (slotParts[0] === 'center') {
      console.log('center')
      return [
        {
          x: parentRect.width / 2 - childRect.width / 2,
          y: parentRect.height / 2 - childRect.height / 2,
          w: childRect.width,
          h: childRect.height,
        },
      ]
    } else if (slotParts[0] === 'uniform-bottom') {
      const [_, offsetY, gap] = slotParts
      const gapSize = parentRect.width * parseFloat(gap)
      const rowWidth =
        this.model.children.reduce((w, child) => {
          return w + child.sectionEl.getBoundingClientRect().width
        }, childRect.width) +
        this.model.children.length * gapSize

      console.log(parentRect.width, rowWidth)
      const rowStart = parentRect.width / 2 - rowWidth / 2
      const rowY = parentRect.height + parseFloat(offsetY) * parentRect.height
      console.log(rowStart)

      return [
        ...this.model.children.map((_, i) => ({
          x: rowStart + (childRect.width + gapSize) * i,
          y: rowY,
          w: childRect.width,
          h: childRect.height,
        })),
        {
          x:
            rowStart + (childRect.width + gapSize) * this.model.children.length,
          y: rowY,
          w: childRect.width,
          h: childRect.height,
        },
      ]
    }
    return null
  }

  isDirectParent(childModel) {
    return this.model.children.some((child) => child.id === childModel.id)
  }

  getBlocks() {
    const result = []
    if (this.model.schematicType === 'block') {
      result.push(this.model)
    }
    return this.model.children.reduce((children, child) => {
      return [...children, ...child.controller.getBlocks()]
    }, result)
  }

  getContainer() {
    if (this.model.parent) return this.model.parent.getContainer()
    return this
  }

  getRootContainerRect() {
    if (this.model.parent) return this.model.parent.getRootContainerRect()
    return this.model.sectionEl?.getBoundingClientRect()
  }

  _createElement() {
    const elementEl = document.createElement('div')
    elementEl.id = this.model.id
    elementEl.classList.add('heed-schematic-element')
    elementEl.classList.add(this.typeClass)
    addDomObserver({
      el: elementEl,
      onChildAdded: this._onChildAdded.bind(this),
      onChildRemoved: this._onChildRemoved.bind(this),
    })
    return elementEl
  }

  _bindReferences(sectionEl, elementEl) {
    this.model.el = elementEl
    this.model.sectionEl = sectionEl

    for (const lmnt of [sectionEl, elementEl]) {
      lmnt._controller = this
      lmnt.model = this.model
    }
  }

  _onChildAdded(parent, child) {
    const sectionDef = child._controller.section
    const childEl = child.model.el
    child.model.parent = this
    this.model.children.push(child.model)
    updateBlockAttributes(parent, childEl, sectionDef, this.slide)
  }

  _onChildRemoved(parent, child) {
    console.log('Block removed from parent', parent, child)
  }

  renderTo(el) {
    el.classList.add('heed-schematic-item-container')
    const elementEl = this._createElement()
    applyBlockAttributes(el, elementEl, this.section, this.slide)
    this._bindReferences(el, elementEl)
    el.appendChild(elementEl)
  }

  clone() {
    const blockEl = Heed.ContentSectionFactory.buildSection({
      section: {
        ...this.section,
        type: this.model.section.type,
      },
      slide: this.slide,
    })

    blockEl.model.dimensionContextRect = this.getRootContainerRect()
    blockEl.model.sectionEl = blockEl
    blockEl.model.el = blockEl.querySelector('.heed-schematic-element')

    updateBlockAttributes(
      blockEl,
      blockEl.model.el,
      blockEl.model.controller.section,
      this.slide
    )

    for (const child of this.model.children) {
      const childCtrl = child.controller.clone()
      blockEl.model.el.appendChild(childCtrl.model.sectionEl)
      childCtrl.model.sectionEl.style.width = child.sectionEl.style.width
      childCtrl.model.sectionEl.style.top = child.sectionEl.style.top
      childCtrl.model.sectionEl.style.left = child.sectionEl.style.left
    }

    return blockEl._controller
  }
}
