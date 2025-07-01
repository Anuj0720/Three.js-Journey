import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

// Own buffer geometry

// 1.Create positionArray it stores the vertex position
// const positionArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ])

// 2. Add positionArray to BufferAttribute specifying number(3) which tells each vertex contain 3 values(x, y, z)
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

// 3.Create buffer geometry and add the postionAttribute in the geometry by specifying shader name('position')
// const geometry = new THREE.BufferGeometry()
// geometry.setAttribute('position', positionAttribute)

// Drawing random 50 triangles
const count = 500
const positionArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++){
    // (Math.random() - 0.5) will center the geometry
    positionArray[i] = (Math.random() - 0.5) * 4 // multiplying by random number tells how much spread the points in 3d space
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionAttribute)


const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Axes Helper
const axesHelper = new THREE.AxesHelper(5)
mesh.add(axesHelper)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()