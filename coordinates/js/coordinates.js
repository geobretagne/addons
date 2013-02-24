Ext.namespace("GEOR.Addons");

GEOR.Addons.coordinates = function (map, options) {
    this.map = map;
    this.options = options;
    this.control = null;
    this.item = null;
    this.layer = null;    
};

GEOR.Addons.coordinates.prototype = (function () {

    /*
     * Private     */

    var _self = null;
    var _map = null;    
    var _config = null;    
    var _coordinatesLayer = null;    
    var _mask_loader = null;   
    

    var requestFailure = function (response) {
        alert(response.responseText);
        _mask_loader.hide();
    };
    
    var _createDrawControl = function () {
            var drawPointCtrl = new OpenLayers.Control.DrawFeature(_coordinatesLayer, OpenLayers.Handler.Point, {
                featureAdded: function (e) {
                    drawPointCtrl.deactivate();
                }
            });
           return drawPointCtrl;
        };
    

    return {
        /*
         * Public
         */


        init: function (record) {
            _self = this;
            var lang = OpenLayers.Lang.getCode();
            title = record.get("title")[lang];
            _map = this.map;            
            _coordinatesLayer = new OpenLayers.Layer.Vector("coordinates", {
                displayInLayerSwitcher: false
            });
            this.layer = _coordinatesLayer;
            _config = _self.options;
            
            this.map.addLayers([_coordinatesLayer]);
            this.control = _createDrawControl();
            
            a = new Ext.Action({text: 'Action 1', handler: function(){ alert('You clicked on');},iconCls: 'mf-print-action' });

            b = Ext.getCmp("mappanel").bottomToolbar;
            b.insert(3,'-');
            b.insert(3,a);
            b.doLayout();

            --------------------------------------------------
            b.remove(a.items[0]);
            b.remove(b.items.items[3]);
            
            var menuitems = new Ext.menu.Item({
                text: title,
                iconCls: 'cadastre2-icon',
                qtip: description,
                listeners: {
                    afterrender: function (thisMenuItem) {
                        Ext.QuickTips.register({
                            target: thisMenuItem.getEl().getAttribute("id"),
                            title: thisMenuItem.initialConfig.text,
                            text: thisMenuItem.initialConfig.qtip
                        });
                    },
                    click: function () {
                        this.control.activate();
                    },
                    scope: this
                }
            });
            this.item = menuitems;
            return menuitems;
        },
        destroy: function () {
            this.map = null;
            this.options = null;
            this.control = null;
            this.item = null;
            this.layer.destroy();            
        }
    }
})();