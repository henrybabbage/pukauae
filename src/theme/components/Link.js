import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system'

const baseStyle = defineStyle({
    fontFamily: 'secondary',
    fontWeight: 'normal',
    textDecoration: 'none'
})

const sizes = {
    lg: defineStyle({
        fontSize: 'lg'
    }),
    md: defineStyle({
        fontSize: 'md'
    }),
    sm: defineStyle({
        fontSize: 'sm'
    })
}

const menuVariant = defineStyle({
    fontFamily: 'secondary',
    textColor: 'white',
    transition: 'transform 0.15s ease-out',
    _hover: {
        textDecoration: 'none',
        textColor: 'pink'
    }
})

export const linkTheme = defineStyleConfig({
    baseStyle,
    sizes,
    variants: {
        menu: menuVariant
    }
})
