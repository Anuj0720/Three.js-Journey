import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */

// Textures
// 1.Using native javascript
/** 
 * 
const image = new Image()
const texture = new THREE.Texture(image)
image.onload = () =>{
    texture.needsUpdate = true
    console.log("image is loaded")
}
image.src = './textures/door/color.jpg'
*/

// 2.Using TextureLoader/ LoadingManager
const loadingManager = new THREE.LoadingManager() 
// loadingManager.onStart = () =>{
//     console.log("Start")
// }

// loadingManager.onLoad = () =>{
//     console.log("Loaded")
// }

// loadingManager.onProgress = () =>{
//     console.log("Progress")
// }

// loadingManager.onError = () =>{
//     console.log("Error")
// }

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const aplphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambbientOcclusion.jpg')
const heighTexture = textureLoader.load('/textures/door/height.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// const texture = textureLoader.load('/textures/door/color.jpg',
// () =>{
//     console.log('Start')
// },
// () =>{
//     console.log("Progress")
// },

// () =>{
//     console.log("Error")
// })


const texture = textureLoader.load('/textures/door/color.jpg')
const magnifationTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const minecraftTexture = textureLoader.load('/textures/minecraft.png')
// Transforming Textures

// 1.Repeat / Wrapping
// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.wrapS = THREE.RepeatWrapping
// texture.wrapT = THREE.RepeatWrapping

// 2.Offset
// texture.offset.x = 0.5
// texture.offset.y = 0.5

// 3.Rotation
// texture.center.x = 0.5
// texture.center.y = 0.5
// texture.rotation = Math.PI * 0.25

// Filtering & MipMapping
minecraftTexture.generateMipmaps = false // if you're using minFilter = NearestFilter then add this line

// 1. Minification Filter
// minecraftTexture.minFilter = THREE.NearestFilter

// 2.Maginfication Filter
minecraftTexture.magFilter = THREE.NearestFilter

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ 
    map: colorTexture,
    transparent: true,
    alphaMap: aplphaTexture,

 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// UV coordinates
// console.log("UV coordinates:" + geometry.attributes.uv)

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
camera.position.z = 1
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