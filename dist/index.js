(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/index.js
  var import_gsap = __toESM(__require("https://cdn.skypack.dev/gsap"));
  var import_swiper = __toESM(__require("https://cdn.skypack.dev/swiper"));
  document.addEventListener("DOMContentLoaded", () => {
    import_gsap.default.registerPlugin(Draggable, InertiaPlugin);
    initTabSystem();
    initSwipers();
  });
  function initTabSystem() {
    const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
    wrappers.forEach((wrapper) => {
      const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
      const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
      const autoplay = wrapper.dataset.tabsAutoplay === "true";
      const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5e3;
      let activeContent = null;
      let activeVisual = null;
      let isAnimating = false;
      let progressBarTween = null;
      function startProgressBar(index) {
        if (progressBarTween) progressBarTween.kill();
        const bar = contentItems[index].querySelector(
          '[data-tabs="item-progress"]'
        );
        if (!bar) return;
        import_gsap.default.set(bar, { scaleX: 0, transformOrigin: "left center" });
        progressBarTween = import_gsap.default.to(bar, {
          scaleX: 1,
          duration: autoplayDuration / 1e3,
          ease: "power1.inOut",
          onComplete: () => {
            if (!isAnimating) {
              const nextIndex = (index + 1) % contentItems.length;
              switchTab(nextIndex);
            }
          }
        });
      }
      function switchTab(index) {
        if (isAnimating || contentItems[index] === activeContent) return;
        isAnimating = true;
        if (progressBarTween) progressBarTween.kill();
        const outgoingContent = activeContent;
        const outgoingVisual = activeVisual;
        const outgoingBar = outgoingContent?.querySelector(
          '[data-tabs="item-progress"]'
        );
        const incomingContent = contentItems[index];
        const incomingVisual = visualItems[index];
        const incomingBar = incomingContent.querySelector(
          '[data-tabs="item-progress"]'
        );
        outgoingContent?.classList.remove("active");
        outgoingVisual?.classList.remove("active");
        incomingContent.classList.add("active");
        incomingVisual.classList.add("active");
        const tl = import_gsap.default.timeline({
          defaults: { duration: 0.65, ease: "power3" },
          onComplete: () => {
            activeContent = incomingContent;
            activeVisual = incomingVisual;
            isAnimating = false;
            if (autoplay) startProgressBar(index);
          }
        });
        if (outgoingContent) {
          outgoingContent.classList.remove("active");
          outgoingVisual?.classList.remove("active");
          tl.set(outgoingBar, { transformOrigin: "right center" }).to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0).to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0);
        }
        incomingContent.classList.add("active");
        incomingVisual.classList.add("active");
        tl.fromTo(
          incomingVisual,
          { autoAlpha: 0, xPercent: 3 },
          { autoAlpha: 1, xPercent: 0 },
          0.3
        ).set(incomingBar, { scaleX: 0, transformOrigin: "left center" }, 0);
      }
      switchTab(0);
      contentItems.forEach(
        (item, i) => item.addEventListener("click", () => {
          if (item === activeContent) return;
          switchTab(i);
        })
      );
    });
  }
  function initSwipers() {
    const imageSwiper = new import_swiper.default(".swiper", {
      slidesPerView: 1.5,
      centeredSlides: true,
      loop: true,
      speed: 500,
      autoplay: {
        delay: 5e3
      },
      navigation: {
        nextEl: "[data-swiper-next]",
        prevEl: "[data-swiper-prev]"
      }
    });
  }
})();
