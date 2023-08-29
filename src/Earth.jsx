import ThreeGlobe from "three-globe";
import countries from './assets/custom.geo.json'
import { extend } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { MeshPhongMaterial } from "three";
import * as THREE from 'three'

import Globe from 'react-globe.gl'

extend({ Globe })



export default function Earth(props) {

    const globeRef = useRef()

    // let customGlobe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true })



    // console.log(customGlobe);

    useLayoutEffect(() => {
        let globeMat = new MeshPhongMaterial()

        // const globeMat = ThreeGlobe.globeMaterial()
        globeMat.color = new THREE.Color(0x3228a)
        globeMat.emission = new THREE.Color(0x220038)
        globeMat.emissionIntensity = 0.9;
        globeMat.shininess = 3.7
        globeRef.current.showAtmosphere(true)
        globeRef.current.atmosphereColor('red')
        globeRef.current.atmosphereAltitude('0.15')
        // Configure the globe
        // globeRef.current.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        // globeRef.current.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        globeRef.current.polygonsData(countries.features)
        globeRef.current.polygonCapColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
        console.log(globeRef.current.globeMaterial(globeMat));
        // globeRef.current.hexPolygonResolution(3)
        // globeRef.current.hexPolygonMargin(0.7)

    }, [])

    return <globe {...props} ref={globeRef} />

}