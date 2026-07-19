// UGC video reviews: lazily builds the modal's video/iframe only when a
// card (or a prev/next click) requests it, so playback starts
// immediately with sound. Browsers block unmuted autoplay unless the
// media is created in direct response to a user gesture - creating it
// on click (instead of on page load) satisfies that.
(function () {
  function getTemplates(modal) {
    return Array.prototype.slice.call(modal.querySelectorAll('template[data-video-reviews-template]'));
  }

  function showVideo(modal, index) {
    var templates = getTemplates(modal);
    if (!templates.length) return;

    var count = templates.length;
    index = ((index % count) + count) % count; // wrap around both directions

    var template = templates[index];
    var stage = modal.querySelector('[data-video-reviews-player]');
    if (!stage) return;

    stage.innerHTML = '';
    stage.appendChild(template.content.cloneNode(true));
    modal.setAttribute('data-current-index', index);

    var video = stage.querySelector('video');
    if (video) {
      video.muted = false;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          // Some browsers still refuse unmuted playback here - fall back
          // rather than leaving the video stalled with no sound and no play.
          video.muted = true;
          video.play();
        });
      }
    }

    var iframe = stage.querySelector('iframe');
    if (iframe) {
      var src = iframe.getAttribute('src') || '';
      if (src.indexOf('autoplay=0') !== -1) {
        iframe.setAttribute('src', src.replace('autoplay=0', 'autoplay=1'));
      }
    }
  }

  function currentIndex(modal) {
    return parseInt(modal.getAttribute('data-current-index') || '0', 10);
  }

  document.addEventListener('click', function (event) {
    var card = event.target.closest('.video-reviews-card');
    if (card) {
      var href = card.getAttribute('href') || '';
      var modalId = href.split('#')[1];
      var modal = modalId && document.getElementById(modalId);
      if (modal) {
        showVideo(modal, parseInt(card.getAttribute('data-video-reviews-index') || '0', 10));
      }
      return;
    }

    var nextBtn = event.target.closest('[data-video-reviews-next]');
    if (nextBtn) {
      var nextModal = nextBtn.closest('.video-reviews-modal');
      if (nextModal) showVideo(nextModal, currentIndex(nextModal) + 1);
      return;
    }

    var prevBtn = event.target.closest('[data-video-reviews-prev]');
    if (prevBtn) {
      var prevModal = prevBtn.closest('.video-reviews-modal');
      if (prevModal) showVideo(prevModal, currentIndex(prevModal) - 1);
      return;
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    var openModal = document.querySelector('.video-reviews-modal.is-open');
    if (!openModal) return;
    showVideo(openModal, currentIndex(openModal) + (event.key === 'ArrowRight' ? 1 : -1));
  });

  // Stop playback and free the stage as soon as its modal closes, so audio
  // doesn't keep running in the background and each video restarts cleanly
  // (rather than resuming mid-clip) the next time it's opened.
  document.querySelectorAll('.video-reviews-modal').forEach(function (modal) {
    var stage = modal.querySelector('[data-video-reviews-player]');
    if (!stage) return;

    var observer = new MutationObserver(function () {
      if (!modal.classList.contains('is-open')) {
        stage.innerHTML = '';
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  });
})();
