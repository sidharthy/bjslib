/*
 * SkinLoader class under util package of Bracket Javascript Library.
 * This class provides implicit support to declare methods/fields as public or private.The public methods/fields are to be exported 
 * through the return statement at the end of the file.
 * 
 * @author Sidharth Yadav
 * Email: sidharth_08@yahoo.com, sidharth@bracket.co.in
 * Copyright protected file. All rights reserved.
 * 
 * You may use this script in your application/web pages provided you don't modify any part of this file, including the comments. If you wish to use a modified version 
 * of this script then you must first get the approval from the author. Also you use this script purely at your own risk and the author doesn't take any 
 * responsibility whatsoever if you face any issue(s) as a result of using this script.
 */
NS_BKTJSLIB1dot0_Util.SkinLoader = NS_BKTJSLIB1dot0_Util.SkinLoader || (function() {

     //short hand names for external classes/methods used inside this class.
     var StoreValue = NS_BKTJSLIB1dot0_IO.LocalStorage.StoreValue;
     var GetValue = NS_BKTJSLIB1dot0_IO.LocalStorage.GetValue;

     var HTML_LINK_ELEM_ID = "bskincss";
     var _PAGE_ID = window.B_PAGE_ID? window.B_PAGE_ID: null;  //if this is defined then an attempt would be made to load the page specific css.
     var _SKINCSS_FOLDER = window.B_SKINCSS_FOLDER? window.B_SKINCSS_FOLDER: "./css/skin/";  //if this is defined then an attempt would be made to load the skin css from this folder else default path will be used.
     if (_SKINCSS_FOLDER.length > 0)
          _SKINCSS_FOLDER = _SKINCSS_FOLDER.charAt(_SKINCSS_FOLDER.length - 1) == '/'? _SKINCSS_FOLDER: (_SKINCSS_FOLDER + "/");

     var DEFAULT_CSS = "defaultSkin.css";
     var BRACKET_SKINCSS_FILE_key = "_bracket_dyncss_file";

     var _cssfile = GetValue(BRACKET_SKINCSS_FILE_key);
     if (_cssfile == null)
          _cssfile = DEFAULT_CSS;
     var filen = _SKINCSS_FOLDER + (_PAGE_ID? _PAGE_ID + "/": "") + _cssfile;

     if (document.getElementById(HTML_LINK_ELEM_ID))
          document.getElementById(HTML_LINK_ELEM_ID).href=filen;

     function LoadSkin(_cssfile, reloadPageIfNecessary)
     {
          StoreValue(BRACKET_SKINCSS_FILE_key, _cssfile);
          if (reloadPageIfNecessary === true)
               location.reload(false);  //reloading from cache might suffice. The new css would be fetched from server if required.
     };

     function WhichSkin()
     {
          return _cssfile;
     };

     //debug method
     function WhichSkinDbg()
     {
          if (document.getElementById(HTML_LINK_ELEM_ID))
               alert(document.getElementById(HTML_LINK_ELEM_ID).href);
          else
               alert("No LINK element found with id '" + HTML_LINK_ELEM_ID + "'. No css skin loaded");
     };

     return {
          //export any public methods and variables
          LoadSkin : LoadSkin,  //this may trigger a page reload
          WhichSkin : WhichSkin,
          WhichSkinDbg : WhichSkinDbg  //debug method
     };

}());