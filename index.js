/**
 * Created by andy on 2017/6/2.
 */

//注意此地址为服务器地址,存在跨域问题
const URL = "http://localhost:8080/hello"


/**
 * 创建XMLHttpRequest对象
 */
function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        //为了支持IE7以前的版本
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {

                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available.")
    }
}


/**
 * 同步请求的方式
 */
function syncRequest() {
    var xhr = createXHR();
    /**
     * open方法第一个参数表示调用方法的方式get,post等,
     * 第二个参数表示URL地址,
     * 第三个参数表示是否异步发送,false表示否,true表示异步发送,
     * 注意!此处的URL只能向同一个域中使用相同端口和协议的URL发送请求,否则存在跨域问题
     */
    xhr.open("get", URL, false);
    /**
     * send方法接受一个参数,既要作为请求主体发送的数据,如果不需要参数,一定要传null
     */
    xhr.send(null);
    /**
     * 响应返回的结果会自动的填充到xhr对象上:
     * responseText:作为响应主体返回的文本
     * responseXML:如果响应的内容类型是"text/xml"或"application/xml",这个属性中将
     * 保存包含着响应数据的XML DOM文档,对于非xml的响应,其为null
     * status:响应的HTTP状态,200表示成功,304表示服务端数据没有改变,可以使用浏览器缓存
     * 中的数据
     * statusText:HTTP状态说明
     */
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText);
    } else {
        alert("Request was unsuccessful:" + xhr.status);
    }
}
/**
 * 异步请求的方式
 */
function asyncRequest() {
    var xhr = createXHR();
    /**
     * 异步方式依赖于XHR对象的readyState属性,她表示请求/响应过程的当前活动阶段,取值如下:
     * 0:未初始化.尚未调用open()方法
     * 1:启动.已经调用open方法,但尚未调用send方法
     * 2:发送.已经调用send方法,但尚未接收到响应
     * 3:接收.已经接收到部分响应数据
     * 4:完成.已经接收全部响应数据,而且已经可以在客户端使用了
     * 注意!下面的事件函数没有使用this对象,原因是onreadystatechange事件处理的作用域问题.
     * 如果使用this对象在有的浏览器会执行失败,或者导致错误.所以使用实际的XHR对象实例变量是较
     * 为可靠的一种方式.
     * 另外在接收到响应之前,可以调用xhr.abort()来取消异步请求
     */
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                console.log(xhr.responseText);
            } else {
                alert("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    xhr.open("get", URL, true);
    xhr.send(null);
}

/**
 * 发送带请求头的信息,获取响应的相关头信息
 */
function requestByHeader() {
    var xhr = createXHR();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                console.log(xhr.responseText);
                /**
                 *调用XHR对象的getResponseHeader方法,并传入响应的头部参数名称,可以
                 * 获取服务器响应的头部相关值.调用getAllResponseHeaders方法获取所有
                 * 的响应头部信息.
                 * @TODO 不能获取服务器的response的头部信息,报Refused to get unsafe header "xx"
                 */
                var myHeader = xhr.getResponseHeader("xx");
                var allHeaders = xhr.getAllResponseHeaders();
                console.log("myHeader: " + myHeader + " allHeaders: " + allHeaders);
            } else {
                alert("Request was unsuccessful:" + xhr.status);
            }
        }
    };

    xhr.open("post", URL, true);
    xhr.overrideMimeType("text/plain;charset=x-user-defined");
    /**
     * HTTP头部信息
     * 在默认情况下,在发送XHR请求时,还会发送下列头部信息:
     * Accept:浏览器能够处理的内容类型
     * Accept-Charset:浏览器能够显示的字符集
     * Accept-Encoding:浏览器能够处理的压缩编码
     * Accept-Language:浏览器当前设置的语言
     * Connection:浏览器与服务器之间连接的类型
     * Cookie:当前页面设置的任何Cookie
     * Host:发送请求的页面所在的域
     * Referer:发送请求的页面URI
     * User-Agent:浏览器的用户代理字符串
     * 使用setRequestHeader可以设置自定义的请求头部,她接收两个参数,第一个是头部的名称,后面一
     * 个是头部字段的值.
     * 注意!要成功发送请求头部信息,必须在调用open方法之后且调用send方法之前,调用setRequestHeader
     * 方法.设置的头部名称的值不要和默认发送的一样,会导致错误.
     *
     */
    xhr.setRequestHeader("myhHeader", "myValue");
    xhr.send(null);

}

/**
 * GET请求要把查询字符串添加到URL后面,以便传给服务器.对于XHR而言,位于传入open方法的URL末尾的查询
 * 字符串必须经过正确的编码才行.
 * @param url URL地址
 * @param name 参数名称
 * @param value 参数值
 */
function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

/**
 * 举个栗子:GET方法加查询参数
 */
function getByURLParam() {
    var xhr = createXHR();
    var url = URL;
    url = addURLParam(url, "name", "Andy");
    url = addURLParam(url, "blog", "www.ivivisoft.com");
    xhr.open("get", url, false);
    xhr.send(null);
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.log(xhr.responseText);
    } else {
        alert("Request was unsuccessful:" + xhr.status);
    }
}

/**
 * 针对于Ajax,POST请求带来的一个问题就是表单序列化.
 * 先看一下,在表单提交期间,浏览器是怎样将数据发送给服务器的:
 * 1.对表单字段的名称和值进行URL编码,使用和号(&)分割.
 * 2.不发送禁用的表单字段
 * 3.只发送勾选的复选框和单选按钮
 * 4.不要发送type为"reset"和"button"的按钮
 * 5.多选选择框的每个选中的值单独一个条目.
 * 6.在单击提交按钮提交表单的情况下,也会发送提交按钮;否则不发送提交按钮.也包括type为"image"的<input>
 *     元素
 * 7.<select>元素的值,就是选中的<option>元素的value特性的值.如果<option>元素没有value特性,则是
 * <option>元素的文本值
 * @param form 表单
 */
function serialize(form) {
    var parts = [], field = null, i, len, j, optLen, option, optValue;
    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];
        switch (field.type) {
            case "select-one":
            case "select-multiple":
                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.hasAttribute["value"].specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case undefined://字段集
            case "file": //文件输入
            case "submit"://提交按钮
            case "reset"://重置按钮
            case "button"://自定义按钮
                break;
            case "radio"://单选按钮
            case "checkbox"://复选框
                if (!field.checked) {
                    break;
                }
            default:
                //不包含没有名字的表单字段
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}

/**
 * 举个栗子:POST方法加发送数据
 * 由于XHR最初设计主要是为了处理XML的,因此可以传入XML DOM文档,传入的文档经序列化之后将作为请求主体被提交到
 * 服务器.当然也可以传入任何想传给服务器的字符串
 * 注意!默认情况下,服务器对POST请求和提交web表单的请求并不会一视同仁.因此服务器端必须有程序来读取发送过来的
 * 原始数据,并解析出有用的部分.不过我们可以使用XHR来模仿表单提交:
 * 1.首先将Content-Type头部信息设置为application/x-www-form-urlencoded.
 * 2.以适当的格式创建一个字符串.也就是表单数据序列化.
 */
function submitData() {
    var xhr = createXHR();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                console.log(xhr.responseText);
            } else {
                console.log("Request was unsuccessful:" + xhr.status);
            }
        }
    };
    xhr.open("post", "http://localhost:8080/login1", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var form = document.getElementById("user-info");
    xhr.send(serialize(form));
}