if(!dojo._hasResource["dojox.charting.plot2d.Default"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.charting.plot2d.Default"] = true;
dojo.provide("dojox.charting.plot2d.Default");

dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Base");

dojo.require("dojox.lang.utils");
dojo.require("dojox.lang.functional");

(function(){
	var df = dojox.lang.functional, du = dojox.lang.utils,
		dc = dojox.charting.plot2d.common,
		purgeGroup = df.lambda("item.purgeGroup()");

	dojo.declare("dojox.charting.plot2d.Default", dojox.charting.plot2d.Base, {
		defaultParams: {
			hAxis: "x",		// use a horizontal axis named "x"
			vAxis: "y",		// use a vertical axis named "y"
			lines:   true,	// draw lines
			areas:   false,	// draw areas
			markers: false,	// draw markers
			shadows: 0		// draw shadows
		},
		optionalParams: {},	// no optional parameters
		
		constructor: function(chart, kwArgs){
			this.opt = dojo.clone(this.defaultParams);
			du.updateWithObject(this.opt, kwArgs);
			this.series = [];
			this.hAxis = this.opt.hAxis;
			this.vAxis = this.opt.vAxis;
		},
		
		calculateAxes: function(dim){
			this._calc(dim, dc.collectSimpleStats(this.series));
			return this;
		},
		render: function(dim, offsets){
			if(this.dirty){
				dojo.forEach(this.series, purgeGroup);
				this.cleanGroup();
				var s = this.group;
				df.forEachReversed(this.series, function(item){ item.cleanGroup(s); });
			}
			var t = this.chart.theme, stroke, outline, color, marker;
			for(var i = this.series.length - 1; i >= 0; --i){
				var run = this.series[i];
				if(!this.dirty && !run.dirty){ continue; }
				run.cleanGroup();
				if(!run.data.length){
					run.dirty = false;
					continue;
				}
				var s = run.group, lpoly;
				if(typeof run.data[0] == "number"){
					lpoly = dojo.map(run.data, function(v, i){
						return {
							x: this._hScaler.scale * (i + 1 - this._hScaler.bounds.lower) + offsets.l,
							y: dim.height - offsets.b - this._vScaler.scale * (v - this._vScaler.bounds.lower)
						};
					}, this);
				}else{
					lpoly = dojo.map(run.data, function(v, i){
						return {
							x: this._hScaler.scale * (v.x - this._hScaler.bounds.lower) + offsets.l,
							y: dim.height - offsets.b - this._vScaler.scale * (v.y - this._vScaler.bounds.lower)
						};
					}, this);
				}
				if(!run.fill || !run.stroke){
					// need autogenerated color
					color = run.dyn.color = new dojo.Color(t.next("color"));
				}
				if(this.opt.areas){
					var apoly = dojo.clone(lpoly);
					apoly.push({x: lpoly[lpoly.length - 1].x, y: dim.height - offsets.b});
					apoly.push({x: lpoly[0].x, y: dim.height - offsets.b});
					apoly.push(lpoly[0]);
					var fill = run.fill ? run.fill : dc.augmentFill(t.series.fill, color);
					run.dyn.fill = s.createPolyline(apoly).setFill(fill).getFill();
				}
				if(this.opt.lines || this.opt.markers){
					// need a stroke
					stroke = run.stroke ? dc.makeStroke(run.stroke) : dc.augmentStroke(t.series.stroke, color);
					if(run.outline || t.series.outline){
						outline = dc.makeStroke(run.outline ? run.outline : t.series.outline);
						outline.width = 2 * outline.width + stroke.width;
					}
				}
				if(this.opt.markers){
					// need a marker
					marker = run.dyn.marker = run.marker ? run.marker : t.next("marker");
				}
				if(this.opt.shadows && stroke){
					var sh = this.opt.shadows, shadowColor = new dojo.Color([0, 0, 0, 0.3]),
						spoly = dojo.map(lpoly, function(c){
							return {x: c.x + sh.dx, y: c.y + sh.dy};
						}),
						shadowStroke = dojo.clone(outline ? outline : stroke);
					shadowStroke.color = shadowColor;
					shadowStroke.width += sh.dw ? sh.dw : 0;
					if(this.opt.lines){
						s.createPolyline(spoly).setStroke(shadowStroke);
					}
					if(this.opt.markers){
						dojo.forEach(spoly, function(c){
							s.createPath("M" + c.x + " " + c.y + " " + marker).setStroke(shadowStroke).setFill(shadowColor);
						}, this);
					}
				}
				if(this.opt.lines){
					if(outline){
						run.dyn.outline = s.createPolyline(lpoly).setStroke(outline).getStroke();
					}
					run.dyn.stroke = s.createPolyline(lpoly).setStroke(stroke).getStroke();
				}
				if(this.opt.markers){
					dojo.forEach(lpoly, function(c){
						var path = "M" + c.x + " " + c.y + " " + marker;
						if(outline){
							s.createPath(path).setStroke(outline);
						}
						s.createPath(path).setStroke(stroke).setFill(stroke.color);
					}, this);
				}
				run.dirty = false;
			}
			this.dirty = false;
			return this;
		}
	});
})();

}
