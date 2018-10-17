const remote = require('electron').remote
// Module to control application life.
const app = remote.app
const path = require('path')
var sqlite3 = require('sqlite3').verbose();

let dbfile = path.join(app.getAppPath(), '../mydb.db');
console.log(dbfile);
var db = new sqlite3.Database(dbfile);

//db.run("CREATE TABLE IF NOT EXISTS `persons` ( `id`	INTEGER PRIMARY KEY AUTOINCREMENT,`fname`	TEXT,`lname`	TEXT,`job`	TEXT)");
/*function getDate() {
  
  db.each("select * from boxes", function (err, row) {
    console.log(row);
  });
  
}*/


function getAllNames(callback) {
  db.serialize(function () {
    db.all("select * from names where n_state=1 order BY id desc", function (err, row) {
      console.log(row)
      callback(err, row)
    });
  });
}

function insertName(data) {

  db.run("INSERT INTO names(name,age,achievement,phon)" +
    "VALUES(?,?,?,?)", data, function (err) {
      if (err) {
        console.log(err)
      }
    });

}

function deleteName(id) {
  db.run("DELETE FROM names WHERE id=?", id, function (err) {
    if (err) {
      console.log(err)
    }
  });
}
function editName(data, id) {
  db.run("UPDATE names SET name=?,age=?,achievement=?,phon=? WHERE id=" + id, data, function (err) {
    if (err) {
      console.log(err)
    }
  });
}

function getGroups(callback) {
  db.serialize(function () {
    db.all("select * from groups order BY id desc", function (err, row) {
      callback(err, row)
    });
  });
}
function getGroup(groupId, callback) {
  db.serialize(function () {
    db.all("select * from names inner join name_group on name_group.name_id=names.id where group_id=? order BY id", groupId, function (err, row) {
      callback(err, row)
    });
  });
}

function insertGroup(data) {
  db.all("SELECT * FROM groups", function (err, row) {

    if (row.length > 0) {
      db.run("INSERT INTO groups(num,date)" +
        "VALUES((SELECT max(num) FROM groups)+1,?)", data, function (err) {
          if (err) {
            console.log(err)
          }
        });
    } else {
      db.run("INSERT INTO groups(num,date)" +
        "VALUES(1,?)", data, function (err) {
          if (err) {
            console.log(err)
          }
        });
    }
  })

}

function deleteGroup(id) {
  db.run("DELETE FROM groups WHERE id=?", id, function (err) {
    if (err) {
      console.log(err)
    }
  });
  db.run("DELETE FROM name_group WHERE group_id=?", id, function (err) {
    if (err) {
      console.log(err)
    }
  });
}

function removeNameFromGroup(nameId, groupId) {
  db.run("DELETE FROM name_group WHERE name_id=? AND group_id=?", [nameId, groupId], function (err) {
    if (err) {
      console.log(err)
    }
  });
}

function getNamesModal(groupId, namesId, num, callback) {
  if (num > 1) {
    var group = '';

    db.all("SELECT * from groups WHERE num =" + (num - 1), function (err, row) {
  
      if(row.length>0){
        group = row[0]['id'];
        db.all("SELECT * from name_group WHERE group_id =" + group, function (err2, row2) {
          // var newNamesId = namesId.concat(row2['']);
          var newNamesId = [];
          row2.forEach(e => {
            newNamesId.push(e['name_id'])
          });
          var resultNamesId = newNamesId.concat(namesId);
          db.all("SELECT * from names WHERE id NOT IN (" + resultNamesId + ") ORDER BY names.id", function (err3, row3) {
            callback(err3, row3)
          });
        })
      }else{
        db.all("SELECT * from names WHERE id NOT IN (" + namesId + ") ORDER BY names.id", function (err4, row4) {
          callback(err4, row4)
        });
      }

    })
    console.log(group)
    //db.serialize(function () {
    //"SELECT * from names INNER JOIN  name_group on names.id=name_group.name_id INNER JOIN groups ON groups.id=name_group.group_id WHERE name_group.group_id !=" + groupId + " AND names.id NOT IN ("+namesId+") ORDER BY names.id"

    // });
  }else{
    db.all("SELECT * from names WHERE id NOT IN (" + namesId + ") ORDER BY names.id", function (err4, row4) {
      callback(err4, row4)
    });
  }

}

function insertNamesToGroup(groupId, nameId) {
  db.run("INSERT INTO name_group(group_id,name_id)" +
    "VALUES(?,?)", [groupId, nameId], function (err) {
      if (err) {
        console.log(err)
      }
    });
}


