const draggableTimeline = document.querySelector(".draggable-timeline");

if (draggableTimeline) {
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  const startDrag = (clientX) => {
    isDragging = true;
    startX = clientX;
    startScrollLeft = draggableTimeline.scrollLeft;
    draggableTimeline.classList.add("is-dragging");
  };

  const moveDrag = (clientX) => {
    if (!isDragging) {
      return;
    }

    const delta = clientX - startX;
    draggableTimeline.scrollLeft = startScrollLeft - delta;
  };

  const endDrag = () => {
    isDragging = false;
    draggableTimeline.classList.remove("is-dragging");
  };

  draggableTimeline.addEventListener("mousedown", (event) => {
    startDrag(event.clientX);
  });

  window.addEventListener("mousemove", (event) => {
    moveDrag(event.clientX);
  });

  window.addEventListener("mouseup", endDrag);
  draggableTimeline.addEventListener("mouseleave", endDrag);

  draggableTimeline.addEventListener("touchstart", (event) => {
    startDrag(event.touches[0].clientX);
  }, { passive: true });

  draggableTimeline.addEventListener("touchmove", (event) => {
    moveDrag(event.touches[0].clientX);
  }, { passive: true });

  draggableTimeline.addEventListener("touchend", endDrag);
}
