import {
  mostSpecificIntersection,
  rectCenter,
  rectOffset,
  rectOffsetPc,
  rectsIntersect,
} from './Dom.js'

export class SchematicSlideController {
  constructor(cfg, slide, slideEl) {
    this.cfg = cfg
    this.slide = slide
    this.slideEl = slideEl
    this.model = {}
    this.idSeq = 0
  }

  initializeView() {
    this.slideEl
      .querySelectorAll('.heed-schematic-container')
      .forEach((cnt) => {
        const model = cnt._controller.model
        this.model[model.id] = model
      })
    this.slideEl
      .querySelectorAll('.heed-schematic-component')
      .forEach((cmp) => this.addBlockLike(cmp))

    this.slideEl
      .querySelectorAll('.heed-schematic-block')
      .forEach((cmp) => this.addBlockLike(cmp))
  }

  addBlockLike(blk) {
    const model = blk._controller.model
    this.model[model.id] = model
    this._makeDraggable(blk)
  }

  _makeDraggable(el) {
    el.addEventListener('mousedown', (e) => this._startDrag(e, el))
  }

  _startDrag(e, el) {
    if (e.button !== 0) return
    e.preventDefault()
    if (this.dragOp) return
    const id = el.id
    const block = this.model[id]
    const rect = block.sectionEl.getBoundingClientRect()
    this.dragOp = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: e.clientX,
      origY: e.clientY,
      source: block.controller,
      model: block,
      dragHandle: block.controller.getDragHandle({
        slideEl: this.slideEl,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }),
    }

    window.addEventListener('mousemove', this._onDrag)
    window.addEventListener('mouseup', this._endDrag)
  }

  _onDrag = (e) => {
    if (!this.dragOp) return
    const { startX, startY, origX, origY } = this.dragOp
    const dx = e.clientX - startX,
      dy = e.clientY - startY
    const model = this.dragOp.model
    const handleEl = this.dragOp.dragHandle
    handleEl.style.transform = `translate(${dx}px, ${dy}px)`
    /*
    this.connections.forEach((conn) => {
      if (conn.from === id || conn.to === id) this._updateConnection(conn)
    })
     */
    const dropTarget = this._findDropTarget(handleEl)
    const container = dropTarget?.model.controller.getContainer()
    //dropTarget.model.controller.updateConnections()
    if (container) {
      container.updateConnections(
        handleEl.model.controller.getBlocks().reduce((result, blk) => {
          result[blk.id] = blk
          return result
        }, {})
      )
    }
  }

  _endDrag = (e) => {
    if (!this.dragOp) return
    const dragHandle = this.dragOp.dragHandle
    const dropTarget = this._findDropTarget(dragHandle)

    if (dropTarget) {
      const slot = Array.isArray(dropTarget.slot)
        ? dropTarget.slot.at(-1)
        : null

      const attachLeft = `${slot?.x ?? dropTarget.position.x}px`
      const attachTop = `${slot?.y ?? dropTarget.position.y}px`

      if (dragHandle.model.transient) {
        if (Array.isArray(dropTarget.slot)) {
          dropTarget.model.children.forEach((child, i) => {
            child.sectionEl.style.left = `${dropTarget.slot[i].x}px`
          })
        }

        const blockEl = Heed.ContentSectionFactory.buildSection({
          section: {
            ...dragHandle.model.section,
            id: `${dragHandle.model.section.id}-${++this.idSeq}`,
            type: 'schematic:block',
          },
          slide: this.slide,
        })
        blockEl.style.position = 'absolute'
        blockEl.style.left = attachLeft
        blockEl.style.top = attachTop

        dropTarget.model.el.appendChild(blockEl)
        blockEl.model.parent = dropTarget.model

        queueMicrotask(() => {
          this.addBlockLike(blockEl.querySelector('.heed-schematic-element'))
          this.updateConnections(blockEl.model)
        })
      } else if (dropTarget.model.controller.isDirectParent(dragHandle.model)) {
        const el = this.dragOp.source.model.sectionEl

        if (!dropTarget.slot) {
          el.style.position = 'absolute'
          el.style.right = null
          el.style.bottom = null
          el.style.left = attachLeft
          el.style.top = attachTop
        }
      }
    }

    window.removeEventListener('mousemove', this._onDrag)
    window.removeEventListener('mouseup', this._endDrag)
    this.dragOp.source.returnDragHandle(dragHandle)
    this.dragOp = null

    Object.entries(this.model).forEach(([id, model]) => {
      if (model.schematicType === 'container') {
        model.controller.updateConnections()
      }
    })
  }

  updateConnections(model) {
    const container = model.controller.getContainer()
    if (container) {
      container.updateConnections()
    }
  }

  _findDropTarget(dragHandle) {
    const handleRect = dragHandle.getBoundingClientRect()
    const intersecting = []

    Object.entries(this.model).forEach(([id, objModel]) => {
      const objRect = objModel.el.getBoundingClientRect()
      if (
        rectsIntersect(handleRect, objRect) &&
        objModel.controller.acceptsChildType(dragHandle.model)
      ) {
        intersecting.push({
          model: objModel,
          rect: objRect,
        })
      }
    })

    const target = mostSpecificIntersection(handleRect, intersecting)
    if (target) {
      const { x, y } = rectOffsetPc(target.rect, handleRect)
      target.model.el.classList.add('heed-schematic-current-drop-target')
      target.model.el.style.setProperty('--x', `${x}%`)
      target.model.el.style.setProperty('--y', `${y}%`)
    }

    Object.entries(this.model).forEach(([id, objModel]) => {
      if (!target || objModel !== target.model) {
        objModel.el.classList.remove('heed-schematic-current-drop-target')
        objModel.el.style.setProperty('--x', `50%`)
        objModel.el.style.setProperty('--y', `50%`)
      }
    })

    if (target) {
      return {
        model: target.model,
        slot: target.model.controller.getSlotFor(dragHandle.model),
        position: {
          x: handleRect.left - target.rect.left,
          y: handleRect.top - target.rect.top,
        },
      }
    }
  }
}
