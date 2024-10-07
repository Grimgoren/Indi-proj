import $ from 'jquery';

async function loading() {
  // Fade out the loading element when the window has fully loaded
  $(window).on('load', function() {
    $('#loading').fadeOut(3000);  // Fades out the loading div in 3 seconds
  });
}

export default loading;
