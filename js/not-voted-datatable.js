// Call the dataTables jQuery plugin
$(document).ready(function() {
  const params = new URLSearchParams(window.location.search);
  const course = params.get("course");
  const table = $('#usersTable').DataTable({
    order: [[0, 'asc']],
  });

  if (!course) {
    window.location.href = 'index.html';
  }

  db.ref('users').orderByChild('course').equalTo(course).on('value', function(snapshot) {
    const users = snapshot.val();

    table.clear();

    for (let id in users) {
      const user = users[id];
      table.row.add([
        user.name,
      ]);
    }

    table.draw();
  });
});
