const lib = require('../main');
const yeelight = require('../libs/yeelight');
const ioHook = require('iohook');

const light = new yeelight.Bulb('192.168.0.64');
light.connect();
light.on('disconnected', (light) => setTimeout(light.connect, 3000));

const process = lib('Among Us.exe');

// process.setAddress('color', 'GameAssembly.dll', [0x01417254, 0x0, 0x4C, 0x28, 0x28, 0x298, 0x5C, 0xD0]);
// process.setAddress('speed', 'GameAssembly.dll', [0x014B1730, 0x20, 0x28, 0x48, 0x48, 0x5C, 0x34, 0x14]);
// process.setAddress('cooldown', 'GameAssembly.dll', [0x0149FAD4, 0x24, 0x20, 0x40, 0x134, 0x5C, 0xE4, 0x20]);
// process.setAddress('killtimeout', 'GameAssembly.dll', [0x014B2EAC, 0x5C, 0x0, 0x8, 0x48, 0x70, 0x3C, 0x44]);
process.setAddress('impostor', 'GameAssembly.dll', [0x014B11C4, 0x28, 0x24, 0x5C, 0x0, 0x34, 0x28]);
// process.setAddress('gamename', 'GameAssembly.dll', [0x014B49B0, 0x4C, 0x848, 0x284, 0x780, 0x90, 0xC, 0xBC]);

let lastImpostor = -1;
setInterval(() => {
  const newImpostor = process.read('impostor', process.BOOLEAN);

  if (lastImpostor !== newImpostor) {
    lastImpostor = newImpostor;
    setLight(newImpostor);
  }
  
  // const newKilltimeout = process.read('killtimeout', process.FLOAT);
  // if (lastKilltimeout !== newKilltimeout) {
  //   console.log('Killtimeout:', newKilltimeout);
  //   lastKilltimeout = newKilltimeout / 1.1;
  //   process.write('killtimeout', lastKilltimeout, process.FLOAT);
  // }
}, 100);

function setLight(red) {
  if (!light) return;

  light.color(...red ? [255, 50, 0] : [0, 120, 255]);
  light.set(true);
  light.brightness(100);
}

let lastPress = null;
ioHook.on('keypress', (e) => {
  const newPress = Object.values(e).toString();
  if (lastPress === newPress) return;
  lastPress = newPress;

  if (!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey
    && e.keychar === 178
    && e.keycode === 0
    && e.rawcode === 222
  ) {
    const impVal = process.read('impostor', process.BOOLEAN);
    process.write('impostor', !impVal, process.BOOLEAN);
  }

  setTimeout(() => lastPress = null, 200);
});

ioHook.start();

