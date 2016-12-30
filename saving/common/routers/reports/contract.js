Router.route('saving/accountContractReport', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    /* var q = this.params.query;*/
    this.render('saving_contractReportGen', {
        /* data: function () {
         return q;
         }*/
    });
}, {
    name: 'saving.accountContractRpt',
});
