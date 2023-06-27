export default {
    name: 'kiriata',
    title: 'Kiriata',
    type: 'object',
    fields: [
        {
            name: 'ingoa',
            title: 'Ingoa',
            type: 'string'
        },
        {
            name: 'url_1080p',
            title: '1080p',
            type: 'string',
            readOnly: true
        },
        {
            name: 'url_1080p_cloudinary',
            title: 'Video cloudinary',
            type: 'cloudinary.asset',
            form: {
                image: {
                    assetSources: (previousAssetSources, context) => {
                        if (
                            context.currentUser?.roles.includes(
                                'cloudinaryAccess'
                            )
                        ) {
                            // appends cloudinary as an asset source
                            return [
                                ...previousAssetSources,
                                cloudinaryImageSource
                            ]
                        }
                        if (
                            context.currentUser?.roles.includes(
                                'onlyCloudinaryAccess'
                            )
                        ) {
                            // only use clooudinary as an asset source
                            return [cloudinaryImageSource]
                        }
                        // dont add cloudnary as an asset sources
                        return previousAssetSources
                    }
                }
            },
            description: 'Video stored in Cloudinary'
        },
        {
            name: 'poster',
            title: 'Poster',
            type: 'whakaahua'
        }
    ],
    preview: {
        select: {
            title: 'ingoa',
            media: 'poster'
        }
    }
}
