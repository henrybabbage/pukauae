import { Box, Grid } from '@chakra-ui/react'
import Image from 'next/image'

export default function VideoCover({ showCover }) {
    return (
        <Box
            position="absolute"
            opacity={showCover ? 100 : 0}
            transition="opacity ease-in-out"
            transitionDuration="0.3s"
        >
            <Grid
                z="10"
                w="100%"
                h="75vh"
                placeSelf="center"
                position="relative"
                overflow="hidden"
            >
                <Image
                    src="/images/duotone.jpg"
                    alt="video preview image"
                    width="1200"
                    height="592"
                    sizes="100vw"
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'center'
                    }}
                />
            </Grid>
        </Box>
    )
}
