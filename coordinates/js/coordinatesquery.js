Ext.namespace("GEOR.Addons");

GEOR.Addons.coordinatesquery = function (map, feature, url, params) {
    GEOR.waiter.show();
    this.map = map;
    this.feature = feature;
    this.url = url;
    this.params = params;
    this.popup = null;
    //var px = this.map.getPixelFromLonLat(new OpenLayers.LonLat(feature.geometry.x,feature.geometry.y));    
    this.feature.coordinates = {x:feature.geometry.x, y:feature.geometry.y, z : {}};     
    OpenLayers.Request.GET({
        url: this.url,
        params: params,
        success: this.onSuccess,
        scope:this
    });   
    
};

GEOR.Addons.coordinatesquery.prototype = (function () {  
    

    return {
        /*
         * Public
         */
        onPopupClose: function (evt) {
            this.feature.destroy();
        },
               
        onSuccess: function (response) {
            var attributes = this.feature.coordinates;
            var features = new OpenLayers.Format.GML().read(response.responseText);
            for (var i = 0; i < features.length; i++) {
                attributes[features[i].gml.featureType] = features[i].attributes.GRAY_INDEX;
                this.feature.coordinates.z[features[i].gml.featureType] =  features[i].attributes.GRAY_INDEX;
            }           
            this.feature.attributes = attributes;
            
           
            this.popup = new GeoExt.Popup({
                map: this.map,
                title: "Coordonnées",
                feature: this.feature,
                bodyStyle: "padding:5px;",
                unpinnable: true,
                closeAction: 'close',
                location: this.map.getCenter(),
                anchorPosition: "bottom-right",
                anchored:true,
                tpl: new Ext.Template("<p>x : {x} </p><p>y : {y}</p><p>z : {z} ({zmetadata})</p>"),
                listeners: {
                    "close": function() {                        
                        this.destroy();                        
                        this.feature.destroy();
                    }                
                },
                scope:this
            });
            
            this.popup.location = this.feature.geometry.getBounds().getCenterLonLat();
            this.popup.position();
            this.popup.show();
            this.popup.update({
                    x:this.feature.coordinates.x,
                    y:this.feature.coordinates.y,
                    z:this.feature.coordinates.z["REG_BD_ALTI"],
                    zmetadata:"bdalti"
            });
            this.popup.position();
            GEOR.waiter.hide();
            
            
        },
       
        destroy: function () {
            this.map = null;
            this.feature.destroy();
            this.popup.destroy();
            this.feature = null;
           
        }
    }
})();