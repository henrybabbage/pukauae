import { Link as ChakraLink } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function NavLink({ href, children, isSiteTitle = false }) {
    const router = useRouter()
    const isActive = router.pathname === href
    const hoverColor = 'pink.200'
    const activeColor = 'pink.200'
    return (
        <ChakraLink
            as={NextLink}
            variant="menu"
            href={href}
            color={isActive && !isSiteTitle ? activeColor : 'white'}
            textDecoration={
                isActive && !isSiteTitle && `underline ${activeColor} 2px`
            }
            _hover={{
                color: hoverColor,
                textDecoration: `underline ${hoverColor} 2px`
            }}
            scroll={false}
            position="fixed"
        >
            {children}
        </ChakraLink>
    )
}
