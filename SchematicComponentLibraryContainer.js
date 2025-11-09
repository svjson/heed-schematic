import { SchematicContainer } from './SchematicContainer.js'

class SchematicComponentLibraryContainer extends SchematicContainer {
  constructor(section, slide) {
    super(section, slide, {
      schematicType: 'component-library',
    })
  }

  addDropListener() {}
}

Heed.ContentSectionRegistry.register(
  'schematic:component-library',
  SchematicComponentLibraryContainer
)
