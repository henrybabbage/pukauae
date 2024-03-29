import { useMediaQuery } from 'react-responsive'

export const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 })
    return isDesktop ? children : null
}
export const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
    return isTablet ? children : null
}
export const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 })
    return isMobile ? children : null
}
export const TabletAndBelow = ({ children }) => {
    const isNotDesktop = useMediaQuery({ maxWidth: 991 })
    return isNotDesktop ? children : null
}
export const TabletAndAbove = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 })
    return isNotMobile ? children : null
}
