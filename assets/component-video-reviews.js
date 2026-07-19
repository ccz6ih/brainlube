// UGC video reviews: lazily builds the modal's video/iframe only when a
// card is clicked, so playback starts immediately with sound. Browsers
// block unmuted autoplay unless the media is created in direct response
// to a user gesture - creating it on click (instead of on page load)
// satisfies that.
document.addEventListener('click', function (event) {
  var card = event.target.closest('.video-reviews-card');
  if (!card) return;

  var href = card.getAttribute('href') || '';
  var modalId = href.split('#')[1];
  if (!modalId) return;

  var modal = document.getElementById(modalId);
  if (!modal) return;

  var player = modal.querySelector('[data-video-reviews-player]');
  var template = modal.querySelector('template[data-video-reviews-template]');
  if (!player || !template) return;

  // Already playing (e.g. re-clicked before it closed) - leave it alone.
  if (player.childNodes.length) return;

  player.appendChild(template.content.cloneNode(true));

  var video = player.querySelector('video');
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

  var iframe = player.querySelector('iframe');
  if (iframe) {
    var src = iframe.getAttribute('src') || '';
    if (src.indexOf('autoplay=0') !== -1) {
      iframe.setAttribute('src', src.replace('autoplay=0', 'autoplay=1'));
    }
  }
});

// Stop playback and free the player as soon as its modal closes, so audio
// doesn't keep running in the background and the video restarts cleanly
// (rather than resuming mid-clip) the next time it's opened.
document.querySelectorAll('.video-reviews-modal').forEach(function (modal) {
  var player = modal.querySelector('[data-video-reviews-player]');
  if (!player) return;

  var observer = new MutationObserver(function () {
    if (!modal.classList.contains('is-open')) {
      player.innerHTML = '';
    }
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
});
