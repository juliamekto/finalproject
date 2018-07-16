$(document).ready(function() {
//сделать кнопку "добавить" неактивной, если поле пустое
    $('#add').attr('disabled',true);
    $('#enterTask').keyup(function(){
        if($('#enterTask').val().length !=0){
            $('#add').attr('disabled', false);
        }
        else
        {
            $('#add').attr('disabled', true);        
        }
    })
//добавление задачи в список
    $('#add').click(function() {
        var toAdd = $('#enterTask').val();
        $("#enterTask").val('');//очистить инпут       
//отправка задачи на сервер на сервер 
             $.ajax({
                url: 'http://localhost:9999/api/tasks',
                method: 'POST',
                data: {
                   title: toAdd
                },
                success: function(response) {
				createTask(response.task);
                },
                error: function(error) {
                   alert('error'); 
                }
            });
		});

function createTask(task) {
	if (!task) {
		return;
	}
var taskElement = $('<li class="item">'+ '<span class="info">'+ task.title + '</span>' + ' <input type="submit" class="edit" value="Edit">' +
'<input type="submit" class="done" value="Done">'+'<input type="submit" class="remove" value="Delete">'+'</li>');
taskElement.data("task_info", task);
$('#toDoList').append(taskElement);
}
function deleteTask(taskId) {
	console.log(taskId);
}
//получение списка задач
 $(function(){
    $.ajax({
          url: 'http://localhost:9999/api/tasks',
          method: 'GET',
          success: function(response) {
            if (!response.tasks) {
				return;
			}
			for (var task of response.tasks) {
				createTask(task);
			}
          },
          error: function(error) {
            console.log(error);
          }
        })
});
 // удаление задачи по клику на кнопку "удалить" и запрос для удаления с сервера 
 $('#toDoList').on('click', '.remove', function(){
		 var taskElement = $(this).parent('.item');
		 var taskInfo = taskElement.data("task_info");
		 
         $.ajax({
                 url: 'http://localhost:9999/api/tasks/' + taskInfo.id,
                 method: 'DELETE',
                 success: function() {
					taskElement.remove();
                 },
                 error: function(error) {
                     console.log(error);
                 }
                });
     });
//при клике на "сделано" удалить лишние кнопку и зачеркнуть задачу, отправить запрос на сервер 
     $('#toDoList').on("click", '.done', function() {
     	      if ($(this).closest(".item").css('background') === '') {
                $(this).closest(".item").css('background', 'none');
            } else {
                $(this).closest(".item").css('background', '#6EE535');
                $(this).closest(".item").find('.edit').remove();
                $(this).attr('disabled',true);
            }
            $.ajax({
                url: 'http://localhost:9999/api/tasks/{dataID}',
                method: 'PUT',
                data: {
                    status: 'Done'
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
//кпонка "выполнено" неактивна, кнопку "редактировать" меняется на "сохранить"
            $('#toDoList').on('click','.edit',function(){
            var e = $(this);
            if(e.hasClass('.edit')){
                e.toggleClass('.edit');
                e.closest(".item").find('span').attr("contenteditable", false).focus();
            	e.attr('value','Edit').css('background','lightblue');
            	e.closest('li').find('.done').attr('disabled',false);
            } else {
                e.toggleClass('.edit');
                e.closest(".item").find('span').attr("contenteditable", true).focus();
            	e.attr('value','Save').css('background','orange');
            	$(this).closest('li').find('.done').attr('disabled',true);
                 }
//редактирование задачи
                 $.ajax({
        url: 'http://localhost:9999/api/tasks/{dataID}',
        method: 'PUT',
        data: {
            title: $('.info').val(),
            status: 'Done' 
        },
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });

  });
  // подсчет кол-ва задач в списке	
    $('#add').click(function(){
     var task = $('.item').length;
	$('#counter').html('Tasks:'+ (task+1) );
    });  
    $('#toDoList').click('.remove',function(){
     var i = $('.item').length;
     $('#counter').html('Tasks:'+ (i-1));
     });  

});
