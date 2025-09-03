// Call the dataTables jQuery plugin
$(document).ready(function() {
  const table = $('#votesTable').DataTable({
    order: [[0, 'asc']],
  });
  var users;
  var candidates;
  var votes;


  db.ref('users').once('value').then(function(snapshot) {
    users = snapshot.val();

    db.ref('votes').once('value').then(function(snapshot) {
      votes = snapshot.val();

      db.ref('candidates').once('value').then(function(snapshot) {
        candidates = snapshot.val();

        $.each(users, function(key, values) {
          console.log('Key: ', key)
          console.log('Values: ', values)
          if (votes[key]) {
            table.row.add([
              values.name,
              candidates[votes[key].p].name,
              candidates[votes[key].ivp].name,
              candidates[votes[key].evp].name,
              candidates[votes[key].s].name,
              candidates[votes[key].t].name,
              candidates[votes[key].a].name,
              candidates[votes[key].pio1]?.name || '',
              candidates[votes[key].pio2]?.name || '',
              candidates[votes[key].pio3]?.name || '',
            ]);
          }
        });

        table.draw();
      });
    });
  });
});
