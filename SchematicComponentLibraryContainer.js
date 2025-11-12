import { SchematicContainer } from './SchematicContainer.js'

/**
 * "Component Library" container block.
 *
 * Contains schematic components that can be dragged and dropped onto
 * other containers/surfaces to be "instantiated" as schematic blocks.
 */
class SchematicComponentLibraryContainer extends SchematicContainer {
  constructor(section, slide) {
    super(section, slide, {
      schematicType: 'component-library',
    })
  }

  // override
  acceptAction(childModel) {
    if (childModel.schematicType === 'block' && !childModel.transient) {
      return {
        action: 'dispose',
      }
    }
  }

  // override
  acceptsChildType() {
    return false
  }
}

Heed.ContentSectionRegistry.register(
  'schematic:component-library',
  SchematicComponentLibraryContainer
)
