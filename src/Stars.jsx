
import * as THREE from 'three'

export default function Stars() {
    const starVertices = []
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 2000
        const y = (Math.random() - 0.5) * 2000
        const z = -(Math.random()) * 2000
        starVertices.push(x, y, z)
    }
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff })
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

    return new THREE.Points(starGeo, starMaterial)
}