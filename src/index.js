// @ts-check
// type="module"
import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    initTabSystem();
    initSwipers();
  });
  
  function initTabSystem() {
    const wrappers = document.querySelectorAll('[data-tabs="wrapper"]');
  
    wrappers.forEach((wrapper) => {
      const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]');
      const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]');
  
      const autoplay = wrapper.dataset.tabsAutoplay === "true";
      const autoplayDuration =
        parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000;
  
      let activeContent = null; // keep track of active item/link
      let activeVisual = null;
      let isAnimating = false;
      let progressBarTween = null; // to stop/start the progress bar
  
      function startProgressBar(index) {
        if (progressBarTween) progressBarTween.kill();
        const bar = contentItems[index].querySelector(
          '[data-tabs="item-progress"]'
        );
        if (!bar) return;
  
        // In this function, you can basically do anything you want, that should happen as a tab is active
        // Maybe you have a circle filling, some other element growing, you name it.
        gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
        progressBarTween = gsap.to(bar, {
          scaleX: 1,
          duration: autoplayDuration / 1000,
          ease: "power1.inOut",
          onComplete: () => {
            if (!isAnimating) {
              const nextIndex = (index + 1) % contentItems.length;
              switchTab(nextIndex); // once bar is full, set next to active – this is important
            }
          },
        });
      }
  
      function switchTab(index) {
        if (isAnimating || contentItems[index] === activeContent) return;
  
        isAnimating = true;
        if (progressBarTween) progressBarTween.kill(); // Stop any running progress bar here
  
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
  
        const tl = gsap.timeline({
          defaults: { duration: 0.65, ease: "power3" },
          onComplete: () => {
            activeContent = incomingContent;
            activeVisual = incomingVisual;
            isAnimating = false;
            if (autoplay) startProgressBar(index); // Start autoplay bar here
          },
        });
  
        // Wrap 'outgoing' in a check to prevent warnings on first run of the function
        // Of course, during first run (on page load), there's no 'outgoing' tab yet!
        if (outgoingContent) {
          outgoingContent.classList.remove("active");
          outgoingVisual?.classList.remove("active");
          tl.set(outgoingBar, { transformOrigin: "right center" })
            .to(outgoingBar, { scaleX: 0, duration: 0.3 }, 0)
            .to(outgoingVisual, { autoAlpha: 0, xPercent: 3 }, 0);
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
  
      // on page load, set first to active
      // idea: you could wrap this in a scrollTrigger
      // so it will only start once a user reaches this section
      switchTab(0);
  
      // switch tabs on click
      contentItems.forEach((item, i) =>
        item.addEventListener("click", () => {
          if (item === activeContent) return; // ignore click if current one is already active
          switchTab(i);
        })
      );
    });
  }

  function initSwipers() {
    const imageSwiper = new Swiper(".swiper", {
      slidesPerView: 1.5,
      centeredSlides: true,
      loop: true,
      speed: 500,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: "[data-swiper-next]",
        prevEl: "[data-swiper-prev]",
      },
    });
  }
  
  console.log("TESTTT")

  console.log("LALALALALAL")