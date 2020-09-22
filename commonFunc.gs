/* 共通処理 */

//backlog課題取得
function getBacklogIssue(id){
  
    //設定読み込み
    var confData = getConf();
    var Burl = BLurl();
    var url = Burl.getIssues_url + id + confData.backlog_key;
    var response = UrlFetchApp.fetch(url);
    var data = response.getContentText("UTF-8");
    
    SpreadsheetApp.openById(confData.key).getSheetByName('log').getRange(2, 1).setValue(data);
    return JSON.parse(data);
  }
  
  /* チャットワークにメッセージを送る */
  function sendMessage(body){
    
    //設定読み込み
    var confData = getConf();
    
    //chatworkのトークン
    var token = confData.token;
    
    //返事するルームID
    var room_id = confData.room_id;
    
    var params = {
      headers : {"X-ChatWorkToken" : token},
      method : "post",
      payload : {
        body : body
      }
    };
  
    var url = "https://api.chatwork.com/v2/rooms/" + room_id + "/messages";
    UrlFetchApp.fetch(url, params);
  }