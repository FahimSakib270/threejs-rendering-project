// Get the canvas element
const canvas = document.getElementById("renderCanvas");

// Initialize Babylon.js engine
const engine = new BABYLON.Engine(canvas, true);

// Create the scene
const createScene = () => {
  const newScene = new BABYLON.Scene(engine);

  // Add a skybox for a dynamic background
  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 1000.0 },
    newScene
  );
  const skyboxMaterial = new BABYLON.StandardMaterial(
    "skyBoxMaterial",
    newScene
  );
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "https://playground.babylonjs.com/textures/skybox",
    newScene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skybox.material = skyboxMaterial;

  // Add a ground plane
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 20, height: 20 },
    newScene
  );
  const groundMaterial = new BABYLON.StandardMaterial(
    "groundMaterial",
    newScene
  );
  groundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4); // Subtle gray
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // No shine
  groundMaterial.reflectionTexture = new BABYLON.MirrorTexture(
    "mirror",
    512,
    newScene,
    true
  );
  groundMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(
    0,
    -1,
    0,
    -2
  );
  groundMaterial.reflectionTexture.level = 0.5;
  ground.material = groundMaterial;

  // Add a camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 4,
    10,
    BABYLON.Vector3.Zero(),
    newScene
  );
  camera.attachControl(canvas, true);

  // Add lights
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    newScene
  );
  light.intensity = 0.7;

  const directionalLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(0, -1, 1),
    newScene
  );
  directionalLight.position = new BABYLON.Vector3(10, 10, -10);
  directionalLight.intensity = 0.8;

  // Load the OBJ model
  BABYLON.SceneLoader.Append(
    "./", // Path to your model files
    "Textured_mesh_1.obj", // Model file name
    newScene,
    function () {
      // Optional: Animate the model (rotation)
      const model = newScene.meshes[0];
      newScene.registerBeforeRender(() => {
        model.rotation.y += 0.005; // Rotate slowly on the Y-axis
      });
    }
  );

  return newScene;
};

// Create the scene
const myScene = createScene();

// Render the scene
engine.runRenderLoop(() => {
  myScene.render();
});

// Resize the engine on window resize
window.addEventListener("resize", () => {
  engine.resize();
});
