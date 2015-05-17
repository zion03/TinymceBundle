/*
 * syntaxhighlighter TinyMCE plugin
 * Released under LGPL License.
 *
 * by Robin Calmejane
 * http://nomadonweb.com
 *
 * Plugin page :
 * http://lab.nomadonweb/sh4tinymce
 *
 */
tinymce.PluginManager.requireLangPack('sh4tinymce');
tinymce.PluginManager.add('sh4tinymce', function(editor,url) {
    function showDialog() {
        /* Var declaration */
        var win, dom = editor.dom, selection = editor.selection, data = {}, Elmt;
        var defaultLanguage = '', selected = false, selectedCode, selectionNode = selection.getNode(), settings;

        /* data : plugin settings */
        data.language = '';
        /* End default settings */

        // List languages
        var languageItems = [
            {text: 'Language',		value: ''},
            {text: 'ActionScript3',	value: 'as3'},
            {text: 'Apache',	    value: 'apache'},
            {text: 'Bash/shell',	value: 'bash'},
            {text: 'C#',			value: 'csharp'},
            {text: 'C++',			value: 'cpp'},
            {text: 'CSS',			value: 'css'},
            {text: 'Delphi',		value: 'delphi'},
            {text: 'Diff',			value: 'diff'},
            {text: 'Erlang',		value: 'erl'},
            {text: 'HTML',			value: 'html'},
            {text: 'Java',			value: 'java'},
            {text: 'JavaScript',	value: 'js'},
            {text: 'Perl',			value: 'perl'},
            {text: 'PHP',			value: 'php'},
            {text: 'PowerShell',	value: 'ps'},
            {text: 'Python',		value: 'py'},
            {text: 'Ruby',			value: 'ruby'},
            {text: 'Scala',			value: 'scala'},
            {text: 'SQL',			value: 'sql'},
            {text: 'Text',			value: 'nohighlight'},
            {text: 'XML',			value: 'xml'},
            {text: 'JSON',			value: 'json'}
        ];

        // Get settings of SH existing code
        function getSHSettings(settings) {
            var s = settings.split(';');
            var settingsObj= {};
            for(var i=0; i<s.length; i++)
            {
                var o = s[i].split(':');
                settingsObj[o[0].replace(/\-/g,'')] = o[1];
            }
            tinymce.each(settingsObj, function(value, setting) {
                if (setting == 'brush') {
                    if (data.language != value)
                        data.language = value;
                } else {
                    value = value == 'true' ? true : (value == 'false' ? false : value);
                    if(setting=='highlight')value=value.replace(/\[/g,"").replace(/\]/g,"");
                    data[setting] = value;
                }
            });
        }

        // Check code/text selection in tinyMCE editor
        if(selectionNode.nodeName.toLowerCase() == 'pre'
            && selectionNode.className.indexOf('brush:') != -1) {
            // This is an SH code
            selected = true;
            selectedCode = $(selectionNode).html();
            selectedCode = selectedCode.replace(/\&lt\;/gi,"<").replace(/\&gt\;/gi,">");
            /* We have to get SH settings from classname */
            settings = selectionNode.className;
            settings = settings.replace(/ /g,'');
            getSHSettings(settings);
        }else{
            // This is a simple selection
            selectedCode = selection.getContent({format : 'text'});
            data.autolinks = false;
            data.toolbar = false;
        }

        // Select language item list
        for(var i=0; i<languageItems.length; i++){
            if(languageItems[i].value == data.language){
                languageItems[i].selected = true;
            }
        }

        data.code = selectedCode;
        if (data.code == '&nbsp;')
            data.code = '';

        function onSubmitFunction(e) {
            var code = e.data.code;
            code = code.replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
            /* Convert settings into strings for classname */
            var language	= e.data.language ? e.data.language : defaultLanguage;

            // Create SH element with string settings
            Elmt = editor.dom.create('code',
                {class: language},
                code);
            Elmt =  editor.dom.create('pre',{}, Elmt);
            if(selected)
                editor.dom.replace(Elmt, selectionNode);
            else
                editor.insertContent(editor.dom.getOuterHTML(Elmt)+'<br>');
        }

        win = editor.windowManager.open({
            title: 'SH4TinyMCE - Code Editor',
            data: data,
            minWidth: 450,
            body: [
                {name: 'language',	type: 'listbox',	values: languageItems},
                {name: 'code',		type: 'textbox',	minHeight: 200,		multiline: true}
            ],
            onsubmit: onSubmitFunction
        });
    }

    tinymce.DOM.loadCSS(url+'/style/style.css');
    editor.addButton('sh4tinymce', {
        icon: 'sh4tinymce',
        tooltip: 'Insert/Edit Code',
        onclick: showDialog
    });
    editor.addMenuItem('sh4tinymce', {
        text: 'SH4TinyMCE',
        icon: 'sh4tinymce',
        context: 'insert',
        onclick: showDialog
    });
});
