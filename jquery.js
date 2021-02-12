function setCell(val) {
  let coutLoop = 0
  let countRow = 0
  if (val) {
    countRow = val
  }
  let gameTable = []
  let table = $(`<table class="table-bordered">`)
    .css({ position: "relative", margin: "auto" })
    .addClass("testTable")

  for (let i = 0; i < countRow; i++) {
    let row = $("<tr>")
    for (let j = 0; j < countRow; j++) {
      let cell = $("<td>")
      let image = `<img src="images/black.png" class="inputImg" id="${coutLoop}" data-row="${coutLoop}" width="100" height="100">`
      cell.html(image)
      row.append(cell)

      gameTable.push(coutLoop)

      coutLoop++
    }
    table.append(row)
  }
  $("#getCell").append(table)

  setImage(countRow)
}

function setImage(cellVal) {
  let getCell = parseInt(cellVal)
  const player1 = "o"
  const player2 = "x"
  let gameTable = []

  let curentPlayer = player1
  let sumCell = getCell * getCell
  let draftWin = setAnswerArray(getCell)

  function switchPlayer(btnVal, counterClick) {
    insertDetail($("#getVal").val(), curentPlayer, btnVal.id)

    gameTable[btnVal.id] = curentPlayer
    btnVal.src = `images/${curentPlayer}.png`
    let gameStatus = checkWin(gameTable, curentPlayer, draftWin)

    if (gameStatus) {
      endGame($("#getVal").val(), curentPlayer, getCell)
      alert(`Player ${curentPlayer} เป็นผู้ชนะ,`)
    } else {
      if (counterClick == sumCell - 1) {
        endGame($("#getVal").val(), "ไม่มีผู้ชนะ", getCell)
        alert("ไม่มีผู้ชนะ")
      }
    }
    curentPlayer = curentPlayer == player1 ? player2 : player1

    $(btnVal).unbind("click")
  }

  for (let i = 0; i < sumCell; i++) {
    var counter = 0
    $(`#${i}`).click(function () {
      switchPlayer(this, counter)
      counter++
    })
  }
}

// สร้าง Cell
function createCell() {
  $(".testTable").empty()
  let sizeVal = $("#sizeVal").val()
  if ($.isNumeric(sizeVal)) {
    insertSizeDb(sizeVal)
    setCell(sizeVal)

    db.collection("tables")
      .orderBy("date", "desc")
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          $("#getVal").val(doc.id)
        })
      })
  } else {
    alert("กรุณากรอกเฉพาะตัวเลข")
  }
}

// เพิ่มข้อมูล tableDb
function insertSizeDb(sizeVal) {
  // $("#cardSection #dataQuery").hide()
  let sizeName = `${sizeVal}*${sizeVal}`
  $("#nameGame").html(sizeName)
  const dataObj = {
    size: sizeName,
    date: new Date(),
    winner: "ยังไม่ผลการแข่งขัน",
  }
  return db
    .collection("tables")
    .add(dataObj)
    .then((docRef) => {
      docRef.id
    })
    .catch((error) => {
      console.error("Error adding document: ", error)
    })
}

// เพิ่มข้อมูล detailDb
function insertDetail(getId, getPlayer, getVal) {
  const dataObj = {
    tableId: getId,
    name: getPlayer,
    val: getVal,
  }
  return db
    .collection("details")
    .add(dataObj)
    .then((docRef) => {
      console.log("Insert Success")
    })
    .catch((error) => {
      console.error("Error adding document: ", error)
    })
}

// ดึงข้อมูล tableDb
function getTableDb() {
  // $("#cardSection #dataQuery").hide()
  db.collection("tables")
    .orderBy("date", "desc")
    .get()
    .then((querySnapshot) => {
      $("#cardSection").append("")
      querySnapshot.forEach(function (tableValue) {
        $("#cardSection").append(`
        <div id="dataQuery" class="card mb-3">
          <div class="card-body">
            <h6 class="card-title"> ชื่อรายการ : ${tableValue.data().size}</h6>
            <p class="card-title"> ผู้ชนะ :  ${tableValue.data().winner} </p>
            <p class="card-title"> ผู้ชนะ :  ${new Date(
              tableValue.data().date.seconds * 1000 +
                tableValue.data().date.nanoseconds / 1000000
            )} </p>          
          <button 
          type="button"
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal" 
          
          id="${tableValue.id}" onclick="viewTable(this)">View</button>
          </div>
        </div>
      `)
      })
    })
}

// set ดราฟ Win
function setAnswerArray(cellVal) {
  let countRow = cellVal
  let countCell = cellVal * cellVal
  let getAnswerArray = []
  for (let a = 0; a < countCell; a += countRow) {
    let arryFirst = []
    for (let b = a; b < a + countRow; b++) {
      arryFirst.push(b)
    }
    getAnswerArray.push(arryFirst)
  }

  for (let a = 0; a < countRow; a++) {
    let arrySecond = []
    for (let b = a; b < countCell; b += countRow) {
      arrySecond.push(b)
    }
    getAnswerArray.push(arrySecond)
  }
  let arrayThird = []
  for (let a = 0; a < countCell; a += countRow + 1) {
    arrayThird.push(a)
  }
  let arrayFourth = []
  for (let a = countRow - 1; a < countCell; a += countRow - 1) {
    arrayFourth.push(a)
    if (arrayFourth.length == countRow) {
      break
    }
  }

  getAnswerArray.push(arrayThird, arrayFourth)
  return getAnswerArray
}

// ตรวจสอบผลการชนะ
function checkWin(gameTable, curPlay, answerArray) {
  let tmpArray = []

  for (let i = 0; i < gameTable.length; i++) {
    if (curPlay == gameTable[i]) {
      tmpArray.push(i)
    }
  }

  let winOr = false

  for (const [index, win] of answerArray.entries()) {
    let mycheck = true
    win.forEach((innerWin) => {
      if (tmpArray.indexOf(innerWin) > -1) {
        mycheck = mycheck && true
      } else {
        mycheck = mycheck && false
      }
    })
    if (mycheck) {
      winOr = true
      break
    }
  }
  return winOr
}

//
function endGame(getDocId, getPlayer, getSize) {
  $("#cardSection #dataQuery").hide()
  db.collection("tables")
    .doc(`${getDocId}`)
    .set({
      size: `${getSize}*${getSize}`,
      winner: getPlayer,
      date: new Date(),
    })
    .then(() => {
      console.log("Update Success")
      getTableDb()
    })
    .catch((err) => console.log("Serve Update ExpensesTable Error :", err))
  $(".inputImg").unbind("click")
}

async function viewTable(btn) {
  var callDetail = []
  await db
    .collection("details")
    .where("tableId", "==", btn.id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const obj = {
          name: doc.data().name,
          val: doc.data().val,
        }
        callDetail.push(obj)
      })
    })
    .catch((error) => {
      console.error("Error adding document: ", error)
    })

  var callTable = null
  await db
    .collection("tables")
    .doc(btn.id)
    .get()
    .then(async (doc) => {
      const obj = {
        winner: doc.data().winner,
        size: doc.data().size,
      }
      callTable = obj
    })

    .catch((error) => {
      console.error("Error adding document: ", error)
    })

  $(".showCellSuccess").empty()
  showCellComplete(callTable, callDetail)

  callDetail.forEach((x) => {
    $(`.${x.val}`)
      .delay(500)
      .queue(function () {
        $(this).attr("src", `images/${x.name}.png`)
        console.log("callDetail", x.name)
      })
  })
}

function showCellComplete(callTable, callDetail) {
  let setSizeVal = parseInt(callTable.size.slice(0, 1))
  $("#exampleModalLabel").text(
    `ผู้ชนะเกมนี้ คือ : ${callTable.winner} ขนาดของตราราง : ${callTable.size}`
  )
  let table = $(`<table class="table-bordered">`)
    .css({ position: "relative", margin: "auto" })
    .addClass("testTable")
  let coutLoop = 0
  for (let i = 0; i < setSizeVal; i++) {
    let row = $("<tr>")
    for (let j = 0; j < setSizeVal; j++) {
      let cell = $(`<td >`)
      let image = `<img src="images/black.png" class="${coutLoop}" id="${coutLoop}" data-row="${coutLoop}" width="100" height="100">`

      cell.html(image)
      row.append(cell)

      coutLoop++
    }
    table.append(row)
  }

  $(".showCellSuccess").append(table)
}
