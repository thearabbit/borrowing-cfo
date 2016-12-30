/************* Generate *************/
Template.saving_contractReportGen.helpers({
    data: function () {
        var query = Router.current().params.query;
        var params = "getContractReport";
        Fetcher.setDefault(params, false);
        Fetcher.retrieve(params, 'getContractReport', query);
        return Fetcher.get(params);
    },
    gender: function (val) {
        if (val == 'M') {
            return 'ប្រុស';
        }

        return 'ស្រី';
    },
    age: function (val) {
        return moment().diff(val, 'year');
    },
    telephone: function (val) {
        if (val) {
            return val;
        }

        return '(គ្មាន)';
    },
    interestRateFormat: function (val) {
        return numeral(val / 12).format('0,0.00');
    },
    numFormat: function (val) {
        return numeral(val).format('0,0.00');
    },
    moFormat: function (val) {
        return moment(val).format('DD/MM/YYYY');
    },
    paymentType: function (val) {
        if (val == '101' || val == '102') {
            return 'សងការប្រាក់រៀងរាល់ចុងខែ និងប្រាក់ដើមសេរី';
        } else if (val == '201' || val == '202') {
            return 'សងការប្រាក់រៀងរាល់ចុងខែ និងប្រាក់ដើមនៅចុងវគ្គ';
        } else if (val == '203' || val == '204') {
            return 'សងការប្រាក់ និងប្រាក់ដើមនៅចុងវគ្គ';
        }
    },
});
