(() => {
  const zoomDefaults = {
    minZoom: 1,
    maxZoom: 8,
    maxZoomPixelRatio: 1,
    zoomInMultiplier: 2,
    keyboardMoveDistance: 50,
    wheelZoomDistanceFactor: 100,
    scrollToZoom: false,
    doubleClickMaxStops: 2,
  };

  const icons = {
    play: '<path d="M8 5v14l11-7z"/>',
    pause: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
    zoomIn: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>',
    zoomOut: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/>',
    close: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
    previous: '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
    next: '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
  };

  function iconSvg(path) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" class="yarl__icon"><g fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/>${path}</g></svg>`;
  }

  function button(label, path, extra = "") {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `yarl__button ${extra}`.trim();
    element.setAttribute("aria-label", label);
    element.title = label;
    element.innerHTML = iconSvg(path);
    return element;
  }

  function open(items, start, opener) {
    if (!items.length) return;

    const templateRoot = document.querySelector('[data-chorlove-template="lace"]');
    const reduced = Boolean(templateRoot?.classList.contains("lace-reduced-motion")) || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const options = { ...zoomDefaults };
    const portal = document.createElement("div");
    portal.className = "yarl__root yarl__portal yarl__no_scroll_padding";
    portal.setAttribute("role", "dialog");
    portal.setAttribute("aria-modal", "true");
    portal.setAttribute("aria-label", "Lightbox");
    if (reduced) portal.style.setProperty("--yarl__fade_animation_duration", "0ms");

    const thumbnails = document.createElement("div");
    const thumbWrapper = document.createElement("div");
    const thumbContainer = document.createElement("div");
    const thumbTrack = document.createElement("nav");
    const vignette = document.createElement("div");
    thumbnails.className = "yarl__thumbnails yarl__thumbnails_bottom";
    thumbWrapper.className = "yarl__thumbnails_wrapper";
    thumbContainer.className = "yarl__thumbnails_container yarl__flex_center";
    thumbContainer.style.cssText = "--yarl__thumbnails_thumbnail_width:84px;--yarl__thumbnails_thumbnail_height:56px;--yarl__thumbnails_thumbnail_border:1px;--yarl__thumbnails_thumbnail_border_radius:8px;--yarl__thumbnails_thumbnail_padding:0px;--yarl__thumbnails_thumbnail_gap:8px";
    thumbTrack.className = "yarl__thumbnails_track yarl__flex_center";
    thumbTrack.setAttribute("aria-label", "Thumbnails");
    thumbTrack.tabIndex = -1;
    vignette.className = "yarl__thumbnails_vignette";

    const container = document.createElement("div");
    const carousel = document.createElement("div");
    const carouselViewport = document.createElement("div");
    container.className = "yarl__container yarl__flex_center";
    container.tabIndex = -1;
    carousel.className = "yarl__carousel yarl__carousel_with_slides";
    carouselViewport.className = "yarl__flex_center";
    carouselViewport.style.cssText = "position:absolute;inset:0;overflow:hidden";
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "Carousel");
    carousel.setAttribute("aria-live", "polite");
    carousel.setAttribute("aria-label", "Photo gallery");
    carousel.style.cssText = "--yarl__carousel_slides_count:5;--yarl__carousel_spacing_px:0;--yarl__carousel_spacing_percent:30;--yarl__carousel_padding_px:16;--yarl__carousel_padding_percent:0";
    carouselViewport.style.width = "100%";
    carouselViewport.style.height = "100%";
    carouselViewport.style.justifyContent = "center";
    carouselViewport.style.alignItems = "stretch";
    carouselViewport.style.display = "flex";
    carouselViewport.style.flex = "none";
    carouselViewport.style.columnGap = "calc(100% * 30 / (5 * 100 + 4 * 30))";
    const counter = document.createElement("div");
    counter.className = "yarl__counter";

    const toolbar = document.createElement("div");
    toolbar.className = "yarl__toolbar";
    const play = button("Play", icons.play);
    const zoomIn = button("Zoom in", icons.zoomIn);
    const zoomOut = button("Zoom out", icons.zoomOut);
    const close = button("Close", icons.close);
    const previous = button("Previous", icons.previous, "yarl__navigation_prev");
    const next = button("Next", icons.next, "yarl__navigation_next");
    toolbar.append(play, zoomIn, zoomOut, close);
    container.append(carousel, toolbar, previous, next, counter);

    let index = (start + items.length) % items.length;
    let zoom = options.minZoom;
    let maxZoom = options.maxZoom;
    let offsetX = 0;
    let offsetY = 0;
    let currentImage = null;
    let currentSlide = null;
    let sliding = false;
    let closing = false;
    let slideshow = 0;
    let pointerStart = null;
    let pointerMode = "";
    let pinchStart = null;
    let previousTap = 0;
    let backdropTarget = null;
    const activePointers = new Map();
    const sourceSiblings = [];

    const imageOffset = (event) => {
      const rect = container.getBoundingClientRect();
      return [event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2];
    };
    const updateControls = () => {
      zoomOut.disabled = zoom <= options.minZoom;
      zoomIn.disabled = zoom >= maxZoom;
    };
    const setImageTransform = (animate = true) => {
      const wrapper = carousel.querySelector(".yarl__slide_current .yarl__slide_wrapper");
      if (!wrapper) return;
      wrapper.style.transition = animate && !reduced ? "transform 500ms ease-in-out" : "none";
      wrapper.style.transform = `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)`;
      updateControls();
    };
    const updateZoomBounds = () => {
      if (!currentImage || !currentSlide || !currentImage.naturalWidth || !currentImage.naturalHeight) return;
      const rect = currentSlide.getBoundingClientRect();
      const availableWidth = Math.max(1, rect.width - 32);
      const availableHeight = Math.max(1, rect.height - 32);
      const fitScale = Math.min(availableWidth / currentImage.naturalWidth, availableHeight / currentImage.naturalHeight);
      const imageWidth = currentImage.naturalWidth * fitScale;
      maxZoom = Math.min(options.maxZoom, Math.max(options.minZoom, currentImage.naturalWidth / imageWidth * options.maxZoomPixelRatio));
      if (zoom > maxZoom) setZoom(maxZoom, true);
      updateControls();
    };
    const setZoom = (value, animate = true, anchorX = 0, anchorY = 0) => {
      const nextZoom = Math.min(maxZoom, Math.max(options.minZoom, value));
      if (nextZoom === zoom) return;
      const factor = 1 / zoom - 1 / nextZoom;
      offsetX -= anchorX * factor;
      offsetY -= anchorY * factor;
      zoom = nextZoom;
      setImageTransform(animate);
    };
    const moveOffsets = (x, y, animate = false) => {
      if (!currentImage || !currentSlide) return;
      const rect = currentSlide.getBoundingClientRect();
      const maxX = Math.max((currentImage.clientWidth * zoom - rect.width + 32) / (2 * zoom), 0);
      const maxY = Math.max((currentImage.clientHeight * zoom - rect.height + 32) / (2 * zoom), 0);
      offsetX = Math.max(-maxX, Math.min(maxX, offsetX + x));
      offsetY = Math.max(-maxY, Math.min(maxY, offsetY + y));
      setImageTransform(animate);
    };
    const countVisibleSlides = () => Math.min(5, items.length);
    const visibleItems = () => {
      const count = countVisibleSlides();
      const side = Math.floor(count / 2);
      return Array.from({ length: count }, (_, position) => {
        const offset = position - side;
        return { item: items[(index + offset + items.length) % items.length], offset };
      });
    };
    const thumbLabel = (itemIndex) => `${itemIndex + 1} of ${items.length}`;
    const draw = () => {
      carouselViewport.replaceChildren();
      thumbTrack.replaceChildren();
      currentImage = null;
      currentSlide = null;
      for (const { item, offset } of visibleItems()) {
        const itemIndex = (index + offset + items.length) % items.length;
        const slide = document.createElement("div");
        const wrapper = document.createElement("div");
        const image = document.createElement("img");
        slide.className = `yarl__slide yarl__flex_center${offset === 0 ? " yarl__slide_current" : ""}`;
        slide.style.flex = "1";
        slide.style.minWidth = "0";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-label", thumbLabel(itemIndex));
        wrapper.className = "yarl__fullsize yarl__flex_center yarl__slide_wrapper yarl__slide_wrapper_interactive";
        image.className = "yarl__slide_image";
        image.src = item.src;
        image.alt = item.alt || item.caption || "";
        image.draggable = false;
        image.onload = () => {
          if (image.naturalWidth && image.naturalHeight) {
            image.style.maxWidth = `min(${image.naturalWidth}px,100%)`;
            image.style.maxHeight = `min(${image.naturalHeight}px,100%)`;
            if (offset === 0 && image === currentImage) updateZoomBounds();
          }
        };
        if (offset === 0) {
          currentImage = image;
          currentSlide = slide;
          wrapper.style.transform = `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)`;
          wrapper.style.transition = "none";
        }
        wrapper.append(image);
        slide.append(wrapper);
        carouselViewport.append(slide);

        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = `yarl__flex_center yarl__thumbnails_thumbnail${offset === 0 ? " yarl__thumbnails_thumbnail_active" : ""}`;
        thumb.setAttribute("aria-label", thumbLabel(itemIndex));
        if (offset === 0) thumb.setAttribute("aria-current", "true");
        const thumbImage = document.createElement("img");
        thumbImage.className = "yarl__slide_image";
        thumbImage.src = item.src;
        thumbImage.alt = "";
        thumbImage.draggable = false;
        thumb.append(thumbImage);
        thumb.onclick = () => jump(itemIndex, thumb);
        thumbTrack.append(thumb);
      }
      counter.textContent = `${index + 1} / ${items.length}`;
      updateZoomBounds();
      updateControls();
    };
    const focusReturn = () => {
      for (const sibling of sourceSiblings) {
        if (sibling.inert) sibling.element.setAttribute("inert", "");
        else sibling.element.removeAttribute("inert");
        if (sibling.ariaHidden === null) sibling.element.removeAttribute("aria-hidden");
        else sibling.element.setAttribute("aria-hidden", sibling.ariaHidden);
      }
      opener?.focus({ preventScroll: true });
    };
    const finishClose = () => {
      if (closing) return;
      closing = true;
      window.clearInterval(slideshow);
      window.removeEventListener("keydown", onDocumentKeydown, true);
      document.body.removeEventListener("keydown", onDocumentKeydown, true);
      portal.classList.remove("yarl__portal_open");
      document.body.classList.remove("yarl__no_scroll");
      templateRoot?.classList.remove("lace-lightbox-open");
      const remove = () => {
        if (!portal.isConnected) return;
        portal.remove();
        focusReturn();
      };
      if (reduced) remove();
      else portal.addEventListener("transitionend", (event) => {
        if (event.target === portal && event.propertyName === "opacity") remove();
      }, { once: true });
      window.setTimeout(remove, reduced ? 0 : 300);
    };
    const animateThumbTrack = (delta, easing) => {
      if (!delta || reduced) return;
      const step = 84 + 2 * (1 + 0) + 8;
      thumbTrack.style.transition = "none";
      thumbTrack.style.transform = `translateX(${-delta * step}px)`;
      void thumbTrack.offsetWidth;
      thumbTrack.style.transition = `transform ${250 * Math.abs(delta)}ms ${easing}`;
      thumbTrack.style.transform = "translateX(0px)";
    };
    const move = (delta, gesture = false, focusThumb = null) => {
      if (sliding || items.length < 2) return;
      sliding = true;
      const distance = Math.round(container.clientWidth * 1.3);
      const duration = reduced ? 0 : 250 * Math.abs(delta);
      const easing = gesture ? "ease-out" : "ease-in-out";
      const from = Number.parseFloat(carouselViewport.style.transform.match(/-?[\d.]+/)?.[0] || "0");
      carouselViewport.style.transition = reduced ? "none" : `transform ${duration}ms ${easing}`;
      thumbTrack.style.transition = reduced ? "none" : "";
      animateThumbTrack(delta, easing);
      carouselViewport.style.transform = `translateX(${from - delta * distance}px)`;
      window.setTimeout(() => {
        index = (index + delta + items.length * (Math.abs(delta) + 1)) % items.length;
        zoom = options.minZoom;
        offsetX = 0;
        offsetY = 0;
        draw();
        carouselViewport.style.transition = "none";
        carouselViewport.style.transform = "translateX(0px)";
        void carousel.offsetWidth;
        carouselViewport.style.transition = "";
        thumbTrack.style.transition = "";
        thumbTrack.style.transform = "";
        sliding = false;
        if (focusThumb) thumbTrack.querySelector(`[aria-label="${thumbLabel(index)}"]`)?.focus({ preventScroll: true });
      }, duration);
    };
    const jump = (nextIndex, thumb = null) => {
      const delta = nextIndex - index;
      if (delta) move(delta, false, thumb);
    };
    const slideshowTick = () => move(1);

    previous.onclick = () => move(-1);
    next.onclick = () => move(1);
    close.onclick = finishClose;
    play.onclick = () => {
      if (slideshow) {
        window.clearInterval(slideshow);
        slideshow = 0;
        play.setAttribute("aria-label", "Play");
        play.title = "Play";
        play.innerHTML = iconSvg(icons.play);
      } else {
        play.setAttribute("aria-label", "Pause");
        play.title = "Pause";
        play.innerHTML = iconSvg(icons.pause);
        slideshow = window.setInterval(slideshowTick, 1500);
      }
    };
    zoomIn.onclick = () => setZoom(zoom * options.zoomInMultiplier);
    zoomOut.onclick = () => setZoom(zoom / options.zoomInMultiplier);

    const pointerPosition = (event) => [event.clientX, event.clientY];
    container.addEventListener("dblclick", (event) => {
      if (event.target instanceof HTMLImageElement) {
        const [x, y] = imageOffset(event);
        setZoom(zoom === options.minZoom ? Math.min(maxZoom, zoom * options.zoomInMultiplier) : options.minZoom, true, x, y);
      }
    });
    container.addEventListener("pointerdown", (event) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      backdropTarget = event.target;
      activePointers.set(event.pointerId, pointerPosition(event));
      if (activePointers.size === 1) {
        pointerStart = { x: event.clientX, y: event.clientY, time: event.timeStamp };
        pointerMode = zoom > options.minZoom ? "pan" : "swipe";
        container.setPointerCapture?.(event.pointerId);
        if (event.pointerType === "touch" && event.target instanceof HTMLImageElement) {
          const elapsed = event.timeStamp - previousTap;
          if (previousTap && elapsed < options.doubleClickMaxStops * 250) {
            const [x, y] = imageOffset(event);
            setZoom(zoom === options.minZoom ? Math.min(maxZoom, zoom * options.zoomInMultiplier) : options.minZoom, true, x, y);
          }
          previousTap = event.timeStamp;
        }
      } else if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        pinchStart = { distance: Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]), zoom, x: (points[0][0] + points[1][0]) / 2, y: (points[0][1] + points[1][1]) / 2 };
        pointerMode = "pinch";
      }
    });
    container.addEventListener("pointermove", (event) => {
      if (!activePointers.has(event.pointerId) || !pointerStart) return;
      activePointers.set(event.pointerId, pointerPosition(event));
      if (activePointers.size === 2 && pinchStart) {
        const points = [...activePointers.values()];
        const distance = Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]);
        const [x, y] = imageOffset({ clientX: pinchStart.x, clientY: pinchStart.y });
        setZoom(pinchStart.zoom * (distance / Math.max(pinchStart.distance, 1)), false, x, y);
        event.stopPropagation();
      } else if (pointerMode === "pan") {
        const previous = pointerStart;
        moveOffsets((event.clientX - previous.x) / zoom, (event.clientY - previous.y) / zoom);
        pointerStart = { ...previous, x: event.clientX, y: event.clientY };
        event.stopPropagation();
      } else if (pointerMode === "swipe") {
        const delta = event.clientX - pointerStart.x;
        carouselViewport.style.transition = "none";
        carouselViewport.style.transform = `translateX(${delta}px)`;
        event.stopPropagation();
      }
    });
    const endPointer = (event) => {
      const hitTarget = document.elementFromPoint(event.clientX, event.clientY);
      if (backdropTarget === hitTarget && hitTarget instanceof HTMLElement && (hitTarget.classList.contains("yarl__slide") || hitTarget.classList.contains("yarl__slide_wrapper"))) {
        backdropTarget = null;
        activePointers.delete(event.pointerId);
        finishClose();
        return;
      }
      if (event.type === "pointerup") backdropTarget = null;
      const start = pointerStart;
      const end = activePointers.get(event.pointerId);
      activePointers.delete(event.pointerId);
      if (pointerMode === "swipe" && start && end && activePointers.size === 0) {
        const delta = end[0] - start.x;
        const elapsed = event.timeStamp - start.time;
        const swipeThreshold = container.clientWidth * 0.3;
        if (Math.abs(delta) > swipeThreshold || (Math.abs(delta) > 5 && elapsed < 300)) move(delta < 0 ? 1 : -1, true);
        else {
          carouselViewport.style.transition = reduced ? "none" : "transform 250ms ease-out";
          carouselViewport.style.transform = "translateX(0px)";
        }
      }
      if (activePointers.size < 2) pinchStart = null;
      if (activePointers.size === 0) {
        pointerStart = null;
        pointerMode = "";
      }
    };
    container.addEventListener("pointerup", endPointer);
    container.addEventListener("pointercancel", endPointer);
    container.addEventListener("wheel", (event) => {
      const scrollToZoom = options.scrollToZoom;
      if ((event.ctrlKey || scrollToZoom) && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.stopPropagation();
        const factor = Math.min(1 + Math.abs(event.deltaY / options.wheelZoomDistanceFactor), 2) ** Math.sign(-event.deltaY);
        const [x, y] = imageOffset(event);
        setZoom(zoom * factor, true, x, y);
      } else if (zoom > options.minZoom) {
        event.stopPropagation();
        moveOffsets(-event.deltaX / zoom, -event.deltaY / zoom, false);
      }
    }, { passive: true });
    const onDocumentKeydown = (event) => {
      if (event.key === "Tab" && document.activeElement === document.body) {
        event.preventDefault();
        const focusables = [...portal.querySelectorAll("button:not(:disabled):not([tabindex=\"-1\"])")];
        (event.shiftKey ? focusables.at(-1) : focusables[0])?.focus({ preventScroll: true });
        return;
      }
    };
    window.addEventListener("keydown", onDocumentKeydown, true);
    document.body.addEventListener("keydown", onDocumentKeydown, true);
    portal.addEventListener("keydown", (event) => {
      const pan = options.keyboardMoveDistance;
      if (zoom > options.minZoom && event.key.startsWith("Arrow")) {
        event.preventDefault();
        event.stopPropagation();
        if (event.key === "ArrowRight") moveOffsets(pan, 0, true);
        else if (event.key === "ArrowLeft") moveOffsets(-pan, 0, true);
        else if (event.key === "ArrowDown") moveOffsets(0, pan, true);
        else if (event.key === "ArrowUp") moveOffsets(0, -pan, true);
      } else if (event.key === "Escape") {
        event.preventDefault();
        finishClose();
      } else if (zoom === options.minZoom && event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      } else if (zoom === options.minZoom && event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "+" || (event.ctrlKey && event.key === "=")) {
        event.preventDefault();
        setZoom(zoom * options.zoomInMultiplier);
      } else if (event.key === "-" || (event.ctrlKey && event.key === "_")) {
        event.preventDefault();
        setZoom(zoom / options.zoomInMultiplier);
      } else if (event.ctrlKey && event.key === "0") {
        event.preventDefault();
        setZoom(options.minZoom);
      }
    });

    carousel.append(carouselViewport);
    thumbWrapper.append(container);
    thumbContainer.append(thumbTrack, vignette);
    thumbnails.append(thumbWrapper, thumbContainer);
    portal.append(thumbnails);
    document.body.append(portal);
    for (const sibling of [...portal.parentElement.children]) {
      if (sibling === portal || ["TEMPLATE", "SCRIPT", "STYLE"].includes(sibling.tagName)) continue;
      sourceSiblings.push({ element: sibling, inert: sibling.hasAttribute("inert"), ariaHidden: sibling.getAttribute("aria-hidden") });
      sibling.setAttribute("inert", "");
      sibling.setAttribute("aria-hidden", "true");
    }
    templateRoot?.classList.add("lace-lightbox-open");
    document.body.classList.add("yarl__no_scroll");
    draw();
    requestAnimationFrame(() => {
      portal.classList.add("yarl__portal_open");
      container.focus({ preventScroll: true });
    });
  }

  window.LaceGalleryLightbox = { open };
})();
