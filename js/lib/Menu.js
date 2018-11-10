/*
 * Menu class under ui package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_UI.Menu = NS_BKTJSLIB1dot0_UI.Menu || (function() {

     //shorthand names of the external classes used inside this class.
     var KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap.instance;
     var GetElementBounds = NS_BKTJSLIB1dot0_Util.DomUtilities.GetElementBounds;

     var MENU_OPEN_LEFT = 1010;
     var MENU_OPEN_RIGHT = 200;
     var MENU_OPEN_UPWARDS = 300;
     var MENU_OPEN_DOWNWARDS = 500;

     function Bounds(x, y, width, height)
     {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
     }

     function ChildrenDivStub()
     {
          this.stubDiv = document.createElement("div");
          this.topDecoratorDivHolder = document.createElement("div");
          this.leftDecoratorDivHolder = document.createElement("div");
          this.bottomDecoratorDivHolder = document.createElement("div");
          this.rightDecoratorDivHolder = document.createElement("div");
          this.mainChildrenDiv = document.createElement("div");

//          var middleWrapperDiv = document.createElement("div");
          //middleWrapperDiv.style.display = "block";
          //middleWrapperDiv.style.float = "left";
          //middleWrapperDiv.style.height = "100%";
          this.leftDecoratorDivHolder.style.display = "inline";
          this.leftDecoratorDivHolder.style.cssFloat = "left";
          this.leftDecoratorDivHolder.style.overflow="hidden";
this.leftDecoratorDivHolder.style.margin = "0px";
this.leftDecoratorDivHolder.style.padding = "0px";
this.leftDecoratorDivHolder.style.border = "none";
          this.mainChildrenDiv.style.display = "block";
          //this.mainChildrenDiv.style.overflow="hidden";
          //this.mainChildrenDiv.style.float = "left";
          this.rightDecoratorDivHolder.style.display = "inline";
          this.rightDecoratorDivHolder.style.cssFloat = "right";
          this.rightDecoratorDivHolder.style.overflow="hidden";
//          middleWrapperDiv.appendChild(this.leftDecoratorDivHolder);
//          middleWrapperDiv.appendChild(this.rightDecoratorDivHolder);
//          middleWrapperDiv.appendChild(this.mainChildrenDiv);

          /*this.stubDiv.appendChild(this.topDecoratorDivHolder);
          this.stubDiv.appendChild(middleWrapperDiv);
          this.stubDiv.appendChild(this.bottomDecoratorDivHolder);*/

          this.stubDiv.appendChild(this.topDecoratorDivHolder);
          this.stubDiv.appendChild(this.leftDecoratorDivHolder);
          this.stubDiv.appendChild(this.rightDecoratorDivHolder);
          this.stubDiv.appendChild(this.mainChildrenDiv);
          this.stubDiv.appendChild(this.bottomDecoratorDivHolder);

          this.getTopHolder = function()
          {
               return this.topDecoratorDivHolder;
          };

          this.getLeftHolder = function()
          {
               return this.leftDecoratorDivHolder;
          };

          this.getBottomHolder = function()
          {
               return this.bottomDecoratorDivHolder;
          };

          this.getRightHolder = function()
          {
               return this.rightDecoratorDivHolder;
          };

          this.getMainContainer = function()
          {
               return this.mainChildrenDiv;
          };

          this.getDiv = function()
          {
               return this.stubDiv;
          };
     };

     function ChildrenContainer()
     {
          this.children = new Array();
          this.childrenDivStub = null;

          //decorator div(s)
          this.topDecoratorDiv = null;
          this.leftDecoratorDiv = null;
          this.bottomDecoratorDiv = null;
          this.rightDecoratorDiv = null;

          this.bounds = new Bounds(0, 0, 0, 0);

          //treat as a private method
          this.setChildMenuBounds = function(index)
                                   {
                                        var menu = this.getMenu(index);
                                        if (menu != null)
                                        {
                                             var x = this.getXOffsetForMenu(index);
                                             var y = this.getYOffsetForMenu(index);
                                             var width = menu.getMaterializedDiv().offsetWidth;
                                             var height = menu.getMaterializedDiv().offsetHeight;
                                             menu.setBounds(x, y, width, height);
                                        }
                                   };

          //treat as a private method
          this.getXOffsetForMenu = function(index)
                                  {
                                       //return this.bounds.x;
                                       return this.bounds.x + (this.childrenDivStub? this.childrenDivStub.getLeftHolder().offsetWidth: 0);
                                  };

          //treat as a private method
          this.getYOffsetForMenu = function(index)
                                  {
                                       //var y = this.bounds.y;
                                       var y = this.bounds.y + (this.childrenDivStub? this.childrenDivStub.getTopHolder().offsetHeight: 0);
                                       for (var i = 0; i < index; i++)
                                       {
                                            y += this.children[i].getMaterializedDiv().offsetHeight;
                                       }
                                       return y;
                                  };

          //container bounds
          this.setBounds = function(x, y, width, height)
                           {
                                this.bounds.x = x;
                                this.bounds.y = y;
                                this.bounds.width = width;
                                this.bounds.height = height;

                                for (var i = 0; i < this.children.length; i++)
                                {
                                     this.setChildMenuBounds(i);
                                }
                           };

          //container bounds
          this.getBounds = function()
                           {
                                return this.bounds;
                           };

          this.setChildrenDivStub = function(childrenDivStub)
                                    {
                                         this.childrenDivStub = childrenDivStub;
                                    };

          this.getChildrenDivStub = function()
                                    {
                                         return this.childrenDivStub;
                                    };

          this.addMenu = function(menu, parentMenu)
                         {
                              //if instanceof Menu
                              menu.parent = parentMenu;
                              this.children.push(menu);
                         };

          this.getMenu = function(index)
                         {
                              if (index >=0 && index < this.children.length)
                              {
                                   return this.children[index];
                              }
                              return null;
                         };

          this.removeMenu = function(index)
                            {
                                 var m = this.getMenu(index);
                                 if (m != null)
                                 {
                                      m.parent = null;
                                      this.children.splice(index, 1);
                                 }
                                 return m;
                            };

          this.removeAll = function()
                           {
                                for (var i = 0; i <  this.children.length; i++)
                                {
                                     this.removeMenu(0);
                                }
                           };

          this.getNumChildren = function()
                                {
                                     return this.children.length;
                                };
     };

     function Callbacks()
     {
          this.actionCallback = null;
          this.onExpandMenuDecoratorCallback = null;
          this.onCollapseMenuDecoratorCallback = null;
     };

     function Menu(id)
     {
          this.id = id;
          this.textOrWhat = null;
          this.iconOrWhat = null;
          this.parent = null;
          this.callbacks = new Callbacks();

          this.childrenContainer = new ChildrenContainer();

          this.bounds = new Bounds(0, 0, 0, 0);

          this.materializedDiv = null;     //materialized div as a whole
          this.materializedDivLeftContainer = null;     //left area inside materialized div (this would typically hold menu icon in a L2R flow)
          this.materializedDivCenterContainer = null;     //central area inside materialized div (this would typically hold the menu text)
          this.materializedDivRightContainer = null;     //right area inside materialized div (this would typically hold the expansion indicator, any mnuemonics etc. in a L2R flow)

          this.menuExpansionDirection = MENU_OPEN_RIGHT;
          this.enabled = true;
          this.expanded = false;  //Introduced for optimization. Otherwise We could have done even without this flag.

          this.minWidth = -1;
          this.minHeight = -1;
          this.maxWidth = -1;
          this.maxHeight = -1;

          this.extendedAttributesMap = new KeyValueMap();     //use this attributes map to store any additional information that this menu component may require at runtime (e.g. some 'selection' state to display checked/unchecked image icon against this menu).
     };

     Menu.prototype.getId = function()
     {
          return this.id;
     };

     Menu.prototype.setTextOrWhat = function(textOrWhat)
     {
          this.textOrWhat = textOrWhat;
     };

     Menu.prototype.getTextOrWhat = function()
     {
          return this.textOrWhat;
     };

     Menu.prototype.setIconOrWhat = function(iconOrWhat)
     {
          this.iconOrWhat = iconOrWhat;
     };

     Menu.prototype.getIconOrWhat = function()
     {
          return this.iconOrWhat;
     };

     Menu.prototype.setActionCallback = function(actionCallback)
     {
          this.callbacks.actionCallback = actionCallback;
     };

     Menu.prototype.getActionCallback = function()
     {
          return this.callbacks.actionCallback;
     };

     Menu.prototype.isContainer = function()
     {
          //return this.children.length > 0;
          return this.childrenContainer.getNumChildren() > 0;
     };

     Menu.prototype.isRoot = function()
     {
          return this.parent == null;
     };

     Menu.prototype.getMenu = function(index)
     {
          return this.childrenContainer.getMenu(index);
     };

     Menu.prototype.getNumChildren = function()
     {
          //return this.children.length;
          return this.childrenContainer.getNumChildren();
     };

     Menu.prototype.addMenu = function(menu)
     {
          //if instanceof Menu
          //menu.parent = this;
          //this.children.push(menu);
          this.childrenContainer.addMenu(menu, this);
     };

     Menu.prototype.removeMenu = function(index)
     {
          return this.childrenContainer.removeMenu(index);
     };

     Menu.prototype.getMaterializedDiv = function()
     {
          return this.materializedDiv;
     };

     Menu.prototype.getMaterializedDivLeftContainer = function()
     {
          return this.materializedDivLeftContainer;
     };

     Menu.prototype.getMaterializedDivCenterContainer = function()
     {
          return this.materializedDivCenterContainer;
     };

     Menu.prototype.getMaterializedDivRightContainer = function()
     {
          return this.materializedDivRightContainer;
     };

     Menu.prototype.getMaterializedDivContainerRegion = function(region)
     {
          if (region == 'left')
               return this.getMaterializedDivLeftContainer();
          else if (region == 'center')
               return this.getMaterializedDivCenterContainer();
          else if (region == 'right')
               return this.getMaterializedDivRightContainer();
          return null;
     };

     Menu.prototype.setBounds = function(x, y, width, height)
     {
          this.bounds.x = x;
          this.bounds.y = y;
          this.bounds.width = width;
          this.bounds.height = height;
     };

     Menu.prototype.getBounds = function()
     {
          return this.bounds;
     };

     Menu.prototype.setMenuExpansionDirection = function(directionIntValue)
     {
          if (!isNaN(directionIntValue))
          {
               this.menuExpansionDirection = directionIntValue;
          }
     };

     Menu.prototype.getMenuExpansionDirection = function()
     {
          return this.menuExpansionDirection;
     };

     Menu.prototype.setOnExpandMenuDecoratorCallback = function(onExpandMenuDecoratorCallback)
     {
          this.callbacks.onExpandMenuDecoratorCallback = onExpandMenuDecoratorCallback;
     };

     Menu.prototype.getOnExpandMenuDecoratorCallback = function()
     {
          return this.callbacks.onExpandMenuDecoratorCallback;
     };

     Menu.prototype.setOnCollapseMenuDecoratorCallback = function(onCollapseMenuDecoratorCallback)
     {
          this.callbacks.onCollapseMenuDecoratorCallback = onCollapseMenuDecoratorCallback;
     };

     Menu.prototype.getOnCollapseMenuDecoratorCallback = function()
     {
          return this.callbacks.onCollapseMenuDecoratorCallback;
     };

     Menu.prototype.setEnabled = function(flag)
     {
          this.enabled = flag;
     };

     Menu.prototype.isEnabled = function()
     {
          return this.enabled;
     };

     Menu.prototype.doAction = function()
     {
          if (this.enabled == true && this.callbacks.actionCallback)
          {
               this.callbacks.actionCallback(this);
          }
     };

     Menu.prototype.setMinimumDimension = function(width, height)
     {
          if (!isNaN(width))
               this.minWidth = width;
          if (!isNaN(height))
               this.minHeight = height;
     };

     Menu.prototype.getMinimumWidth = function()
     {
          return this.minWidth;
     };

     Menu.prototype.getMinimumHeight = function()
     {
          return this.minHeight;
     };

     Menu.prototype.setMaximumDimension = function(width, height)
     {
          if (!isNaN(width))
               this.maxWidth = width;
          if (!isNaN(height))
               this.maxHeight = height;
     };

     Menu.prototype.getMaximumWidth = function()
     {
          return this.maxWidth;
     };

     Menu.prototype.getMaximumHeight = function()
     {
          return this.maxHeight;
     };

     Menu.prototype.setChildMenuDecoratorDiv = function(childMenuDecoratorDiv, location)
     {
          if (location == 'top')
               this.childrenContainer.topDecoratorDiv = childMenuDecoratorDiv;
          else if (location == 'left')
               this.childrenContainer.leftDecoratorDiv = childMenuDecoratorDiv;
          else if (location == 'bottom')
               this.childrenContainer.bottomDecoratorDiv = childMenuDecoratorDiv;
          else if (location == 'right')
               this.childrenContainer.rightDecoratorDiv = childMenuDecoratorDiv;
     };

     Menu.prototype.getChildMenuDecoratorDiv = function(location)
     {
          if (location == 'top')
               return this.childrenContainer.topDecoratorDiv;
          else if (location == 'left')
               return this.childrenContainer.leftDecoratorDiv;
          else if (location == 'bottom')
               return this.childrenContainer.bottomDecoratorDiv;
          else if (location == 'right')
               return this.childrenContainer.rightDecoratorDiv;

          return null;
     };

     Menu.prototype.setExtendedAttribute = function(name, value)
     {
          this.extendedAttributesMap.put(name, value);
     };

     Menu.prototype.getExtendedAttribute = function(name)
     {
          return this.extendedAttributesMap.get(name);
     };

     Menu.prototype.removeExtendedAttribute = function(name)
     {
          return this.extendedAttributesMap.remove(name);
     };

     Menu.prototype.materialize = function(containerDomElement, registerEventsCallback, menuDecoratorCallback)
     {
          if (this.materializedDiv)
               return;

          //var divE = document.createElement("div");
          //divE.appendChild(document.createTextNode(this.text));

          var divE = document.createElement("div");
//divE.style.display = "table";
//divE.style.position = "relative";
          //divE.innerHTML = "<img src=SAM_2055.JPG width=15px;></img>"+this.text+"<div style=float:right;display=inline;width=15px;>&gt;</div>";
          var divE_leftspace = document.createElement("div");
          divE_leftspace.style.padding = "0px";
          divE_leftspace.style.margin = "0px";
          divE_leftspace.style.border = "none";
          //divE_leftspace.style.width = "16px";
          //divE_leftspace.style.height = "16px";
//divE_leftspace.style.overflow = "hidden";
          var isThisDotIconAnImageObject = this.iconOrWhat instanceof Image || this.iconOrWhat instanceof HTMLImageElement;
          var isThisDotIconAString = typeof(this.iconOrWhat) == 'string';
          //var icon = isThisDotIconAnImageObject? this.iconOrWhat: (typeof(this.iconOrWhat) == 'string'? document.createElement("img"): null);
          var icon = isThisDotIconAString? document.createElement("img"): this.iconOrWhat;
          if (icon && isThisDotIconAString)
          {
               icon.src = this.iconOrWhat;
               //icon.width = "16";
               //icon.height = "16";
          }
          if (icon)
               divE_leftspace.appendChild(icon);

          var divE_text = document.createElement("div");
          if (this.textOrWhat)
          {
               if (typeof(this.textOrWhat) == 'string')
                    divE_text.appendChild(document.createTextNode(this.textOrWhat));
               else
                    divE_text.appendChild(this.textOrWhat);
          }
          divE_text.style.padding = "0px";
          divE_text.style.margin = "0px";
          divE_text.style.border = "none";
          divE_text.style.verticalAlign = "bottom";
          //divE_text.style.overflow = "auto";

          var divE_rightspace = document.createElement("div");
          divE_rightspace.style.padding = "0px";
          divE_rightspace.style.margin = "0px";
          divE_rightspace.style.border = "none";
          //divE_rightspace.style.width = "16px";
          //divE_rightspace.style.height = "16px";
          if (this.isContainer())
          {
               divE_rightspace.appendChild(document.createTextNode(">"));
               divE_rightspace.style.verticalAlign = "middle";
          }
          divE.appendChild(divE_leftspace);
          divE.appendChild(divE_rightspace);
          divE.appendChild(divE_text);

          containerDomElement.appendChild(divE);
          //divE.style.display = (this.parent == null)? "block": "none";
          //divE.style.visibility = (this.parent == null)? "visible": "hidden";
          this.materializedDiv = divE;
          this.materializedDivLeftContainer = divE_leftspace;
          this.materializedDivCenterContainer = divE_text;
          this.materializedDivRightContainer = divE_rightspace;
          if (menuDecoratorCallback)
               menuDecoratorCallback(this);
          if (registerEventsCallback)
               registerEventsCallback(this);

          /**********************************************************************************************************************/
          /****** We don't allow change in the following attribute values as any other value could distort the menu layout ******/
          /************ Let's reset the values if they are modified by any chance inside the menu decorator callback ************/
          /**********************************************************************************************************************/

          //divE_leftspace.style.display = "table-cell";
          //divE_text.style.display = "table-cell";
          //divE_rightspace.style.display = "table-cell";

          /*divE_leftspace.style.position = "absolute";
          divE_text.style.position = "absolute";
          divE_rightspace.style.position = "absolute";
          divE_leftspace.style.margin = "auto";
          divE_text.style.margin = "auto";
          divE_rightspace.style.margin = "auto";
          divE_leftspace.style.top = "0";
          divE_text.style.top = "0";
          divE_rightspace.style.top = "0";
          divE_leftspace.style.bottom = "0";
          divE_text.style.bottom = "0";
          divE_rightspace.style.bottom = "0";
          divE_leftspace.style.height = "100%";
          divE_text.style.height = "100%";
          divE_rightspace.style.height = "100%";
          divE_leftspace.style.width = "20%";
          divE_text.style.width = "70%";
          divE_rightspace.style.width = "10%";*/


          divE_leftspace.style.display = "inline-block";
          //divE_leftspace.style.cssFloat = "left";  //Keep it commented as it is not necessary to set this property. Moreover setting this property disturbs the alignment in some cases.
          divE_text.style.display = "inline";
          divE_rightspace.style.display = "inline";
          divE_rightspace.style.cssFloat = "right";  //NA //Keep it commented as it is not necessary to set this property. Moreover setting this property disturbs the alignment in some cases.
          /**********************************************************************************************************************/
          /**********************************************************************************************************************/
          /**********************************************************************************************************************/


          //divE_rightspace.style.border = "solid thin green";
          /*var height_ = Math.max(divE_rightspace.offsetHeight, Math.max(divE_leftspace.offsetHeight, divE_text.offsetHeight));
          divE_leftspace.style.height = Math.max(height_, divE_leftspace.offsetHeight) + "px";
          divE_text.style.height = Math.max(height_, divE_text.offsetHeight) + "px";
          divE_rightspace.style.height = Math.max(height_, divE_rightspace.offsetHeight) + "px";*/



          /*var childrenDiv = null;
          if (this.isContainer())
          {
               childrenDiv = document.createElement("div");
               divE.appendChild(childrenDiv);
               childrenDiv.style.display = "none";
               childrenDiv.style.padding = "0px";
               childrenDiv.style.margin = "0px";
          }
          var numChildren = this.getNumChildren();
          for (var i = 0; i < numChildren; i++)
          {
               this.childrenContainer.getMenu(i).materialize(childrenDiv, registerEventsCallback, menuDecoratorCallback);
          }
          this.childrenContainer.setChildrenDiv(childrenDiv);*/


          var childrenDivStub = null;
          if (this.isContainer())
          {
               childrenDivStub = new ChildrenDivStub();
               var childrenDiv = childrenDivStub.getDiv();
               divE.appendChild(childrenDiv);
               childrenDiv.style.display = "none";
               childrenDiv.style.padding = "0px";
               childrenDiv.style.margin = "0px";
               childrenDiv.style.overflow = "hidden";

               //add decorator div(s)
               if (this.childrenContainer.topDecoratorDiv)
                    childrenDivStub.getTopHolder().appendChild(this.childrenContainer.topDecoratorDiv);
               if (this.childrenContainer.leftDecoratorDiv)
                    childrenDivStub.getLeftHolder().appendChild(this.childrenContainer.leftDecoratorDiv);
               if (this.childrenContainer.rightDecoratorDiv)
                    childrenDivStub.getRightHolder().appendChild(this.childrenContainer.rightDecoratorDiv);
               if (this.childrenContainer.bottomDecoratorDiv)
                    childrenDivStub.getBottomHolder().appendChild(this.childrenContainer.bottomDecoratorDiv);
          }
          var numChildren = this.getNumChildren();
          for (var i = 0; i < numChildren; i++)
          {
               this.childrenContainer.getMenu(i).materialize(childrenDivStub.getMainContainer(), registerEventsCallback, menuDecoratorCallback);
          }
          this.childrenContainer.setChildrenDivStub(childrenDivStub);
     };

     Menu.prototype.expand = function()
     {
          if (!this.isContainer() || !this.materializedDiv || this.childrenContainer.getChildrenDivStub() == null || this.enabled == false || this.expanded == true)
               return;

          var expandAtExplicitLocation = false;
          if (arguments.length >= 2)
          {
               expandAtExplicitLocation = !isNaN(arguments[0]) && !isNaN(arguments[1]);
          }

          //var _width = 100;
          //var _height = (this.children.length * 20);
          var childrenDivE = this.childrenContainer.getChildrenDivStub().getDiv();
          childrenDivE.style.display = "block";
          childrenDivE.style.visibility = "visible";
          //childrenDivE.style.width = _width + "px";
          //childrenDivE.style.height = _height + "px";
          var _width = childrenDivE.offsetWidth;
          var _height = childrenDivE.offsetHeight;

          /************************************************************/
          /***** Take min and max width/height into consideration *****/
          /************************************************************/
          var __width = _width;
          var __height = _height;
          if (this.minWidth != -1)
               __width = Math.max(__width, this.minWidth);
          if (this.minHeight != -1)
               __height = Math.max(__height, this.minHeight);

          if (this.maxWidth != -1)
               __width = Math.min(__width, this.maxWidth);
          if (this.maxHeight != -1)
               __height = Math.max(__height, this.maxHeight);

          if (_width != __width)
          {
               _width = __width;
               childrenDivE.style.width = _width + "px";
          }
          if (_height != __height)
          {
               _height = __height;
               childrenDivE.style.height = _height + "px";
          }
          /************************************************************/
          /************************************************************/
          /************************************************************/

          //the following border related properties can be overridden inside onExpandMenuDecoratorCallback if any set.
          childrenDivE.style.borderStyle = "solid";
          childrenDivE.style.borderColor = "black";
          childrenDivE.style.borderWidth = "1px";
          if (this.callbacks.onExpandMenuDecoratorCallback)
               this.callbacks.onExpandMenuDecoratorCallback(childrenDivE);

          //the following properties even if set inside onExpandMenuDecoratorCallback will be overridden.
          childrenDivE.style.position = "fixed";
          childrenDivE.style.zIndex = 100;

          //this.childrenContainer.getChildrenDivStub().getMainContainer().style.display="block";
          this.childrenContainer.getChildrenDivStub().getLeftHolder().style.height = this.childrenContainer.getChildrenDivStub().getMainContainer().offsetHeight + "px";
          this.childrenContainer.getChildrenDivStub().getRightHolder().style.height = this.childrenContainer.getChildrenDivStub().getMainContainer().offsetHeight + "px";

          var pos = this.isRoot()? GetElementBounds(this.materializedDiv): this.getBounds();
          if (expandAtExplicitLocation)
          {
               //adjust the x and y coordinates to the explicit location
               pos.x = parseInt(arguments[0]);
               pos.y = parseInt(arguments[1]);
          }

          switch(this.menuExpansionDirection)
          {
               case MENU_OPEN_LEFT:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                         }

                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.childrenContainer.setBounds(pos.x - _width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_UPWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = pos.x + "px";
                                         childrenDivE.style.top = (pos.y - _height) + "px";
                                         this.childrenContainer.setBounds(pos.x, pos.y - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_DOWNWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = pos.x + "px";
                                         childrenDivE.style.top = (pos.y + pos.height) + "px";
                                         this.childrenContainer.setBounds(pos.x, pos.y + pos.height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_LEFT & MENU_OPEN_UPWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = (pos.y + pos.height - _height) + "px";
                                         this.childrenContainer.setBounds(pos.x - _width, pos.y + pos.height - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_LEFT & MENU_OPEN_DOWNWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.childrenContainer.setBounds(pos.x - _width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT & MENU_OPEN_UPWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = (pos.y + pos.height - _height) + "px";
                                         this.childrenContainer.setBounds(pos.x + pos.width, pos.y + pos.height - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT & MENU_OPEN_DOWNWARDS:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                              pos.y = pos.y + 1;
                                         }

                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.childrenContainer.setBounds(pos.x + pos.width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT:
               default:
                                    {
                                         //fix for some browsers inorder to prevent disposing/collapsing of the expanded menu before the mouse is moved over it.
                                         if (!this.isRoot() && !expandAtExplicitLocation)
                                         {
                                              pos.x = pos.x + 1;
                                         }

                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.childrenContainer.setBounds(pos.x + pos.width, pos.y, _width, _height);
                                    }
                                    break;
          }
          this.expanded = true;
     };

     Menu.prototype.expand2 = function()
     {
          if (!this.isContainer() || !this.materializedDiv)
               return;
          //var _width = 100;
          //var _height = (this.children.length * 20);
          var childrenDivE = this.children[0].getMaterializedDiv();
          childrenDivE.style.display = "block";
          //childrenDivE.style.width = _width + "px";
          //childrenDivE.style.height = _height + "px";
          var _width = childrenDivE.offsetWidth;
          var _height = childrenDivE.offsetHeight;
          childrenDivE.style.position = "fixed";
          childrenDivE.style.zIndex = 100;
          childrenDivE.style.border = "thin solid black";
          childrenDivE.style.background = "yellow";
          var pos = this.isRoot()? GetElementBounds(this.materializedDiv): this.getBounds();
          //var pos = GetElementBounds(this.materializedDiv);
          //var pos = findScreenPosition(this.materializedDiv, this.text == 'Sub Menu');
          //childrenDivE.style.left = this.isRoot()? pos.x + "px": pos.x + 100 + "px";
          //childrenDivE.style.top = this.isRoot()? (pos.y + pos.height) + "px": pos.y + "px";

          switch(this.menuExpansionDirection)
          {
               case MENU_OPEN_LEFT:
                                    {
                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.children[0].setBounds(pos.x - _width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT:
                                    {
                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.children[0].setBounds(pos.x + pos.width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_UPWARDS:
                                    {
                                         childrenDivE.style.left = pos.x + "px";
                                         childrenDivE.style.top = (pos.y - _height) + "px";
                                         this.children[0].setBounds(pos.x, pos.y - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_DOWNWARDS:
                                    {
                                         childrenDivE.style.left = pos.x + "px";
                                         childrenDivE.style.top = (pos.y + pos.height) + "px";
                                         this.children[0].setBounds(pos.x, pos.y + pos.height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_LEFT & MENU_OPEN_UPWARDS:
                                    {
                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = (pos.y + pos.height - _height) + "px";
                                         this.children[0].setBounds(pos.x - _width, pos.y + pos.height - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_LEFT & MENU_OPEN_DOWNWARDS:
                                    {
                                         childrenDivE.style.left = (pos.x - _width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.children[0].setBounds(pos.x - _width, pos.y, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT & MENU_OPEN_UPWARDS:
                                    {
                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = (pos.y + pos.height - _height) + "px";
                                         this.children[0].setBounds(pos.x + pos.width, pos.y + pos.height - _height, _width, _height);
                                    }
                                    break;
               case MENU_OPEN_RIGHT & MENU_OPEN_DOWNWARDS:
                                    {
                                         childrenDivE.style.left = (pos.x + pos.width) + "px";
                                         childrenDivE.style.top = pos.y + "px";
                                         this.children[0].setBounds(pos.x + pos.width, pos.y, _width, _height);
                                    }
                                    break;
          }

          //childrenDivE.style.visibility = "visible";
     };

     Menu.prototype.collapse = function()
     {
          if ((this.expanded == false) || !this.isContainer() || !this.materializedDiv || this.childrenContainer.getChildrenDivStub() == null || this.enabled == false)
               return;

          //var childrenDivE = this.children[0].getMaterializedDiv();
          var childrenDivE = this.childrenContainer.getChildrenDivStub().getDiv();
          if (this.callbacks.onCollapseMenuDecoratorCallback)
               this.callbacks.onCollapseMenuDecoratorCallback(childrenDivE);
          //childrenDivE.style.display = "none";
          childrenDivE.style.visibility = "hidden";
          this.expanded = false;
     };

     Menu.prototype.isMouseOut = function(event)
     {
          if (!this.materializedDiv)
               return true;
          var parentBounds = this.isRoot()? null: this.parent.getBounds();
          return parentBounds? !isWithinBounds(parentBounds, event) && !this.isInsideSelfORAnyDescendantBounds(event): !this.isInsideSelfORAnyDescendantBounds(event);
     };

     Menu.prototype.isInsideSelfORAnyDescendantBounds = function(event)
     {
          var selfBounds = this.isRoot()? GetElementBounds(this.materializedDiv): this.getBounds();
          var _isInside = isWithinBounds(selfBounds, event);
          if (!_isInside)
          {
               //now check inside the descendants
               if (this.expanded === true)
               {
                    var numChildren = this.getNumChildren();
                    for (var i = 0; i < numChildren; i++)
                    {
                         //if (this.childrenContainer.getMenu(i).expanded === true)
                              _isInside = _isInside || this.childrenContainer.getMenu(i).isInsideSelfORAnyDescendantBounds(event);
                         if (_isInside)
                              break;     //already inside a descendant. Need not loop further.
                    }
               }
          }
          return _isInside;
     };

     function isWithinBounds(bounds, event)
     {
          if (!bounds)
               return false;

          return !(event.pageX < bounds.x || event.pageX > (bounds.x + bounds.width) || event.pageY < bounds.y || event.pageY > (bounds.y + bounds.height));
     };

     return {
          //export any public methods and variables
          instance : Menu,     //constructor

          //public fields
          MENU_OPEN_LEFT : MENU_OPEN_LEFT,
          MENU_OPEN_RIGHT : MENU_OPEN_RIGHT,
          MENU_OPEN_UPWARDS : MENU_OPEN_UPWARDS,
          MENU_OPEN_DOWNWARDS : MENU_OPEN_DOWNWARDS
     };

}());