import { chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'

export const MotionSpan = chakra(motion.span, {
    /**
     * Allow motion props and non-Chakra props to be forwarded.
     */
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop)
})
