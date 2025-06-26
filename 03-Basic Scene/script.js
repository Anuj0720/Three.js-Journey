import * as THREE from 'three'

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()


// Textures
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('./textures/door/color.jpg')


const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

// Object
const geometry = new THREE.BoxGeometry(2, 2, 2)

const material = new THREE.MeshStandardMaterial({})

const mesh = new THREE.Mesh(geometry, material)


scene.add(mesh)

// Camera
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // take two arguments field of view and aspect ratio
camera.position.z = 3
scene.add(camera)




// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
