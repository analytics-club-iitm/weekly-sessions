"use strict";

function createEl(template) {
  let el = document.createElement('div');
  el.innerHTML = template.trim();
  return el.firstChild;
}

function createSvgEl(template) {
  let el = createEl(`
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${template.trim()}</svg>
  `);
  return el;
}

function createSvgChildEl(template) {
  return createSvgEl(template).firstChild;
}

function createLine(options) {
  let el = createSvgChildEl(`
    <rect x="${options.x}" y="${options.y}" width="${options.width}" height="${options.height}" fill="${options.color}">
  `);
  return el;
}

let pageEl = document.querySelector('#page');
let introEl = document.querySelector('#intro');
let stripesEl = document.querySelector('#stripes');
let logoContainer = document.querySelector('#logo-container');
let logo = logoContainer.querySelector('svg');
let logoPath = logo.querySelector('path');
let windowWidth = document.body.clientWidth;
let windowHeight = document.body.clientHeight;

// animate stripes
function _animateStripes(container, options={}) {
  options.count = options.count || 10;
  options.sizeRatio = options.sizeRatio || 1;
  let stripes = [];
  for (let i = 0; i < options.count; i++) {
    let color;
    if (options.color) {
      color = options.color;
    } else {
      color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`).toRgbString();
    }
    let baseWidth = Math.max(windowWidth, 1000);
    let width = Math.round(baseWidth / 10 + Math.random() * baseWidth / 10) * options.sizeRatio;
    let height = Math.round(Math.random() * 10 + 2) * options.sizeRatio;
    let point;
    if (options.point) {
      point = {
        x: Math.round(options.point.x - width / 2 + Math.random() * 200 - 100),
        y: Math.round(options.point.y - height / 2 + Math.random() * 50 - 25),
      };
    } else {
      point = {
        x: Math.round((windowWidth + width) * Math.random() - width),
        y: Math.round(windowHeight * Math.random()),
      };
    }
    let lineOptions = {
      x: point.x,
      y: point.y,
      width: width,
      height: height,
      color: color,
    };
    let lineEl = createLine(lineOptions);
    lineEl.style.display = 'none';
    container.appendChild(lineEl);

    dynamics.setTimeout(function() {
      lineEl.style.display = 'block';

      dynamics.setTimeout(function() {
        lineOptions.x += Math.random() * 100 - 50;
        lineOptions.y += Math.random() * 20 - 10;
        lineEl.setAttribute('x', lineOptions.x);
        lineEl.setAttribute('y', lineOptions.y);

        let newLineOptions = options.transform({
          width: lineOptions.width,
          height: lineOptions.height,
        });
        lineEl.setAttribute('width', newLineOptions.width);
        lineEl.setAttribute('height', newLineOptions.height);

        dynamics.setTimeout(function() {
          container.removeChild(lineEl);
        }, options.delay('hide', i));
      }, options.delay('transform', i));
    }, options.delay('show', i));

    stripes.push(lineEl);
  }
  return stripes;
}
function animateBlackStripes(container, options={}) {
  options.sizeRatio = 3;
  options.color = '#101214';
  options.delay = function(type, i) {
    if (type === 'show') {
      if (options.delayShow) {
        return Math.random() * 50;
      }
      return 0;
    } else if (type === 'transform') {
      return Math.random() * 20 + i * 2;
    } else if (type === 'hide') {
      return 100;
    }
  };
  options.transform = function(size) {
    return {
      width: size.width / 2,
      height: size.height / 5,
    };
  };
  _animateStripes(container, options);
}
function animateColoredStripes(container, options={}) {
  options.delay = function(type, i) {
    if (type === 'show') {
      return Math.random() * 300;
    } else if (type === 'transform') {
      return Math.random() * 20;
    } else if (type === 'hide') {
      return 100;
    }
  };
  options.transform = function(size) {
    return {
      width: size.width / 2,
      height: size.height / 5,
    };
  };
  _animateStripes(container, options);
}

let totalMaskIdx = 0;
function createMasksWithStripes(count, box, averageHeight=10) {
  let masks = [];
  for (let i = 0; i < count; i++) {
    masks.push([]);
  }
  let maskNames = [];
  for (let i = totalMaskIdx; i < totalMaskIdx + masks.length; i++) {
    maskNames.push(`clipPath${i}`);
  }
  totalMaskIdx += masks.length;
  let maskIdx = 0;
  let x = 0;
  let y = 0;
  let stripeHeight = averageHeight;
  while(true) {
    let w = Math.max(stripeHeight * 10, Math.round(Math.random() * box.width));
    masks[maskIdx].push(`
      M ${x},${y} L ${x + w},${y} L ${x + w},${y + stripeHeight} L ${x},${y + stripeHeight} Z
    `);

    maskIdx += 1;
    if (maskIdx >= masks.length) {
      maskIdx = 0;
    }

    x += w;
    if (x > box.width) {
      x = 0;
      y += stripeHeight;
      stripeHeight = Math.round(Math.random() * averageHeight + averageHeight / 2);
    }
    if (y >= box.height) {
      break;
    }
  }

  masks.forEach(function(rects, i) {
    let el = createSvgChildEl(`<clipPath id="${maskNames[i]}">
      <path d="${rects.join(' ')}" fill="white"></path>
    </clipPath>`);
    document.querySelector('#clip-paths g').appendChild(el);
  });

  return maskNames;
}

function cloneAndStripeElement(element, clipPathName, parent) {
  let el = element.cloneNode(true);
  let box = element.getBoundingClientRect();
  let parentBox = parent.getBoundingClientRect();
  box = {
    top: box.top - parentBox.top,
    left: box.left - parentBox.left,
    width: box.width,
    height: box.height,
  };
  let style = window.getComputedStyle(element);

  dynamics.css(el, {
    position: 'absolute',
    left: Math.round(box.left + window.scrollX),
    top: Math.round(box.top + window.scrollY),
    width: Math.ceil(box.width),
    height: Math.ceil(box.height),
    display: 'none',
    pointerEvents: 'none',
    background: '#101214',
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    color: style.color,
    textDecoration: style.textDecoration,
  });
  parent.appendChild(el);
  el.style['-webkit-clip-path'] = `url(/#${clipPathName})`;
  el.style['clip-path'] = `url(/#${clipPathName})`;

  return el;
}

let contentEls = [];
let originalContentEls = document.querySelectorAll('#header-content, #content');
(function() {
  let els = originalContentEls;
  let pageBox = pageEl.getBoundingClientRect();
  for (let j = 0; j < els.length; j++) {
    let el = els[j];
    let box = el.getBoundingClientRect();
    let masks = createMasksWithStripes(6, box);
    for (let i = 0; i < masks.length; i++) {
      let clonedEl = cloneAndStripeElement(el, masks[i], pageEl);
      clonedEl.setAttribute('data-idx', i);
      contentEls.push(clonedEl)
      let childrenEls = clonedEl.querySelectorAll('h2, ul > li > a, a.more, h1, p, path');
      for (let k = 0; k < childrenEls.length; k++) {
        let color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
        let rgb = color.toRgbString();
        dynamics.css(childrenEls[k], {
          color: rgb,
          fill: rgb,
        });
      }
    }
    el.style.visibility = 'hidden';
  }
})();

function showContent() {
  let maxDelay = 0;
  for (let i = 0; i < contentEls.length; i++) {
    let el = contentEls[i];
    let d = 50 + Math.round(Math.random() * 350);
    let transform = {
      translateX: Math.round(Math.random() * 40 - 20),
    };
    let more = el.getAttribute('data-idx') <= 3;
    dynamics.css(el, transform);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        display: '',
      });
    }, d);
    maxDelay = Math.max(maxDelay, d);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        translateX: Math.round(transform.translateX / -5),
      });
    }, d + 100);
    dynamics.setTimeout(function() {
      dynamics.css(el, {
        translateX: 0,
        translateY: 0,
      });
      if (!more) {
        el.parentNode.removeChild(el);
      }
    }, d + 150);
    if (more) {
      dynamics.setTimeout(function() {
        dynamics.css(el, {
          translateX: Math.round(transform.translateX / -2),
        });
      }, d + 300);
      dynamics.setTimeout(function() {
        el.parentNode.removeChild(el);
      }, d + 550);
    }
  }
  dynamics.setTimeout(function() {
    for (let i = 0; i < originalContentEls.length; i++) {
      originalContentEls[i].style.visibility = 'visible';
    }
  }, maxDelay);
}

// intro
(function() {
  animateBlackStripes(stripesEl, {
    count: 200,
  });
  animateColoredStripes(stripesEl, {
    count: 100,
  });

  dynamics.css(pageEl, {
    scale: 0.95,
  });
  dynamics.animate(pageEl, {
    scale: 1,
  }, {
    type: dynamics.easeInOut,
    friction: 500,
    duration: 4000,
  });


  dynamics.css(logo, {
    scale: 1,
  })
  dynamics.animate(logo, {
    scale: 0.90,
  }, {
    duration: 1500,
    type: dynamics.easeOut,
  });

  let color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
  dynamics.animate(logoPath, {
    fill: color.toRgbString(),
  }, {
    duration: 700,
  });

  color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
  dynamics.animate(logoPath, {
    fill: color.toRgbString(),
  }, {
    duration: 700,
    delay: 700,
  });

  function animateLogo() {
    dynamics.css(logoContainer, {
      scale: 0.5,
      translateX: Math.random() * 100 - 50,
    });

    dynamics.setTimeout(function() {
      dynamics.css(logoContainer, {
        translateX: 10,
        scale: 0.55,
      });
    }, 100);

    dynamics.setTimeout(function() {
      dynamics.css(logoContainer, {
        translateX: 0,
        scale: 0.5,
      });
    }, 150);
  };

  animateLogo();

  dynamics.setTimeout(function() {
    logoContainer.style.visibility = 'visible';
  }, 1);

  dynamics.setTimeout(function() {
    animateLogo();
    animateBlackStripes(stripesEl, {
      count: 200,
      delayShow: true,
    });
    animateColoredStripes(stripesEl, {
      count: 100,
    });
  }, 1000);

  dynamics.setTimeout(function() {
    introEl.style.backgroundColor = 'transparent';
    dynamics.css(logoContainer, {
      scale: 1,
      translateX: Math.random() * windowWidth - windowWidth / 2,
      translateY: Math.random() * windowHeight - windowHeight / 2,
    });
    showContent();
  }, 1300);

  dynamics.setTimeout(function() {
    dynamics.css(logoContainer, {
      scale: 0.75,
    });
  }, 1350);

  dynamics.setTimeout(function() {
    logo.style.display = 'none';
  }, 1400);

  dynamics.setTimeout(function() {
    document.body.removeChild(introEl);
  }, 3000);
})();

// page
(function() {
  let pageStripesEl = document.querySelector('#page-stripes');
  let linkEls = document.querySelectorAll('a');

  function animateCrazyLogo() {
    let el = document.querySelector('#header-logo');
    let box = el.getBoundingClientRect();
    let count = 10 + Math.random() * 10;
    let masks = createMasksWithStripes(count, box, Math.round(100 / count));
    let clonedEls = [];

    for (let i = 0; i < masks.length; i++) {
      let clonedEl = cloneAndStripeElement(el, masks[i], document.body);
      let path = clonedEl.querySelector('path');
      let color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
      dynamics.css(path, {
        fill: color.toRgbString(),
      });
      clonedEls.push(clonedEl);
    }

    for (let i = 0; i < clonedEls.length; i++) {
      let clonedEl = clonedEls[i];
      let d = Math.random() * 100;

      dynamics.setTimeout(function() {
        clonedEl.style.display = '';
        dynamics.css(clonedEl, {
          translateX: Math.random() * 100 - 50,
        });
      }, d);

      dynamics.setTimeout(function() {
        dynamics.css(clonedEl, {
          translateX: Math.random() * 20 - 10,
        });
      }, d + 50);

      dynamics.setTimeout(function() {
        dynamics.css(clonedEl, {
          translateX: Math.random() * 5 - 2.5,
        });
      }, d + 100);

      dynamics.setTimeout(function() {
        document.body.removeChild(clonedEl);
      }, d + 150);
    }
  };

  function logoAnimationLoop() {
    dynamics.setTimeout(function() {
      animateCrazyLogo();
      logoAnimationLoop();
    }, 100 + Math.random() * 5000);
  };

  dynamics.setTimeout(logoAnimationLoop, 4000);
  document.querySelector('#header-logo').addEventListener('mouseover', animateCrazyLogo);

  function handleMouseOver(e) {
    let el = e.target;
    while (el && el.tagName.toLowerCase() !== 'a') {
      el = el.parentNode;
    }
    if (!el) {
      return;
    }
    let r = animateLink(el);

    let handleMouseOut = function(e) {
      el.removeEventListener('mouseout', handleMouseOut);
      r.stop();
    }

    el.addEventListener('mouseout', handleMouseOut);
  }

  function animateLink(el) {
    let animating = true;
    let box = el.getBoundingClientRect();

    let animate = function() {
      let masks = createMasksWithStripes(3, box, 3);
      let clonedEls = [];

      for (let i = 0; i < masks.length; i++) {
        let clonedEl = cloneAndStripeElement(el, masks[i], document.body);
        let childrenEls = Array.prototype.slice.apply(clonedEl.querySelectorAll('path'));
        childrenEls.push(clonedEl);
        for (let k = 0; k < childrenEls.length; k++) {
          let color = tinycolor(`hsl(${Math.round(Math.random() * 360)}, 80%, 65%)`);
          let rgb = color.toRgbString();
          dynamics.css(childrenEls[k], {
            color: rgb,
            fill: rgb,
          });
        }
        clonedEl.style.display = '';
        clonedEls.push(clonedEl);
      }

      for (let i = 0; i < clonedEls.length; i++) {
        let clonedEl = clonedEls[i];
        dynamics.css(clonedEl, {
          translateX: Math.random() * 10 - 5,
        });

        dynamics.setTimeout(function() {
          dynamics.css(clonedEl, {
            translateX: 0,
          });
        }, 50);

        dynamics.setTimeout(function() {
          dynamics.css(clonedEl, {
            translateX: Math.random() * 5 - 2.5,
          });
        }, 100);

        dynamics.setTimeout(function() {
          document.body.removeChild(clonedEl);
        }, 150);
      }

      dynamics.setTimeout(function() {
        if(animating) {
          animate();
        }
        for (let i = 0; i < masks.length; i++) {
          let maskEl = document.querySelector(`#${masks[i]}`);
          maskEl.parentNode.removeChild(maskEl);
        }
      }, Math.random() * 1000);
    };

    animate();

    return {
      stop: function() {
        animating = false;
      },
    };
  };

  if (!('ontouchstart' in window)) {
    for (let i = 0; i < linkEls.length; i++) {
      linkEls[i].addEventListener('mouseover', handleMouseOver);
    }
  }
})();
