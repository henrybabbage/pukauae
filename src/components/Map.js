import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import { rhumbBearing } from '@turf/turf'
import GeoJSON from 'geojson'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'
import ReactMapGL, { Layer, Source } from 'react-map-gl'
import DigitalClock from './DigitalClock'
import WahineModal from './WahineModal'

const randomFirstWahine = () => {
    const index = Math.floor(Math.random() * 15)
    return index
}

const latLngOptions = [
    { latitude: -39.565997787590135, longitude: 174.29172348541545 },
    { latitude: -39.565997787590135, longitude: 174.29172348541545 },
    { latitude: -39.582078648735035, longitude: 174.15676449475075 },
    { latitude: -39.582078648735035, longitude: 174.15676449475075 },
    { latitude: -39.3252965231007, longitude: 174.1073037804627 },
    { latitude: -39.318496306584905, longitude: 174.099359208252 },
    { latitude: -39.367594679853745, longitude: 173.8095453055592 },
    { latitude: -39.2885374, longitude: 173.8397035 },
    { latitude: -39.2885374, longitude: 173.8397035 },
    { latitude: -39.24832985708955, longitude: 173.9354912075433 },
    { latitude: -39.157052852754376, longitude: 174.21095456800253 },
    { latitude: -39.06191077154044, longitude: 174.02025238525744 },
    { latitude: -39.03801449196456, longitude: 174.11135608585238 },
    { latitude: -38.98841455903835, longitude: 174.2233916041253 },
    { latitude: -39.06782525043155, longitude: 174.26466659215401 },
    { latitude: -38.98954738956933, longitude: 174.40478763948636 }
]

const randomStartPoint =
    latLngOptions[Math.floor(Math.random() * latLngOptions.length)]

export default function Map({ data }) {
    const mapRef = useRef(null)
    const [selectedWahineIndex, setSelectedWahineIndex] = useState(0)
    const [viewport, setViewport] = useState({
        latitude: randomStartPoint.latitude,
        longitude: randomStartPoint.longitude,
        // latitude: -39.296128,
        // longitude: 174.063848,
        bearing: 90,
        pitch: 70,
        zoom: 12,
        scrollZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
        dragRotate: false,
        dragPan: false
    })
    const [mapData, setMapData] = useState(null)

    const { wahines, portraits, posters, baseUrlVideo } = data

    const taranakiLatLng = [174.063848, -39.296128]

    useEffect(() => {
        const wahi = wahines.map((wahine) => {
            return {
                id: wahine.id,
                title: wahine.ingoa,
                lat: wahine.wahi.ahuahanga[1],
                lng: wahine.wahi.ahuahanga[0],
                centroid: wahine.wahi.ahuahanga
            }
        })
        const newMapData = GeoJSON.parse(wahi, { Point: ['lat', 'lng'] })

        setMapData(newMapData)
    }, [wahines])

    const layerStyle = {
        id: 'wahine',
        type: 'symbol',
        source: 'taranaki-data',
        tolerance: 0,
        layout: {
            'icon-image': 'diamond',
            'icon-size': 0.35,
            'icon-allow-overlap': true,
            'text-optional': true,
            // get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': ['Arial Unicode MS Bold'],
            'text-offset': [0, 1.25],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right']
        },
        paint: {
            'icon-color': '#ffffff',
            'text-color': '#ffffff'
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    function handleMapBearing(newLatlng) {
        return rhumbBearing(taranakiLatLng, newLatlng)
    }

    const handlePrevClick = () => {
        const prevIndex =
            selectedWahineIndex === wahines.length - 1
                ? 0
                : (selectedWahineIndex + 1) % wahines.length
        prevIndex &&
            setSelectedWahineIndex(() => {
                setTimeout(() => {
                    onOpen()
                }, 3200)
                return prevIndex
            })

        mapRef.current.flyTo({
            center: wahines[prevIndex].wahi.ahuahanga,
            pitch: 70,
            duration: 3000,
            bearing: handleMapBearing(wahines[prevIndex].wahi.ahuahanga) - 180
        })
    }

    const handleNextClick = () => {
        const nextIndex =
            selectedWahineIndex === 0
                ? wahines.length - 1
                : (selectedWahineIndex - 1) % wahines.length
        nextIndex &&
            setSelectedWahineIndex(() => {
                setTimeout(() => {
                    onOpen()
                }, 3200)
                return nextIndex
            })
        mapRef.current.flyTo({
            center: wahines[nextIndex].wahi.ahuahanga,
            pitch: 70,
            duration: 3000,
            bearing: handleMapBearing(wahines[nextIndex].wahi.ahuahanga) - 180
        })
    }

    const wahinesArrayLength = wahines.length

    const onClick = (e) => {
        if (e.features.length && e.features[0].properties) {
            const { id } = e.features[0].properties
            const clickedWahine = wahines.find((wahine) => wahine.id === id)

            clickedWahine &&
                setSelectedWahineIndex(() => {
                    setTimeout(() => {
                        onOpen()
                    }, 3200)
                    return clickedWahine.id - 1
                })
            mapRef.current.flyTo({
                center: wahines[clickedWahine.id - 1].wahi.ahuahanga,
                pitch: 70,
                duration: 3000,
                bearing:
                    handleMapBearing(
                        wahines[clickedWahine.id - 1].wahi.ahuahanga
                    ) - 180
            })
        }
    }

    return (
        <Box h="100vh" w="100vw" cursor="auto" position="relative">
            <WahineModal
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                wahines={wahines}
                images={portraits}
                covers={posters}
                baseUrlVideo={baseUrlVideo}
                selectedWahineIndex={selectedWahineIndex}
                handleNextClick={handleNextClick}
                handlePrevClick={handlePrevClick}
            />
            <ReactMapGL
                {...viewport}
                reuseMaps
                ref={mapRef}
                width="100%"
                height="100%"
                position="relative"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                onMove={(event) => setViewport(event.viewport)}
                mapStyle="mapbox://styles/henrybabbage/clfr4mju3000301mopx95pkck?optimize=true"
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                interactiveLayerIds={['wahine']}
                onClick={onClick}
            >
                <Box
                    position="absolute"
                    left="1rem"
                    top="50%"
                    transform="translateY(-50%)"
                >
                    <IconButton
                        aria-label="Previous Wahine"
                        icon={<ChevronLeftIcon color="black" />}
                        onClick={handlePrevClick}
                        isRound
                        mr={2}
                    />
                </Box>
                <Box
                    position="absolute"
                    right="1rem"
                    top="50%"
                    transform="translateY(-50%)"
                >
                    <IconButton
                        aria-label="Next Wahine"
                        icon={<ChevronRightIcon color="black" />}
                        onClick={handleNextClick}
                        isRound
                        ml={2}
                    />
                </Box>
                {mapData && (
                    <Source
                        id="taranaki-data"
                        type="geojson"
                        data={mapData}
                        tolerance={0}
                    />
                )}
                <Layer source="taranaki-data" {...layerStyle} />
            </ReactMapGL>
            <Box id="local-time" position="fixed" left="6" bottom="6">
                <DigitalClock />
            </Box>
            <HStack spacing="24px" position="fixed" z="20" bottom="6" left="32">
                <Text
                    fontFamily="subheading"
                    fontSize="14px"
                    lineHeight="1"
                    textAlign="left"
                    color="white"
                    pb="2"
                >
                    {' • '}
                </Text>
                <Text
                    id="month"
                    fontFamily="subheading"
                    fontSize="14px"
                    lineHeight="1"
                    textAlign="left"
                    color="white"
                    pb="2"
                >
                    {'Paenga-whāwhā'}
                </Text>
                <Text
                    fontFamily="subheading"
                    fontSize="14px"
                    lineHeight="1"
                    textAlign="left"
                    color="white"
                    pb="2"
                >
                    {' • '}
                </Text>
                <Text
                    id="moon-phase"
                    fontFamily="subheading"
                    fontSize="14px"
                    lineHeight="1"
                    textAlign="left"
                    color="white"
                    pb="2"
                >
                    {'Ohua'}
                </Text>
            </HStack>
        </Box>
    )
}
