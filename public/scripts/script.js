//Client side JS

$(function() {
console.log("pageloaded")
var statusController = {

//template on view where status ends up
  template: _.template($('#status-template').html()),

// pass objects through the template and append to view
  render: function(statusData) {
    var $statusHtml = $(statusController.template(statusData));
    $('#status-list').append($statusHtml);
  },


//setup view on home page
  all: function (image, game, status) {
    $.ajax ({
      type: 'GET',
      url: '/api/status',
      data: {
        image: image,
        game: game, 
        status: status
      },
      success: function (data) {
        var allStatus = data;
        console.log(allStatus);
        _.each(allStatus, function(status) {
          // pass each phrase object through template and append to view
          statusController.render(status);
          console.log(status);
        });
        statusController.addEventHandlers();
      }
    })
  },


//add new posts to front page
  save: function (newImage, newGame, newStatus) {
    var statusData = {image: newImage, game: newGame, status: newStatus};

    $.ajax ({
      type: 'POST',
      url: '/api/status',
      datatype: 'JSON',
      success: function(data) {
        var newStatus = data;
        statusController.render(newStatus);
      }
    })
  },

// edit status post on view page
  update: function(statusId, updateImage, updateGame, updateStatus) {
    $.ajax({
      type: 'PUT',
      url: '/api/status',
      data: {
        image: updateImage,
        game: updateGame,
        status: updateStatus
      },
      success: function(data){
        var updatedStatus = data;

        // replace existing status with updated status
        var $statusHtml = $(statusController.template(updatedStatus));
        $('#status-' + statusId).replaceWith($statusHtml);
      }
    })
  },

//delete status from page
  delete: function (statusId) {
    $.ajax({
      type: 'DELETE',
      url: '/api/status/' + statusId,
      success: function (data) {

        //remove deleted status from view
        $('#status-' + statusId).remove();
      }
    })
  },

//event handlers for page
  addEventHandlers: function () {
    console.log('event handlers loaded');
    $('status-list')
    // for update: submit event on '.update-status' form
    .on('submit', '.update-status', function(event){
      event.preventDefault();
      console.log("on click submit, new post modal");
      // find the status' id (stored in HTML as 'data-id')
      var statusId = $(this).closest('.status').attr('data-id');

      //update the status with form data
      var updatedImage = $(this).find('.updated-image').val();
      var updatedGame = $(this).find('.updated-game').val();
      var updatedStatus = $(this).find('.updated-status').val();
      statusController.update(statusId, updatedImage, updatedGame, updatedStatus);
    }); 
    console.log("after submit button");
  },

  setupView: function() {
    //sppend existing status to view
    statusController.all();
      event.preventDefault();

    //add event-handler to new-status modal
    $('#status-modal-form').on('submit', function(event) {
      // event.preventDefault();

      //create new status with form data
      var newStatus = $('#new-status').val(); 
      var newGame = $('#new-game').val(); 
      var newImage = $('#new-image').val(); 
      statusController.create(newImage, newGame, newStatus);

      // reset the form
      $(this)[0].reset();
      $('new-game').focus();
    })
  }
} // end phrase statusController 

statusController.setupView();

});

