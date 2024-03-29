import theme from '@/styles/ChakraTheme'
import { ColorModeScript } from '@chakra-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
