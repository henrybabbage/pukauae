import { Box, Center, Flex, HStack, Text, useDisclosure } from '@chakra-ui/react'
import { rhumbBearing } from '@turf/turf'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMapGL, { Layer, Source } from 'react-map-gl'

import DigitalClock from './DigitalClock'
import MonthDisplay from './MonthDisplay'

import useStorage from '@/hooks/useStorage'
import { Mobile, TabletAndAbove } from '@/utils/breakpoints'
import { FocusIcon, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Client } from 'react-hydration-provider'
import MapErrorDrawer from './MapErrorDrawer'
import MapModal from './MapModal'
import MapOverlay from './MapOverlay'
import MapProgress from './MapProgress'
import MoonPhaseDisplay from './MoonPhaseDisplay'

export default function Map({ wahine, haerenga }) {
    // Taranaki, New Zealand [Longitude, Latitiude]
    // Negative values denote Southern Hemisphere
    // rhumbBearing function wants order: [Lng, Lat]
    const taranakiLatLng = [174.063848, -39.296128]

    // reference from https://turfjs.org/docs/#rhumbBearing
    function handleMapBearing(newLatlng) {
        return rhumbBearing(taranakiLatLng, newLatlng) - 180
    }

    const { getItem, setItem, removeItem } = useStorage()

    const [mapIsVisible, setMapIsVisible] = useState(false)
    const [selectedWahineIndex, setSelectedWahineIndex] = useState(0)
    const [selectedWahine, setSelectedWahine] = useState(null)
    const [viewport, setViewport] = useState(() => {
        const randomIndex = Math.floor(Math.random() * wahine?.features?.length)
        setSelectedWahine(wahine?.features[randomIndex]?.properties)
        const initialPoint = wahine?.features[randomIndex]?.properties?.wahi
        return {
            latitude: initialPoint?.ahuahanga?.lat,
            longitude: initialPoint?.ahuahanga?.lng,
            activeId: wahine.features[randomIndex]?.id,
            // bearing should be provided in [Lng, Lat] order
            bearing: handleMapBearing([initialPoint?.ahuahanga?.lng, initialPoint?.ahuahanga?.lat]),
            pitch: 100,
            zoom: 11
        }
    }, [])

    const [mapIsIdle, setMapIsIdle] = useState(false)
    const [mapIsMoving, setMapIsMoving] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [introShown, setIntroShown] = useState(false)
    const [mapError, setMapError] = useState(false)
    const mapRef = useRef(null)
    const hoveredStateIdRef = useRef(null)
    const touchRef = useRef(null)

    const layerStyle = {
        id: 'wahine',
        type: 'symbol',
        source: 'taranaki-data',
        tolerance: 0,
        layout: {
            'icon-size': 0.35,
            'icon-allow-overlap': true,
            'text-allow-overlap': true,
            'text-ignore-placement': false,
            'text-optional': true,
            'text-field': ['get', 'title'],
            'text-font': ['Arial Unicode MS Bold'],
            'text-size': ['case', ['==', ['get', 'id'], selectedWahine ? selectedWahine?.id : null], 18, 14],
            'text-offset': [0, 1.25],
            'text-variable-anchor': [
                'top',
                'bottom',
                'left',
                'right',
                'center',
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right'
            ],
            'text-radial-offset': 1.25
        },
        paint: {
            'icon-color': '#ffffff',
            'text-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                '#f9abab',
                ['case', ['==', ['get', 'id'], selectedWahine ? selectedWahine?.id : null], '#f9abab', '#ffffff']
            ]
        }
    }

    const mapModal = useDisclosure()
    const instructionsModal = useDisclosure()
    const errorDrawer = useDisclosure()

    useEffect(() => {
        const intro = getItem('intro-shown', 'local')
        if (!intro) {
            instructionsModal.onOpen()
            setTimeout(() => {
                setIntroShown(true)
                setItem('intro-shown', true, 'local')
            }, 60000)
        } else {
            setIntroShown(true)
        }
    }, [])

    useEffect(() => {
        if (mapError) {
            errorDrawer.onOpen()
            setTimeout(() => {
                location.reload()
            }, 2500)
        }
    }, [mapError])

    useEffect(() => {
        if (!mapIsMoving && mapIsIdle && modalOpen) {
            mapModal.onOpen()
        } else if (mapModal.isOpen && !modalOpen) {
            mapModal.onClose()
        }
    }, [mapIsMoving, mapIsIdle, modalOpen])

    useEffect(() => {
        selectedWahine &&
            setSelectedWahineIndex(wahine.features.findIndex((w) => w.properties.id === selectedWahine.id))
    }, [selectedWahine])

    const handlePrevClick = () => {
        mapModal.isOpen && mapModal.onClose()
        setMapIsMoving(true)
        setModalOpen(true)
        const prevIndex = selectedWahineIndex === wahine.features.length - 1 ? 0 : selectedWahineIndex + 1
        setSelectedWahine(wahine.features[prevIndex].properties)
        const previousCoords = [
            wahine.features[prevIndex].properties.wahi.ahuahanga.lng,
            wahine.features[prevIndex].properties.wahi.ahuahanga.lat
        ]
        mapRef.current.flyTo({
            center: previousCoords,
            pitch: 70,
            duration: 3000,
            bearing: handleMapBearing(previousCoords)
        })
    }

    const handleNextClick = () => {
        mapModal.isOpen && mapModal.onClose()
        setMapIsMoving(true)
        setModalOpen(true)
        const nextIndex = selectedWahineIndex === 0 ? wahine.features.length - 1 : selectedWahineIndex - 1
        setSelectedWahine(wahine.features[nextIndex].properties)
        const nextCoords = [
            wahine.features[nextIndex].properties.wahi.ahuahanga.lng,
            wahine.features[nextIndex].properties.wahi.ahuahanga.lat
        ]
        mapRef.current.flyTo({
            center: nextCoords,
            pitch: 70,
            duration: 3000,
            bearing: handleMapBearing(nextCoords)
        })
    }

    // This converts the stringified object to JS object notation. Note: we need to handle any objects passed down here. Something to consider around the handling and storing of data.
    const convertJSONProperties = (p) => {
        if (p) {
            return {
                ...p,
                kiriata: JSON.parse(p.kiriata),
                korero_pukauae: JSON.parse(p.korero_pukauae),
                korero_wahi: JSON.parse(p.korero_wahi),
                wahi: JSON.parse(p.wahi),
                whakaahua: JSON.parse(p.whakaahua || '{}')
            }
        }
    }

    const onClick = useCallback(
        (e) => {
            if (e.features.length && e.features[0].properties) {
                const wahineProperties = convertJSONProperties(e.features[0].properties)
                if (selectedWahine.id !== wahineProperties.id) {
                    setSelectedWahine(wahineProperties)
                    const clickedCoords = [wahineProperties.wahi.ahuahanga.lng, wahineProperties.wahi.ahuahanga.lat]
                    mapRef.current.flyTo({
                        center: clickedCoords,
                        pitch: 70,
                        duration: 3000,
                        bearing: handleMapBearing(clickedCoords)
                    })
                    setMapIsMoving(true)
                    setModalOpen(true)
                } else if (selectedWahine.id == wahineProperties.id) {
                    setMapIsMoving(false)
                    setModalOpen(true)
                }
            }
        },
        [selectedWahine]
    )

    const onMapLoad = useCallback(() => {
        mapRef &&
            mapRef.current &&
            mapRef.current.on('mousemove', 'wahine', (e) => {
                if (e.features.length > 0) {
                    if (hoveredStateIdRef.current !== null) {
                        mapRef?.current?.setFeatureState(
                            { source: 'taranaki-data', id: hoveredStateIdRef.current },
                            { hover: false }
                        )
                    }
                    hoveredStateIdRef.current = e.features[0].id
                    mapRef?.current?.setFeatureState(
                        { source: 'taranaki-data', id: hoveredStateIdRef.current },
                        { hover: true }
                    )
                }
            })
        mapRef &&
            mapRef.current &&
            mapRef.current.on('mouseleave', 'wahine', () => {
                if (hoveredStateIdRef.current !== null) {
                    mapRef?.current?.setFeatureState(
                        { source: 'taranaki-data', id: hoveredStateIdRef.current },
                        { hover: false }
                    )
                }
                hoveredStateIdRef.current = null
            })
    }, [])

    // NB: ?optimize=true removed from mapbox style url to prevent mapbox error
    return (
        <>
            {/* Appears when Mapbox error is thrown */}
            <MapErrorDrawer isOpen={errorDrawer.isOpen} onOpen={errorDrawer.onOpen} onClose={errorDrawer.onClose} />
            {/* Instructions modal will be open by default when page mounts if local storage intro-shown key is null */}
            {!introShown && (
                <MapOverlay
                    haerenga={haerenga}
                    isOpen={instructionsModal.isOpen}
                    onOpen={instructionsModal.onOpen}
                    onClose={instructionsModal.onClose}
                />
            )}
            {/* Fallback display before map mounts */}
            <Center h="100vh" w="100vw" position="fixed" inset="0" overflow="hidden" bg="grey.900">
                <Box
                    position="relative"
                    h={['70px', '70px', '70px', '120px', '120px', '120px']}
                    w={['70px', '70px', '70px', '120px', '120px', '120px']}
                >
                    <Image
                        src="/icons/pukauae.svg"
                        alt="Pukauae logo"
                        fill
                        priority
                        sizes="100vw"
                        style={{
                            objectFit: 'contain',
                            objectPosition: 'center'
                        }}
                    />
                </Box>
            </Center>
            <Box
                id="map-container"
                maxH="100dvh"
                h="100vh"
                w="100vw"
                cursor="auto"
                position="relative"
                opacity={mapIsVisible ? 1 : 0}
                transition="opacity 0.5s ease-in"
                transitionDelay="1s"
                sx={{
                    maxHeight: '-webkit-fill-available'
                }}
            >
                {selectedWahine && (
                    <MapModal
                        isOpen={mapModal.isOpen}
                        onOpen={mapModal.onOpen}
                        onClose={() => setModalOpen(false)}
                        wahine={wahine}
                        selectedWahine={selectedWahine}
                        selectedWahineIndex={selectedWahineIndex}
                        handleNextClick={handleNextClick}
                        handlePrevClick={handlePrevClick}
                    />
                )}
                <ReactMapGL
                    {...viewport}
                    reuseMaps
                    ref={mapRef}
                    pitch={60}
                    width="100%"
                    height="100%"
                    cursor="pointer"
                    position="relative"
                    scrollZoom={false}
                    boxZoom={false}
                    doubleClickZoom={false}
                    dragRotate={false}
                    dragPan={false}
                    localFontFamily={'SohneBreit_Buch'}
                    mapboxAccessToken={process.env.MAPBOX_API_TOKEN}
                    onMove={(event) => setViewport(event.viewport)}
                    onTouchStart={(e) => {
                        touchRef.current = e.point
                    }}
                    onTouchEnd={(e) => {
                        if (Math.abs(touchRef.current.x - e.point.x > 50)) {
                            touchRef.current.x > e.point.x ? handleNextClick() : handlePrevClick()
                        }
                    }}
                    onMouseDown={(e) => {
                        touchRef.current = e.point
                    }}
                    onMouseUp={(e) => {
                        if (Math.abs(touchRef.current.x - e.point.x > 50)) {
                            touchRef.current.x > e.point.x ? handleNextClick() : handlePrevClick()
                        }
                    }}
                    mapStyle="mapbox://styles/henrybabbage/clfr4mju3000301mopx95pkck"
                    terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                    interactiveLayerIds={['wahine']}
                    onClick={onClick}
                    onLoad={(e) => {
                        setMapIsVisible(true), onMapLoad(e)
                    }}
                    onIdle={() => {
                        setMapIsIdle(true)
                        setMapIsMoving(false)
                    }}
                    onMoveStart={() => {
                        setMapIsIdle(false)
                        setMapIsMoving(true)
                    }}
                    onError={() => setMapError(true)}
                    style={{ fontWeight: 'normal' }}
                >
                    <Source id="taranaki-data" type="geojson" data={wahine} tolerance={0} generateId={true} />
                    <Layer source="taranaki-data" {...layerStyle} />
                </ReactMapGL>
                <Client>
                    <TabletAndAbove>
                        <Flex
                            justifyContent="space-between"
                            position="fixed"
                            bottom={['6', '6', '8', '8', '8', '8']}
                            left="8"
                        >
                            <HStack spacing="24px" z="20">
                                <Flex gap="12px">
                                    <MapPin strokeWidth={2} color="#FFD233" size={20} />
                                    <Text
                                        fontFamily="subheading"
                                        fontSize="14px"
                                        lineHeight="1"
                                        textAlign="left"
                                        color="#FFD233"
                                        pb="2"
                                    >
                                        {selectedWahine?.wahi?.ingoa}
                                    </Text>
                                </Flex>
                                <Flex gap="12px">
                                    <FocusIcon strokeWidth={2} color="#FFD233" size={20} />
                                    <Text
                                        fontFamily="subheading"
                                        fontSize="14px"
                                        lineHeight="1"
                                        textAlign="left"
                                        color="#FFD233"
                                        pb="2"
                                    >
                                        {selectedWahine?.ingoa}
                                    </Text>
                                </Flex>
                            </HStack>
                            <HStack
                                spacing="24px"
                                position="fixed"
                                z="20"
                                bottom={['6', '6', '8', '8', '8', '8']}
                                right="8"
                            >
                                <Box w="80px"></Box>
                                <Box id="local-time" position="absolute">
                                    <DigitalClock />
                                </Box>
                                <Text
                                    fontFamily="subheading"
                                    fontSize="14px"
                                    lineHeight="1"
                                    textAlign="left"
                                    color="#FFD233"
                                    pb="2"
                                >
                                    {' • '}
                                </Text>
                                <MonthDisplay />
                                <Text
                                    fontFamily="subheading"
                                    fontSize="14px"
                                    lineHeight="1"
                                    textAlign="left"
                                    color="#FFD233"
                                    pb="2"
                                >
                                    {' • '}
                                </Text>
                                <MoonPhaseDisplay />
                            </HStack>
                        </Flex>
                    </TabletAndAbove>
                    <Mobile>
                        <Flex w="100%" justifyContent="center" position="fixed" bottom="6" px="24">
                            <Text
                                fontFamily="subheading"
                                fontSize="14px"
                                lineHeight="1"
                                textAlign="center"
                                color="#FFD233"
                                pb="2"
                            >
                                {'Swipe left or right, or tap a name on the map to navigate'}
                            </Text>
                        </Flex>
                    </Mobile>
                </Client>
                <MapProgress pending={mapIsMoving && !mapModal.isOpen} />
            </Box>
        </>
    )
}
