(function() {
    //variable declaration
    var result=document.querySelector('#result');
    var resultText=document.createTextNode("");//Note text node needs to be created
    result.appendChild(resultText);

    var buttons=document.getElementsByTagName("td");
    const VALID_OPERATOR_START = 3;
    const clearAllBtn = buttons[1];
    const clearOneBtn = buttons[2];
    const EqualBtn = buttons[buttons.length - 1];

    var attribute,current = "";//current represents thr str for calculation

    // add event listeners for buttons
    clearAllBtn.addEventListener("click",deleteAll);
    clearOneBtn.addEventListener("click",deleteOne);
    for(var i = VALID_OPERATOR_START; i < buttons.length - 1; i++){
        buttons[i].addEventListener('click',showInBox);
    }
    EqualBtn.addEventListener("click",intergrateCacu);

    function showInBox(){
        attribute=result.className;
        if(attribute.indexOf('calculated')>=0){
        // when '=' is clicked, the result element's className will be changed to 'calculated'
            resultText.data = '';
            current = "";
            result.className = result.className.replace('calculated',' ');
            //note: JavaScript has no implementations for removeClass, but jQuery does
            //note: how replace is used
        }
        var text = this.firstChild.data; // 'this' refers to the result element
        var showtext = text; // showtext is the str showed on the screen and text is the transformed version
        if(text == '-' && resultText.data.length <= 0)  text = '0-';
        if(text == 'x')   text = '*';
        // if(text=='÷')   text='/';
        resultText.appendData(showtext);
        current += text;
    }

    function deleteAll(){
        resultText.data = '';
        current = '';
    }

    function deleteOne(){
        deleteOneLetter(resultText.data);
        deleteOneLetter(current);
    }

    function deleteOneLetter(str) {
        var newArray = str.split('');
        newArray.splice(str.length - 1, 1);
        return newArray.join("");
    }


    const isp={'#':0,'(':1,'*':5,'/':5,'%':5,'+':3,'-':3,')':6};//栈内优先数 // inside
    const icp={'#':0,'(':6,'*':4,'/':4,'%':4,'+':2,'-':2,')':1};//栈外优先数 // outside
    const eps=1e-5;
    const symbols='+-*/%()#';

    // turns an expression into an array
    function separate(expression){
        var tempArray=[], finalArray=[];
        for(var i = 0; i < expression.length; i++){
            if(symbols.indexOf(expression[i]) != -1){//is a symbol
                if(tempArray.length != 0){ // if temp array is not empty, make the temp array into a string and push into final array
                    var a=tempArray.join('');
                    finalArray.push(a);
                    tempArray = [];
                }
                finalArray.push(expression[i]);
            }else{
                tempArray.push(expression[i]);
            }
        }
        if(tempArray.length > 0){
            var a = tempArray.join('');
            finalArray.push(a);
        }
        // console.log(finalArray);
        return finalArray;
    }

    // turn infix  array into suffix array
    function turnSuffix(infixArray){
        var tempArray=['#'];
        var suffixArray=[];
        var top, element;
        infixArray.push('#');
        for(var i = 0; i < infixArray.length; ){
            if(symbols.indexOf(infixArray[i]) == -1){//if it's a number
                suffixArray.push(infixArray[i]);
                i++;
            }else{
                top = tempArray[tempArray.length - 1];
                if(icp[infixArray[i]] > isp[top]){
                    tempArray.push(infixArray[i]);
                    i++;
                    // console.log(icp[infixArray[i]]+'大于'+isp[top]);
                }
                else if(icp[infixArray[i]] < isp[top]){
                    element=tempArray.pop();
                    suffixArray.push(element);
                    // console.log(icp[infixArray[i]]+'小于'+isp[top]);
                }else{
                    element=tempArray.pop();
                    if(element=='(' || '#') i++;
                    // console.log(icp[infixArray[i]]+'=='+isp[top]);
                }
            }
            // console.log('i: '+i+',  '+suffixArray.toString()+"        "+tempArray.toString());
        }
        return suffixArray;
    }

    //calculate the result of the suffixArray
    function calculate(suffixArray){
        var calculator=[];
        for(var i = 0;i < suffixArray.length; i++){
            if(symbols.indexOf(suffixArray[i]) == -1){
                element = parseFloat(suffixArray[i]);
                calculator.push(element);
            }else{
                var element1 = calculator.pop();
                if(suffixArray[i]=='%'){
                    element = element1 / 100.0;
                }else{
                    var element2 = calculator.pop();
                    if(suffixArray[i] =='+') element = element1 + element2;
                    else if(suffixArray[i] =='-')   element = element2 - element1;
                    else if(suffixArray[i] =='*')   element = element2 * element1;
                    else if(suffixArray[i] =='/')  element = element2 / element1;
                }
                calculator.push(element);
            }
        }
        var calculateResult= calculator.pop();
        // console.log(calculateResult);
        // calculateResult=round(calculateResult,3);
        calculateResult=round_s(calculateResult);
        return calculateResult;
    }

    // solve the precision problem for JavaScript
    function round_s(result){
        var resultI=Math.round(result * 1e5);
        if(Math.abs(resultI - result * 1e5) < eps)    result = resultI / 1e5;
        return result;
    }

    function intergrateCacu(event){
        var res = calculate(turnSuffix(separate(current)));
        resultText.data = res;
        result.className += ' calculated ';
    }

}());

