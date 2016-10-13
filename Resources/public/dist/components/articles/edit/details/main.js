define(["underscore","jquery","suluarticle/services/article-manager"],function(a,b,c){"use strict";return{layout:function(){return{extendExisting:!0,content:{width:this.options.preview?"fixed":"max",rightSpace:!1,leftSpace:!1}}},initialize:function(){this.saved=!0,this.render(),this.bindCustomEvents(),this.listenForChange()},bindCustomEvents:function(){this.sandbox.on("sulu.tab.template-change",function(a){this.checkRenderTemplate(a.template)},this),this.sandbox.on("sulu.content.contents.default-template",function(a){this.template=a,this.sandbox.emit("sulu.header.toolbar.item.change","template",a)}.bind(this)),this.sandbox.on("sulu.tab.save",this.save.bind(this))},listenForChange:function(){this.sandbox.dom.on(this.$el,"keyup",a.debounce(this.setDirty.bind(this),10),"input, textarea"),this.sandbox.dom.on(this.$el,"change",a.debounce(this.setDirty.bind(this),10),'input[type="checkbox"], select'),this.sandbox.on("sulu.content.changed",this.setDirty.bind(this))},setDirty:function(){this.saved=!1,this.sandbox.emit("sulu.tab.dirty")},save:function(b){if(!this.sandbox.form.validate(this.formId))return void this.sandbox.emit("sulu.tab.dirty",!0);var d=this.sandbox.form.getData(this.formId);d.template=this.template,a.each(d,function(a,b){this.data[b]=a}.bind(this)),c.save(this.data,this.options.locale,b).then(function(a){this.data=a,this.sandbox.emit("sulu.tab.saved",a.id,a)}.bind(this)).fail(function(a){this.sandbox.emit("sulu.article.error",a.status,d)}.bind(this))},render:function(){this.checkRenderTemplate(this.data.template||null)},checkRenderTemplate:function(a){return a&&this.template===a?this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1):(this.sandbox.emit("sulu.header.toolbar.item.loading","template"),void(""===this.template||this.saved?this.loadFormTemplate(a):this.showRenderTemplateDialog(a)))},showRenderTemplateDialog:function(a){this.sandbox.emit("sulu.overlay.show-warning","sulu.overlay.be-careful","content.template.dialog.content",function(){this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1),this.template&&this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template,!1)}.bind(this),function(){this.loadFormTemplate(a)}.bind(this))},loadFormTemplate:function(a){if(a||(a=this.options.config.types[this.options.type||this.data.type]["default"]),this.template=a,this.formId="#content-form-container",this.$container=this.sandbox.dom.createElement('<div id="content-form-container"/>'),this.html(this.$container),this.sandbox.form.getObject(this.formId)){var b=this.data;this.data=this.sandbox.form.getData(this.formId),b.id&&(this.data.id=b.id),this.data=this.sandbox.util.extend({},b,this.data)}require([this.getTemplateUrl(a)],function(a){this.renderFormTemplate(a)}.bind(this))},getTemplateUrl:function(a){var b="text!/admin/content/template/form";return b+=a?"/"+a+".html":".html",b+="?type=article&language="+this.options.locale,this.data.id&&(b+="&uuid="+this.data.id),b},renderFormTemplate:function(a){this.sandbox.dom.html(this.formId,this.sandbox.util.template(a,{translate:this.sandbox.translate,content:this.data,options:this.options})),this.data.id||this.$find("#routePath").parent().remove(),this.createForm(this.data).then(function(){this.changeTemplateDropdownHandler()}.bind(this))},changeTemplateDropdownHandler:function(){this.template&&this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template),this.sandbox.emit("sulu.header.toolbar.item.enable","template",!1)},createForm:function(a){var b=this.sandbox.form.create(this.formId),c=this.sandbox.data.deferred();return b.initialized.then(function(){this.sandbox.form.setData(this.formId,a).then(function(){this.sandbox.start(this.$el,{reset:!0}).then(function(){if(this.initSortableBlock(),this.bindFormEvents(),c.resolve(),this.options.preview){this.options.preview.bindDomEvents(this.$el);var a=this.data;a.template=this.template,this.options.preview.updateContext({template:this.template},a)}}.bind(this))}.bind(this))}.bind(this)),c.promise()},initSortableBlock:function(){var a,b=this.sandbox.dom.find(".sortable",this.$el);b&&b.length>0&&(this.sandbox.dom.sortable(b,"destroy"),a=this.sandbox.dom.sortable(b,{handle:".move",forcePlaceholderSize:!0}),this.sandbox.dom.unbind(a,"sortupdate"),a.bind("sortupdate",function(a){this.updatePreviewProperty(a.currentTarget,null),this.sandbox.emit("sulu.content.changed")}.bind(this)))},bindFormEvents:function(){this.sandbox.dom.on(this.formId,"form-remove",function(a,b){this.initSortableBlock(),this.setDirty(),this.updatePreviewProperty(a.currentTarget,b)}.bind(this)),this.sandbox.dom.on(this.formId,"form-add",function(a,b,c,d){var e=this.sandbox.dom.children(this.$find('[data-mapper-property="'+b+'"]')),f=void 0!==d&&e.length>d?e[d]:this.sandbox.dom.last(e);this.sandbox.start(f),this.setDirty(),this.initSortableBlock(),this.updatePreviewProperty(a.currentTarget,b)}.bind(this)),this.sandbox.dom.on(this.formId,"init-sortable",function(a){this.initSortableBlock()}.bind(this))},loadComponentData:function(){var a=b.Deferred();return a.resolve(this.options.data()),a},updatePreviewProperty:function(a,b){if(this.options.preview){var c=this.sandbox.form.getData(this.formId);!b&&a&&(b=this.sandbox.dom.data(a,"mapperProperty")),this.options.preview.updateProperty(b,c[b])}}}});