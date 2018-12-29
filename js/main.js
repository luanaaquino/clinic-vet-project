var vetClinicsModel = Backbone.Model.extend({});

var vetClinicsCollection = Backbone.Collection.extend({ 
    model: vetClinicsModel,
    url: 'db/data.json',
    parse: function(response, options) {
        return response.clinics;
    }
});

var vetClinicsView = Backbone.View.extend({
    el: $('#clinics-data'),
	initialize: function(options) {
        this.render(options);
    },
    events: { 
        "click .more-info" : "clicked", 
    },
    clicked: function(e) {
        var currentClinic = $(e.currentTarget).find(".id-card").val();
        new vetClinicDetailsView({id:currentClinic});
    },
	render: function(options) {
        var that = this;
        var clinics = new vetClinicsCollection();

        clinics.fetch({
            success: function(clinics) {
                var result = clinics.models;

                //Search
                if (options && options.name.toLowerCase()) {
                    result = _.filter(result, function(item, index) {
                        return item.attributes.name.toLowerCase().includes(options.name.toLowerCase());
                    })
                }

                var variable = {clinics:result};
                var template = _.template($('#template-card').html());
                that.$el.html(template(variable));
            },
            error: function() {
                console.log('There was an error loading and processing the JSON file');
            }
        })
	}
});

var vetClinicDetailsView = Backbone.View.extend({
    el: $('#clinics-data'),
	initialize: function(options) {
        this.render(options);
    },
    events: { 
        "click .btn" : "clicked", 
    },
    clicked: function(e) {
        new vetClinicsView();
    },
	render: function(options) {
        var that = this;
        var clinics = new vetClinicsCollection();

        clinics.fetch({
            success: function(clinics) {
                var result = clinics.models;

                if (options && options.id) {
                    result = _.filter(result, function(item, index) {
                        return item.attributes.id == options.id;
                    })
                }

                var variable = {clinics:result};
                var template = _.template($('#clinic-details').html());
                that.$el.html(template(variable));
            },
            error: function(){
                console.log('There was an error loading and processing the JSON file');
            }
        })
	}
});

$(document).ready(function name(params) {
    viewContent = new vetClinicsView();
});

//Search functionality
$("#search-icon-open").on("click",function() {
    $("#nav-header-info").addClass("hide");
    $("#nav-header-search").removeClass("hide");
    $("#search").focus();

});
$("#search-icon-close").on("click",function() {
    $("#nav-header-search").addClass("hide");
    $("#nav-header-info").removeClass("hide");
    $("#search").val("");
});
$("#nav-header-search").on("submit",function(event) {
    event.preventDefault();
    var value = $("#search").val();
    new vetClinicsView({name:value});
});