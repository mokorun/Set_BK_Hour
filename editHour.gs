function doSetEstimatedHours(EstBody){
    try {
      /*conf読み込み*/
      var confData = getConf();
      var Burl = BLurl();
  
      //sheet指定
      var spreadsheet = SpreadsheetApp.openById(confData.key).getSheetByName('log');
  
      //チャットワークメッセージ部
      var retBody = "";
  
      //プロジェクトがAAA-なのかBBB-なのか
      var is_aaa = true;
  
      var title_start = EstBody.indexOf("AAA1-", 1);
      if(title_start == -1){
          title_start = EstBody.indexOf("AAA2-", 1);
          is_aaa = false;
        }

      if(title_start == -1){
        var retBody = "AAA案件しかやらないよ＠＠";
        sendMessage(retBody);
        return "エラー";
      }
      
      var keyword_est = EstBody.indexOf("[予定時間入力]", 1);

      var estimatedHours_new = EstBody.slice(keyword_est,title_start).replace('[予定時間入力]:', '').trim();
      spreadsheet.getRange(8,3).setValue(estimatedHours_new); //予定時間(変更後)
      var title = EstBody.slice(title_start);

      //backlogのIDの取得
      var backlog_id = "";
      if(is_aaa){
        backlog_id = title.match(/AAA1-(\d+)/)[0];
      }else{
        backlog_id = title.match(/AAA2-(\d+)/)[0];
      }
  
      //backlogから課題データ取得
      var backlog_issues = getBacklogIssue(backlog_id);
      
      //backlogの課題予定時間
      var backlog_estimatedHours_old = backlog_issues["estimatedHours"];
      
      //工数内容一時記録（スプレッドシートに）
      spreadsheet.getRange(8,1).setValue(title); //案件タイトル
      spreadsheet.getRange(8,2).setValue(backlog_estimatedHours_old); //予定時間(変更前)
      
      //変更前後の比較
      if (backlog_estimatedHours_old == estimatedHours_new) {
        var retBody = "すでに[" + estimatedHours_new + "]は設定済みです";
        sendMessage(retBody);
       return false
      }
      
      //変更通知
      var flag = 1; 
      if(editBacklogHours(backlog_id,estimatedHours_new,flag)){
        retBody = "予定時間を変更したぞ！\n" + title;
        retBody += "\n予定時間：" + backlog_estimatedHours_old + "->" + estimatedHours_new;
        retBody += "\nbacklog：" + Burl.backlog_url + "view/" + backlog_id;
      }
      
      //チャットワークに送信
      sendMessage(retBody);
      
      return ContentService.createTextOutput("Hello World");
    } catch(ex) {
      //失敗したらlogに投げる
      var err_msg = "予定時間更新処理は失敗した。";
      toErr(err_msg);
      return false;
    }
  }
  
  
  function doSetActualHours(ActBody){
    try {
      /*conf読み込み*/
      var confData = getConf();
      var Burl = BLurl();
  
      //sheet指定
      var spreadsheet = SpreadsheetApp.openById(confData.key).getSheetByName('log');
  
      //チャットワークメッセージ部
      var retBody = "";
  
      //プロジェクトがAAA1なのかAAA2なのか
      var is_aaa = true;
  
      var title_start = ActBody.indexOf("AAA1-", 1);
      if(title_start == -1){
          title_start = ActBody.indexOf("AAA2-", 1);
          is_aaa = false;
      }
      
      if(title_start == -1){
        var retBody = "AAA案件しかやらないよ＠＠";
        sendMessage(retBody);
        return "エラー";
      }
      
      var keyword_act = ActBody.indexOf("[実績時間入力]", 1);
  
      var actualHours_new = ActBody.slice(keyword_act,title_start).replace('[実績時間入力]:', '').trim();
      spreadsheet.getRange(8,5).setValue(actualHours_new); //実績時間(変更後)
      var title = ActBody.slice(title_start);
    
      //backlogのIDの取得
      var backlog_id = "";
      if(is_aaa){
        backlog_id = title.match(/AAA1-(\d+)/)[0];
      }else{
        backlog_id = title.match(/AAA2-(\d+)/)[0];
      }
  
      //backlogから課題データ取得
      var backlog_issues = getBacklogIssue(backlog_id);
      
      //backlogの課題実績時間
      var backlog_actualHours_old = backlog_issues["actualHours"];
      
      //工数内容一時記録（スプレッドシートに）
      spreadsheet.getRange(3,1).setValue(title); //案件タイトル
      spreadsheet.getRange(3,4).setValue(backlog_actualHours_old); //実績時間(変更前)
      
      //変更前後の比較
      if (backlog_actualHours_old == actualHours_new) {
        var retBody = "すでに[" + actualHours_new + "]は設定済みです";
        sendMessage(retBody);
       return false
      }
      
      //変更通知
      var flag = 2;
      if(editBacklogHours(backlog_id,actualHours_new,flag)){
        retBody = "実績時間を変更したぞ！\n" + title;
        retBody += "\n実績時間：" + backlog_actualHours_old + "->" + actualHours_new;
        retBody += "\nbacklog：" + Burl.backlog_url + "view/" + backlog_id;
      } 
      
      //チャットワークに送信
      sendMessage(retBody);
      
      return ContentService.createTextOutput("Hello World");
      
    } catch(ex) {
      //失敗したらlogに投げる
      var err_msg = "実績時間更新処理は失敗した。";
      toErr(err_msg);
      return false;
    }
  }
  
  //backlogの課題本文更新
  function editBacklogHours(id,Hours_new,flag){
    /*conf読み込み*/
    var confData = getConf();
    var Burl = BLurl();
    
    try{
      var url = Burl.updataIssues_url + id + confData.backlog_key;
      if (flag == 1){
        var params = {
          method : "patch",
          payload : {
            "estimatedHours" : Hours_new
          }
        };
      }
      if (flag == 2){
        var params = {
          method : "patch",
          payload : {
            "actualHours" : Hours_new
          }
        };
      }
      
      var res = UrlFetchApp.fetch(url, params);
      
    } catch(ex) {
      //失敗したらlogに投げる
      var err_msg = "backlog更新は失敗した。";
      toErr(err_msg);
      return false;
    }
    return true;
  }