import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'


// debugObject
const debugObject = {}

// Debug UI
const gui = new GUI({
    width: 300,
    title: 'Cube UI',
    closeFolders: false
})


// Toggle the UI by pressing h to hide and show
window.addEventListener('keydown', (event) =>{
    if(event.key == 'h'){
        gui.show(gui._hidden)
    }
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// UI


/**
 * Object
 */

// add color in the debugObject
debugObject.color = '#ff0000'
debugObject.subdivision = 2
const geometry = new THREE.BoxGeometry(1, 1, 1,debugObject.subdivision, debugObject.subdivision, debugObject.subdivision)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// UI

// Folders
const cubeTweaks = gui.addFolder('Awesome Cube')
cubeTweaks.close()

// 1.Range
cubeTweaks.add(mesh.position, 'y', 0, 30, 0.01) // or you can do like
cubeTweaks.add(mesh.position, 'x').min(0).max(20).step(0.01)

// 2.Checkboxes
cubeTweaks.add(material, 'wireframe')

// 3.Colors - in colors the values displayed on screen are not used internally in the Three.js to avoid this we've 2 solutions

// 1. copy the color from the console and paste in the material
// cubeTweaks.addColor(material, 'color').onChange((value) =>{
//     console.log(value.getHexString())
// })

// 2. Only deal with the non-modified colors
cubeTweaks.addColor(debugObject, 'color').onChange((value) =>{
    material.color.set(debugObject.color)
})

// 4. Function / Button
debugObject.spin = () =>{
    gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 2})
}

cubeTweaks.add(debugObject, 'spin')

// exercise - change the geometry subdivision (widthSegmets, heightSegmets)
cubeTweaks.add(debugObject, 'subdivision').onFinishChange(() =>{
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision)
})

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
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