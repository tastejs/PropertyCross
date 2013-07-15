(function(app, $, dust) {

app.render = function(template, model) {
  dust.render(template, model, function(err, html) {
    if (err) {
      console.log(err);
    } else {
      $('#view-root').html(html);
    }
  });
};

app.load = function(model) {
  $(document).ready(function(e) {
    app.render('type', model);
  });
};

$(document.body)
  .on('click', '.show-inherited', function(e) {
    e.preventDefault();
    $(e.currentTarget).remove();
    $(document.body).addClass('display-all');
  })
$(document)
  .ready(function(e) {
    $('script[type="text/x-dust-template"]').each(function() {
      dust.compile(this.innerHTML, this.getAttribute('data-name'));
    });
  });

})(window.app || (window.app = {}), Zepto, xdust);