// Call the dataTables jQuery plugin
$(document).ready(function() {
  const table = $('#adminTable').DataTable({
    // autoWidth: false, // IMPORTANT: Let columnDefs control widths
    columnDefs: [
      {
        targets: 0,
        width: '10%',
        className: 'no-wrap'
      },
      {
        targets: 3,
        width: '1%',
        className: 'no-wrap'
      },
    ],
    order: [[1, 'asc']],
    drawCallback: function() {
      $('#adminTable tbody tr').each(function() {
        var cell = $(this).find('td:eq(3)'); // Change index to the correct column
        var value = cell.text().trim();
        
        if (value === 'Yes') {
          cell.css('color', 'green');
        } else if (value === 'No') {
          cell.css('color', 'red');
        }
      });
    }
  });

  db.ref('users').orderByChild('admin').equalTo(true).on('value', function(snapshot) {
    const users = snapshot.val();

    table.clear();

    for (let id in users) {
      const user = users[id];
      table.row.add([
        id,
        user.name,
        user.course,
        user.voted ? "Yes" : "No",
      ]);
    }

    table.draw();
  });

  addAdmin = function() {
    const idNumber = $('#idNumber');
    const idNumberError = $('#idNumberError');
    idNumber.removeClass('is-invalid');
    idNumberError.addClass('d-none');

    if (idNumber.val() == '') {
      idNumber.addClass('is-invalid');
      idNumberError.html('ID Number is required!');
      idNumberError.removeClass('d-none');
      return;
    }

    db.ref('users/'+idNumber.val()).get().then(snapshot => {
      if (snapshot.exists()) {
        const userToBeAdded = snapshot.val();
        db.ref('users/'+idNumber.val()).update({"admin": true}).then(() => {
          $('#addAdminModal').modal('hide');
          alert(`User ${userToBeAdded.name} has been added as admin!`);
        })
        .catch((error) => {
          console.log("Error: ", error);
        })
      } else {
        idNumber.addClass('is-invalid');
        idNumberError.html('ID Number does not exist!');
        idNumberError.removeClass('d-none');
        return;
      }
    });
  }
});
