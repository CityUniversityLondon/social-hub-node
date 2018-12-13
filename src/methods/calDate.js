exports.daysAgo = function(apiDate) {
    let curDate = new Date();
    let oneDay = 24 * 60 * 60 * 1000;
    let date = new Date(apiDate);
    let diffDays = Math.round(Math.abs((date.getTime() - curDate.getTime()) / (oneDay)));

    return diffDays
}

exports.formatDate = function(apiDate) {
    let date = new Date(apiDate);
    let year = date.getFullYear();
    let month = date.getMonth();
    month = month + 1;
    let day = date.getDate();
    let formatDate = year.toString() + (month < 10 ? '0' + month.toString() : month.toString()) + (day < 10 ? '0' + day.toString() : day.toString());

    return formatDate
}