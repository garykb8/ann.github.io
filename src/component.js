const SCRIPT_0 = ['Hello', 'World', 'Apple', 'Banna', 'Orange'];
const SCRIPT_1 = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE'];
const SCRIPT_ARRAY = [SCRIPT_0, SCRIPT_1];

AFRAME.registerComponent('log', {
  schema: {
    message: { type: 'string', default: 'Hello, World!' }
  },
  init: function() {
    console.log(this.data.message);
  }
});

AFRAME.registerComponent('box', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },
    color: { type: 'color', default: '#aaa' }
  },
  init: function() {
    const data = this.data;
    const el = this.el;

    // Create geometry.
    this.geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);

    // Create material.
    this.material = new THREE.MeshStandardMaterial({ color: data.color });

    // Create mesh.
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // Set mesh on entity.
    el.setObject3D('mesh', this.mesh);
  },
  update: function(oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) {
      return;
    }

    // Geometry-related properties changed. Update the geometry.
    if (data.width !== oldData.width || data.height !== oldData.height || data.depth !== oldData.depth) {
      el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.width, data.height, data.depth);
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = new THREE.Color(data.color);
    }
  },
  remove: function() {
    this.el.removeObject3D('mesh');
  }
});

AFRAME.registerComponent('follow', {
  schema: {
    target: { type: 'selector' },
    speed: { type: 'number' }
  },

  init: function() {
    this.directionVec3 = new THREE.Vector3();
  },

  tick: function(time, timeDelta) {
    var directionVec3 = this.directionVec3;

    // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
    var targetPosition = this.data.target.object3D.position;
    var currentPosition = this.el.object3D.position;

    // Subtract the vectors to get the direction the entity should head in.
    directionVec3.copy(targetPosition).sub(currentPosition);

    // Calculate the distance.
    var distance = directionVec3.length();

    // Don't go any closer if a close proximity has been reached.
    if (distance < 1) {
      return;
    }

    // Scale the direction vector's magnitude down to match the speed.
    var factor = this.data.speed / distance;
    ['x', 'y', 'z'].forEach(function(axis) {
      directionVec3[axis] *= factor * (timeDelta / 1000);
    });

    // Translate the entity in the direction towards the target.
    this.el.setAttribute('position', {
      x: currentPosition.x + directionVec3.x,
      y: currentPosition.y + directionVec3.y,
      z: currentPosition.z + directionVec3.z
    });
  }
});

AFRAME.registerComponent('menu-bg', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    color: { type: 'color', default: '#000000' }
  },
  init: function() {
    const data = this.data;
    const el = this.el;

    this.geometry = new THREE.PlaneBufferGeometry(data.width, data.height);
    this.material = new THREE.MeshStandardMaterial({ color: data.color });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    el.setObject3D('mesh', this.mesh);
  },
  update: function(oldData) {
    const data = this.data;
    const el = this.el;

    if (Object.keys(oldData).length === 0) {
      return;
    }

    // Geometry-related properties changed. Update the geometry.
    if (data.width !== oldData.width || data.height !== oldData.height) {
      el.getObject3D('mesh').geometry = new THREE.PlaneBufferGeometry(data.width, data.height);
    }

    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = new THREE.Color(data.color);
    }
  },
  remove: function() {
    this.el.removeObject3D('mesh');
  }
});

AFRAME.registerComponent('do-something-once-loaded', {
  init: function() {
    // This will be called after the entity has properly attached and loaded.
    console.log('I am ready!');
  }
});

const tanukiAction = {
  summon: '#p1-011',
  others: ['#p2-003', '#p2-011', '#p1-021', '#p1-017', '#p1-019', '#p2-029', '#p3-011'],
  final: '#p1-031'
};

const kitsuneAction = {
  summon: '#p1-012',
  others: ['#p2-014', '#p2-018', '#p1-016', '#p1-004', '#p1-024', '#p2-020', '#p3-020'],
  final: '#p3-016'
};

AFRAME.registerComponent('chara-tanuki', {
  schema: {},
  init: function() {
    const el = this.el;

    const sceneEl = document.querySelector('a-scene');
    const textBoardIdEl = sceneEl.querySelector('#text-board-id');
    const bgmEl = sceneEl.querySelector('#main-bgm');
    const summonBgmEl = sceneEl.querySelector('#summon-bgm');
    el.addEventListener('click', function(e) {
      const textBoardAttr = textBoardIdEl.getAttribute('text-board');
      console.log(textBoardAttr.scriptIdx);

      if (summonBgmEl.components.sound.isPlaying) {
        summonBgmEl.components.sound.stopSound();
      }
      bgmEl.setAttribute('volume', 1);
      textBoardIdEl.setAttribute('text-board', 'scriptIdx', textBoardAttr.scriptIdx + 1);
    });
  }
});

AFRAME.registerComponent('chara-kitsune', {
  schema: {},
  init: function() {
    const el = this.el;

    const sceneEl = document.querySelector('a-scene');
    const textBoardIdEl = sceneEl.querySelector('#text-board-id');
    const bgmEl = sceneEl.querySelector('#main-bgm');
    const summonBgmEl = sceneEl.querySelector('#summon-bgm');
    el.addEventListener('click', function(e) {
      const textBoardAttr = textBoardIdEl.getAttribute('text-board');
      console.log(textBoardAttr.scriptIdx);
      if (summonBgmEl.components.sound.isPlaying) {
        summonBgmEl.components.sound.stopSound();
      }
      bgmEl.setAttribute('volume', 1);
      if (textBoardAttr.scriptIdx !== 0) {
        textBoardIdEl.setAttribute('text-board', 'scriptIdx', textBoardAttr.scriptIdx - 1);
      }
    });
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const OrbsPositions = [
  { x: -0.034, y: 2.423, z: -0.714 },
  { x: -0.583, y: 2.106, z: -0.365 },
  { x: -0.339, y: 1.562, z: -0.046 },
  { x: 0.322, y: 1.568, z: -0.046 },
  { x: 0.554, y: 2.094, z: -0.456 }
];

const OrbsLabelInfo = {
  Pokemon: 'Pokemon',
  Food: 'Food',
  Game: 'Game',
  Movie: 'Movie'
};

AFRAME.registerComponent('summon-board', {
  schema: {
    opened: { type: 'array', default: [] },
    check: { type: 'int', default: 0 }
  },
  init: function() {
    const data = this.data;
    const el = this.el;

    const orbsSources = ['#orbs-red', '#orbs-blue', '#orbs-green', '#orbs-gray'];

    // edit
    const sceneEl = document.querySelector('a-marker');
    for (let i = 0; i < OrbsPositions.length; i++) {
      const planeEl = document.createElement('a-plane');
      const orbsIndex = getRandomInt(0, 3);
      // console.log(orbsIndex);
      planeEl.setAttribute('id', `orbs-${i}`);
      planeEl.setAttribute('visible', false);
      planeEl.setAttribute('src', orbsSources[orbsIndex]);
      planeEl.setAttribute('scale', { x: 0.6, y: 0.6, z: 1.0 });
      planeEl.setAttribute('rotation', { x: -30, y: 0, z: 0 });
      planeEl.setAttribute('transparent', true);
      planeEl.setAttribute('position', OrbsPositions[i]);
      // planeEl.setAttribute('sound', { src: '#summon-sound' });

      const clickEventFn = function(e) {
        const bgmEl = sceneEl.querySelector('#main-bgm');
        // if (bgmEl.components.sound.isPlaying) {
        // bgmEl.components.sound.pauseSound();
        bgmEl.setAttribute('volume', 0);
        // }
        // bgmEl.components.sound.playSound();
        const summonBgmEl = sceneEl.querySelector('#summon-bgm');
        if (summonBgmEl.components.sound.isPlaying) {
          summonBgmEl.components.sound.stopSound();
        }
        if (!summonBgmEl.components.sound.isPlaying) {
          summonBgmEl.components.sound.playSound();
        }

        const textBoardEl = sceneEl.querySelector('#text-board-id');
        textBoardEl.setAttribute('animation__enter', 'property', 'position');
        textBoardEl.setAttribute(
          'animation__enter',
          'to',
          `${TextBoardPositionInfo.bottom.x} ${TextBoardPositionInfo.bottom.y} ${TextBoardPositionInfo.bottom.z}`
        );
        textBoardEl.setAttribute(
          'animation__enter',
          'from',
          `${TextBoardPositionInfo.top.x} ${TextBoardPositionInfo.top.y} ${TextBoardPositionInfo.top.z}`
        );
        textBoardEl.setAttribute('animation__enter', 'dur', 4000);
        textBoardEl.setAttribute('text__message', 'value', '');
        textBoardEl.removeAttribute('animation__leave');
        // console.log(OrbsLabelInfo);
        const labelKeys = Object.keys(OrbsLabelInfo);
        const labelIndex = Math.floor(Math.random() * labelKeys.length);
        if (data.opened.length !== 4) {
          // console.log(OrbsLabelInfo);
          textBoardEl.setAttribute('text-board', 'scriptType', OrbsLabelInfo[labelKeys[labelIndex]]);
          delete OrbsLabelInfo[labelKeys[labelIndex]];
          data.opened.push(labelKeys[labelIndex]);
        } else {
          textBoardEl.setAttribute('text-board', 'scriptType', 'Tanuki & Kitsune');
          data.opened.push(labelKeys[labelIndex]);
        }

        const kitsuneEl = sceneEl.querySelector('#kitsune');
        kitsuneEl.setAttribute('src', kitsuneAction.summon);
        const tanukiEl = sceneEl.querySelector('#tanuki');
        tanukiEl.setAttribute('src', tanukiAction.summon);

        planeEl.removeEventListener('click', clickEventFn);

        setTimeout(function() {
          for (let i = 0; i < OrbsPositions.length; i++) {
            const orbEl = sceneEl.querySelector(`#orbs-${i}`);
            // console.log(orbEl);
            orbEl.setAttribute('visible', false);
          }
          el.setAttribute('visible', false);
          planeEl.setAttribute('opacity', 0);

          planeEl.setAttribute('text__label', 'align', 'center');
          // planeEl.setAttribute('text__label', 'font', 'assets/font/JhengHei-msdf/JhengHei-msdf.json');
          planeEl.setAttribute('text__label', 'color', '#0000ff');
          planeEl.setAttribute('text__label', 'negate', true);
          planeEl.setAttribute('text__label', 'width', 5.87);
          if (data.opened.length !== 5) {
            planeEl.setAttribute('text__label', 'value', labelKeys[labelIndex]);
          } else {
            planeEl.setAttribute('text__label', 'value', 'Tanuki & Kitsune');
          }
        }, 4500);
      };

      planeEl.addEventListener('click', clickEventFn);
      sceneEl.appendChild(planeEl);
    }
  },
  update: function(oldData) {
    const el = this.el;
    const data = this.data;
    const sceneEl = document.querySelector('a-scene');

    if (Object.keys(oldData).length === 0) {
      return;
    }

    if (data.check !== oldData.check) {
      // console.log(oldData.visible);
      // if (oldData.visible === false && data.visible === true) {
      //   for (let i = 0; i < OrbsPositions.length; i++) {
      //     const orbEl = sceneEl.querySelector(`#orbs-${i}`);
      //     console.log(orbEl);
      //     orbEl.visible = true;
      //   }
      // }
      // console.log(data.opened.length);
      if (data.opened.length === 5) {
        const textBoardEl = sceneEl.querySelector('#text-board-id');
        textBoardEl.setAttribute('animation__enter', 'property', 'position');
        textBoardEl.setAttribute(
          'animation__enter',
          'to',
          `${TextBoardPositionInfo.bottom.x} ${TextBoardPositionInfo.bottom.y} ${TextBoardPositionInfo.bottom.z}`
        );
        textBoardEl.setAttribute(
          'animation__enter',
          'from',
          `${TextBoardPositionInfo.top.x} ${TextBoardPositionInfo.top.y} ${TextBoardPositionInfo.top.z}`
        );
        textBoardEl.setAttribute('animation__enter', 'dur', 4000);
        textBoardEl.setAttribute('text__message', 'value', '');
        textBoardEl.removeAttribute('animation__leave');
        textBoardEl.setAttribute('text-board', 'scriptType', 'End');
      }
    }
  }
});

const scriptInfo = {
  enter: [
    { state: 1, value: '三週年快樂' },
    { state: 1, value: '又度過了一年' },
    { state: 1, value: '除了在忙碌的工作日子中度過' },
    { state: 1, value: '應該還有什麼些事情豐富了這三年' },
    { state: 1, value: '是該時候來回顧一下' },
    { state: 1, value: '就用我們彼此最熟悉的方式進行吧' },
    { state: 1, value: '準備好了嗎' },
    { state: 1, value: 'GO' },
    { state: 0, value: '' }
    // { state: 1, value: 'G' },
    // { state: 1, value: 'GG' },
    // { state: 1, value: 'GGG' },
    // { state: 1, value: 'GGGG' },
    // { state: 1, value: 'GGGGG' },
    // { state: 1, value: 'GGGGGG' },
    // { state: 1, value: 'GGGGGGG' },
    // { state: 0, value: 'GO' }
  ],
  Pokemon: [
    { state: 1, value: 'Pokemon' },
    { state: 1, value: '認識妳的頭一年間' },
    { state: 1, value: '正好Pokemon Go上市' },
    { state: 1, value: '到處抓寶可夢成為我們生活的一部分' },
    { state: 1, value: '為了沒抓到卡比獸的妳' },
    { state: 1, value: '製作了一隻卡比獸' },
    { state: 1, value: '牠以為今天牠可以登場' },
    { state: 1, value: '並沒有' },
    { state: 1, value: '一次又一次的社群日' },
    { state: 1, value: '官方活動我們都盡可能沒錯過' },
    { state: 1, value: '寶可夢中心也是我們的觀光景點之一' },
    { state: 1, value: '每次踏進去' },
    { state: 1, value: '不花個五位數絕不罷休' },
    { state: 1, value: '也一起去了阿羅拉探險' },
    { state: 1, value: '謎擬Q成為了妳的最愛之一' },
    { state: 1, value: '剛發售的劍盾還等著我們去摸索呢' },
    { state: 0, value: '' }
    // { state: 1, value: '1' },
    // { state: 1, value: '2' },
    // { state: 1, value: '3' },
    // { state: 1, value: '4' },
    // { state: 1, value: '5' },
    // { state: 1, value: '6' },
    // { state: 1, value: '7' },
    // { state: 1, value: '8' },
    // { state: 1, value: '9' },
    // { state: 1, value: '0' },
    // { state: 1, value: '-' },
    // { state: 1, value: '=' },
    // { state: 1, value: '2' },
    // { state: 0, value: '5' }
  ],
  Movie: [
    { state: 1, value: 'Movie' },
    { state: 1, value: '第一次兩人看的電影' },
    { state: 1, value: '如果這世界貓消失了' },
    { state: 1, value: '這之後電影就伴隨我們約會的腳步' },
    { state: 1, value: '透過大螢幕帶給我們不同主題的故事' },
    { state: 1, value: '唯獨恐怖電影' },
    { state: 1, value: '那是妳一個人享受的視覺聲光饗宴' },
    { state: 1, value: '我不願打擾妳' },
    { state: 1, value: '簡單說就是' },
    { state: 1, value: '我俗辣' },
    { state: 1, value: '而我在看電影時睡著' },
    { state: 1, value: '似乎也成為了一種習慣' },
    { state: 1, value: '精彩睡' },
    { state: 1, value: '不精彩也睡' },
    { state: 1, value: '我想也許是我愛睡' },
    { state: 1, value: '所以電影才是我們約會的選項' },
    { state: 0, value: '' }
  ],
  Food: [
    { state: 1, value: 'Food' },
    { state: 1, value: '要吃什麼' },
    { state: 1, value: '是我們最常出現的問句' },
    { state: 1, value: '新埔地區也就這樣吃了三年' },
    { state: 1, value: '想吃的也都吃了' },
    { state: 1, value: '不想吃的也一起吃了' },
    { state: 1, value: '說好晚餐不要吃那麼多' },
    { state: 1, value: '卻沒有做到幾次' },
    { state: 1, value: '下一次一定要吃少少' },
    { state: 1, value: '那我們等等要不要去吃冰' },
    { state: 0, value: '' }
  ],
  Game: [
    { state: 1, value: 'Game' },
    { state: 1, value: '我們在遊戲公司相遇' },
    { state: 1, value: '雖然一開始我是掌機和家機玩家' },
    { state: 1, value: '妳偏向電腦和手機玩家' },
    { state: 1, value: '但這三年來' },
    { state: 1, value: '妳擁有 PS4 和 Switch' },
    { state: 1, value: '我也開始會在手機上課金' },
    { state: 1, value: '每次的聖火召喚都讓我們很期待' },
    { state: 1, value: '但帶來的總是傷害' },
    { state: 1, value: '一起討論風花雪月的劇情和角色' },
    { state: 1, value: '讓我感受到你對老師和王子的愛有多深' },
    { state: 1, value: '雖然買了一堆遊戲玩不完' },
    { state: 1, value: '但相信只要我們還有力氣' },
    { state: 1, value: '玩遊戲這選項是永遠不會消失的' },
    { state: 0, value: '' }
  ],
  'Tanuki & Kitsune': [
    { state: 1, value: 'Tanuki & Kitsune' },
    { state: 1, value: '一開始只是貼圖上的兩隻動物' },
    { state: 1, value: '沒想到卻是我們日常不可或缺的配角們' },
    { state: 1, value: '貼圖買齊了之後' },
    { state: 1, value: '開始買週邊' },
    { state: 1, value: '週邊不滿意就開始夾娃娃' },
    { state: 1, value: '不知道花了多少日幣在牠們身上' },
    { state: 1, value: '這兩位小朋友真的看不膩' },
    { state: 1, value: '只是週邊在買下去房間就塞不下啦' },
    { state: 0, value: '' }
  ],
  End: [
    { state: 1, value: '列出的這五項' },
    { state: 1, value: '不知道妳是否也認同呢' },
    { state: 1, value: '明年 2020 看來又會是個忙碌的一年' },
    { state: 1, value: '也希望是個平順的一年' },
    { state: 1, value: '這三年來謝謝妳的陪伴' },
    { state: 1, value: '我是亂槍打鳥人' },
    { state: 1, value: '謝謝妳隨意試試人' },
    { state: 1, value: '聖誕快樂' },
    { state: 0, value: '' }
  ]
};

const TextBoardPositionInfo = {
  top: { x: 0, y: 11.309, z: -0.013 },
  bottom: { x: 0, y: 1.82627, z: -0.013 }
};

AFRAME.registerComponent('text-board', {
  schema: {
    scriptType: { type: '', default: 'enter' },
    scriptInfo: { type: '', default: scriptInfo },
    scriptIdx: { type: 'int', default: 0 }
  },
  init: function() {
    const el = this.el;
    const data = this.data;
    const sceneEl = document.querySelector('a-scene');
    const bgmEl = sceneEl.querySelector('#main-bgm');

    const animationCompleteFn = function(e) {
      setTimeout(function() {
        // if (!bgmEl.components.sound.isPlaying) {
        if (data.scriptType === 'enter') {
          bgmEl.components.sound.playSound();
        } else if (data.scriptType === 'Tanuki & Kitsune') {
          const kitsuneEl = sceneEl.querySelector('#kitsune');
          kitsuneEl.setAttribute('src', kitsuneAction.final);
          const tanukiEl = sceneEl.querySelector('#tanuki');
          tanukiEl.setAttribute('src', tanukiAction.final);
        } else {
          const kitsuneEl = sceneEl.querySelector('#kitsune');
          const actionIndex = getRandomInt(0, kitsuneAction.others.length - 1);
          kitsuneEl.setAttribute('src', kitsuneAction.others[actionIndex]);
          const tanukiEl = sceneEl.querySelector('#tanuki');
          tanukiEl.setAttribute('src', tanukiAction.others[actionIndex]);
        }
        // }
      }, 600);
      // el.removeEventListener('animationcomplete__enter', animationCompleteFn);
    };

    el.addEventListener('animationcomplete__enter', animationCompleteFn);

    el.setAttribute('text__message', 'value', data.scriptInfo[data.scriptType][data.scriptIdx].value);
  },
  update: function(oldData) {
    const el = this.el;
    const data = this.data;
    const sceneEl = document.querySelector('a-scene');
    const bgmEl = sceneEl.querySelector('#main-bgm');

    if (Object.keys(oldData).length === 0) {
      return;
    }

    if (data.scriptType !== oldData.scriptType) {
      el.setAttribute('text-board', 'scriptIdx', 0);
    }

    if (data.scriptIdx !== oldData.scriptIdx) {
      if (data.scriptType === 'End') {
        bgmEl.setAttribute('volume', 0);
        const christmasBgmEl = sceneEl.querySelector('#christmas-bgm');
        christmasBgmEl.components.sound.playSound();
      }
      if (data.scriptInfo[data.scriptType][data.scriptIdx] !== undefined) {
        if (data.scriptInfo[data.scriptType][data.scriptIdx].state !== 0) {
          el.setAttribute('text__message', 'value', data.scriptInfo[data.scriptType][data.scriptIdx].value);
        }
      } else {
        if (data.scriptType === 'End') {
          return;
        }
        // el.setAttribute('visible', false);
        el.setAttribute('animation__leave', 'property', 'position');
        el.setAttribute(
          'animation__leave',
          'from',
          `${TextBoardPositionInfo.bottom.x} ${TextBoardPositionInfo.bottom.y} ${TextBoardPositionInfo.bottom.z}`
        );
        el.setAttribute(
          'animation__leave',
          'to',
          `${TextBoardPositionInfo.top.x} ${TextBoardPositionInfo.top.y} ${TextBoardPositionInfo.top.z}`
        );
        el.setAttribute('animation__leave', 'dur', 500);
        el.removeAttribute('animation__enter');
        // if (bgmEl.components.sound.isPlaying) {
        // bgmEl.components.sound.pauseSound();
        bgmEl.setAttribute('volume', 0);
        // }

        const summonBoardEl = sceneEl.querySelector('#summon-board-id');
        setTimeout(function() {
          summonBoardEl.setAttribute('visible', true);
          const randomCheckInt = getRandomInt(1, 20191223);
          summonBoardEl.setAttribute('summon-board', 'check', randomCheckInt);

          for (let i = 0; i < OrbsPositions.length; i++) {
            const orbEl = sceneEl.querySelector(`#orbs-${i}`);
            // console.log(orbEl);
            orbEl.setAttribute('visible', true);
          }
        }, 1000);
      }
    }
  }
});
