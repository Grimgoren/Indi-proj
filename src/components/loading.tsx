import $ from 'jquery';

async function loading() {
  $(window).on('load', function() {
    $('#loading').fadeOut(500);
  });
}

export default loading;
