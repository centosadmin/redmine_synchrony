$(function(){
  var properties = $('#synchrony-sites')
  var translations = properties.data('i18n')
  var projects = properties.data('projects')
  var trackers = properties.data('trackers')

  var label = function(field_name, nextId){
    return $('<label for="settings_redmine_' + nextId + '_' + field_name + '">' + translations[field_name] + '</label>');
  };

  var inputField = function(field_name, nextId){
    return $('<p>').append(
      label(field_name, nextId)
    ).append(
      $('<input type="text" size="60" id="settings_redmine_' + nextId + '_' + field_name +
        '" name="settings[redmine][][' + field_name + ']">')
    );
  };

  var selectField = function(field_name, values, nextId){
    var options = [$('<option></option>')];
    for (var id in values) {
      if (values.hasOwnProperty(id)) {
        options.push($('<option value="' + id + '">' + values[id] + '</option>'))
      }
    }
    return $('<p>').append(
      label(field_name, nextId)
    ).append(
      $('<select id="settings_redmine_' + nextId +'_' + field_name + '" name="settings[redmine][][' + field_name + ']">').
        append(options)
    );
  };

  var validatePresence = function() {
    var errorCount = 0;
    $('#settings input, #settings select').not('#settings input[type="hidden"]').each(function(){
      var $this = $(this);
      if($this.val() === ''){
        if(!errorDisplayed($this)) {
          displayError($this, translations['errors.blank']);
        }
        errorCount++;
      } else {
        removeError($this);
      }
    });
    return !(errorCount > 0);
  };

  var validateProjectUniqueness = function() {
    var errorCount = 0;
    var projects = [];
    $('select[name="settings[redmine][][target_project]"]').each(function(){
      var $this = $(this);
      var project = $this.val();
      var existProjectIndex = $.inArray(project, projects);
      if(existProjectIndex >= 0) {
        errorCount++;
        if(!errorDisplayed($this)) {
          displayError($this, translations['errors.uniqueness']);
        }
        var existProjectSelect = $($('select[name="settings[redmine][][target_project]"]')[existProjectIndex]);
        if(!errorDisplayed(existProjectSelect)) {
          displayError(existProjectSelect, translations['errors.uniqueness']);
        }
      } else {
        removeError($this);
      }
      projects.push(project);
    });
    return !(errorCount > 0);
  };

  var errorDisplayed = function(element) {
    return element.closest('p').find('.error-notice').length > 0;
  };

  var displayError = function(element, message){
    element.addClass('error-setting');
    element.closest('p').append(
      $('<span class="error-notice">' + message + '</span>')
    );
  };

  var removeError = function(element){
    element.removeClass('error-setting');
    element.closest('p').find('.error-notice').remove();
  };

  $('.add-synchrony-site').click(function(event){
    event.preventDefault();
    var nextRedmine = $('.synchrony-site-settings').length;
    $('#synchrony-sites').append(
      $('<fieldset>', { class: 'box synchrony-site-settings' }).append(
          $('<a href="#" class="icon icon-del contextual delete-synchrony-site">' + translations['button_delete'] + '</a>')
        ).append(
          inputField('source_site', nextRedmine)
        ).append(
          inputField('api_key', nextRedmine)
        ).append(
          inputField('source_tracker', nextRedmine)
        ).append(
          selectField('target_project', projects, nextRedmine)
        ).append(
          selectField('target_tracker', trackers, nextRedmine)
        )
    );
  });

  $('.delete-synchrony-site').live('click', function(event){
    event.preventDefault();
    $(this).closest('.synchrony-site-settings').remove();
  });

  $('#settings form').submit(function(event){
    if(validatePresence() && validateProjectUniqueness()) {
      $(this).off('submit');
      $(this).trigger('submit');
    } else {
      event.preventDefault();
    }
  });

});