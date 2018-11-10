/*
 * Animator class under util package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_Util.Animator = NS_BKTJSLIB1dot0_Util.Animator || (function() {

     //define short hand names for any external classes that are used inside this class.
     var KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap.instance;

     function NUMBERS_STATE_TRANSITION_PROVIDER(attribValue, finalValue, delta)
     {
          var increment = attribValue < finalValue;
          if (increment)
          {
               attribValue = Math.min(attribValue + delta, finalValue);
          }
          else
          {
               attribValue = Math.max(attribValue - delta, finalValue);
          }
          return attribValue;
     };

     function BASIC_EQUALITY_COMPARATOR(value1, value2)
     {
          return value1 == value2;
     };

     function State()
     {
          this.attribMap = {};
          this.achievedAttributes = {};
          this.achieveAttributesAsGroup = false;
          this.lastAttributeReturnedAsUnachieved = null;

          /******************************************************/
          /******** Attribute State Transition Providers ********/
          /******************************************************/
          this.attributeStateTransitionProviderMap = new KeyValueMap();
          this.attributeStateTransitionProviderMap.setDefault("ForNumbers", NUMBERS_STATE_TRANSITION_PROVIDER);
          this.setAttributeStateTransitionProviderMap = function(kvMap)
          {
               this.attributeStateTransitionProviderMap = kvMap;
          };
          this.getAttributeStateTransitionProviderMap = function()
          {
               return this.attributeStateTransitionProviderMap;
          };
          /******************************************************/
          /******************************************************/
          /******************************************************/

          /***************************************/
          /******** Attribute Comparators ********/
          /***************************************/
          this.attributeComparatorMap = new KeyValueMap();
          this.attributeComparatorMap.setDefault("BasicEqualityComparator", BASIC_EQUALITY_COMPARATOR);
          this.setAttributeComparatorMap = function(kvMap)
          {
               this.attributeComparatorMap = kvMap;
          };
          this.getAttributeComparatorMap = function()
          {
               return this.attributeComparatorMap;
          };
          /***************************************/
          /***************************************/
          /***************************************/

          this.setAttribute = function(name, value)
          {
               this.attribMap[name] = value;
          };

          this.getAttribute = function(name)
          {
               return this.attribMap[name];
          };

          this.getAttributeValue = function(name)
          {
               return this.getAttribute(name);
          };

          this.removeAttribute = function(name)
          {
               if (this.attribMap[name])
                    this.attribMap[name] = null;
          };

          this.removeAllAttributes = function()
          {
               this.attribMap = {};
          };

          this.achieved = function(goal)
          {
               for (name in this.attribMap)
               {
                    if (this.getAttribute(name) == null || goal.getAttribute(name) == null)
                         continue;     //ignore the null attribute and continue comparing others.
                    //if (this.getAttribute(name) != goal.getAttribute(name))
                    if (this.getAttributeComparatorMap().get(name, true)(this.getAttribute(name), goal.getAttribute(name)) !== true)
                         return false;
               }
               return true;
          };

          this.achieve = function(attribute, delta, finalValue)
          {
               var attribValue = this.getAttribute(attribute);
               if (attribValue == null || typeof(attribValue) == 'undefined')
               {
                    if (this.attribMap[attribute])
                         this.achievedAttributes[attribute] = true;     //let's treat the target attribute value as achieved.
                    this.lastAttributeReturnedAsUnachieved = null;
                    return {nextAnimateAttribute:this.getNextUnachievedAttribute(), isCurrentAchieved:true};
               }
               if (finalValue == null || typeof(finalValue) == 'undefined')
               {
                    this.achievedAttributes[attribute] = true;     //let's treat the target attribute value as achieved.
                    this.lastAttributeReturnedAsUnachieved = null;
                    return {nextAnimateAttribute:this.getNextUnachievedAttribute(), isCurrentAchieved:true};
               }

               var attributeStateTransitionProvider = this.getAttributeStateTransitionProviderMap().get(attribute, true);
               attribValue = attributeStateTransitionProvider(attribValue, finalValue, delta);
               this.setAttribute(attribute, attribValue);
               var attributeValueAchieved = this.getAttributeComparatorMap().get(attribute, true)(attribValue, finalValue) == true;
               if (attributeValueAchieved)
               {
                    this.achievedAttributes[attribute] = true;
                    this.lastAttributeReturnedAsUnachieved = null;
               }
               if (this.achieveAttributesAsGroup === true)
                    return {nextAnimateAttribute:this.getNextUnachievedAttribute(), isCurrentAchieved:attributeValueAchieved};
               else
               {
                    if (attributeValueAchieved)
                         return {nextAnimateAttribute:this.getNextUnachievedAttribute(), isCurrentAchieved:true};     //attribute has reached its target value. Now adjust next attribute.
                    else
                         return {nextAnimateAttribute:attribute, isCurrentAchieved:false};     //attribute has not yet reached target value. Continue adjusting attribute.
               }
          };

          this.clone = function()
          {
               var _clone = new State();
               for (name in this.attribMap)
               {
                    _clone.setAttribute(name, this.attribMap[name]);
                    _clone.setAttributeStateTransitionProviderMap(this.attributeStateTransitionProviderMap? this.attributeStateTransitionProviderMap.clone(): null);
                    _clone.setAttributeComparatorMap(this.attributeComparatorMap? this.attributeComparatorMap.clone(): null);
               }
               return _clone;
          };

          this.getNextUnachievedAttribute = function()
          {
               var firstUnachievedInLine = null;
               var setOk = this.lastAttributeReturnedAsUnachieved == null;
               for (name in this.attribMap)
               {
                    if (this.achievedAttributes[name] === true)
                         continue;
                    if (this.achieveAttributesAsGroup === true)
                    {
                         if (!firstUnachievedInLine)
                              firstUnachievedInLine = name;
                         if (name == this.lastAttributeReturnedAsUnachieved)
                         {
                              setOk = true;
                              continue;
                         }
                         if (setOk)
                         {
                              this.lastAttributeReturnedAsUnachieved = name;
                              return name;
                         }
                    }
                    else
                    {
                         this.lastAttributeReturnedAsUnachieved = name;     //although lastAttributeReturnedAsUnachieved is not used in this mode but let's anyway set it.
                         return name;
                    }
               }
               if (setOk && this.achieveAttributesAsGroup === true)
               {
                    this.lastAttributeReturnedAsUnachieved = firstUnachievedInLine;
                    return firstUnachievedInLine;
               }
               return null;
          };

          this.resetAchieved = function()
          {
               this.achievedAttributes = {};
          };
     };

     function AdvancedCallback()
     {
          this.callbackFn = null;
          this.callbackFnContextPointer = null;
     };

     //optional wrapper class to use for source if the source object is a complex one.
     function SourceWrapper(animatableSourceElement, sourceObjData)
     {
          this.animatableSourceElement = animatableSourceElement;
          this.sourceObjData = sourceObjData;

          //this should return the animatable object.
          this.getAnimatableElement = function()
          {
               return this.animatableSourceElement;
          };

          this.getSourceObjectData = function()
          {
               return this.sourceObjData;
          };
     };

     function Animator(source, start, end)
     {
          this.source = source;
          this.startState = start;
          this.endState = end;

          this.terminate = false;

          this.onCompleteCallback = new AdvancedCallback();
          this.onStopCallback = new AdvancedCallback();
          this.applyStateToSourceCallback = new AdvancedCallback();

          this.typeOfAnimation = null;     //animation type can optionally be set to identify the type of animation that is to be played (e.g. fade away, slide etc.)
          this.animateAttributesAsGroup = false;
     };

     Animator.prototype.getSource = function()
     {
          return this.source;
     };

     Animator.prototype.getStartState = function()
     {
          return this.startState;
     };

     Animator.prototype.getEndState = function()
     {
          return this.endState;
     };

     Animator.prototype.setOnCompleteCallback = function(callbackFn, callbackFnContextPointer)
     {
          this.onCompleteCallback.callbackFn = callbackFn;
          if (callbackFnContextPointer)
               this.onCompleteCallback.callbackFnContextPointer = callbackFnContextPointer;
          else
               this.onCompleteCallback.callbackFnContextPointer = null;
     };

     Animator.prototype.getOnCompleteCallback = function()
     {
          return this.onCompleteCallback;
     };

     Animator.prototype.setOnStopCallback = function(callbackFn, callbackFnContextPointer)
     {
          this.onStopCallback.callbackFn = callbackFn;
          if (callbackFnContextPointer)
               this.onStopCallback.callbackFnContextPointer = callbackFnContextPointer;
          else
               this.onStopCallback.callbackFnContextPointer = null;
     };

     Animator.prototype.getOnStopCallback = function()
     {
          return this.onStopCallback;
     };

     Animator.prototype.setApplyStateToSourceCallback = function(callbackFn, callbackFnContextPointer)
     {
          this.applyStateToSourceCallback.callbackFn = callbackFn;
          if (callbackFnContextPointer)
               this.applyStateToSourceCallback.callbackFnContextPointer = callbackFnContextPointer;
          else
               this.applyStateToSourceCallback.callbackFnContextPointer = null;
     };

     Animator.prototype.getApplyStateToSourceCallback = function()
     {
          return this.applyStateToSourceCallback;
     };

     Animator.prototype.setTypeOfAnimation = function(typeHint)
     {
          this.typeOfAnimation = typeHint;
     };

     Animator.prototype.getTypeOfAnimation = function()
     {
          return this.typeOfAnimation;
     };

     Animator.prototype.setAnimateAttributesAsGroup = function(flag)
     {
          this.animateAttributesAsGroup = flag;
     };

     Animator.prototype.isAnimateAttributesAsGroup = function()
     {
          return this.animateAttributesAsGroup;
     };

     Animator.prototype.stop = function()
     {
          this.terminate = true;
     };

     Animator.prototype.start = function(deltaKVMap, speedKVMap)
     {
          var start = this.startState.clone();
          var end = this.endState.clone();
          start.achieveAttributesAsGroup = this.animateAttributesAsGroup;
          if (this.terminate === true || start.achieved(end))
          {
               if (this.terminate === true && this.onStopCallback.callbackFn)
               {
                    //this.onStopCallback(this, start);     //start here holds the current state where the 'stop' happened.
                    var callbackFnContextPointer = this.onStopCallback.callbackFnContextPointer? this.onStopCallback.callbackFnContextPointer: this;
                    this.onStopCallback.callbackFn.call(callbackFnContextPointer, this, start);     //start here holds the current state where the 'stop' happened.
               }
               if (this.terminate !== true && this.onCompleteCallback.callbackFn)
               {
                    //this.onCompleteCallback(this);
                    var callbackFnContextPointer = this.onCompleteCallback.callbackFnContextPointer? this.onCompleteCallback.callbackFnContextPointer: this;
                    this.onCompleteCallback.callbackFn.call(callbackFnContextPointer, this);
               }
               return;
          }
          _animate(this, start.getNextUnachievedAttribute(), start, end, deltaKVMap, speedKVMap);
     };

     var _animate = function(animator, animateAttribute, start, end, deltaKVMap, speedKVMap)
     {
          var source = animator.source;
          if (animator.terminate ===true || animateAttribute == null || start.achieved(end))
          {
               if (animator.terminate === true && animator.onStopCallback.callbackFn)
               {
                    //animator.onStopCallback(animator, start);     //start here holds the current state where the 'stop' happened.
                    var callbackFnContextPointer = animator.onStopCallback.callbackFnContextPointer? animator.onStopCallback.callbackFnContextPointer: window;
                    animator.onStopCallback.callbackFn.call(callbackFnContextPointer, animator, start);     //start here holds the current state where the 'stop' happened.
               }
               if (animator.terminate !== true && animator.onCompleteCallback.callbackFn)
               {
                    //animator.onCompleteCallback(animator);
                    var callbackFnContextPointer = animator.onCompleteCallback.callbackFnContextPointer? animator.onCompleteCallback.callbackFnContextPointer: window;
                    animator.onCompleteCallback.callbackFn.call(callbackFnContextPointer, animator);
               }
               return;
          }
          var result = start.achieve(animateAttribute, deltaKVMap.get(animateAttribute, true), end.getAttributeValue(animateAttribute));
          var _nextAnimateAttribute = result.nextAnimateAttribute;
          applyStateToSource(animator.getApplyStateToSourceCallback(), animator.getTypeOfAnimation(), source, start, animateAttribute, result.isCurrentAchieved);
          var speed = _nextAnimateAttribute == null? 0: speedKVMap.get(animateAttribute, true);     //if _nextAnimateAttribute is null that means the animation is already complete and we don't want to introduce any delay in call to next setTimeout.
          setTimeout(function(){_animate(animator, _nextAnimateAttribute, start, end, deltaKVMap, speedKVMap);}, speed);
     };

     var applyStateToSource = function(applyStateToSourceCallback, typeOfAnimation, source, state, attribute, isAttributeTransitionComplete)
                              {
                                   if (!source || !state)
                                        return;
                                   if (applyStateToSourceCallback.callbackFn)
                                   {
                                        //applyStateToSourceCallback(typeOfAnimation, source, state, attribute, isAttributeTransitionComplete);
                                        var callbackFnContextPointer = applyStateToSourceCallback.callbackFnContextPointer? applyStateToSourceCallback.callbackFnContextPointer: window;
                                        applyStateToSourceCallback.callbackFn.call(callbackFnContextPointer, typeOfAnimation, source, state, attribute, isAttributeTransitionComplete);
                                   }
                                   else
                                   {
                                        //handling some common css updates. However don't rely on this default implementation and instead use your own 'applyStateToSource' callback
                                        source = source instanceof SourceWrapper? source.getAnimatableElement(): source;
                                        var _attrib = attribute;
                                        if (attribute == 'opacity')
                                        {
                                             source.style[_attrib] = state.getAttributeValue(attribute);
                                             source.style.filter = "'alpha(opacity=" + (state.getAttributeValue(attribute) * 100) + ")'";     //fallback for IE 6 or earlier
                                        }
                                        else if (attribute == 'color' || attribute == 'background')
                                        {
                                             source.style[_attrib] = state.getAttributeValue(attribute);
                                        }
                                        else
                                             source.style[_attrib] = state.getAttributeValue(attribute) + "px";
                                   }
                              };

     return {
          //export any public methods and variables
          instance : Animator,     //constructor
          State : State,
          SourceWrapper: SourceWrapper
     };

}());