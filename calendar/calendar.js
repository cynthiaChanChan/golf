
function restrictDate(year, month, dirs) {
    const thisYear = new Date().getFullYear();
    if (year === thisYear && month === 1) {
      dirs.isLeftHidden = true;
    }
    if (year === thisYear && month === 12) {
      dirs.isRightHidden = true;
    }
    return dirs;
}

function getMoreSpots(totalSpots, allDays) {
    if (totalSpots > 28 && totalSpots <= 35) {
        var moreContainerNum = 35 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    } else if (totalSpots > 35) {
        var moreContainerNum = 42 - totalSpots;
        for (var ii = 0; ii < moreContainerNum; ii += 1) {
          allDays.push({});
        }
    }
    return allDays;
}

function Markthem(allDays, allDataArray) {
    let matchData = "";
    //标记上有赛事的天
    for (let i of allDataArray){
        for (let ii of allDays) {
            if (i.day == ii.id) {
                ii.marked = "marked";
                ii.data = i.data;
                ii.chosen = i.chosen;
            }
            if (ii.chosen) {
                matchData = ii.data;
            }
        }
    }
    return matchData;
}

function chooseTheLatest (theYear, theMonth, allDataArray) {
    //默认显示每月第一天比赛（chosen），但如果是当月则显示今天或之后的最近比赛
    const daysArray = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let chosenDay = "";
    for (let one of allDataArray) {
        daysArray.push(one.day);
    }
    daysArray.sort((a, b) => {
        return a -b;
    });
    if (theYear == year && theMonth == month) {
        chosenDay = daysArray.find(function(elem) {
            return elem >= day;
        })

    } else {
        chosenDay = daysArray[0];
    }
    console.log("chosenDay: ", chosenDay);
    for (let item of allDataArray) {
        if (item.day == chosenDay) {
            item.chosen = "chosen";
        }
    }
    return allDataArray;
}

module.exports = {
    restrictDate,
    getMoreSpots,
    Markthem,
    chooseTheLatest
}
