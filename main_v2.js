/*计算器目前的缺陷：
（1）%计算问题；--------------------------如果简单计算的话，没有问题
（2）括号的加入问题；----------------------------separate部分出现了一点问题，简单表达式的话，ok
（3）乘号与除号的表示问题；------------------------解决一半，显示在框里的还是*与/的形式
（4）计算过一次之后最好的体验应该是清零，---------------------已简单做到
（5）报错情况，如果输入形式不对，应该报错
（6）小数点显示的位数问题------------------------------------三四位的小数计算应该还可以，多了的话，就会有误差
（7）-3的问题，负数问题----------------------现在和乘除号的问题是一样的，显示非常不美观，现在的想法是分为展示文本和计算文本*/
var result=document.querySelector('#result');

var resultText=document.createTextNode("");//主义之前result是没有子节点的，需要创建

// result.data = "";
result.appendChild(resultText);


/*建立一个数组，对0-9等进行存储，然后循环遍历，addEventListener?*/
var buttons=document.getElementsByTagName("td");
for(var i=3;i<buttons.length-1;i++){
    buttons[i].addEventListener('click',showInBox);
}

buttons[1].addEventListener("click",deleteAll);
buttons[2].addEventListener("click",deleteOne);

buttons[buttons.length-1].addEventListener("click",intergrateCacu);
// var percent=document.querySelector("#percent");
// alert(percent.firstChild.data);
var attribute,current = "";//current是实际计算是需要的字符串
function showInBox(event){//不是很理解event
    attribute=result.className;
    if(attribute.indexOf('calculated')>=0){
        // alert(1);
        resultText.data='';
        current="";
        result.className=result.className.replace('calculated',' ');//注意：原生的js是不存在removeClass方法的，同时，注意replace用法
    }
    var text=this.firstChild.data;
    var showtext=text;
    if(text=='-' && resultText.data.length<=0)  text='0-';
    if(text=='x')   text='*';
    // if(text=='÷')   text='/';
    resultText.appendData(showtext);/*点击之后能出现在result框中*/
    current+=text;
    // alert(typeof(resultText.data));
}
function deleteAll(event){
    resultText.data='';
    current='';
}
function deleteOne(event){
    var newArray=resultText.data.split('');
    newArray.pop();
    resultText.data=newArray.join('');
    var newArray2=current.split('');
    newArray2.pop();
    current=newArray2.join("");
}

//使用js来构建栈，想到js中的array本身就有push和pop方法，所以直接将表达式转变为后缀形式，然后进行计算即可。
var isp={'#':0,'(':1,'*':5,'/':5,'%':5,'+':3,'-':3,')':6};//栈内优先数
var icp={'#':0,'(':6,'*':4,'/':4,'%':4,'+':2,'-':2,')':1};//栈外优先数
var eps=1e-5;
var symbols='+-*/%()#';

function separate(expression){//将string转为一个表达式，即数字构成一个元素，如果能利用正则表达式将其分开就好了
    var interArray=[],finalArray=[];
    for(var i=0;i<expression.length;i++){
        if(symbols.indexOf(expression[i])!=-1){//符号
            if(interArray.length!=0){
                var a=interArray.join('');
                finalArray.push(a);
                interArray=[];
            }
            finalArray.push(expression[i]);
        }else{
            interArray.push(expression[i]);
        }
    }
    if(interArray.length>0){
        var a=interArray.join('');
        finalArray.push(a);
    }
    // console.log(finalArray);
    return finalArray;
}
// finalArray=separate("(2+3)*5");
// console.log("(2.4+3)*5".split(''));
// console.log(finalArray);
function turnSuffix(finalArray){//由中缀表达式(infix)转变为后缀表达式(suffix)
    var suffixArray=['#'];
    var lastArray=[];
    var top,element;
    finalArray.push('#');
    for(var i=0;i<finalArray.length;){
        if(symbols.indexOf(finalArray[i])==-1){//是数字
            lastArray.push(finalArray[i]);
            i++;
            console.log('number');
        }else{
            top=suffixArray[suffixArray.length-1];
            if(icp[finalArray[i]]>isp[top]){
                suffixArray.push(finalArray[i]);
                i++;
                console.log(icp[finalArray[i]]+'大于'+isp[top]);
            }
            else if(icp[finalArray[i]]<isp[top]){
                element=suffixArray.pop();
                lastArray.push(element);
                console.log(icp[finalArray[i]]+'小于'+isp[top]);
            }else{
                element=suffixArray.pop();
                // if(suffixArray.length==0)   break;
                if(element=='(' || '#') i++;
                console.log(icp[finalArray[i]]+'=='+isp[top]);
            }
        }
        console.log('i: '+i+',  '+lastArray.toString()+"        "+suffixArray.toString());
    }
    return lastArray;
}


// console.log(isp[finalArray[1]]);
// console.log(symbols.indexOf(finalArray[1]));

// lastArray=turnSuffix(separate('-3+2'));
// console.log(lastArray.toString());

function calculate(lastArray){
    var calculator=[];
    for(var i=0;i<lastArray.length;i++){
        if(symbols.indexOf(lastArray[i])==-1){
            element=parseFloat(lastArray[i]);
            calculator.push(element);
        }else{
            var element1=calculator.pop();
            if(lastArray[i]=='%'){
                element=element1/100.0;
            }else{
                var element2=calculator.pop();
                if(lastArray[i]=='+') element= element1+element2;
                else if(lastArray[i]=='-')   element= element2-element1;
                else if(lastArray[i]=='*')   element= element2*element1;
                else if(lastArray[i]=='/')  element=element2/element1;
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

    function intergrateCacu(event){
        // alert(current);
        var res=calculate(turnSuffix(separate(current)));
        resultText.data=res;
        result.className+=' calculated ';
        // alert(result.className);
    }
    function round_s(result){
        var resultI=Math.round(result*1e5);
        if(Math.abs(resultI-result*1e5)<eps)    result=resultI/1e5;
        return result;
    }
