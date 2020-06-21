"use strict";

function createEl(template) {
  var el = document.createElement('div');
  el.innerHTML = template.trim();
  return el.firstChild;
}

function createSvgEl(template) {
  var el = createEl('\n    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + template.trim() + '</svg>\n  ');
  return el;
}

function createSvgChildEl(template) {
  return createSvgEl(template).firstChild;
}

function createLine(options) {
  var el = createSvgChildEl('\n    <rect x="' + options.x + '" y="' + options.y + '" width="' + options.width + '" height="' + options.height + '" fill="' + options.color + '">\n  ');
  return el;
}

var pageEl = document.querySelector('#page');
var introEl = document.querySelector('#intro');
var stripesEl = document.querySelector('#stripes');
var logoContainer = document.querySelector('#logo-container');
var logo = logoContainer.querySelector('svg');
var logoPath = logo.querySelector('path');
var windowWidth = document.body.clientWidth;
var windowHeight = document.body.clientHeight;

// animate stripes
function _animateStripes(container) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options.count = options.count || 10;
  options.sizeRatio = options.sizeRatio || 1;
  var stripes = [];

  var _loop = function _loop(i) {
    var color = void 0;
    if (options.color) {
      color = options.color;
    } else {
      color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)').toRgbString();
    }
    var baseWidth = Math.max(windowWidth, 1000);
    var width = Math.round(baseWidth / 10 + Math.random() * baseWidth / 10) * options.sizeRatio;
    var height = Math.round(Math.random() * 10 + 2) * options.sizeRatio;
    var point = void 0;
    if (options.point) {
      point = {
        x: Math.round(options.point.x - width / 2 + Math.random() * 200 - 100),
        y: Math.round(options.point.y - height / 2 + Math.random() * 50 - 25)
      };
    } else {
      point = {
        x: Math.round((windowWidth + width) * Math.random() - width),
        y: Math.round(windowHeight * Math.random())
      };
    }
    var lineOptions = {
      x: point.x,
      y: point.y,
      width: width,
      height: height,
      color: color
    };
    var lineEl = createLine(lineOptions);
    lineEl.style.display = 'none';
    container.appendChild(lineEl);

    dynamics.setTimeout(function () {
      lineEl.style.display = 'block';

      dynamics.setTimeout(function () {
        lineOptions.x += Math.random() * 100 - 50;
        lineOptions.y += Math.random() * 20 - 10;
        lineEl.setAttribute('x', lineOptions.x);
        lineEl.setAttribute('y', lineOptions.y);

        var newLineOptions = options.transform({
          width: lineOptions.width,
          height: lineOptions.height
        });
        lineEl.setAttribute('width', newLineOptions.width);
        lineEl.setAttribute('height', newLineOptions.height);

        dynamics.setTimeout(function () {
          container.removeChild(lineEl);
        }, options.delay('hide', i));
      }, options.delay('transform', i));
    }, options.delay('show', i));

    stripes.push(lineEl);
  };

  for (var i = 0; i < options.count; i++) {
    _loop(i);
  }
  return stripes;
}
function animateBlackStripes(container) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options.sizeRatio = 3;
  options.color = '#101214';
  options.delay = function (type, i) {
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
  options.transform = function (size) {
    return {
      width: size.width / 2,
      height: size.height / 5
    };
  };
  _animateStripes(container, options);
}
function animateColoredStripes(container) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options.delay = function (type, i) {
    if (type === 'show') {
      return Math.random() * 300;
    } else if (type === 'transform') {
      return Math.random() * 20;
    } else if (type === 'hide') {
      return 100;
    }
  };
  options.transform = function (size) {
    return {
      width: size.width / 2,
      height: size.height / 5
    };
  };
  _animateStripes(container, options);
}

var totalMaskIdx = 0;
function createMasksWithStripes(count, box) {
  var averageHeight = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

  var masks = [];
  for (var i = 0; i < count; i++) {
    masks.push([]);
  }
  var maskNames = [];
  for (var _i = totalMaskIdx; _i < totalMaskIdx + masks.length; _i++) {
    maskNames.push('clipPath' + _i);
  }
  totalMaskIdx += masks.length;
  var maskIdx = 0;
  var x = 0;
  var y = 0;
  var stripeHeight = averageHeight;
  while (true) {
    var w = Math.max(stripeHeight * 10, Math.round(Math.random() * box.width));
    masks[maskIdx].push('\n      M ' + x + ',' + y + ' L ' + (x + w) + ',' + y + ' L ' + (x + w) + ',' + (y + stripeHeight) + ' L ' + x + ',' + (y + stripeHeight) + ' Z\n    ');

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

  masks.forEach(function (rects, i) {
    var el = createSvgChildEl('<clipPath id="' + maskNames[i] + '">\n      <path d="' + rects.join(' ') + '" fill="white"></path>\n    </clipPath>');
    document.querySelector('#clip-paths g').appendChild(el);
  });

  return maskNames;
}

function cloneAndStripeElement(element, clipPathName, parent) {
  var el = element.cloneNode(true);
  var box = element.getBoundingClientRect();
  var parentBox = parent.getBoundingClientRect();
  box = {
    top: box.top - parentBox.top,
    left: box.left - parentBox.left,
    width: box.width,
    height: box.height
  };
  var style = window.getComputedStyle(element);

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
    textDecoration: style.textDecoration
  });
  parent.appendChild(el);
  el.style['-webkit-clip-path'] = 'url(/#' + clipPathName + ')';
  el.style['clip-path'] = 'url(/#' + clipPathName + ')';

  return el;
}

var contentEls = [];
var originalContentEls = document.querySelectorAll('#header-content, #content');
(function () {
  var els = originalContentEls;
  var pageBox = pageEl.getBoundingClientRect();
  for (var j = 0; j < els.length; j++) {
    var el = els[j];
    var box = el.getBoundingClientRect();
    var masks = createMasksWithStripes(6, box);
    for (var i = 0; i < masks.length; i++) {
      var clonedEl = cloneAndStripeElement(el, masks[i], pageEl);
      clonedEl.setAttribute('data-idx', i);
      contentEls.push(clonedEl);
      var childrenEls = clonedEl.querySelectorAll('h2, ul > li > a, a.more, h1, p, path');
      for (var k = 0; k < childrenEls.length; k++) {
        var _color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
        var rgb = _color.toRgbString();
        dynamics.css(childrenEls[k], {
          color: rgb,
          fill: rgb
        });
      }
    }
    el.style.visibility = 'hidden';
  }
})();

function showContent() {
  var maxDelay = 0;

  var _loop2 = function _loop2(i) {
    var el = contentEls[i];
    var d = 50 + Math.round(Math.random() * 350);
    var transform = {
      translateX: Math.round(Math.random() * 40 - 20)
    };
    var more = el.getAttribute('data-idx') <= 3;
    dynamics.css(el, transform);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        display: ''
      });
    }, d);
    maxDelay = Math.max(maxDelay, d);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: Math.round(transform.translateX / -5)
      });
    }, d + 100);
    dynamics.setTimeout(function () {
      dynamics.css(el, {
        translateX: 0,
        translateY: 0
      });
      if (!more) {
        el.parentNode.removeChild(el);
      }
    }, d + 150);
    if (more) {
      dynamics.setTimeout(function () {
        dynamics.css(el, {
          translateX: Math.round(transform.translateX / -2)
        });
      }, d + 300);
      dynamics.setTimeout(function () {
        el.parentNode.removeChild(el);
      }, d + 550);
    }
  };

  for (var i = 0; i < contentEls.length; i++) {
    _loop2(i);
  }
  dynamics.setTimeout(function () {
    for (var _i2 = 0; _i2 < originalContentEls.length; _i2++) {
      originalContentEls[_i2].style.visibility = 'visible';
    }
  }, maxDelay);
}

// intro
(function () {
  animateBlackStripes(stripesEl, {
    count: 200
  });
  animateColoredStripes(stripesEl, {
    count: 100
  });

  dynamics.css(pageEl, {
    scale: 0.95
  });
  dynamics.animate(pageEl, {
    scale: 1
  }, {
    type: dynamics.easeInOut,
    friction: 500,
    duration: 4000
  });

  dynamics.css(logo, {
    scale: 1
  });
  dynamics.animate(logo, {
    scale: 0.90
  }, {
    duration: 1500,
    type: dynamics.easeOut
  });

  var color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
  dynamics.animate(logoPath, {
    fill: color.toRgbString()
  }, {
    duration: 700
  });

  color = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
  dynamics.animate(logoPath, {
    fill: color.toRgbString()
  }, {
    duration: 700,
    delay: 700
  });

  function animateLogo() {
    dynamics.css(logoContainer, {
      scale: 0.5,
      translateX: Math.random() * 100 - 50
    });

    dynamics.setTimeout(function () {
      dynamics.css(logoContainer, {
        translateX: 10,
        scale: 0.55
      });
    }, 100);

    dynamics.setTimeout(function () {
      dynamics.css(logoContainer, {
        translateX: 0,
        scale: 0.5
      });
    }, 150);
  };

  animateLogo();

  dynamics.setTimeout(function () {
    logoContainer.style.visibility = 'visible';
  }, 1);

  dynamics.setTimeout(function () {
    animateLogo();
    animateBlackStripes(stripesEl, {
      count: 200,
      delayShow: true
    });
    animateColoredStripes(stripesEl, {
      count: 100
    });
  }, 1000);

  dynamics.setTimeout(function () {
    introEl.style.backgroundColor = 'transparent';
    dynamics.css(logoContainer, {
      scale: 1,
      translateX: Math.random() * windowWidth - windowWidth / 2,
      translateY: Math.random() * windowHeight - windowHeight / 2
    });
    showContent();
  }, 1300);

  dynamics.setTimeout(function () {
    dynamics.css(logoContainer, {
      scale: 0.75
    });
  }, 1350);

  dynamics.setTimeout(function () {
    logo.style.display = 'none';
  }, 1400);

  dynamics.setTimeout(function () {
    document.body.removeChild(introEl);
  }, 3000);
})();

// page
(function () {
  var pageStripesEl = document.querySelector('#page-stripes');
  var linkEls = document.querySelectorAll('a');

  function animateCrazyLogo() {
    var el = document.querySelector('#header-logo');
    var box = el.getBoundingClientRect();
    var count = 10 + Math.random() * 10;
    var masks = createMasksWithStripes(count, box, Math.round(100 / count));
    var clonedEls = [];

    for (var i = 0; i < masks.length; i++) {
      var clonedEl = cloneAndStripeElement(el, masks[i], document.body);
      var path = clonedEl.querySelector('path');
      var _color2 = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
      dynamics.css(path, {
        fill: _color2.toRgbString()
      });
      clonedEls.push(clonedEl);
    }

    var _loop3 = function _loop3(_i3) {
      var clonedEl = clonedEls[_i3];
      var d = Math.random() * 100;

      dynamics.setTimeout(function () {
        clonedEl.style.display = '';
        dynamics.css(clonedEl, {
          translateX: Math.random() * 100 - 50
        });
      }, d);

      dynamics.setTimeout(function () {
        dynamics.css(clonedEl, {
          translateX: Math.random() * 20 - 10
        });
      }, d + 50);

      dynamics.setTimeout(function () {
        dynamics.css(clonedEl, {
          translateX: Math.random() * 5 - 2.5
        });
      }, d + 100);

      dynamics.setTimeout(function () {
        document.body.removeChild(clonedEl);
      }, d + 150);
    };

    for (var _i3 = 0; _i3 < clonedEls.length; _i3++) {
      _loop3(_i3);
    }
  };

  function logoAnimationLoop() {
    dynamics.setTimeout(function () {
      animateCrazyLogo();
      logoAnimationLoop();
    }, 100 + Math.random() * 5000);
  };

  dynamics.setTimeout(logoAnimationLoop, 4000);
  document.querySelector('#header-logo').addEventListener('mouseover', animateCrazyLogo);

  function handleMouseOver(e) {
    var el = e.target;
    while (el && el.tagName.toLowerCase() !== 'a') {
      el = el.parentNode;
    }
    if (!el) {
      return;
    }
    var r = animateLink(el);

    var handleMouseOut = function handleMouseOut(e) {
      el.removeEventListener('mouseout', handleMouseOut);
      r.stop();
    };

    el.addEventListener('mouseout', handleMouseOut);
  }

  function animateLink(el) {
    var animating = true;
    var box = el.getBoundingClientRect();

    var animate = function animate() {
      var masks = createMasksWithStripes(3, box, 3);
      var clonedEls = [];

      for (var i = 0; i < masks.length; i++) {
        var clonedEl = cloneAndStripeElement(el, masks[i], document.body);
        var childrenEls = Array.prototype.slice.apply(clonedEl.querySelectorAll('path'));
        childrenEls.push(clonedEl);
        for (var k = 0; k < childrenEls.length; k++) {
          var _color3 = tinycolor('hsl(' + Math.round(Math.random() * 360) + ', 80%, 65%)');
          var rgb = _color3.toRgbString();
          dynamics.css(childrenEls[k], {
            color: rgb,
            fill: rgb
          });
        }
        clonedEl.style.display = '';
        clonedEls.push(clonedEl);
      }

      var _loop4 = function _loop4(_i4) {
        var clonedEl = clonedEls[_i4];
        dynamics.css(clonedEl, {
          translateX: Math.random() * 10 - 5
        });

        dynamics.setTimeout(function () {
          dynamics.css(clonedEl, {
            translateX: 0
          });
        }, 50);

        dynamics.setTimeout(function () {
          dynamics.css(clonedEl, {
            translateX: Math.random() * 5 - 2.5
          });
        }, 100);

        dynamics.setTimeout(function () {
          document.body.removeChild(clonedEl);
        }, 150);
      };

      for (var _i4 = 0; _i4 < clonedEls.length; _i4++) {
        _loop4(_i4);
      }

      dynamics.setTimeout(function () {
        if (animating) {
          animate();
        }
        for (var _i5 = 0; _i5 < masks.length; _i5++) {
          var maskEl = document.querySelector('#' + masks[_i5]);
          maskEl.parentNode.removeChild(maskEl);
        }
      }, Math.random() * 1000);
    };

    animate();

    return {
      stop: function stop() {
        animating = false;
      }
    };
  };

  if (!('ontouchstart' in window)) {
    for (var i = 0; i < linkEls.length; i++) {
      linkEls[i].addEventListener('mouseover', handleMouseOver);
    }
  }
})();
