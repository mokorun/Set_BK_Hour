function toErr(err_msg) {
    /*conf読み込み*/
    var confData = getConf();
  
    //sheet指定
    var spreadsheet = SpreadsheetApp.openById(confData.key).getSheetByName('log');
    
    spreadsheet.getRange(1, 1).setValue(err_msg);
    
    sendMessage(err_msg);
    
  }