// Call the dataTables jQuery plugin
$(document).ready(function() {
  function populateDatatable(query, course) {
    // $('#openLink').attr('href', `not-voted-manage-shareable.html?course=${course}`);
    $('#shareableLink').val(`https://geraldjohnt.github.io/uvdc-voting-system/not-voted-manage-shareable.html?course=${course}`);

    query.once('value', function(snapshot) {
      const users = snapshot.val();
  
      table.clear();
      
      
      for (let id in users) {
        const user = users[id];
        
        if (!user.voted) {
          table.row.add([
            user.name
          ]);
        }
        
      }
  
      table.draw();
    });
  }

  const params = new URLSearchParams(window.location.search);
  let course = params.get("course");
  let ref = db.ref('users');
  let query = ref;

  const table = $('#usersTable').DataTable({
    order: [[0, 'asc']],
  });

  if (course && course !== 'All') {
    // window.location.href = 'index.html';
    query = ref.orderByChild('course').equalTo(course);
  }

  $('#dtTitle').html(course);

  db.ref('users').once('value').then(function(snapshot) {
    const users = snapshot.val();
    const coursesSet = new Set();

    for (let id in users) {
      const user = users[id];
      if (user.course) {
        coursesSet.add(user.course);
      }
    }

    // Convert Set to Array (optional)
    const uniqueCourses = Array.from(coursesSet).sort();
    course = 'All';

    $.each(uniqueCourses, function(key, value) {
      $('#courseFilter').append(`
          <option value="${value}">${value}</option>
      `);
    });
    console.log("Unique Courses:", uniqueCourses);
    
    // $('#openLink').attr('href', `not-voted-manage-shareable.html`)
  
    populateDatatable(query, course);
  });

  $("#courseFilter").on("change", function () {
    let selectedCourse = $(this).val();

    query = db.ref('users');
    if (selectedCourse != 'All') {
      query = query.orderByChild('course').equalTo(selectedCourse);
    }

    
    $('#shareableLink').val(`https://geraldjohnt.github.io/uvdc-voting-system/not-voted-manage-shareable.html?course=${course}`);
    // $('#openLink').attr('href', `not-voted-manage-shareable.html?course=${course}`);

    populateDatatable(query, selectedCourse);
  });

  $("#copyLink").click(function (e) {
    e.preventDefault();
    let link = $("#shareableLink").val();
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copied!"))
      .catch(() => {
        let input = $("<textarea>").val(link).appendTo("body").select();
        document.execCommand("copy");
        input.remove();
        alert("Link copied (fallback)!");
      });
  });
});
