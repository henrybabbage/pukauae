/* eslint-disable indent */
/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/pages/studio/[[...index]].jsx` route
 */

import { visionTool } from '@sanity/vision'
import { theme } from 'https://themer.sanity.build/api/hues?default=c3918f&primary=c3918f&transparent=c3918f&darkest=141414'
import { defineConfig } from 'sanity'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { media } from 'sanity-plugin-media'
import { structureTool } from 'sanity/structure'
import { defaultDocumentNode } from './src/sanity/utils/defaultDocumentNode'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { BlockContentIcon, CogIcon, UserIcon, UsersIcon } from '@sanity/icons'
import { MapIcon } from 'lucide-react'
import { apiVersion, dataset, projectId, title } from './src/sanity/env'
import { schema } from './src/sanity/schema'

// Define the actions that should be available for singleton documents
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Define the singleton document types
const singletonTypes = new Set(['korero', 'kaiwhakaahua', 'config', 'haerenga'])

export default defineConfig({
    theme,
    basePath: '/studio',
    projectId,
    dataset,
    title,
    // Add and edit the content schema in the './sanity/schema' folder
    schema: {
        types: schema.types,
        templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType))
    },
    plugins: [
        structureTool({
            defaultDocumentNode,
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.documentTypeListItem('wahine').title('Wahine').icon(UsersIcon),
                        // Singleton type has a list item with a custom child
                        S.listItem()
                            .title('Kaiwhakaahua')
                            .id('kaiwhakaahua')
                            .icon(UserIcon)
                            .child(S.document().schemaType('kaiwhakaahua').documentId('kaiwhakaahua')),
                        S.listItem().title('Korero').id('korero').icon(BlockContentIcon).child(
                            // Instead of rendering a list of documents, we render a single
                            // document, specifying the `documentId` manually to ensure
                            // that we're editing the single instance of the document
                            S.document().schemaType('korero').documentId('korero')
                        ),
                        S.listItem()
                            .title('Haerenga')
                            .id('haerenga')
                            .icon(MapIcon)
                            .child(S.document().schemaType('haerenga').documentId('haerenga')),
                        S.listItem()
                            .title('Config')
                            .id('config')
                            .icon(CogIcon)
                            .child(S.document().schemaType('config').documentId('config'))
                    ])
        }),
        // Vision is a tool that lets you query your content with GROQ in the studio
        // https://www.sanity.io/docs/the-vision-plugin
        visionTool({ defaultApiVersion: apiVersion }),
        media(),
        cloudinarySchemaPlugin()
    ],
    document: {
        // For singleton types, filter out actions that are not explicitly included
        // in the `singletonActions` list defined above
        actions: (input, context) =>
            singletonTypes.has(context.schemaType)
                ? input.filter(({ action }) => action && singletonActions.has(action))
                : input
    }
})
