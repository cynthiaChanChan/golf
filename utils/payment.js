
function makeAPayment (payData) {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
           'timeStamp': payData.timeStamp,
           'nonceStr': payData.nonceStr,
           'package': payData.package,
           'signType': 'MD5',
           'paySign': payData.paySign,
           'success':function(res){
               resolve(res);
           },
           'fail':function(res){
               reject(res);
           }
       })
    })
}

module.exports = {
    makeAPayment
}
