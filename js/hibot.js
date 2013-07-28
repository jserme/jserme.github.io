var Character = {
	UNDER_LINE: "_",
	ZERO: "0",
	SLASH: "/",
	BACK_SLASH: "\\",
	SINGLE_QUOTE: "'",
	DOUBLE_QUOTE: '"',
	SPACE: " ",
	TAB: "\t",
	ENTER: "\r",
	LINE: "\n",
	LEFT_PARENTHESE: "(",
	RIGHT_PARENTHESE: ")",
	LEFT_BRACKET: "[",
	RIGHT_BRACKET: "]",
	LEFT_BRACE: "{",
	RIGHT_BRACE: "}",
	LEFT_ANGLE_BRACE: "<",
	RIGHT_ANGLE_BRACE: ">",
	STAR: "*",
	EXCLAMATION: "!",
	COLON: ":",
	SEMICOLON: ",",
	DECIMAL: ".",
	DOLLAR: "$",
	QUESTION: "?",
	SHARP: "#",
	AT: "@",
	ADD: "+",
	MINUS: "-",
	PERCENT: "%",
	AND: "&",
	LESS: "<",

	isDigit: function(c) {
		return c >= "0" && c <= "9";
	},

	isDigit16: function(c) {
		return this.isDigit(c) || (c >= "a" && c <= "f") || (c >= "A" && c <= "F");
	},
	isDigitOrDecimal: function(c) {
		return this.isDigit(c) || c == this.DECIMAL;
	},
	isLetter: function(c) {
		return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
	},
	isLetterOrDigit: function(c) {
		return this.isLetter(c) || this.isDigit(c);
	},
	isIdentifiers: function(c) {
		return this.isLetterOrDigit(c) || c == this.UNDER_LINE;
	},
	isLong: function(c) {
		return c == "l" || c == "L";
	},
	isFloat: function(c) {
		return c == "f" || c == "F";
	},
	isDouble: function(c) {
		return c == "d" || c == "D";
	},
	isX: function(c) {
		return c == "x" || c == "X";
	},
	isB: function(c) {
		return c == "b" || c == "B";
	},
	isBlank: function(c) {
		return c == this.SPACE || c == this.TAB;
	},
	isExponent: function(c) {
		return c == "e" || c == "E";
	},
	isQuote: function(c) {
		return c == this.DOUBLE_QUOTE || c == this.SINGLE_QUOTE;
	}
},

HtmlEncode = (function() {
	var AND = "&amp;",
	LESS = "&lt;",
	BLANK = "&nbsp;",
	TAB = "&nbsp;&nbsp;&nbsp;&nbsp;",
	ESCAPE = "\\\\";

	return {
		AND: AND,
		LESS: LESS,
		BLANK: BLANK,
		TAB: TAB,
		ESCAPE: ESCAPE,

		CHARS: [Character.AND, Character.TAB, Character.SPACE, Character.LESS],
		ESCAPES: [AND, TAB, BLANK, LESS],

		encodeChar: function(c) {
			switch (c) {
			case Character.SPACE:
				return this.BLANK;
			case Character.TAB:
				return this.TAB;
			case Character.BACK_SLASH:
				return this.ESCAPE;
			case Character.AND:
				return this.AND;
			case Character.LESS:
				return this.LESS;
			}
			return c;
		},
		encode: function(s) {
			//遍历替换需encode的特殊html编码字符
			for (var i = 0; i < this.CHARS.length; i++) {
				if (s.indexOf(this.CHARS[i]) > - 1) {
					s = s.replace(new RegExp(this.CHARS[i], "g"), this.ESCAPES[i]);
				}
			}
			//反斜线因产生正则表达式的原因特殊对待
			if (s.indexOf("\\") > - 1) {
				s = s.replace(/\\/g, this.ESCAPE);
			}
			return s;
		},
		encodeWithLine: function(s, newLine) {
			s = this.encode(s);
			//若有换行则替换
			if (s.indexOf("\n") > - 1) {
				s = s.replace(/\n/g, "</span>" + newLine);
			}
			return s;
		}

	};
})(),

HighLighter = (function() {
	var COMMENT = "comment",
	STRING = "string",
	HEAD = "head",
	CDATA = "cdata",
	REG = "reg";

	function start(type) {
		//console.log( type );
		return "<span class=\"" + type + "\">";
	}

	function hightLighter(type, s) {
		//console.log( type );
		return "<span class=\"" + type + "\">" + s + "</span>";
	}

	return {
		COMMENT: COMMENT,
		STRING: STRING,
		HEAD: HEAD,
		CDATA: CDATA,
		REG: REG,
		number: function(s) {
			return hightLighter("num", s);
		},
		keyword: function(s) {
			return hightLighter("keyword", s);
		},
		string: function(s) {
			return hightLighter(STRING, s);
		},
		comment: function(s) {
			return hightLighter(COMMENT, s);
		},
		variable: function(s) {
			return hightLighter("variable", s);
		},
		regular: function(s) {
			return hightLighter(REG, s);
		},
		annot: function(s) {
			return hightLighter("annot", s);
		},
		head: function(s) {
			return hightLighter(HEAD, s);
		},
		attr: function(s) {
			return hightLighter("attr", s);
		},
		val: function(s) {
			return hightLighter("val", s);
		},
		cdata: function(s) {
			return hightLighter(CDATA, s);
		},
		ns: function(s) {
			return hightLighter("namespace", s);
		},
		commentStart: function() {
			return start(COMMENT);
		},
		stringStart: function() {
			return start(STRING);
		},
		regStart: function() {
			return start(REG);
		},
		headStart: function() {
			return start(HEAD);
		},
		cdataStart: function() {
			return start(CDATA);
		}
	};
})(),

HashMap = function(words) {
	this.hash = {},
	this.index = 0;

	this.hasKey = function(key) {
		return this.hash[key] == true;
	};

	for (var i = 0; i < words.length; i++) {
		this.hash[words[i]] = true;
	}
},

StringBuilder = function(s) {

	this.append = function(s) {
		this.s += s;
	};

	this.has = function(s) {
		return this.s.indexOf(s) > - 1;
	};

	this.clear = function() {
		this.s = "";
	};
	this.toString = function() {
		return this.s;
	};

	this.s = s;
};

function AbstractParser(keywords) {
	this.peek = "";
	this.index = this.depth = this.line = 0;
	this.words = new HashMap(keywords);
	this.result = new StringBuilder("<li rel=\"0\">");
}

AbstractParser.prototype = {
	result: '',
	//存储结果
	words: '',
	//保留字hash
	peek: '',
	//向前看字符
	code: '',
	//原始代码
	index: 0,
	depth: 0,
	line: 0,
	//当前读入字符索引、深度、行数
	parse: function(code) {
		this.code = code;
		this.scan();
		return this.result.toString() + "</li>";
	},

	isFinish: function() {
		return this.index > this.code.length;
	},

	scan: function() {
		throw new Error("scan方法必须被子类所实现");
	},

	//处理代码中的空格、制表符和换行。参数指定是否需要处理换行
	dealBlank: function(newline) {
		if (newline == undefined) {
			newline = true;
		}

		for (;; this.readch()) {
			//空格和制表符编码存入
			if (Character.isBlank(this.peek)) {
				this.result.append(HtmlEncode.encodeChar(this.peek));
			}
			//不需要处理换行符则跳出
			else if (!newline) {
				return;
			}
			//换行则存入新的<li>
			else if (this.peek == Character.LINE) {
				this.genNewLine();
			} else {
				return;
			}
		}
	},

	inheritDealSign: function() {},

	//处理符号
	dealSign: function() {
		this.inheritDealSign();
		this.result.append(HtmlEncode.encodeChar(this.peek));
		this.readch();
	},

	//处理数字
	dealNumber: function() {
		var start = this.index - 1;
		var res;
		//以0开头需判断是否2、16进制
		if (this.peek == Character.ZERO) {
			this.readch();
			//0后面是x或者X为16进制
			if (Character.isX(this.peek)) {
				this.readch();
				//寻找第一个非16进制字符
				while (this.index < this.code.length) {
					if (!Character.isDigit16(this.peek)) {
						break;
					}
					this.readch();
				}
				//小数点继续，其它退出
				if (this.peek != Character.DECIMAL) {
					this.result.append(HighLighter.number(this.code.slice(start, this.index - 1)));
					return;
				}
			}
			//0后面是b或者B为2进制
			else if (Character.isB(this.peek)) {
				this.readch();
				//直到不是数字为止
				while (this.index < this.code.length) {
					if (!Character.isDigit(this.peek)) {
						break;
					}
					this.readch();
				}
				//小数点继续，其它退出
				if (this.peek != Character.DECIMAL) {
					this.result.append(HighLighter.number(this.code.slice(start, this.index - 1)));
					return;
				}
			}
			//不是小数点跳出
			else if (this.peek != Character.DECIMAL) {
				this.result.append(HighLighter.number(Character.ZERO));
				return;
			}
		}
		//先处理整数部分
		else {
			do {
				this.readch();
			}
			while (Character.isDigit(this.peek) || this.peek == Character.UNDER_LINE);
		}
		//整数后可能跟的类型L字母
		if (Character.isLong(this.peek)) {
			//防止.l的出现
			if (this.index == start + 2 && this.code.charAt(start) == Character.DECIMAL) {
				this.result.append(this.code.slice(start, this.index));
			}
			else {
				this.result.append(HighLighter.number(code.slice(start, this.index)));
			}
			this.readch();
			return;
		}
		//也可能是小数部分
		else if (this.peek == Character.DECIMAL) {
			do {
				this.readch();
			}
			while (Character.isDigit(this.peek));
			//小数后可能跟的类型字母D、F
			if (Character.isFloat(this.peek) || Character.isDouble(this.peek)) {
				this.readch();
				res = code.slice(start, this.index - 1);
				//防止.f出现
				if (res.length > 2) {
					res = HighLighter.number(res);
				}
				this.result.append(res);
				return;
			}
		}
		//指数E
		if (Character.isExponent(this.peek)) {
			this.readch();
			//+-号
			if (this.peek == Character.ADD || this.peek == Character.MINUS) {
				this.readch();
			}
			//指数后面的数字
			while (Character.isDigit(this.peek)) {
				this.readch();
			}
		}
		//高亮
		res = code.slice(start, this.index - 1);
		//防止.e之类的出现，即第一个字符是小数点的情况下判断第二个字符是否非数字
		if (res.charAt(0) != Character.DECIMAL && ! Character.isLetter(res.charAt(1))) {
			res = HighLighter.number(res);
		}
		this.result.append(res);
	},
	//读入下一个字符
	readch: function() {
		this.peek = this.code.charAt(this.index++);
	},
	//换行新<li/>节点并分析深度
	genNewLine: function() {
		this.result.append(this.getNewLine());
		this.line++;
	},
	getNewLine: function() {
		return "&nbsp;</li><li rel=\"" + this.depth + "\">";
	},
	//是否为关键字
	isKeyword: function(s) {
		return this.words.hasKey(s);
	}
};

$extend = function(target, source) {
	for (var key in source) {
		target[key] = source[key];
	}
};

function CSeriesParser(keywords) {
	AbstractParser.call(this, keywords);
}

$extend(CSeriesParser.prototype, AbstractParser.prototype);
$extend(CSeriesParser.prototype, {
	//字符串处理，单引号或多引号、是否允许转义折行
	dealString: function(c, wrap) {
		var start = this.index - 1,
		c = c || "\"";

		if (wrap == undefined) {
			wrap = false;
		}

		while (this.index <= this.code.length) {
			this.readch();
			//转义符
			if (this.peek == Character.BACK_SLASH) {
				this.readch();
				//不允许转义换行跳出
				if (!wrap && this.peek == Character.LINE) {
					break;
				}
			}
			//行末尾未转义换行或找到结束跳出
			else if (this.peek == c || this.peek == Character.LINE) {
				break;
			}
		}
		//高亮
		this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(start, this.index), this.getNewLine() + HighLighter.stringStart())));
		this.readch();
	},

	//处理单行注释
	dealSingleComment: function() {
		var end = code.indexOf("\n", this.index);
		this.index -= 2;
		//找不到换行符说明是最后一行
		if (end == - 1) {
			end = this.code.length;
		}
		//本行存入
		this.result.append(HighLighter.comment(HtmlEncode.encode(this.code.slice(this.index, end))));
		this.index = end;
		this.readch();
	},
	//处理多行注释
	dealMultiComment: function() {
		this.depth++;
		var end = this.code.indexOf("*/", this.index);
		this.index -= 2;
		//i为-1时直接注释到结尾
		if (end == - 1) {
			end = this.code.length;
		}
		else {
			end += 2;
		}
		this.result.append(HighLighter.comment(HtmlEncode.encodeWithLine(this.code.slice(this.index, end), this.getNewLine() + HighLighter.commentStart())));
		//调整索引和深度，并读取当前peek
		this.index = end;
		this.depth--;
		this.readch();
	},

	//处理符号同时要计算深度
	inheritDealSign: function() {
		if (this.peek == Character.LEFT_BRACE) {
			this.depth++;
		}
		else if (this.peek == Character.RIGHT_BRACE) {
			this.depth--;
		}
	}

});

function CompileParser(keywords) {
	CSeriesParser.call(this, keywords);
}

$extend(CompileParser.prototype, CSeriesParser.prototype);
$extend(CompileParser.prototype, {
	dealChar: function() {
		var start = this.index - 1;
		this.readch();
		//转义符多读入一个字符
		if (this.peek == Character.BACK_SLASH) {
			this.readch();
		}
		//字符单引号结尾
		if (this.peek == Character.SINGLE_QUOTE) {
			this.readch();
		}
		//高亮
		this.result.append(HighLighter.string(HtmlEncode.encode(this.code.slice(start, this.index))));
		this.readch();
	},
	dealWord: function() {
		var start = this.index - 1;
		//直到不是字母数字下划线为止
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isIdentifiers(this.peek)) {
				break;
			}
		}
		//高亮
		var res = code.slice(start, this.index - 1);
		if (this.words.hasKey(res)) {
			res = HighLighter.keyword(res);
		}
		this.result.append(res);
	}
});

function EcmascriptParser(keywords) {
	CSeriesParser.call(this, keywords);
	this.isPerlReg = true;
}

$extend(EcmascriptParser.prototype, CSeriesParser.prototype);
$extend(EcmascriptParser.prototype, {
	scan: function() {
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//除号检查注释
			if (this.peek == Character.SLASH) {
				this.readch();
				//单行注释
				if (this.peek == Character.SLASH) {
					this.dealSingleComment();
				}
				//多行注释
				else if (this.peek == Character.STAR) {
					this.dealMultiComment();
				}
				//除号或者perl风格正则
				else {
					//正则
					if (this.isPerlReg) {
						this.dealPerlReg();
						this.isPerlReg = true;
					}
					//除号
					else {
						this.result.append("/");
						this.isPerlReg = false;
					}
				}
			}
			//单双引号字符串
			else if (Character.isQuote(this.peek)) {
				this.dealString(this.peek, true);
				this.isPerlReg = true;
			}
			//处理数字
			else if (Character.isDigitOrDecimal(this.peek)) {
				this.dealNumber();
				this.isPerlReg = false;
			}
			//处理单词，美元符号或者字母或者下划线开头
			else if (Character.isIdentifiers(this.peek) || this.peek == Character.DOLLAR) {
				this.dealWord();
				this.isPerlReg = false;
			}

			//其它情况
			else {
				if (this.peek == Character.RIGHT_PARENTHESE) {
					this.isPerlReg = false;
				} else {
					this.isPerlReg = true;
				}

				this.dealSign();
			}
		}
	},

	dealWord: function() {
		var start = this.index - 1;
		//直到不是字母数字下划线美元符号为止
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isIdentifiers(this.peek) && this.peek != Character.DOLLAR) {
				break;
			}
		}
		//高亮
		var res = code.slice(start, this.index - 1);
		if (this.words.hasKey(res)) {
			res = HighLighter.keyword(res);
		}
		this.result.append(res);
	},

	//perl正则
	dealPerlReg: function() {
		var start = this.index - 2;
		outer: while (this.index <= this.code.length) {
			//转义符
			if (this.peek == Character.BACK_SLASH) {
				this.readch();
			}
			//[括号
			else if (this.peek == Character.LEFT_BRACKET) {
				while (this.index <= this.code.length) {
					this.readch();
					//转义符
					if (this.peek == Character.BACK_SLASH) {
						this.readch();
					}
					//]括号
					else if (this.peek == Character.RIGHT_BRACKET) {
						continue outer;
					}
				}
			}
			//行末尾
			else if (this.peek == Character.LINE) {
				break;
			}
			//正则表达式/结束
			else if (this.peek == Character.SLASH) {
				while (this.index <= this.code.length) {
					this.readch();
					//不是字母跳出
					if (!Character.isLetter(this.peek)) {
						break outer;
					}
				}
			}
			this.readch();
		}
		//高亮
		this.result.append(HighLighter.regular(HtmlEncode.encodeWithLine(this.code.slice(start, this.index - 1), this.getNewLine() + HighLighter.regStart())));
	}
});

/******** 各种语言 *********/
/*** javascript ***/
function JavascriptParser() {
	var keywords = "if else for break case continue function true switch default do while int float double long short char null public super in false abstract boolean byte class const debugger delete static void synchronized this import enum export extends final finally goto implements protected throw throws transient instanceof interface native new package private try typeof var volatile with document window return Function String Date Array Object RegExp Event Math Number".split(" ");

	EcmascriptParser.call(this, keywords);
}

$extend(JavascriptParser.prototype, EcmascriptParser.prototype);
$extend(JavascriptParser.prototype, {
	embedParse: function(code, depth) {
		this.depth = depth;
		var res = this.parse(code);
		return res.slice(12, res.length - 5);
	}
});

/*** css ***/
function CssParser() {
	this.values = new HashMap("above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow".split(" "));
	this.defaultDepth = 0;

	var keywords = "ascent azimuth background-attachment background-color background-image background-position background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index".split(" ");
	CSeriesParser.call(this, keywords);

}

$extend(CssParser.prototype, CSeriesParser.prototype);
$extend(CssParser.prototype, {
	scan: function() {
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//除号检查注释
			if (this.peek == Character.SLASH) {
				this.readch();
				//单行注释
				if (this.peek == Character.SLASH) {
					this.dealSingleComment();
				}
				//多行注释
				else if (this.peek == Character.STAR) {
					this.dealMultiComment();
				}
				//除号
				else {
					this.result.append("/");
				}
			}
			//#颜色，防止和id冲突，需要至少深度为1
			else if (this.peek == Character.SHARP && this.depth > 0) {
				this.dealColor();
			}
			//单双引号字符串
			else if (Character.isQuote(this.peek)) {
				this.dealString(this.peek);
			}
			//处理数字
			else if (Character.isDigitOrDecimal(this.peek)) {
				this.dealNum();
			}
			//处理单词，字母开头
			else if (Character.isLetter(this.peek)) {
				this.dealWord();
			}
			//其它情况
			else {
				this.dealSign();
			}
		}
	},
	dealNum: function() {
		var start = this.index - 1,
		end;
		//先处理整数部分
		while (Character.isDigit(this.peek)) {
			this.readch();
		}
		//小数部分
		if (this.peek == Character.DECIMAL) {
			this.readch();
			while (Character.isDigit(this.peek)) {
				this.readch();
			}
		}
		end = this.index - 1;
		//单位
		while (Character.isLetter(this.peek)) {
			this.readch();
		}
		var unit = this.code.slice(end, this.index - 1).toLowerCase();
		//%或者em px pt cm mm ex pc in单位
		if (unit == "%" || (unit.length == 2 && "em px pt cm mm ex pc in".indexOf(unit) > - 1)) {
			end = this.index - 1;
		}
		//高亮
		var res = this.code.slice(start, end);
		if (this.depth > this.defaultDepth) {
			res = HighLighter.number(res);
		}
		this.result.append(res);
		this.index = end;
		this.readch();
	},
	dealWord: function() {
		var start = this.index - 1;
		//找到第一个非字母横线位置
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isLetter(this.peek) && this.peek != Character.MINUS) {
				break;
			}
		}
		var res = this.code.slice(start, this.index - 1);
		//高亮
		if (this.depth > this.defaultDepth) {
			if (this.words.hasKey(res.toLowerCase())) {
				res = HighLighter.keyword(res);
			}
			else if (this.values.hasKey(res.toLowerCase())) {
				res = HighLighter.val(res);
			}
		}
		this.result.append(res);
	},

	dealColor: function() {
		var start = this.index - 1;
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isDigit16(this.peek)) {
				break;
			}
		}
		var res = this.code.slice(start, this.index - 1);
		//必须深度大于默认深度并且长度符合要求时（颜色16进制为#加3位或6位字母）
		if (this.depth > this.defaultDepth && (res.length == 4 || res.length == 7)) {
			res = HighLighter.number(res);
		}
		this.result.append(res);
	},

	embedParse: function(code, depth) {
		this.depth = defaultDepth = depth;
		var res = this.parse(this.code);
		return res.slice(12, res.length - 5);
	}
});

/*** html ***/
function MarkupParser(keywords) {
	this.TEXT = 0;
	this.MARK = 1;
	this.state = this.TEXT;
	AbstractParser.call(this, keywords);
}

$extend(MarkupParser.prototype, AbstractParser.prototype);
$extend(MarkupParser.prototype, {

	dealString: function(c) {
		if (c == undefined) c = "\"";
		var start = this.index - 1;
		//寻找接下来的引号，无需考虑转义问题
		this.index = this.code.indexOf(c, this.index);
		if (this.index == - 1) {
			this.index = this.code.length - 1;
		}
		this.index++;
		this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(start, this.index), this.getNewLine() + HighLighter.stringStart())));
		this.readch();
	},
	dealComment: function() {
		this.depth++;
		var end = this.code.indexOf("-->", this.index + 4);
		if (end == - 1) {
			end = this.code.length - 3;
		}
		end += 3;
		this.result.append(HighLighter.comment(HtmlEncode.encodeWithLine(this.code.slice(this.index, end), this.getNewLine() + HighLighter.commentStart())));
		this.index = end;
		this.depth--;
		this.readch();
	}
});

function HtmlParser() {
	this.CSS = 2;
	this.JS = 3;

	this.auto = false; //当前html节点是否为自闭合标签
	this.css = false; //当前节点是否为style
	this.javascript = false; //当前节点是否为js
	//自闭合html节点关键字
	this.autoWords = new HashMap("BR HR COL IMG AREA BASE LINK META FRAME INPUT PARAM ISINDEX BASEFONT COLGROUP".split(" "));

	//属性关键字
	this.attributes = new HashMap("abbr accept-charset accept accesskey action align behavior bgcolor bgproperties border bordercolor bordercolordark alink alt bordercolorlight borderstyle buffer caption cellpadding cellspacing archive char charoff charset checked cite class classid clear code codebase axis codetype color cols colspan compact content contentType coords data vlink datetime declare defer dir direction disabled dynsrc encoding enctype errorPage extends face file flush for frame frameborder framespacing urn gutter headers height href hreflang hspace http-equiv icon id import info isErrorPage ismap isThreadSafe label language leftmargin link autoFlush longdesc loop lowsrc marginheight marginwidth maximizebutton maxlength media method methods minimizebutton multiple name nohref noresize background noshade nowrap object onabort onblur onchange onclick ondblclick width onerror onfocus onkeydown onkeypress onkeyup onload applicationname rows onmousemove onmouseout onmouseover onmouseup onreset onselect onsubmit onunload page param profile prompt property readonly rel onmousedown rev rowspan rules runat scheme scope scrollamount scrolldelay scrolling vrml selected session shape showintaskbar singleinstance size span src standby start style summary sysmenu tabindex target text title topmargin type wrap usemap valign value valuetype version vspace windowstate".split(" "));

	var keywords = "A ABBR ACRONYM ADDRESS APPLET B BDO BIG BLOCKQUOTE BODY BUTTON CAPTION CENTER CITE CODE DD DEL DFN DIR DIV DL DT EM FIELDEST FONT FORM FRAMESET H1 H2 H3 H4 H5 H6 HEAD HTML I IFRAME INS KBD LABEL LEGEND LI MAP MENU NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TITLE TR TT U EMBED UL VAR PUBLIC".split(" ");

	MarkupParser.call(this, keywords);
}

$extend(HtmlParser.prototype, MarkupParser.prototype);
$extend(HtmlParser.prototype, {
	scan: function() {
		var start = 0;
		this.readch();
		while (this.index <= this.code.length) {
			this.dealBlank();
			//根据不同状态来分析代码
			switch (this.state) {
			case this.TEXT:
				start = this.index - 1;
				this.index = this.code.indexOf("<", start);
				//处理<之前的文本部分，找不到<说明到了末尾
				if (this.index == - 1) {
					this.result.append(HtmlEncode.encodeWithLine(this.code.slice(start), this.getNewLine()));
					return;
				}
				else if (this.index > start) {
					this.result.append(HtmlEncode.encodeWithLine(this.code.slice(start, this.index), this.getNewLine()));
				}
				this.readch();
				//分析html标签
				this.dealLeftAngleBracket();
				break;
			case this.MARK:
				//单双引号
				if (Character.isQuote(this.peek)) {
					this.dealString(this.peek);
				}
				//结束符/>
				else if (this.peek == Character.SLASH) {
					this.readch();
					if (this.peek == Character.RIGHT_ANGLE_BRACE) {
						this.result.append(HighLighter.keyword("/>"));
						this.state = this.TEXT;
						//非自闭合标签深度--
						if (!this.auto) {
							this.depth--;
						}
					}
					else {
						this.result.append("/");
					}
					this.auto = false;
					this.readch();
				}
				//结束符>
				else if (this.peek == Character.RIGHT_ANGLE_BRACE) {
					this.result.append(HighLighter.keyword(">"));
					this.readch();
					this.state = this.TEXT;
					this.auto = false;
					//css和js
					if (this.css) {
						this.state = this.CSS;
					}
					else if (this.javascript) {
						this.state = this.JS;
					}
				}
				//单词
				else if (Character.isLetter(this.peek)) {
					this.dealAttr();
				}
				//数字
				else if (Character.isDigit(this.peek)) {
					this.dealNumber();
				}
				//其它情况编码此字符直接存入
				else {
					this.result.append(HtmlEncode.encodeChar(this.peek));
					this.readch();
				}
				break;
			case this.CSS:
				this.dealCss();
				break;
			case this.JS:
				this.dealJs();
				break;
			}
		}
	},
	dealLeftAngleBracket: function() {
		this.readch();
		//<!
		if (this.peek == Character.EXCLAMATION) {
			//<!--
			if (this.code.substr(this.index, 2) == "--") {
				this.index -= 2;
				this.dealComment();
			}
			//<!DOCTYPE
			else if (this.code.substr(this.index, 7).toUpperCase() == "DOCTYPE") {
				this.result.append(HighLighter.keyword(HtmlEncode.encode(this.code.substr(this.index - 2, 9))));
				this.index += 7;
				this.state = this.MARK;
				this.auto = true;
				this.readch();
			}
			else {
				this.result.append("&lt;!");
				this.readch();
			}
		}
		//闭合html标签</
		else if (this.peek == Character.SLASH) {
			this.dealEndWord();
		}
		//跟字母检查开始标签
		else if (Character.isLetter(this.peek)) {
			this.dealStartWord();
		}
		else {
			this.result.append(HtmlEncode.LESS + HtmlEncode.encodeChar(this.peek));
			this.readch();
		}
	},
	dealStartWord: function() {
		var start = this.index - 1;
		//直到非数字字母为止
		do {
			this.readch();
		}
		while (Character.isLetterOrDigit(this.peek));
		var res = this.code.slice(start, this.index - 1);
		//普通html节点
		if (this.words.hasKey(res.toUpperCase())) {
			//css和js
			if (res.toUpperCase() == "STYLE") {
				this.css = true;
			}
			else if (res.toUpperCase() == "SCRIPT") {
				this.javascript = true;
			}
			//高亮
			res = HighLighter.keyword(HtmlEncode.LESS + res);
			this.state = this.MARK;
			this.depth++;
		}
		//自闭合节点
		else if (this.autoWords.hasKey(res.toUpperCase())) {
			res = HighLighter.keyword(HtmlEncode.LESS + res);
			this.state = this.MARK;
			this.auto = true;
		}
		else {
			res = HtmlEncode.LESS + res;
		}
		this.result.append(res);
	},
	dealEndWord: function() {
		var start = this.index;
		//直到非数字字母为止
		do {
			this.readch();
		}
		while (Character.isLetterOrDigit(this.peek));
		var res = this.code.slice(start, this.index - 1);
		//是否为html关键字，并且要直接>闭合
		if (this.peek == Character.RIGHT_ANGLE_BRACE && this.words.hasKey(res.toUpperCase())) {
			this.result.append(HighLighter.keyword(HtmlEncode.LESS + "/" + res + ">"));
			this.readch();
			this.state = this.TEXT;
			this.depth--;
		}
		else {
			this.result.append(HtmlEncode.LESS + "/" + res);
		}
	},
	dealAttr: function() {
		var start = this.index - 1;
		//直到非字母横线为止
		do {
			this.readch();
		}
		while (Character.isLetter(this.peek) || this.peek == Character.MINUS);
		//高亮，是否为属性
		var res = this.code.slice(start, this.index - 1);
		if (this.attributes.hasKey(res.toLowerCase())) {
			res = HighLighter.attr(res);
		}
		this.result.append(res);
	},
	dealCss: function() {
		var start = this.index - 1,
		end;
		var tag;
		//找到第一个非注释中的</style>，忽略大小写，忽略字符串
		while (this.index <= this.code.length) {
			if (this.peek == Character.SLASH) {
				this.readch();
				//多行注释
				if (this.peek == Character.STAR) {
					end = this.code.indexOf("*/", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end;
				}
				//单行注释
				else if (this.peek == Character.SLASH) {
					end = this.code.indexOf("\n", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end;
				}
			}
			else if (Character.isQuote(this.peek)) {
				tag = this.peek;
				while (this.index <= this.code.length) {
					this.readch();
					//转义
					if (this.peek == Character.BACK_SLASH) {
						this.readch();
					}
					else if (this.peek == tag) {
						break;
					}
				}
			}
			else if (this.peek == Character.LEFT_ANGLE_BRACE) {
				tag = this.code.substr(this.index - 1, 8).toLowerCase();
				if (tag == "</style>") {
					break;
				}
			}
			this.readch();
		}
		//高亮
		var cssParser = new CssParser();
		var res = cssParser.embedParse(this.code.slice(start, this.index - 1), this.depth);
		this.result.append(res);
		this.css = false;
		this.state = this.TEXT;
	},
	dealJs: function() {
		var start = this.index - 1,
		end;
		var tag;
		var isPerlReg = true;
		//找到第一个</script>，注意注释/字符串/正则等
		while (this.index <= this.code.length) {
			if (this.peek == Character.SLASH) {
				this.readch();
				//多行注释
				if (this.peek == Character.STAR) {
					end = this.code.indexOf("*/", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end + 2;
				}
				//单行注释
				else if (this.peek == Character.SLASH) {
					end = this.code.indexOf("\n", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end;
				}
				//正则
				else if (isPerlReg) {
					while (this.index <= this.code.length) {
						if (this.peek == Character.BACK_SLASH) {
							this.readch();
						}
						else if (this.peek == Character.SLASH) {
							break;
						}
						else if (this.peek == Character.LEFT_BRACKET) {
							while (this.index <= this.code.length) {
								this.readch();
								if (this.peek == Character.BACK_SLASH) {
									this.readch();
								}
								else if (this.peek == Character.RIGHT_BRACKET) {
									break;
								}
							}
						}
						this.readch();
					}
					isPerlReg = true;
				}
				//除号
				else {
					isPerlReg = false;
				}
			}
			else if (Character.isQuote(this.peek)) {
				tag = this.peek;
				while (this.index <= this.code.length) {
					this.readch();
					//转义
					if (this.peek == Character.BACK_SLASH) {
						this.readch();
					}
					else if (this.peek == tag) {
						break;
					}
				}
				isPerlReg = true;
			}
			else if (this.peek == Character.LEFT_ANGLE_BRACE) {
				tag = this.code.substr(this.index, 8).toLowerCase();
				if (tag == "/script>") {
					break;
				}
			}
			else if (Character.isIdentifiers(this.peek) || this.peek == Character.DOLLAR || this.peek == Character.RIGHT_PARENTHESE) {
				isPerlReg = false;
			}
			else {
				isPerlReg = true;
			}
			this.readch();
		}
		//高亮
		var javascriptParser = new JavascriptParser();
		var res = javascriptParser.embedParse(this.code.slice(start, this.index - 1), this.depth);
		this.result.append(res);
		this.javascript = false;
		this.state = this.TEXT;
	}
});

/*** java ***/
function JavaParser() {
	var keywords = "if else for break case continue function true false switch default do while int float double long throws transient abstract assert boolean byte class const enum instanceof try volatilechar extends final finally goto implements import protected return void char interface native new package private protected throw short public return strictfp super synchronized this static null String".split(" ");
	CompileParser.call(this, keywords);
}

$extend(JavaParser.prototype, CompileParser.prototype);
$extend(JavaParser.prototype, {
	scan: function() {
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//除号检查注释
			if (this.peek == Character.SLASH) {
				this.readch();
				//单行注释
				if (this.peek == Character.SLASH) {
					this.dealSingleComment();
				}
				//多行注释
				else if (this.peek == Character.STAR) {
					this.dealMultiComment();
				}
				//除号
				else {
					this.result.append(Character.SLASH);
				}
			}
			//双引号字符串
			else if (this.peek == Character.DOUBLE_QUOTE) {
				this.dealString(this.peek);
			}
			//单引号字符
			else if (this.peek == Character.SINGLE_QUOTE) {
				this.dealChar();
			}
			//@号java注释语法
			else if (this.peek == Character.AT) {
				this.dealAnnot();
			}
			//处理数字
			else if (Character.isDigitOrDecimal(this.peek)) {
				this.dealNumber();
			}
			//处理单词，美元符号或者字母或者下划线开头
			else if (Character.isIdentifiers(this.peek)) {
				this.dealWord();
			}
			//其它情况
			else {
				this.dealSign();
			}
		}
	},
	dealAnnot: function() {
		var start = this.index - 1;
		while (this.index <= this.code.length) {
			this.readch();
			//非字母数字跳出
			if (!Character.isLetterOrDigit(this.peek)) {
				break;
			}
		}
		//高亮
		this.result.append(HighLighter.annot(HtmlEncode.encode(this.code.slice(start, --this.index))));
		this.readch();
	}

});

/*** php ***/
function CPhpParser() {
	this.tag = '';
	var keywords = "and or xor __FILE__ __LINE__ array as cfunction class const declare die elseif empty enddeclare endfor endforeach endif endswitch endwhile extends foreach include include_once global new old_function use require require_once var __FUNCTION__ __CLASS__ __METHOD__ abstract interface public implements extends private protected throw echo exit die".split(" ");
	CSeriesParser.call(this, keywords);
}

$extend(CPhpParser.prototype, CSeriesParser.prototype);
$extend(CPhpParser.prototype, {
	scan: function() {
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//除号检查注释
			if (this.peek == Character.SLASH) {
				this.readch();
				//单行注释
				if (this.peek == Character.SLASH) {
					this.dealSingleComment();
				}
				//多行注释
				else if (this.peek == Character.STAR) {
					this.dealMultiComment();
				}
				//除号
				else {
					this.result.append("/");
				}
			}
			//单双引号字符串
			else if (Character.isQuote(this.peek)) {
				this.dealString(this.peek);
			}
			//跨行字符串
			else if (this.peek == Character.LEFT_ANGLE_BRACE) {
				this.readch();
				if (this.peek == Character.LEFT_ANGLE_BRACE) {
					this.readch();
					if (this.peek == Character.LEFT_ANGLE_BRACE) {
						this.readch();
						this.dealMultiString();
					}
					else {
						this.result.append(HtmlEncode.LESS + HtmlEncode.LESS + this.peek);
					}
				}
				else {
					this.result.append(HtmlEncode.LESS + this.peek);
				}
			}
			//处理数字
			else if (Character.isDigitOrDecimal(this.peek)) {
				this.dealNumber();
			}
			//处理变量，美元符号开头
			else if (this.peek == Character.DOLLAR) {
				this.dealVal();
			}
			//处理单词，字母下划线开头
			else if (Character.isIdentifiers(this.peek)) {
				this.dealWord();
			}
			//其它情况
			else {
				this.dealSign();
			}
		}
	},
	dealVal: function() {
		var start = this.index - 1;
		//非数字字母下划线跳出
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isIdentifiers(this.peek)) {
				break;
			}
		}
		//高亮
		this.result.append(HighLighter.val(this.code.slice(start, this.index - 1)));
	},
	dealWord: function() {
		var start = this.index - 1;
		//非数字字母下划线跳出
		while (this.index <= this.code.length) {
			this.readch();
			if (!Character.isIdentifiers(this.peek)) {
				break;
			}
		}
		//高亮
		var res = this.code.slice(start, this.index - 1);
		if (this.words.hasKey(res)) {
			res = HighLighter.keyword(res);
		}
		this.result.append(res);
	},
	//特殊的跨行字符串处理
	dealMultiString: function() {
		this.depth++;
		var start = this.index - 4;
		//记录多行字符串标示符
		while (this.index <= this.code.length) {
			if (!Character.isIdentifiers(this.peek)) {
				break;
			}
			this.readch();
		}
		//寻找结束
		var tag = this.code.slice(start + 3, this.index - 1);
		var end = this.code.indexOf("\n" + tag, this.index);
		//高亮
		if (end == - 1) {
			end = this.code.length;
		}
		else {
			end += tag.length + 1;
		}
		this.result.append(HighLighter.string(HtmlEncode.encodeWithLine(this.code.slice(start, end), this.getNewLine() + HighLighter.stringStart())));
		this.index = end;
		this.depth--;
		this.readch();
	},

	embedParse: function(code, depth) {
		this.depth = depth;
		var res = this.parse(code);
		return res.slice(12, res.length - 5);
	}
});

function PhpParser() {
	this.PHP = 4;
	HtmlParser.call(this);
}

$extend(PhpParser.prototype, HtmlParser.prototype);
$extend(PhpParser.prototype, {
	dealLeftAngleBracket: function() {
		this.readch();
		//发现<?
		if (this.peek == Character.QUESTION) {
			//<?php
			if (this.code.substr(this.index, 3).toLowerCase() == "php") {
				this.result.append(HighLighter.keyword(HtmlEncode.LESS + this.code.slice(this.index - 1, this.index + 3)));
				this.index += 3;
				this.dealPhp();
			}
			//或者短标记
			else if (!Character.isIdentifiers(this.code.charAt(this.index))) {
				this.result.append(HighLighter.keyword(HtmlEncode.LESS + "?"));
				this.dealPhp();
			}
			else {
				this.result.append(HtmlEncode.LESS + "?");
				this.readch();
			}
		}
		else {
			this.index--;
			HtmlParser.dealLeftAngleBracket.call(this);
		}
	},
	dealPhp: function() {
		this.readch();
		this.depth++;
		var start = this.index - 1,
		end;
		//寻找结束符?>
		while (this.index <= this.code.length) {
			if (this.peek == Character.SLASH) {
				this.readch();
				//多行注释
				if (this.peek == Character.STAR) {
					end = this.code.indexOf("*/", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end;
				}
				//单行注释
				else if (this.peek == Character.SLASH) {
					end = this.code.indexOf("\n", this.index);
					if (end == - 1) {
						end = this.code.length;
					}
					this.index = end;
				}
			}
			else if (Character.isQuote(this.peek)) {
				var tag = this.peek;
				while (this.index <= this.code.length) {
					this.readch();
					//转义
					if (this.peek == Character.BACK_SLASH) {
						this.readch();
					}
					else if (this.peek == tag) {
						break;
					}
				}
			}
			else if (this.peek == Character.QUESTION) {
				this.readch();
				//找到?>
				if (this.peek == Character.RIGHT_ANGLE_BRACE) {
					this.index--;
					break;
				}
			}
			this.readch();
		}

		var phpParser = new CPhpParser();
		var res = phpParser.embedParse(this.code.slice(start, this.index - 1), this.depth);
		res += HighLighter.keyword("?>");
		this.index += 2;
		this.result.append(res);
		this.depth--;
	}
});

/*** c ***/
function CAndCppParser(keywords) {
	CompileParser.call(this, keywords);
}
$extend(CAndCppParser.prototype, CompileParser.prototype);
$extend(CAndCppParser.prototype, {
	scan: function() {
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//除号检查注释
			if (this.peek == Character.SLASH) {
				this.readch();
				//单行注释
				if (this.peek == Character.SLASH) {
					this.dealSingleComment();
				}
				//多行注释
				else if (this.peek == Character.STAR) {
					this.dealMultiComment();
				}
				//除号
				else {
					this.result.append(Character.SLASH);
				}
			}
			//双引号字符串
			else if (this.peek == Character.DOUBLE_QUOTE) {
				this.dealString(this.peek);
			}
			//单引号字符
			else if (this.peek == Character.SINGLE_QUOTE) {
				this.dealChar();
			}
			//处理头文件
			else if (this.peek == Character.SHARP) {
				this.dealHead();
			}
			//处理数字
			else if (Character.isDigitOrDecimal(this.peek)) {
				this.dealNumber();
			}
			//处理单词，美元符号或者字母或者下划线开头
			else if (Character.isIdentifiers(this.peek)) {
				this.dealWord();
			}
			//其它情况
			else {
				this.dealSign();
			}
		}
	},

	dealHead: function() {
		var start = this.index - 1;
		while (this.index <= this.code.length) {
			this.readch();
			//转义符
			if (this.peek == Character.BACK_SLASH) {
				this.readch();
			}
			//换行符退出
			else if (this.peek == Character.LINE) {
				break;
			}
		}
		this.result.append(HighLighter.head(HtmlEncode.encodeWithLine(this.code.slice(start, this.index - 1), this.getNewLine() + HighLighter.headStart())));
	}

});

function CParser() {
	var keywords = "if else for break case continue function struct true false switch default do while int float double long signed short char return void static null assert byte this throw new public return strictfp extends final finally goto implements import instanceof unsigned super synchronized boolean enum interface native package private protected protected extern abstract const class throws transient try volatile typedef bool".split(" ");
	CAndCppParser.call(this, keywords);
}
$extend(CParser.prototype, CAndCppParser.prototype);

/*** cpp ***/
function CppParser() {
	var keywords = "if else for break case continue function true false switch default do while int float double long const_cast private short char return void static null whcar_t volatile uuid explicit extern class const __finally __exception __try virtual using signed namespace new public protected __declspec delete unsigned friend goto inline mutable deprecated dllexport dllimport dynamic_cast enum union bool naked typeid noinline noreturn nothrow register this reinterpret_cast selectany sizeof static_cast struct template thread throw try typedef typename".split(" ");
	CAndCppParser.call(this, keywords);
}
$extend(CppParser.prototype, CAndCppParser.prototype);

/*** actionscript ***/
function ActionscriptParser() {
	var keywords = "as class const delete extends finally to true false continue in instanceof interface internal is native new null package Boolean uint Infinity return undefined private protected public super this throw import include Date Error RegExp NaN void int intrinsic try typeof use var with each get set namespace implements function XML Object static break dynamic final native override trace String Number Date Event Array XMLLIST if else do while for swtich case".split(" ");
	EcmascriptParser.call(this, keywords);
}
$extend(ActionscriptParser.prototype, EcmascriptParser.prototype);

/*** xml ***/
function XmlParser() {
	this.auto = false;
	MarkupParser.call(this, []);
}

$extend(XmlParser.prototype, MarkupParser.prototype);
$extend(XmlParser.prototype, {
	scan: function() {
		var start = 0;
		this.readch();
		while (this.index <= this.code.length) {
			//处理空白
			this.dealBlank();
			//根据不同状态来分析代码
			switch (this.state) {
			case this.TEXT:
				start = this.index - 1;
				this.index = this.code.indexOf("<", start);
				//处理<之前的文本部分
				if (this.index == - 1) {
					this.result.append(HtmlEncode.encodeWithLine(this.code.slice(start), this.getNewLine()));
					return;
				}
				else if (this.index > start) {
					this.result.append(HtmlEncode.encodeWithLine(this.code.slice(start, this.index), this.getNewLine()));
				}
				this.readch();
				//分析xml标签
				this.dealLeftAngleBracket();
				break;
			case this.MARK:
				//单双引号
				if (Character.isQuote(this.peek)) {
					this.dealString(this.peek);
				}
				//结束符/>
				else if (this.peek == Character.SLASH) {
					this.readch();
					if (this.peek == Character.RIGHT_ANGLE_BRACE) {
						this.result.append(HighLighter.keyword("/>"));
						this.state = this.TEXT;
						//非自闭合标签深度--
						if (!this.auto) {
							this.depth--;
						}
					}
					else {
						this.result.append("/");
					}
					this.auto = false;
					this.readch();
				}
				//结束符>
				else if (this.peek == Character.RIGHT_ANGLE_BRACE) {
					this.result.append(HighLighter.keyword(">"));
					this.readch();
					this.state = this.TEXT;
					this.auto = false;
				}
				//单词
				else if (Character.isLetter(this.peek)) {
					this.dealAttr();
				}
				//数字
				else if (Character.isDigit(this.peek)) {
					this.dealNumber();
				}
				//其它情况编码此字符直接存入
				else {
					this.result.append(HtmlEncode.encodeChar(this.peek));
					this.readch();
				}
				break;
			}
		}
	},

	dealLeftAngleBracket: function() {
		this.readch();
		//<!
		if (this.peek == Character.EXCLAMATION) {
			//<!--
			if (this.code.substr(this.index, 2) == "--") {
				this.index -= 2;
				this.dealComment();
			}
			//<!DOCTYPE
			else if (this.code.substr(this.index, 7).toLowerCase() == "doctype") {
				this.result.append(HighLighter.keyword(HtmlEncode.encode(this.code.substr(this.index - 2, 9))));
				this.index += 7;
				this.state = this.MARK;
				this.auto = true;
				this.readch();
			}
			//cdata
			else if (this.code.substr(this.index, 7).toLowerCase() == "[cdata[") {
				this.dealCdata();
			}
			else {
				this.result.append(HtmlEncode.LESS + "!");
				this.readch();
			}
		}
		//<?
		else if (this.peek == Character.QUESTION) {
			this.dealQuestion();
		}
		//闭合html标签</
		else if (this.peek == Character.SLASH) {
			this.dealEndWord();
		}
		//跟字母检查开始标签
		else if (Character.isLetter(this.peek)) {
			this.dealStartWord();
		}
		else {
			this.result.append(HtmlEncode.LESS + HtmlEncode.enthis.codeChar(this.peek));
			this.readch();
		}
	},
	dealStartWord: function() {
		var start = this.index - 1;
		//直到非数字字母-为止
		do {
			this.readch();
		}
		while (Character.isLetterOrDigit(this.peek) || this.peek == Character.MINUS || this.peek == Character.COLON);
		var res = this.code.slice(start, this.index - 1);
		//高亮
		res = HighLighter.keyword(HtmlEncode.LESS + res);
		this.state = this.MARK;
		this.depth++;
		this.result.append(res);
	},
	dealEndWord: function() {
		var start = this.index;
		//直到非数字字母为止
		do {
			this.readch();
		}
		while (Character.isLetterOrDigit(this.peek) || this.peek == Character.MINUS || this.peek == Character.COLON);
		var res = this.code.slice(start, this.index - 1);
		//高亮
		if (this.peek == Character.RIGHT_ANGLE_BRACE) {
			res = HighLighter.keyword(HtmlEncode.LESS + "/" + res + ">");
			this.readch();
			this.state = this.TEXT;
			this.depth--;
		}
		else {
			res = HtmlEncode.LESS + "/" + res;
		}
		this.result.append(res);
	},
	dealAttr: function() {
		var start = this.index - 1;
		//直到非字母横线为止
		do {
			this.readch();
		}
		while (Character.isLetterOrDigit(this.peek) || this.peek == Character.MINUS);
		//高亮
		var res;
		if (this.peek == Character.COLON) {
			res = HighLighter.ns(this.code.slice(start, this.index - 1));
		}
		else {
			res = HighLighter.attr(this.code.slice(start, this.index - 1));
		}
		this.result.append(res);
	},
	dealQuestion: function() {
		var i = this.code.indexOf("?>", this.index);
		this.index -= 2;
		if (i == - 1) {
			i = this.code.length;
		}
		else {
			i += 2;
		}
		this.result.append(HighLighter.head(HtmlEncode.encodeWithLine(this.code.slice(this.index, i), this.getNewLine() + HighLighter.headStart())));
		this.index = i;
		this.readch();
	},
	dealCdata: function() {
		this.depth++;
		var i = this.code.indexOf("]]>", this.index + 7);
		this.index -= 2;
		if (i == - 1) {
			i = this.code.length;
		}
		else {
			i += 3;
		}
		this.result.append(HighLighter.cdata(HtmlEncode.encodeWithLine(this.code.slice(this.index, i), this.getNewLine() + HighLighter.cdataStart())));
		this.index = i;
		this.depth--;
		this.readch();
	}
});

/*** unknow ***/
function UnknowParser() {}
$extend(UnknowParser.prototype, AbstractParser.prototype);
$extend(UnknowParser.prototype, {
	parse: function(code) {
		return "<li name=\"0\">" + HtmlEncode.encodeWithLine(code, "&nbsp;</li><li name=\"0\"><span>") + "</li>";
	}
});

//页面相关
//取标签，取源码，解析，替换
(function() {
	var els = [],
	hibotAttr = 'data-lang',
	getParser = function(syntax) {
		switch (syntax) {
		case "js":
		case "javascript":
		case "ecmascript":
		case "jscript":
			return new JavascriptParser();
		case "as":
		case "as2":
		case "as3":
		case "actionscript":
		case "flash":
			return new ActionscriptParser();
		case "c":
			return new CParser();
		case "c++":
		case "cpp":
		case "cplusplus":
			return new CppParser();
		case "java":
			return new JavaParser();
		case "php":
			return new PhpParser();
		case "html":
		case "xhtml":
		case "htm":
			return new HtmlParser();
		case "css":
			return new CssParser();
		case "xml":
			return new XmlParser();
		default:
			return new UnknowParser();
		}
	},

	getEls = function(attr) {
		var els = [];
		if (document.querySelectorAll) {
			els = document.querySelectorAll('*[' + attr + ']');
		} else {
			var tmpEls = document.getElementsByTagName('*'),
			len = els.length;
			for (var i = 0; i < len; i++) {
				if (tmpEls[i] && tmpEls[i].getAttribute(attr) != null) {
					els.push(tmpEls[i]);
				}
			}
		}

		return els;
	};

    if( !$.browser.msie ) {
        //marked渲染后的,暂时信赖jquery
        $('*[class^=lang]').each(function(i,el){
                syntax = el.className.toLowerCase().split('-')[1];

                if (el.tagName.toLowerCase() == 'textarea') {
                    code = el.value;
                } else {
                    code = $(el).text();
                }

                //先清除可能多余的\r
                if (code.indexOf("\r") > - 1) {
                    code = code.replace(/\r/g, "");
                }

                var parser = getParser(syntax);
                parser.parse(code);

                el.style.display = 'none';
                var ol = document.createElement('ol');
                ol.className = 'hibot';
                ol.innerHTML = parser.result.toString();

                el.parentNode.insertBefore(ol, el);
            
        });
    }
})();

