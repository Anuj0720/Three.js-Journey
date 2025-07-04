import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const axesHelper = new THREE.AxesHelper(5)
mesh.add(axesHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// GSAP
gsap.to(mesh.position, {duration: 1, delay: 1, x: 2})
gsap.to(mesh.position, {duration: 1, delay: 2, x: 0})

// Animations
// const clock = new THREE.Clock()
const tick = () =>{

    // const elapsedTime = clock.getElapsedTime()
    
    // Update Objects
    // mesh.rotation.y = elapsedTime * Math.PI * 1 // After multiplying the Math.PI * 2 it will rotate the cube 1 revolution per second
    // camera.position.x = Math.cos(elapsedTime)
    // camera.position.y = Math.sin(elapsedTime) 

    // camera.lookAt(mesh.position)

    // Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

