import {
  acceptsDropOfType,
  applyBlockAttributes,
  updateBlockAttributes,
} from './block-props.js'
import { addDomObserver } from './Dom.js'

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
  }

  acceptsChildType(childModel) {
    return (
      this.isDirectParent(childModel) ||
      acceptsDropOfType(this.slide, this.model, childModel)
    )
  }

  isDirectParent(childModel) {
    return this.model.children.some((child) => child.id === childModel.id)
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
}
