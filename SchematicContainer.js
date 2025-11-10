import { getAttributes } from './block-props.js'
import { findConnections } from './Connection.js'
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

  updateConnections(substitutes = {}) {
    const blocks = this.getBlocks().map((bl) => {
      return substitutes[bl.id] ?? bl
    })

    const containerRect = this.model.el.getBoundingClientRect()

    this.connSvg.setAttribute(
      'viewBox',
      `0 0 ${containerRect.width} ${containerRect.height}`
    )

    const refreshed = []

    blocks
      .reduce((result, block) => {
        return [...result, ...findConnections(block, blocks)]
      }, [])
      .forEach((conn) => {
        const connId = `conn--${conn.from.id}--to--${conn.to.id}`
        refreshed.push(connId)

        let line = this.connSvg.querySelector(`#${connId}`)

        if (!line) {
          line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('id', connId)
          this.connSvg.appendChild(line)
        }

        const fromRect = conn.from.el.getBoundingClientRect()
        const toRect = conn.to.el.getBoundingClientRect()

        line.classList.add('heed-schematic-connection')
        line.setAttribute(
          'x1',
          fromRect.left + fromRect.width / 2 - containerRect.left
        )
        line.setAttribute('y1', fromRect.bottom - containerRect.top)
        line.setAttribute(
          'x2',
          toRect.left + toRect.width / 2 - containerRect.left
        )
        line.setAttribute('y2', toRect.top - containerRect.top)
        line.setAttribute('stroke', 'black')
        line.setAttribute('stroke-width', 3)
        line.setAttribute('marker-end', 'url(#arrowhead)')
      })

    this.connSvg
      .querySelectorAll('.heed-schematic-connection')
      .forEach((line) => {
        if (!refreshed.includes(line.id)) {
          console.log(`No ${line.id} in ${refreshed}`)
          line.remove()
        }
      })
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

    const SVG_NS = 'http://www.w3.org/2000/svg'
    this.connSvg = document.createElementNS(SVG_NS, 'svg')
    this.connSvg.classList.add('heed-schematic-connection-layer')
    this.connSvg.setAttribute('viewBox', `0 0 1000 1000`)

    const defs = document.createElementNS(SVG_NS, 'defs')
    this.connSvg.appendChild(defs)

    const marker = document.createElementNS(SVG_NS, 'marker')
    marker.setAttribute('id', 'arrowhead')
    marker.setAttribute('markerWidth', '8')
    marker.setAttribute('markerHeight', '7')
    marker.setAttribute('refX', '8')
    marker.setAttribute('refY', '3.5')
    marker.setAttribute('orient', 'auto')

    defs.appendChild(marker)

    const polygon = document.createElementNS(SVG_NS, 'polygon')
    polygon.setAttribute('points', '0 0, 8 3.5, 0 7')
    polygon.setAttribute('fill', 'black')
    marker.appendChild(polygon)

    containerDiv.appendChild(this.connSvg)

    el.appendChild(containerDiv)
  }
}

Heed.ContentSectionRegistry.register('schematic:container', SchematicContainer)
