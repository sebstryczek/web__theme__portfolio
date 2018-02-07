export const loadFont = url => {
  return new Promise( (resolve, reject) => {
    const loader = new THREE.FontLoader();
    loader.load(url, font => resolve(font));
  });
}
