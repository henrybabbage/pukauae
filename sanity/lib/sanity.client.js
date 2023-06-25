import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn, studioUrl } from '../env'

export const client = createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn,
    studioUrl
})
