/* 共通設定 */
function getConf(){
  
    //書き込み先スプレッドシートのID
    var key = "***********************************";
    
    //chatworkのトークン
    var token = "***********************************"; //bot id
    
    //返事するルームID
    var room_id = "*********"; //room
    
    //バックログAPI Key
    var backlog_key = "?apiKey=***********************************"; 
    
    return {
      key : key,
      token : token,
      room_id : room_id,
      backlog_key : backlog_key
    }  
  }
  
  //URL類
  function BLurl(){
    //BacklogのURL
    var backlog_url = "https://****.backlog.com/";
    //課題取得エンドポイント
    var getIssues_url = backlog_url + "api/v2/issues/";
    //課題更新エンドポイント
    var updataIssues_url = backlog_url + "api/v2/issues/";
    
    return {
      backlog_url : backlog_url,
      getIssues_url : getIssues_url,
      updataIssues_url : updataIssues_url,
    } 
  }