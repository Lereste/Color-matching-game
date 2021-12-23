function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr; // shuffle if arr > 2

  for (let i = arr.length - 1; i > 1; i--) { // start with i: 16 - 1 = 15
    // create a number < i
    const j = Math.floor(Math.random() * i);

    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = [];
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  // random "count" colors
  for (let i = 0; i < count; i++) {
    // randomColor func is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length], // index 0 --> 7
    });

    colorList.push(color);
  }

  // double current color list (8 * 2 = 16)
  const fullColorList = [...colorList, ...colorList];
  
  // shuffle color
  shuffle(fullColorList);

  return fullColorList;
};
