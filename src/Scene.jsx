import Globe from 'react-globe.gl'
import * as THREE from 'three'
import countries from './assets/finalmix2.json'
import { MeshPhongMaterial } from "three";
import { useEffect, useRef, useState, useReducer, useMemo } from 'react';
import Stars from './Stars';
import UI from './UI';
import CountryInfo from './CountryInfo';
import * as d3 from 'd3'
import {useControls } from "leva";




export default function Scene() {
    const [isHovered, setIsHovered] = useState(false)
    const [currentHover, setCurrentHover] = useState(null)
    const [currentFocus, setCurrentFocus] = useState(null)


    const forceUpdate = useReducer(() => ({}), {})[1]

    // console.log(countries);

    //Control to determine which statistic is viewed.
    const settings = useControls({
        statistic: { value: 'Population', options: ['Population', 'Agricultural Land( %)', 'Co2-Emissions', 'Birth Rate', 'GDP', 'Armed Forces size'] }
    });

    const globeRef = useRef()

    const color1 = useMemo(() => {
        // console.log("Initializing Colors");
        let colors = {}
        countries.forEach((x) => {
            colors[x.properties.Abbreviation] = `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`
        })
        return colors
    }, [countries])
    // parseInt(stringWithCommas.replace(/,/g, ""))
    const maxVal = useMemo(() => Math.max(...countries.map(x => x.properties[settings.statistic] ? (x.properties[settings.statistic].replace(/[,$%]/g, "")) : 0)), [settings.statistic])

    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    colorScale.domain([0, maxVal]);


    
    let globeMat = new MeshPhongMaterial()
    // console.log("-----".repeat(20));

    // console.log("Colors generated", color1);
    // console.log("Hover Status", isHovered, "Current state: ", currentHover);


    globeMat.color = new THREE.Color(0x32289a)
    globeMat.emission = new THREE.Color(0x220038)
    globeMat.emissionIntensity = 0.9;
    globeMat.shininess = 3.7

    useEffect(() => {
        //Adding stars to the scene
        let currentScene = globeRef.current.scene()
        currentScene.add(Stars())

        //Setting rotate speed
        let controls = globeRef.current.controls()
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        // console.log(controls);


        window.addEventListener('resize', forceUpdate)

        // GDP per capita (avoiding countries with small pop)

    }, [])

    const capColor = (current, prev) => {

        let cap = current.properties[settings.statistic] ? colorScale(parseInt(current.properties[settings.statistic].replace(/[,$%]/g, ""))) : "#ffffff"

        // console.log(current.properties[settings.statistic], cap);
        if (currentFocus && current.properties.Abbreviation == currentFocus?.properties.Abbreviation) {

            return '#FFC0CB'
        }
        else if (currentHover && (current.properties.Abbreviation === currentHover?.properties.Abbreviation)) {
            return '#FFC0CB'
        }

        // return `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`
        return cap
    }
    const hover = (current, prev) => {
        if (currentFocus) {
            return
        }
        // console.log("Currently Hovered", current, "Previous Hovered", prev);
        setCurrentHover(current ? current : null)
        setIsHovered(x => !x)
    }

    const click = (obj, event, { lat, lng, altitude }) => {
        // console.log("CLICK", obj);
        globeRef.current.pointOfView({ lat, lng, altitude: 2.5 }, 1000)

        setCurrentFocus(obj)

        globeRef.current.controls().autoRotateSpeed = 0;

    }

    const unfocus = () => {
        // console.log("UNFOCUSED");
        setCurrentFocus(null)
        setCurrentHover(null)

        globeRef.current.controls().autoRotateSpeed = 1;

    }

    const strokeAndSide = (obj) => {
        let abbrev = obj.properties.Abbreviation
        return color1[abbrev]
    }


    return (
        <>
            <Globe
                        polygonLabel={({ properties: d }) => `
                    <b>${d[settings.statistic]? settings.statistic +" ("+ d[settings.statistic] +")" : "NO DATA AVAILABLE"}</b>
                  `}
                onPolygonHover={hover}
                polygonAltitude={d => d === currentHover ? 0.09 : 0.01}
                height={innerHeight} width={innerWidth}
                ref={globeRef}
                polygonCapColor={capColor}
                globeMaterial={globeMat}
                atmosphereAltitude={0.40}
                animateIn
                polygonStrokeColor={strokeAndSide}
                polygonSideColor={strokeAndSide}
                polygonsData={countries}
                onPolygonClick={click} />
            <UI countryName={currentHover?.properties.Country || currentFocus?.properties.Country} />
            {currentFocus && <CountryInfo unfocus={unfocus} data={currentFocus} />}
        </>
    )
}